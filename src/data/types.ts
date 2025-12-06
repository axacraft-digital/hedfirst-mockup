// ============================================================================
// Core Types for Teligant Mock Data
// ============================================================================

// Status Enums
export type PatientStatus =
  | "AWAITING_REVIEW"
  | "IN_PROGRESS"
  | "ACTIVE"
  | "NEEDS_ATTENTION"
  | "DEACTIVATED"

export type OrderStatus =
  | "NEW"
  | "AWAITING_REVIEW"
  | "APPROVED"
  | "PAID"
  | "SENT_TO_PHARMACY"
  | "ORDER_SHIPPED"
  | "COMPLETED"
  | "DENIED"
  | "CANCELED"
  | "PAUSED"
  | "ACTIVE"
  | "FAILED"

export type SubscriptionStatus =
  | "SUCCESS"
  | "ACTIVE"
  | "PAUSED"
  | "CANCELLED"
  | "PENDING_RENEWAL"

export type AppointmentStatus =
  | "NEEDS_SCHEDULING"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"

export type DiseaseState =
  | "HAIR_GROWTH"
  | "WEIGHT_LOSS"
  | "SEXUAL_WELLNESS"
  | "SKIN_CARE"
  | "GENERAL_HEALTH"
  | "MENTAL_HEALTH"

export type ProductType =
  | "PHYSICAL_PRODUCT"
  | "SERVICE"
  | "BUNDLE"
  | "LAB_TEST"
  | "MEMBERSHIP"

// ============================================================================
// Address
// ============================================================================

export interface Address {
  addressLineOne: string
  addressLineTwo?: string
  city: string
  state: string
  zipCode: string
  country?: string
}

// ============================================================================
// Patient
// ============================================================================

export interface PatientDetails {
  heightFeet: number
  heightInches: number
  currentWeightLbs: number
  allergiesOrSubstances: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
}

export interface Patient {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  status: string
  patientStatus: PatientStatus
  roles: string[]
  appOfRegistration: string
  createdAt: string
  address: Address
  patientDetails: PatientDetails
  assignedProviderId: string | null
  diseaseStates: DiseaseState[]
  lastActivity: string
  flagReason?: string
  deactivatedAt?: string
  deactivationReason?: string
}

// ============================================================================
// Provider
// ============================================================================

export interface DoctorCredential {
  deaNumber: string
  npiNumber: string
  boardCertification: string
}

export interface License {
  state: string
  licenseNumber: string
  expiryDate: string
}

export interface ProviderStats {
  patientsReviewed: number
  avgResponseTime: string
}

export interface Provider {
  id: string
  email: string
  firstName: string
  lastName: string
  status: string
  roles: string[]
  avatarUrl?: string
  doctorCredential: DoctorCredential
  degree: { name: string }
  speciality: { name: string }
  licenses: License[]
  stats: ProviderStats
}

// ============================================================================
// Product
// ============================================================================

export interface ProductVariant {
  id: string
  sku: string
  supply?: string
  billingCycle?: string
  qty?: number
  price: number
  compareAtPrice?: number
  dosages?: {
    strength: string
    form?: string
  }
}

export interface Product {
  id: string
  type: ProductType
  available: boolean
  name: string
  subTitle: string
  badge?: string | null
  slug: string
  diseaseState: DiseaseState
  treatmentType?: string
  requirePrescription?: boolean
  variants: ProductVariant[]
  bundledProducts?: string[]
  testedMarkers?: string[]
}

// ============================================================================
// Order
// ============================================================================

export interface LineItem {
  productName: string
  sku: string
  dosages?: { strength: string }
  supply: string
  price: number
  qty?: number
  diseaseState: DiseaseState
}

export interface DiscountCode {
  code: string
  discountPercent: number
}

export interface Order {
  id: string
  publicOrderId: string
  type: string
  status: OrderStatus
  createdAt: string
  userId: string
  approvalDoctorId: string | null
  subtotal: number
  discount: number
  discountByCode: number
  shippingPrice: number
  tax: number
  amount: number
  billingCycle: string
  lineItems: LineItem[]
  discountCode?: DiscountCode
  shippingAddress?: Address
}

// ============================================================================
// Subscription
// ============================================================================

export interface Refill {
  id: string
  publicId: string
  fillDate: string
  status: string
}

export interface Subscription {
  id: string
  orderId: string
  status: SubscriptionStatus
  amount: number
  subtotal: number
  tax: number
  discount: number
  paymentCount: number
  paymentInterval: string
  nextBillDate: string
  canceledAt: string | null
  refills: Refill[]
}

// ============================================================================
// Appointment
// ============================================================================

export interface Appointment {
  id: string
  name: string
  type: string
  status: AppointmentStatus
  patientId: string
  doctorId: string
  purchasedAt: string
  startAtLocal: string
  durationMinutes: string
  timezone: string
  meetingUrl: string
  reviewedAt?: string
}

// ============================================================================
// Conversation & Message
// ============================================================================

export interface ChatParticipant {
  userId: string
  role: string
  assignedAt: string
}

export interface Message {
  id: string
  text: string
  type: string
  senderId: string
  createdAt: string
}

export interface Conversation {
  id: string
  type: string
  storeId: string
  createdAt: string
  participants: ChatParticipant[]
  messages: Message[]
}

// ============================================================================
// SOAP Note
// ============================================================================

export interface SoapSubjective {
  chiefComplaint: string
  historyOfPresentIllness: string
  reviewOfSystems: string
}

export interface SoapObjective {
  vitalSigns: string | null
  physicalExam: string
  labResults: string | null
}

export interface SoapAssessment {
  diagnoses: string[]
  differentialDiagnoses: string[]
  clinicalImpression: string
}

export interface SoapPlan {
  medications: string[]
  instructions: string
  followUp: string
  referrals: string | null
}

export interface SoapNote {
  id: string
  patientId: string
  authorId: string
  authorType: string
  createdAt: string
  subjective: SoapSubjective
  objective: SoapObjective
  assessment: SoapAssessment
  plan: SoapPlan
}

// ============================================================================
// Transaction
// ============================================================================

export interface Transaction {
  id: string
  orderId: string
  amount: number
  subtotal: number
  tax: number
  discount: number
  shipping: number
  fee: number
  moneyDirection: "IN" | "OUT"
  status: string
  createdAt: string
}

// ============================================================================
// Notification
// ============================================================================

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

// ============================================================================
// Store
// ============================================================================

export interface Store {
  id: string
  name: string
  domain: string
  description: string
  active: boolean
  currency: string
  orderIdPrefix: string
  firstOrderId: string
  shippingSettings: {
    freeShippingThreshold: number
    standardShippingPrice: number
    expeditedShippingPrice: number
  }
}

// ============================================================================
// Discount Code (admin)
// ============================================================================

export interface AdminDiscountCode {
  id: string
  code: string
  type: string
  value: number
  minOrderAmount: number | null
  maxUses: number | null
  usedCount: number
  active: boolean
  expiresAt: string | null
  createdAt: string
}

// ============================================================================
// Complete Dataset
// ============================================================================

export interface MockDataset {
  _metadata: {
    version: string
    generated: string
    description: string
    notes: Record<string, string>
  }
  store: Store
  providers: Provider[]
  products: Product[]
  patients: Patient[]
  orders: Order[]
  subscriptions: Subscription[]
  appointments: Appointment[]
  conversations: Conversation[]
  soapNotes: SoapNote[]
  transactions: Transaction[]
  discountCodes: AdminDiscountCode[]
  notifications: Notification[]
}
