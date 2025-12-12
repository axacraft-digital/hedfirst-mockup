/**
 * Order Types for Teligant Order Management
 *
 * Parent orders contain one or more child orders (sub-orders).
 * Each child order has its own status, payment timing, and lifecycle.
 */

// Child order product types
export type ChildOrderProductType =
  | "SERVICE" // Consultation
  | "MEMBERSHIP" // Recurring membership
  | "LAB_TEST" // Lab kit
  | "PHYSICAL_PRODUCT" // Prescription medication
  | "APPOINTMENT" // Video appointment

// Billing cycles
export type BillingCycle =
  | "ONE_TIME_PAYMENT"
  | "MONTHLY"
  | "ANNUAL"
  | "EVERY_DAY_30"
  | "EVERY_DAY_60"
  | "EVERY_DAY_90"
  | "EVERY_DAY_120"
  | "EVERY_DAY_180"

// Parent order statuses (derived from children)
export type ParentOrderStatus =
  | "NEW"
  | "PROCESSING"
  | "AWAITING_REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETED"
  | "PARTIALLY_COMPLETED"
  | "PAUSED"
  | "CANCELED"
  | "DENIED"
  | "PAYMENT_FAILED"

// Child order statuses
export type ChildOrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSED"
  | "AWAITING_REVIEW"
  | "APPROVED"
  | "DENIED"
  | "ACTIVE"
  | "PAUSED"
  | "CANCELED"
  | "SENT_TO_PHARMACY"
  | "ORDER_SHIPPED"
  | "COMPLETED"
  | "PAYMENT_FAILED"

// Child order (sub-order)
export interface ChildOrder {
  id: string
  parentOrderId: string
  type: "SUBORDER"
  productType: ChildOrderProductType
  status: ChildOrderStatus
  productName: string
  sku: string
  amount: number // in cents
  discount?: number // in cents
  billingCycle: BillingCycle

  // Subscription fields (optional)
  subscriptionId?: string | null
  nextBillDate?: string // ISO date string

  // Dates
  paidAt?: string
  approvedAt?: string
  pausedAt?: string
  shippedAt?: string
  labResultsReceivedAt?: string
  lastPaymentAttempt?: string

  // Shipping (for physical items)
  tracking?: string
  carrier?: string

  // Payment retry
  paymentRetryCount?: number

  // Dosage info (for medications)
  dosages?: {
    strength: string
  }
  supply?: string

  // Notes (for mock data context)
  _note?: string
}

// Parent order
export interface ParentOrder {
  id: string
  publicOrderId: string // HF-XXXXX format
  type: "MAIN"
  status: ParentOrderStatus
  createdAt: string // ISO datetime

  // Patient
  userId: string

  // Provider (if assigned)
  approvalDoctorId: string | null

  // Financials (in cents)
  subtotal: number
  discount: number
  discountByCode: number
  shippingPrice: number
  tax: number
  amount: number // total

  // Child orders
  children?: ChildOrder[]

  // Legacy line items (for older orders without children structure)
  lineItems?: Array<{
    productName: string
    sku: string
    dosages?: { strength: string }
    supply?: string
    price: number
    qty: number
    diseaseState?: string
  }>

  // Billing cycle (for single-item orders)
  billingCycle?: BillingCycle

  // Pause/cancel info
  pausedAt?: string
  pauseReason?: string
  canceledAt?: string

  // Payment failure info
  paymentFailedAt?: string
  paymentRetryCount?: number

  // Comments (for mock data context)
  _comment?: string
}

// Enriched order with patient info (for display)
export interface OrderWithPatient extends ParentOrder {
  patient: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  provider?: {
    id: string
    firstName: string
    lastName: string
  } | null
}

// Helper to get item count from order
export function getItemCount(order: ParentOrder): number {
  if (order.children && order.children.length > 0) {
    return order.children.length
  }
  if (order.lineItems && order.lineItems.length > 0) {
    return order.lineItems.length
  }
  return 1
}

// Helper to format currency from cents
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

