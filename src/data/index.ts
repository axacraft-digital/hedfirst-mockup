import rawData from "../../mock-dataset/complete-mock-dataset.json"
import type {
  ActivityEvent,
  Appointment,
  Consultation,
  Conversation,
  AdminDiscountCode,
  DiseaseStateEntity,
  MockDataset,
  Notification,
  Order,
  OrderStatus,
  Patient,
  PatientStatus,
  PaymentMethod,
  PaymentTransaction,
  Product,
  Provider,
  Questionnaire,
  SoapNote,
  Subscription,
  Transaction,
  Treatment,
} from "./types"

// ============================================================================
// New Discrete JSON Imports (Phase 2+)
// ============================================================================

import diseaseStatesJson from "./mock/reference/disease-states.json"
import providersJson from "./mock/reference/providers.json"
import productsJson from "./mock/reference/products.json"
import patientsJson from "./mock/patients.json"
import chartNotesJson from "./mock/clinical/chart-notes.json"
import questionnairesJson from "./mock/clinical/questionnaires.json"
import treatmentsJson from "./mock/clinical/treatments.json"
import consultationsJson from "./mock/clinical/consultations.json"
import messagesJson from "./mock/communication/messages.json"
import appointmentsJson from "./mock/communication/appointments.json"
import notesJson from "./mock/communication/notes.json"
import ordersJson from "./mock/financial/orders.json"
import paymentMethodsJson from "./mock/financial/payment-methods.json"
import paymentHistoryJson from "./mock/financial/payment-history.json"
import documentsJson from "./mock/documents/documents.json"
import activityHistoryJson from "./mock/audit/activity-history.json"

// Typed exports from discrete files (currently empty, will be populated in Phase 2+)
export const diseaseStateEntities = diseaseStatesJson as DiseaseStateEntity[]
export const mockProviders = providersJson as Provider[]
export const mockProducts = productsJson as Product[]
export const mockPatients = patientsJson as Patient[]
export const mockChartNotes = chartNotesJson as SoapNote[]
export const mockQuestionnaires = questionnairesJson as Questionnaire[]
export const mockTreatments = treatmentsJson as Treatment[]
export const mockConsultations = consultationsJson as Consultation[]
export const mockMessages = messagesJson as Conversation[]
export const mockAppointments = appointmentsJson as Appointment[]
export const mockNotes = notesJson as unknown[] // PatientNote - already in notes.ts
export const mockOrders = ordersJson as Order[]
export const mockPaymentMethods = paymentMethodsJson as PaymentMethod[]
export const mockPaymentHistory = paymentHistoryJson as PaymentTransaction[]
export const mockDocuments = documentsJson as unknown[] // PatientDocument - already in documents.ts
export const mockActivityHistory = activityHistoryJson as ActivityEvent[]

// Cast the imported JSON to our typed dataset
const data = rawData as unknown as MockDataset

// ============================================================================
// Direct Exports
// ============================================================================

export const store = data.store
export const providers = data.providers as Provider[]
export const products = data.products as Product[]
export const patients = data.patients as Patient[]
export const orders = data.orders as Order[]
export const subscriptions = data.subscriptions as Subscription[]
export const appointments = data.appointments as Appointment[]
export const conversations = data.conversations as Conversation[]
export const soapNotes = data.soapNotes as SoapNote[]
export const transactions = data.transactions as Transaction[]
export const discountCodes = data.discountCodes as AdminDiscountCode[]
export const notifications = data.notifications as Notification[]

// ============================================================================
// Patient Helpers
// ============================================================================

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id)
}

export function getPatientsByStatus(status: PatientStatus): Patient[] {
  return patients.filter((p) => p.patientStatus === status)
}

export function getPatientsByProvider(providerId: string): Patient[] {
  return patients.filter((p) => p.assignedProviderId === providerId)
}

export function getPatientFullName(patient: Patient): string {
  return `${patient.firstName} ${patient.lastName}`
}

// ============================================================================
// Provider Helpers
// ============================================================================

export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id)
}

export function getProviderFullName(provider: Provider): string {
  return `${provider.firstName} ${provider.lastName}`
}

export function getProviderDisplayName(provider: Provider): string {
  return `Dr. ${provider.lastName}`
}

// ============================================================================
// Order Helpers
// ============================================================================

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id)
}

export function getOrderByPublicId(publicId: string): Order | undefined {
  return orders.find((o) => o.publicOrderId === publicId)
}

export function getOrdersByPatient(patientId: string): Order[] {
  return orders.filter((o) => o.userId === patientId)
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return orders.filter((o) => o.status === status)
}

export function getOrdersByProvider(providerId: string): Order[] {
  return orders.filter((o) => o.approvalDoctorId === providerId)
}

