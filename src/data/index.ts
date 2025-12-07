import rawData from "../../mock-dataset/complete-mock-dataset.json"
import type {
  Appointment,
  Conversation,
  AdminDiscountCode,
  MockDataset,
  Notification,
  Order,
  OrderStatus,
  Patient,
  PatientStatus,
  Product,
  Provider,
  SoapNote,
  Subscription,
  Transaction,
} from "./types"

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
// Re-export types and modules
// ============================================================================

export * from "./types"
export * from "./documents"
export * from "./notes"
export * from "./chart-notes"
