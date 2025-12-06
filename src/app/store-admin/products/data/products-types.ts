/**
 * Product Types for Teligant Product Management
 */

// Product types
export type ProductType =
  | "PHYSICAL_PRODUCT"
  | "SERVICE"
  | "MEMBERSHIP"
  | "LAB_TEST"

// Disease states (treatment categories)
export type DiseaseState =
  | "WEIGHT_LOSS"
  | "HAIR_GROWTH"
  | "ERECTILE_DYSFUNCTION"
  | "SEXUAL_WELLNESS"
  | "HORMONE_THERAPY"
  | "SLEEP_INSOMNIA"
  | "DIABETES_MANAGEMENT"
  | "CARDIOVASCULAR_HEALTH"
  | "GASTROINTESTINAL_DISORDERS"
  | "ONCOLOGY_CANCER"
  | "MENTAL_HEALTH"
  | "GENERAL_WELLNESS"

// Treatment types for physical products
export type PhysicalTreatmentType =
  | "PRESCRIPTION_MEDICATION"
  | "TOPICAL_TREATMENT"
  | "SUPPLEMENT"
  | "COMPOUND_MEDICATION"

// Treatment use/dosing schedule
export type TreatmentUse =
  | "Abortive/PRN (As Needed)"
  | "Abortive/Fixed Schedule"
  | "Adjunctive/Daily"
  | "Adjunctive/PRN"
  | "Breakthrough/PRN"
  | "Maintenance/BID"
  | "Maintenance/Daily"
  | "Maintenance/QID"
  | "Maintenance/TID"
  | "Preventative/Cyclic"
  | "Preventative/Daily"
  | "Preventative/Seasonal"
  | "Rescue/Emergency"

// Product interface (list view)
export interface Product {
  id: string
  name: string
  type: ProductType
  diseaseState: DiseaseState
  onStore: boolean
  sku?: string
  description?: string
  price?: number // in cents
  createdAt: string
}

// Extended product interface (detail view)
export interface ProductDetail extends Product {
  subtitle?: string
  badge?: string
  slug: string
  marketingDescription?: string
  treatmentType?: PhysicalTreatmentType
  treatmentUse?: TreatmentUse
  pharmacyId?: string
  requiresPrescription: boolean
  allowMultiplePurchase: boolean
  images: string[] // paths to product images
  ingredients: ProductIngredient[]
  variants: ProductVariant[]
}

// Product ingredient
export interface ProductIngredient {
  id: string
  name: string
}

// Product variant (Phase 3 - structure defined now)
export interface ProductVariant {
  id: string
  showOnStore: boolean
  formFactor: string
  medicationName: string
  dosage: string
  units: string
  quantity: number
  supplyDays: number
  billingCycle: string
  refills: number
  price: number // in cents
  compareAtPrice?: number
  showComparePrice: boolean
  sku: string
  pharmacyNotes?: string
  patientDirections?: string
}

// Display labels for product types
export const productTypeLabels: Record<ProductType, string> = {
  PHYSICAL_PRODUCT: "Physical Product",
  SERVICE: "Service",
  MEMBERSHIP: "Membership",
  LAB_TEST: "Lab Test",
}

// Display labels for disease states
export const diseaseStateLabels: Record<DiseaseState, string> = {
  WEIGHT_LOSS: "Weight Loss",
  HAIR_GROWTH: "Hair Growth",
  ERECTILE_DYSFUNCTION: "Erectile Dysfunction",
  SEXUAL_WELLNESS: "Sexual Wellness",
  HORMONE_THERAPY: "Hormone Therapy",
  SLEEP_INSOMNIA: "Sleep/Insomnia",
  DIABETES_MANAGEMENT: "Diabetes Management",
  CARDIOVASCULAR_HEALTH: "Cardiovascular Health",
  GASTROINTESTINAL_DISORDERS: "Gastrointestinal Disorders",
  ONCOLOGY_CANCER: "Oncology/Cancer",
  MENTAL_HEALTH: "Mental Health",
  GENERAL_WELLNESS: "General Wellness",
}

// Display labels for treatment types
export const treatmentTypeLabels: Record<PhysicalTreatmentType, string> = {
  PRESCRIPTION_MEDICATION: "Prescription Medication",
  TOPICAL_TREATMENT: "Topical Treatment",
  SUPPLEMENT: "Supplement",
  COMPOUND_MEDICATION: "Compound Medication",
}

// Treatment use options for select dropdown
export const treatmentUseOptions: TreatmentUse[] = [
  "Abortive/PRN (As Needed)",
  "Abortive/Fixed Schedule",
  "Adjunctive/Daily",
  "Adjunctive/PRN",
  "Breakthrough/PRN",
  "Maintenance/BID",
  "Maintenance/Daily",
  "Maintenance/QID",
  "Maintenance/TID",
  "Preventative/Cyclic",
  "Preventative/Daily",
  "Preventative/Seasonal",
  "Rescue/Emergency",
]

// Tab filter type
export type ProductTabFilter = "all" | "physical" | "service" | "membership" | "lab-test"

// Map tab to product type
export const tabToProductType: Record<Exclude<ProductTabFilter, "all">, ProductType> = {
  physical: "PHYSICAL_PRODUCT",
  service: "SERVICE",
  membership: "MEMBERSHIP",
  "lab-test": "LAB_TEST",
}

// ============================================
// Variant Field Options
// ============================================

// Common form factors (subset of 82 FDA options)
export const formFactorOptions = [
  "Tablets",
  "Capsules",
  "Injectable",
  "Creams",
  "Gel",
  "Solution",
  "Foam",
  "Patch",
  "Lotion",
  "Spray, Metered",
  "Suppository",
  "Suspension",
  "Film",
  "Powder, Metered",
  "Troche/Lozenge",
]

// Dosage units
export const dosageUnitOptions = [
  "mg",
  "mcg",
  "g",
  "IU",
  "%",
  "oz",
  "mL",
]

// Billing cycles
export const billingCycleOptions: { label: string; value: string }[] = [
  { label: "One Time Payment", value: "ONE_TIME_PAYMENT" },
  { label: "Every 30 days", value: "EVERY_DAY_30" },
  { label: "Every 60 days", value: "EVERY_DAY_60" },
  { label: "Every 90 days", value: "EVERY_DAY_90" },
  { label: "Every 120 days", value: "EVERY_DAY_120" },
  { label: "Every 180 days", value: "EVERY_DAY_180" },
  { label: "Annual", value: "ANNUAL" },
]

// Supply durations
export const supplyDurationOptions: { label: string; value: number }[] = [
  { label: "30 day", value: 30 },
  { label: "60 day", value: 60 },
  { label: "90 day", value: 90 },
  { label: "120 day", value: 120 },
  { label: "180 day", value: 180 },
]