// ============================================================================
// Subscription Helpers
// ============================================================================

export function getSubscriptionById(id: string): Subscription | undefined {
  return subscriptions.find((s) => s.id === id)
}

export function getSubscriptionByOrder(orderId: string): Subscription | undefined {
  return subscriptions.find((s) => s.orderId === orderId)
}

// ============================================================================
// Appointment Helpers
// ============================================================================

export function getAppointmentById(id: string): Appointment | undefined {
  return appointments.find((a) => a.id === id)
}

export function getAppointmentsByPatient(patientId: string): Appointment[] {
  return appointments.filter((a) => a.patientId === patientId)
}

export function getAppointmentsByProvider(providerId: string): Appointment[] {
  return appointments.filter((a) => a.doctorId === providerId)
}

// ============================================================================
// Conversation Helpers
// ============================================================================

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id)
}

export function getConversationsByParticipant(userId: string): Conversation[] {
  return conversations.filter((c) =>
    c.participants.some((p) => p.userId === userId)
  )
}

// ============================================================================
// SOAP Note Helpers
// ============================================================================

export function getSoapNotesByPatient(patientId: string): SoapNote[] {
  return soapNotes.filter((s) => s.patientId === patientId)
}

export function getSoapNotesByProvider(providerId: string): SoapNote[] {
  return soapNotes.filter((s) => s.authorId === providerId)
}

// ============================================================================
// Product Helpers
// ============================================================================

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByDiseaseState(diseaseState: string): Product[] {
  return products.filter((p) => p.diseaseState === diseaseState)
}

// ============================================================================
// Transaction Helpers
// ============================================================================

export function getTransactionsByOrder(orderId: string): Transaction[] {
  return transactions.filter((t) => t.orderId === orderId)
}

// ============================================================================
// Disease State Helpers (New)
// ============================================================================

export function getDiseaseStateById(id: string): DiseaseStateEntity | undefined {
  return diseaseStateEntities.find((ds) => ds.id === id)
}

export function getDiseaseStateByCode(code: string): DiseaseStateEntity | undefined {
  return diseaseStateEntities.find((ds) => ds.code === code)
}

// ============================================================================
// Questionnaire Helpers (New)
// ============================================================================

export function getQuestionnairesByPatientId(patientId: string): Questionnaire[] {
  return mockQuestionnaires.filter((q) => q.patientId === patientId)
}

export function getQuestionnaireById(id: string): Questionnaire | undefined {
  return mockQuestionnaires.find((q) => q.id === id)
}

// ============================================================================
// Treatment Helpers (New)
// ============================================================================

export function getTreatmentsByPatientId(patientId: string): Treatment[] {
  return mockTreatments.filter((t) => t.patientId === patientId)
}

export function getTreatmentById(id: string): Treatment | undefined {
  return mockTreatments.find((t) => t.id === id)
}

export function getActiveTreatmentsByPatientId(patientId: string): Treatment[] {
  return mockTreatments.filter((t) => t.patientId === patientId && t.status === "ACTIVE")
}

// ============================================================================
// Consultation Helpers (New)
// ============================================================================

export function getConsultationsByPatientId(patientId: string): Consultation[] {
  return mockConsultations.filter((c) => c.patientId === patientId)
}

export function getConsultationById(id: string): Consultation | undefined {
  return mockConsultations.find((c) => c.id === id)
}

export function getConsultationsByProviderId(providerId: string): Consultation[] {
  return mockConsultations.filter((c) => c.providerId === providerId)
}

export function getPendingConsultations(): Consultation[] {
  return mockConsultations.filter((c) => c.status === "PENDING_REVIEW")
}

// ============================================================================
// Payment Method Helpers (New)
// ============================================================================

export function getPaymentMethodsByPatientId(patientId: string): PaymentMethod[] {
  return mockPaymentMethods.filter((pm) => pm.patientId === patientId)
}

export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return mockPaymentMethods.find((pm) => pm.id === id)
}

export function getDefaultPaymentMethod(patientId: string): PaymentMethod | undefined {
  return mockPaymentMethods.find((pm) => pm.patientId === patientId && pm.isDefault)
}

// ============================================================================
// Payment Transaction Helpers (New)
// ============================================================================

export function getPaymentHistoryByPatientId(patientId: string): PaymentTransaction[] {
  return mockPaymentHistory.filter((pt) => pt.patientId === patientId)
}

export function getPaymentTransactionById(id: string): PaymentTransaction | undefined {
  return mockPaymentHistory.find((pt) => pt.id === id)
}

export function getPaymentTransactionsByOrderId(orderId: string): PaymentTransaction[] {
  return mockPaymentHistory.filter((pt) => pt.orderId === orderId)
}

