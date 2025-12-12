import treatmentsJson from "./mock/clinical/treatments.json"
import productsJson from "./mock/reference/products.json"
import type { Treatment, TreatmentStatus, TreatmentType } from "./types"

/**
 * Treatments data - using centralized mock data with UI-shaped helpers
 * Transforms normalized data to denormalized shape for UI consumption
 */

export const treatments = treatmentsJson as Treatment[]

interface ProductVariant {
  id: string
  sku?: string
  supply?: string
  billingCycle?: string
  qty?: number
  price: number
  compareAtPrice?: number
  dosages?: {
    strength: string
    form: string
  }
}

interface Product {
  id: string
  name: string
  subTitle?: string
  type: string
  variants: ProductVariant[]
}

const products = productsJson as Product[]

// UI-shaped treatment type (what the UI expects)
export interface UITreatment {
  id: string
  masterOrderId: string | null
  patientId: string
  productName: string
  orderDate: string
  billingCycle: string | null
  nextBilledDate: string | null
  status: "active" | "paused" | "canceled" | "completed"
  value: number
  type: "subscription" | "one-time" | "membership"
  children?: UITreatmentChild[]
}

export interface UITreatmentChild {
  id: string
  productName: string
  status: UITreatment["status"]
  value: number
}

// Map centralized status to UI status
function mapStatus(status: TreatmentStatus): UITreatment["status"] {
  switch (status) {
    case "ACTIVE":
      return "active"
    case "PAUSED":
      return "paused"
    case "CANCELLED":
      return "canceled"
    case "COMPLETED":
      return "completed"
    default:
      return "active"
  }
}

// Map centralized type to UI type
function mapType(type: TreatmentType): UITreatment["type"] {
  switch (type) {
    case "SUBSCRIPTION":
      return "subscription"
    case "ONE_TIME":
      return "one-time"
    case "MEMBERSHIP":
      return "membership"
    default:
      return "subscription"
  }
}

// Get product and variant info
function getProductInfo(
  productId: string,
  variantId?: string
): {
  name: string
  price: number
  billingCycle: string | null
} {
  const product = products.find((p) => p.id === productId)
  if (!product) {
    // Handle missing products gracefully
    return {
      name: "Unknown Product",
      price: 0,
      billingCycle: null,
    }
  }

  const variant = variantId
    ? product.variants.find((v) => v.id === variantId)
    : product.variants[0]

  const billingCycle = variant?.billingCycle
    ? formatBillingCycle(variant.billingCycle)
    : null

  return {
    name: product.name,
    price: variant?.price ?? 0,
    billingCycle,
  }
}

// Format billing cycle for display
function formatBillingCycle(cycle: string): string {
  switch (cycle) {
    case "EVERY_DAY_30":
      return "Every 30 days"
    case "EVERY_DAY_60":
      return "Every 60 days"
    case "EVERY_DAY_70":
      return "Every 70 days"
    case "EVERY_DAY_90":
      return "Every 90 days"
    case "EVERY_DAY_180":
      return "Every 180 days"
    case "MONTHLY":
      return "Monthly"
    case "ANNUAL":
      return "Annual"
    case "ONE_TIME_PAYMENT":
      return null as unknown as string
    default:
      return cycle
  }
}

// Transform centralized treatment to UI shape
function toUITreatment(treatment: Treatment): UITreatment {
  const productInfo = getProductInfo(treatment.productId, treatment.variantId)

  return {
    id: treatment.id,
    masterOrderId: null, // Not tracked in treatment data
    patientId: treatment.patientId,
    productName: productInfo.name,
    orderDate: treatment.startDate,
    billingCycle: productInfo.billingCycle,
    nextBilledDate: treatment.nextRefillDate ?? null,
    status: mapStatus(treatment.status),
    value: productInfo.price,
    type: mapType(treatment.type),
    children: undefined, // Children not tracked in centralized data
  }
}

// Get treatments for a specific patient (UI-shaped)
export function getTreatmentsForUI(patientId: string): UITreatment[] {
  return treatments
    .filter((t) => t.patientId === patientId)
    .map(toUITreatment)
    .sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    )
}

// Filter treatments by type
export function filterTreatmentsByType(
  treatments: UITreatment[],
  type: "all" | "subscriptions" | "one-time" | "membership"
): UITreatment[] {
  switch (type) {
    case "subscriptions":
      return treatments.filter((t) => t.type === "subscription")
    case "one-time":
      return treatments.filter((t) => t.type === "one-time")
    case "membership":
      return treatments.filter((t) => t.type === "membership")
    default:
      return treatments
  }
}

// Get treatment by ID (raw)
export function getTreatmentById(id: string): Treatment | undefined {
  return treatments.find((t) => t.id === id)
}

// Get all treatments (raw)
export function getAllTreatments(): Treatment[] {
  return treatments
}
