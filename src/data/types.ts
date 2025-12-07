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

export type DiseaseStateCode =
  | "HAIR_GROWTH"
  | "WEIGHT_LOSS"
  | "SEXUAL_WELLNESS"
  | "SKIN_CARE"
  | "GENERAL_HEALTH"
  | "MENTAL_HEALTH"
  | "HORMONE_THERAPY"

// Legacy alias for backwards compatibility
export type DiseaseState = DiseaseStateCode

// ============================================================================
// Disease State Entity (Reference Data)
// ============================================================================

export interface DiseaseStateEntity {
  id: string // e.g., "ds_hormone", "ds_weight"
  code: DiseaseStateCode
  name: string // e.g., "Hormone Optimization", "Weight Management"
  description: string
  active: boolean
}

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
  read?: boolean
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
// Questionnaire
// ============================================================================

export type QuestionnaireStatus = "PENDING" | "COMPLETED" | "EXPIRED"

export interface QuestionnaireQuestion {
  id: string
  text: string
  type: "TEXT" | "SINGLE_CHOICE" | "MULTI_CHOICE" | "DATE" | "FILE_UPLOAD"
  options?: string[]
  required: boolean
}

export interface QuestionnaireAnswer {
  questionId: string
  value: string | string[]
  fileUrl?: string
}

export interface Questionnaire {
  id: string
  patientId: string
  type: string // e.g., "INTAKE", "FOLLOW_UP", "LIFESTYLE"
  title: string
  diseaseStateId?: string
  status: QuestionnaireStatus
  version: string
  questions: QuestionnaireQuestion[]
  answers: QuestionnaireAnswer[]
  submittedAt?: string
  createdAt: string
}

// ============================================================================
// Treatment
// ============================================================================

export type TreatmentStatus = "ACTIVE" | "PAUSED" | "CANCELLED" | "COMPLETED"
export type TreatmentType = "SUBSCRIPTION" | "ONE_TIME" | "MEMBERSHIP"