// Helper to derive parent status from children (for display consistency)
export function deriveParentStatus(children: ChildOrder[]): ParentOrderStatus {
  if (children.length === 0) return "COMPLETED"

  const statuses = children.map((c) => c.status)

  // Priority: PAYMENT_FAILED > AWAITING_REVIEW > DENIED > PAUSED > PARTIALLY > ACTIVE/COMPLETED
  if (statuses.some((s) => s === "PAYMENT_FAILED")) return "PAYMENT_FAILED"
  if (statuses.some((s) => s === "AWAITING_REVIEW")) return "AWAITING_REVIEW"
  if (statuses.every((s) => s === "DENIED")) return "DENIED"
  if (statuses.some((s) => s === "PAUSED")) return "PAUSED"
  if (statuses.every((s) => s === "COMPLETED" || s === "PROCESSED"))
    return "COMPLETED"
  if (
    statuses.every(
      (s) => s === "ACTIVE" || s === "COMPLETED" || s === "PROCESSED"
    )
  )
    return "ACTIVE"

  return "PARTIALLY_COMPLETED"
}

// Product type display info
export const productTypeInfo: Record<
  ChildOrderProductType,
  { label: string; iconName: string }
> = {
  SERVICE: { label: "Consultation", iconName: "message-circle" },
  MEMBERSHIP: { label: "Membership", iconName: "user" },
  LAB_TEST: { label: "Lab Kit", iconName: "test-tube" },
  PHYSICAL_PRODUCT: { label: "Prescription", iconName: "pill" },
  APPOINTMENT: { label: "Appointment", iconName: "calendar" },
}

// Status display info
export const parentStatusInfo: Record<
  ParentOrderStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
    className?: string
  }
> = {
  NEW: { label: "New", variant: "secondary" },
  PROCESSING: { label: "Processing", variant: "secondary" },
  AWAITING_REVIEW: {
    label: "Needs Review",
    variant: "outline",
    className:
      "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200",
  },
  APPROVED: { label: "Approved", variant: "default" },
  ACTIVE: {
    label: "Active",
    variant: "outline",
    className: "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
  },
  COMPLETED: {
    label: "Complete",
    variant: "outline",
    className:
      "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  },
  PARTIALLY_COMPLETED: {
    label: "Partial",
    variant: "outline",
    className: "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
  },
  PAUSED: {
    label: "Paused",
    variant: "outline",
    className: "bg-neutral-300/40 border-neutral-300",
  },
  CANCELED: {
    label: "Canceled",
    variant: "outline",
    className: "bg-neutral-300/40 border-neutral-300",
  },
  DENIED: {
    label: "Denied",
    variant: "outline",
    className:
      "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  },
  PAYMENT_FAILED: {
    label: "Payment Failed",
    variant: "outline",
    className:
      "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  },
}

export const childStatusInfo: Record<
  ChildOrderStatus,
  { label: string; className?: string }
> = {
  PENDING: { label: "Pending", className: "text-muted-foreground" },
  PAID: { label: "Paid", className: "text-teal-600 dark:text-teal-400" },
  PROCESSED: {
    label: "Processed",
    className: "text-teal-600 dark:text-teal-400",
  },
  AWAITING_REVIEW: {
    label: "Awaiting Review",
    className: "text-amber-600 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    className: "text-teal-600 dark:text-teal-400",
  },
  DENIED: { label: "Denied", className: "text-destructive" },
  ACTIVE: { label: "Active", className: "text-teal-600 dark:text-teal-400" },
  PAUSED: { label: "Paused", className: "text-muted-foreground" },
  CANCELED: { label: "Canceled", className: "text-muted-foreground" },
  SENT_TO_PHARMACY: {
    label: "Sent to Pharmacy",
    className: "text-sky-600 dark:text-sky-400",
  },
  ORDER_SHIPPED: {
    label: "Shipped",
    className: "text-sky-600 dark:text-sky-400",
  },
  COMPLETED: {
    label: "Complete",
    className: "text-teal-600 dark:text-teal-400",
  },
  PAYMENT_FAILED: { label: "Payment Failed", className: "text-destructive" },
}
