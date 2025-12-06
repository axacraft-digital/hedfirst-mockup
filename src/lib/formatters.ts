import { format, formatDistanceToNow, parseISO } from "date-fns"

// ============================================================================
// Currency Formatting
// All monetary values in the mock data are stored in cents
// ============================================================================

/**
 * Format cents to currency string
 * @example formatCurrency(4500) => "$45.00"
 * @example formatCurrency(4500, false) => "45.00"
 */
export function formatCurrency(cents: number, includeSymbol = true): string {
  const dollars = cents / 100
  const formatted = dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return includeSymbol ? `$${formatted}` : formatted
}

/**
 * Format cents to compact currency (for large numbers)
 * @example formatCurrencyCompact(150000) => "$1.5K"
 */
export function formatCurrencyCompact(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(1)}M`
  }
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}K`
  }
  return formatCurrency(cents)
}

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format ISO date string to readable date
 * @example formatDate("2024-06-15T10:30:00Z") => "Jun 15, 2024"
 */
export function formatDate(isoString: string): string {
  return format(parseISO(isoString), "MMM d, yyyy")
}

/**
 * Format ISO date string to readable date with time
 * @example formatDateTime("2024-06-15T10:30:00Z") => "Jun 15, 2024 at 10:30 AM"
 */
export function formatDateTime(isoString: string): string {
  return format(parseISO(isoString), "MMM d, yyyy 'at' h:mm a")
}

/**
 * Format ISO date string to time only
 * @example formatTime("2024-06-15T10:30:00Z") => "10:30 AM"
 */
export function formatTime(isoString: string): string {
  return format(parseISO(isoString), "h:mm a")
}

/**
 * Format ISO date string to relative time
 * @example formatRelativeTime("2024-12-04T10:30:00Z") => "2 hours ago"
 */
export function formatRelativeTime(isoString: string): string {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
}

/**
 * Format ISO date string to short date (for tables)
 * @example formatShortDate("2024-06-15T10:30:00Z") => "06/15/24"
 */
export function formatShortDate(isoString: string): string {
  return format(parseISO(isoString), "MM/dd/yy")
}

// ============================================================================
// Phone Formatting
// ============================================================================

/**
 * Format phone number to readable format
 * @example formatPhone("+15551234567") => "(555) 123-4567"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// ============================================================================
// Name Formatting
// ============================================================================

/**
 * Get initials from first and last name
 * @example getInitials("Sarah", "Johnson") => "SJ"
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// ============================================================================
// Status Badge Formatting
// ============================================================================

type StatusVariant = "default" | "secondary" | "destructive" | "outline"

interface StatusConfig {
  label: string
  variant: StatusVariant
}

const patientStatusConfig: Record<string, StatusConfig> = {
  AWAITING_REVIEW: { label: "Awaiting Review", variant: "secondary" },
  IN_PROGRESS: { label: "In Progress", variant: "default" },
  ACTIVE: { label: "Active", variant: "default" },
  NEEDS_ATTENTION: { label: "Needs Attention", variant: "destructive" },
  DEACTIVATED: { label: "Deactivated", variant: "outline" },
}

const orderStatusConfig: Record<string, StatusConfig> = {
  NEW: { label: "New", variant: "secondary" },
  AWAITING_REVIEW: { label: "Awaiting Review", variant: "secondary" },
  APPROVED: { label: "Approved", variant: "default" },
  PAID: { label: "Paid", variant: "default" },
  SENT_TO_PHARMACY: { label: "Sent to Pharmacy", variant: "default" },
  ORDER_SHIPPED: { label: "Shipped", variant: "default" },
  COMPLETED: { label: "Completed", variant: "default" },
  DENIED: { label: "Denied", variant: "destructive" },
  CANCELED: { label: "Canceled", variant: "outline" },
  PAUSED: { label: "Paused", variant: "outline" },
  ACTIVE: { label: "Active", variant: "default" },
  FAILED: { label: "Failed", variant: "destructive" },
}

const appointmentStatusConfig: Record<string, StatusConfig> = {
  NEEDS_SCHEDULING: { label: "Needs Scheduling", variant: "secondary" },
  SCHEDULED: { label: "Scheduled", variant: "default" },
  COMPLETED: { label: "Completed", variant: "default" },
  CANCELLED: { label: "Cancelled", variant: "outline" },
}

export function getPatientStatusConfig(status: string): StatusConfig {
  return patientStatusConfig[status] ?? { label: status, variant: "outline" }
}

export function getOrderStatusConfig(status: string): StatusConfig {
  return orderStatusConfig[status] ?? { label: status, variant: "outline" }
}

export function getAppointmentStatusConfig(status: string): StatusConfig {
  return appointmentStatusConfig[status] ?? { label: status, variant: "outline" }
}

// ============================================================================
// Supply/Billing Cycle Formatting
// ============================================================================

const supplyLabels: Record<string, string> = {
  DAY_30: "30-day supply",
  DAY_60: "60-day supply",
  DAY_90: "90-day supply",
  DAY_180: "180-day supply",
}

const billingCycleLabels: Record<string, string> = {
  ONE_TIME_PAYMENT: "One-time",
  EVERY_DAY_30: "Monthly",
  EVERY_DAY_60: "Every 2 months",
  EVERY_DAY_90: "Every 3 months",
  EVERY_DAY_180: "Every 6 months",
}

export function formatSupply(supply: string): string {
  return supplyLabels[supply] ?? supply
}

export function formatBillingCycle(cycle: string): string {
  return billingCycleLabels[cycle] ?? cycle
}

// ============================================================================
// Disease State Formatting
// ============================================================================

const diseaseStateLabels: Record<string, string> = {
  HAIR_GROWTH: "Hair Loss",
  WEIGHT_LOSS: "Weight Loss",
  SEXUAL_WELLNESS: "Sexual Wellness",
  SKIN_CARE: "Skin Care",
  GENERAL_HEALTH: "General Health",
  MENTAL_HEALTH: "Mental Health",
}

export function formatDiseaseState(state: string): string {
  return diseaseStateLabels[state] ?? state
}