export interface Treatment {
  id: string
  patientId: string
  productId: string
  variantId?: string
  type: TreatmentType
  status: TreatmentStatus
  diseaseStateId: string
  prescribedById?: string
  dosage?: string
  instructions?: string
  startDate: string
  endDate?: string
  nextRefillDate?: string
  refillCount: number
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Consultation
// ============================================================================

export type ConsultationStatus =
  | "PENDING_REVIEW"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NEEDS_INFO"

export type ConsultationType = "INITIAL" | "FOLLOW_UP" | "URGENT" | "TELEHEALTH"

export interface Consultation {
  id: string
  patientId: string
  providerId?: string
  diseaseStateId: string
  type: ConsultationType
  status: ConsultationStatus
  reason: string
  notes?: string
  scheduledAt?: string
  completedAt?: string
  createdAt: string
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
// Payment Method
// ============================================================================

export type PaymentMethodType = "CARD" | "BANK_ACCOUNT" | "PAYPAL"
export type CardBrand = "VISA" | "MASTERCARD" | "AMEX" | "DISCOVER"

export interface PaymentMethod {
  id: string
  patientId: string
  type: PaymentMethodType
  isDefault: boolean
  // Card-specific fields
  cardBrand?: CardBrand
  lastFour?: string
  expiryMonth?: number
  expiryYear?: number
  cardholderName?: string
  // Bank-specific fields
  bankName?: string
  accountLastFour?: string
  accountType?: "CHECKING" | "SAVINGS"
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Payment Transaction (History)
// ============================================================================

export type PaymentTransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"

export type PaymentTransactionType =
  | "CHARGE"
  | "REFUND"
  | "CHARGEBACK"
  | "ADJUSTMENT"

export interface PaymentTransaction {
  id: string
  patientId: string
  orderId?: string
  subscriptionId?: string
  paymentMethodId: string
  type: PaymentTransactionType
  status: PaymentTransactionStatus
  amount: number
  currency: string
  description: string
  failureReason?: string
  refundedAmount?: number
  processedAt: string
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
// Patient Note (Quick Notes)
// ============================================================================

export interface PatientNote {
  id: string
  patientId: string
  title: string
  content: string
  createdAt: string
  createdBy: string
  createdByRole: "Admin" | "Provider" | "System"
}

// ============================================================================
// Patient Document
// ============================================================================

export type DocumentSource =
  | "Questionnaire Response"
  | "Manual Upload"
  | "Patient Upload"
  | "EHR Import"
  | "Provider Upload"
  | "System Generated"

export interface PatientDocument {
  id: string
  patientId: string
  name: string
  uploadedAt: string
  source: DocumentSource
  fileType: string
  fileSize: number
  uploadedBy?: string
}

// ============================================================================
// Activity Event (Audit Trail)
// ============================================================================

export type ActivityEventType =
  | "ACCOUNT_CREATED"
  | "ACCOUNT_UPDATED"
  | "STATUS_CHANGED"
  | "ORDER_PLACED"
  | "ORDER_APPROVED"
  | "ORDER_DENIED"
  | "ORDER_SHIPPED"
  | "PRESCRIPTION_CREATED"
  | "PRESCRIPTION_REFILLED"
  | "CONSULTATION_SCHEDULED"
  | "CONSULTATION_COMPLETED"
  | "MESSAGE_SENT"
  | "MESSAGE_RECEIVED"
  | "DOCUMENT_UPLOADED"
  | "QUESTIONNAIRE_SUBMITTED"
  | "PAYMENT_PROCESSED"
  | "PAYMENT_FAILED"
  | "SUBSCRIPTION_STARTED"
  | "SUBSCRIPTION_PAUSED"
  | "SUBSCRIPTION_CANCELLED"
  | "PROVIDER_ASSIGNED"
  | "NOTE_ADDED"
  | "LOGIN"
  | "PASSWORD_CHANGED"

export interface ActivityEvent {
  id: string
  patientId: string
  type: ActivityEventType
  title: string
  description: string
  actorId?: string // Who performed the action
  actorType?: "PATIENT" | "PROVIDER" | "ADMIN" | "SYSTEM"
  metadata?: Record<string, unknown> // Additional context (orderId, etc.)
  createdAt: string
}

// ============================================================================
// Store User (Admin Staff)
// ============================================================================

export type StoreUserRole = "admin" | "manager" | "support"
export type StoreUserStatus = "ACTIVE" | "INACTIVE" | "INVITED"

export interface StoreUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: StoreUserRole
  status: StoreUserStatus
  createdAt: string
  lastLoginAt: string | null // null if user has never logged in
}

// ============================================================================
// Pharmacy (Fulfillment Partner)
// ============================================================================

export interface Pharmacy {
  id: string
  name: string
  address: string
  phone: string
  pic: string // Person in charge
  externalPharmacyId: string // DoseSpot pharmacy ID
  state: string // State abbreviation (e.g., "TX", "CO")
}

// ============================================================================
// Integration Status (System Integrations)
// ============================================================================

export type IntegrationStatus = "connected" | "issue" | "not_connected" | "not_tested"
export type IntegrationCategory = "clinical" | "payment" | "fulfillment" | "communication" | "marketing" | "utility" | "ai" | "infrastructure"
export type ConnectionTestResult = "success" | "failed"
export type IssueSeverity = "warning" | "critical"

export interface IntegrationConnectionTest {
  lastTested: string
  result: ConnectionTestResult
  message: string
  errorCode?: string
  responseTime: number
}

export interface IntegrationIssue {
  severity: IssueSeverity
  message: string
  timestamp: string
  affectedFeature?: string
}

export interface IntegrationUsage {
  requestsThisMonth: number
  costThisMonth?: number // In cents, for AI providers
  errorRate: number
}

export interface IntegrationStatusRecord {
  id: string
  name: string
  category: IntegrationCategory
  status: IntegrationStatus
  enabled: boolean
  connectionTest: IntegrationConnectionTest | null
  issue?: IntegrationIssue
  usage?: IntegrationUsage
}

// ============================================================================
// Lab Kit (Choose Health Integration)
// ============================================================================

export type LabKitCategory =
  | "Metabolic"
  | "Liver"
  | "Endocrine"
  | "Female Hormone"
  | "Male Hormone"

export interface LabKitCatalog {
  source: string
  version: string
  lastUpdated: string
  collectionMethod: string
}

export interface LabKit {
  id: string
  name: string
  category: LabKitCategory
  description: string
  focus: string
  biomarkerCount: number
  biomarkers: string[]
  price?: number // in cents
  sku?: string
  onStore?: boolean
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