// ============================================================================
// Activity History Helpers (New)
// ============================================================================

export function getActivityHistoryByPatientId(patientId: string): ActivityEvent[] {
  return mockActivityHistory
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getActivityEventById(id: string): ActivityEvent | undefined {
  return mockActivityHistory.find((e) => e.id === id)
}

// ============================================================================
// Composite Helper Types (Phase 5)
// ============================================================================

export interface PatientWithDetails {
  patient: Patient
  provider: Provider | undefined
  diseaseStates: DiseaseStateEntity[]
  recentOrders: Order[]
  activeConsultation: Consultation | null
}

export interface ProviderDashboardData {
  provider: Provider
  patients: Patient[]
  pendingConsultations: Consultation[]
  todayAppointments: Appointment[]
}

export interface PatientPortalData {
  patient: Patient
  activeTreatments: Treatment[]
  upcomingAppointments: Appointment[]
  unreadMessages: number
  recentOrders: Order[]
}

// ============================================================================
// Composite Helpers (Phase 5)
// ============================================================================

/**
 * Get patient with all related details for patient detail views
 * Used by: Store Admin, Provider Portal, Patient Portal
 */
export function getPatientWithDetails(patientId: string): PatientWithDetails | null {
  const patient = mockPatients.find((p) => p.id === patientId)
  if (!patient) return null

  // Get assigned provider
  const provider = patient.assignedProviderId
    ? mockProviders.find((p) => p.id === patient.assignedProviderId)
    : undefined

  // Get disease state entities for this patient's disease state codes
  const diseaseStates = patient.diseaseStates
    .map((code) => diseaseStateEntities.find((ds) => ds.code === code))
    .filter((ds): ds is DiseaseStateEntity => ds !== undefined)

  // Get recent orders (last 5, sorted by date)
  const recentOrders = mockOrders
    .filter((o) => o.userId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Get active consultation (in progress or pending)
  const activeConsultation = mockConsultations.find(
    (c) => c.patientId === patientId &&
    (c.status === "PENDING_REVIEW" || c.status === "IN_PROGRESS")
  ) ?? null

  return {
    patient,
    provider,
    diseaseStates,
    recentOrders,
    activeConsultation,
  }
}

/**
 * Get provider dashboard data for provider portal home
 * Used by: Provider Portal
 */
export function getProviderDashboard(providerId: string): ProviderDashboardData | null {
  const provider = mockProviders.find((p) => p.id === providerId)
  if (!provider) return null

  // Get all patients assigned to this provider
  const patients = mockPatients.filter((p) => p.assignedProviderId === providerId)

  // Get pending consultations for this provider
  const pendingConsultations = mockConsultations.filter(
    (c) => c.providerId === providerId && c.status === "PENDING_REVIEW"
  )

  // Get today's appointments
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

  const todayAppointments = mockAppointments.filter((a) => {
    if (a.doctorId !== providerId) return false
    if (!a.startAtLocal) return false
    const apptDate = new Date(a.startAtLocal)
    return apptDate >= todayStart && apptDate < todayEnd
  })

  return {
    provider,
    patients,
    pendingConsultations,
    todayAppointments,
  }
}

/**
 * Get patient portal home data
 * Used by: Patient Portal
 */
export function getPatientPortalData(patientId: string): PatientPortalData | null {
  const patient = mockPatients.find((p) => p.id === patientId)
  if (!patient) return null

  // Get active treatments
  const activeTreatments = mockTreatments.filter(
    (t) => t.patientId === patientId && t.status === "ACTIVE"
  )

  // Get upcoming appointments (scheduled, not completed)
  const now = new Date()
  const upcomingAppointments = mockAppointments
    .filter((a) => {
      if (a.patientId !== patientId) return false
      if (a.status !== "SCHEDULED") return false
      if (!a.startAtLocal) return false
      return new Date(a.startAtLocal) > now
    })
    .sort((a, b) => new Date(a.startAtLocal).getTime() - new Date(b.startAtLocal).getTime())

  // Count unread messages
  const unreadMessages = mockMessages
    .filter((thread) => thread.participants.some((p) => p.userId === patientId))
    .reduce((count, thread) => {
      const unreadInThread = thread.messages.filter(
        (m) => m.senderId !== patientId && !m.read
      ).length
      return count + unreadInThread
    }, 0)

  // Get recent orders (last 5)
  const recentOrders = mockOrders
    .filter((o) => o.userId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return {
    patient,
    activeTreatments,
    upcomingAppointments,
    unreadMessages,
    recentOrders,
  }
}

// ============================================================================
// Re-export types and modules
// ============================================================================

export * from "./types"
export * from "./documents"
export * from "./notes"
export * from "./chart-notes"
