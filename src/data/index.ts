import activityHistoryJson from "./mock/audit/activity-history.json"
import chartNotesJson from "./mock/clinical/chart-notes.json"
import consultationsJson from "./mock/clinical/consultations.json"
import questionnairesJson from "./mock/clinical/questionnaires.json"
import treatmentsJson from "./mock/clinical/treatments.json"
import appointmentsJson from "./mock/communication/appointments.json"
import messagesJson from "./mock/communication/messages.json"
import notesJson from "./mock/communication/notes.json"
import documentsJson from "./mock/documents/documents.json"
import ordersJson from "./mock/financial/orders.json"
import paymentHistoryJson from "./mock/financial/payment-history.json"
import paymentMethodsJson from "./mock/financial/payment-methods.json"
import integrationStatusJson from "./mock/integrations/status.json"
import patientsJson from "./mock/patients.json"
// ============================================================================
// New Discrete JSON Imports (Phase 2+)
// ============================================================================

import diseaseStatesJson from "./mock/reference/disease-states.json"
import labKitsJson from "./mock/reference/lab-kits.json"
import pharmaciesJson from "./mock/reference/pharmacies.json"
import productsJson from "./mock/reference/products.json"
import providersJson from "./mock/reference/providers.json"
import storeUsersJson from "./mock/reference/store-users.json"
import type {
  ActivityEvent,
  Appointment,
  Consultation,
  Conversation,
  DiseaseStateEntity,
  IntegrationCategory,
  IntegrationStatus,
  IntegrationStatusRecord,
  LabKit,
  LabKitCatalog,
  Order,
  OrderStatus,
  Patient,
  PatientStatus,
  PaymentMethod,
  PaymentTransaction,
  Pharmacy,
  Product,
  Provider,
  Questionnaire,
  SoapNote,
  StoreUser,
  StoreUserRole,
  StoreUserStatus,
  Treatment,
} from "./types"

// Typed exports from discrete files (currently empty, will be populated in Phase 2+)
export const diseaseStateEntities = diseaseStatesJson as DiseaseStateEntity[]
export const mockProviders = providersJson as Provider[]
export const mockProducts = productsJson as Product[]
export const mockStoreUsers = storeUsersJson as StoreUser[]
export const mockPharmacies = pharmaciesJson as Pharmacy[]
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
export const mockIntegrationStatus =
  integrationStatusJson as IntegrationStatusRecord[]
export const labKitCatalog = labKitsJson.catalog as LabKitCatalog
export const mockLabKits = labKitsJson.labKits as LabKit[]

// ============================================================================
// Patient Helpers
// ============================================================================

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id)
}

export function getPatientsByStatus(status: PatientStatus): Patient[] {
  return mockPatients.filter((p) => p.patientStatus === status)
}

export function getPatientsByProvider(providerId: string): Patient[] {
  return mockPatients.filter((p) => p.assignedProviderId === providerId)
}

export function getPatientFullName(patient: Patient): string {
  return `${patient.firstName} ${patient.lastName}`
}

// ============================================================================
// Provider Helpers
// ============================================================================

export function getProviderById(id: string): Provider | undefined {
  return mockProviders.find((p) => p.id === id)
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
  return mockOrders.find((o) => o.id === id)
}

export function getOrderByPublicId(publicId: string): Order | undefined {
  return mockOrders.find((o) => o.publicOrderId === publicId)
}

export function getOrdersByPatient(patientId: string): Order[] {
  return mockOrders.filter((o) => o.userId === patientId)
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return mockOrders.filter((o) => o.status === status)
}

export function getOrdersByProvider(providerId: string): Order[] {
  return mockOrders.filter((o) => o.approvalDoctorId === providerId)
}

// ============================================================================
// Appointment Helpers
// ============================================================================

export function getAppointmentById(id: string): Appointment | undefined {
  return mockAppointments.find((a) => a.id === id)
}

export function getAppointmentsByPatient(patientId: string): Appointment[] {
  return mockAppointments.filter((a) => a.patientId === patientId)
}

export function getAppointmentsByProvider(providerId: string): Appointment[] {
  return mockAppointments.filter((a) => a.doctorId === providerId)
}

// ============================================================================
// Conversation Helpers
// ============================================================================

export function getConversationById(id: string): Conversation | undefined {
  return mockMessages.find((c) => c.id === id)
}

export function getConversationsByParticipant(userId: string): Conversation[] {
  return mockMessages.filter((c) =>
    c.participants.some((p) => p.userId === userId)
  )
}

// ============================================================================
// SOAP Note Helpers
// ============================================================================

export function getSoapNotesByPatient(patientId: string): SoapNote[] {
  return mockChartNotes.filter((s) => s.patientId === patientId)
}

export function getSoapNotesByProvider(providerId: string): SoapNote[] {
  return mockChartNotes.filter((s) => s.authorId === providerId)
}

// ============================================================================
// Product Helpers
// ============================================================================

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug)
}

export function getProductsByDiseaseState(diseaseState: string): Product[] {
  return mockProducts.filter((p) => p.diseaseState === diseaseState)
}

// ============================================================================
// Disease State Helpers (New)
// ============================================================================

export function getDiseaseStateById(
  id: string
): DiseaseStateEntity | undefined {
  return diseaseStateEntities.find((ds) => ds.id === id)
}

export function getDiseaseStateByCode(
  code: string
): DiseaseStateEntity | undefined {
  return diseaseStateEntities.find((ds) => ds.code === code)
}

// ============================================================================
// Store User Helpers
// ============================================================================

export function getStoreUserById(id: string): StoreUser | undefined {
  return mockStoreUsers.find((u) => u.id === id)
}

export function getStoreUsersByRole(role: StoreUserRole): StoreUser[] {
  return mockStoreUsers.filter((u) => u.role === role)
}

export function getStoreUsersByStatus(status: StoreUserStatus): StoreUser[] {
  return mockStoreUsers.filter((u) => u.status === status)
}

export function getStoreUserFullName(user: StoreUser): string {
  return `${user.firstName} ${user.lastName}`
}

// ============================================================================
// Pharmacy Helpers
// ============================================================================

export function getPharmacyById(id: string): Pharmacy | undefined {
  return mockPharmacies.find((p) => p.id === id)
}

export function getPharmaciesByState(state: string): Pharmacy[] {
  return mockPharmacies.filter((p) => p.state === state)
}

export function getPharmacyOptions(): { label: string; value: string }[] {
  return mockPharmacies.map((p) => ({
    label: p.name,
    value: p.id,
  }))
}

// ============================================================================
// Questionnaire Helpers (New)
// ============================================================================

export function getQuestionnairesByPatientId(
  patientId: string
): Questionnaire[] {
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
  return mockTreatments.filter(
    (t) => t.patientId === patientId && t.status === "ACTIVE"
  )
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

export function getConsultationsByProviderId(
  providerId: string
): Consultation[] {
  return mockConsultations.filter((c) => c.providerId === providerId)
}

export function getPendingConsultations(): Consultation[] {
  return mockConsultations.filter((c) => c.status === "PENDING_REVIEW")
}

// ============================================================================
// Payment Method Helpers (New)
// ============================================================================

export function getPaymentMethodsByPatientId(
  patientId: string
): PaymentMethod[] {
  return mockPaymentMethods.filter((pm) => pm.patientId === patientId)
}

export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return mockPaymentMethods.find((pm) => pm.id === id)
}

export function getDefaultPaymentMethod(
  patientId: string
): PaymentMethod | undefined {
  return mockPaymentMethods.find(
    (pm) => pm.patientId === patientId && pm.isDefault
  )
}

// ============================================================================
// Payment Transaction Helpers (New)
// ============================================================================

export function getPaymentHistoryByPatientId(
  patientId: string
): PaymentTransaction[] {
  return mockPaymentHistory.filter((pt) => pt.patientId === patientId)
}

export function getPaymentTransactionById(
  id: string
): PaymentTransaction | undefined {
  return mockPaymentHistory.find((pt) => pt.id === id)
}

export function getPaymentTransactionsByOrderId(
  orderId: string
): PaymentTransaction[] {
  return mockPaymentHistory.filter((pt) => pt.orderId === orderId)
}

// ============================================================================
// Activity History Helpers (New)
// ============================================================================

export function getActivityHistoryByPatientId(
  patientId: string
): ActivityEvent[] {
  return mockActivityHistory
    .filter((e) => e.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getActivityEventById(id: string): ActivityEvent | undefined {
  return mockActivityHistory.find((e) => e.id === id)
}

// ============================================================================
// Integration Helpers
// ============================================================================

export function getIntegrationStatusById(
  id: string
): IntegrationStatusRecord | undefined {
  return mockIntegrationStatus.find((i) => i.id === id)
}

export function getIntegrationsByStatus(
  status: IntegrationStatus
): IntegrationStatusRecord[] {
  return mockIntegrationStatus.filter((i) => i.status === status)
}

export function getIntegrationsByCategory(
  category: IntegrationCategory
): IntegrationStatusRecord[] {
  return mockIntegrationStatus.filter((i) => i.category === category)
}

export function getIntegrationsWithIssues(): IntegrationStatusRecord[] {
  return mockIntegrationStatus.filter((i) => i.status === "issue")
}

export function getEnabledIntegrations(): IntegrationStatusRecord[] {
  return mockIntegrationStatus.filter((i) => i.enabled)
}

/**
 * Simulate testing an integration connection.
 * Returns the stored connectionTest result for the integration.
 * Used by Test Connection buttons in the UI.
 */
export function testIntegrationConnection(id: string): {
  result: "success" | "failed" | "not_configured"
  message: string
  errorCode?: string
  responseTime?: number
} {
  const integration = mockIntegrationStatus.find((i) => i.id === id)

  if (!integration) {
    return {
      result: "failed",
      message: `Integration "${id}" not found`,
    }
  }

  if (!integration.connectionTest) {
    return {
      result: "not_configured",
      message: `${integration.name} has not been configured. Please add credentials to enable this integration.`,
    }
  }

  return {
    result: integration.connectionTest.result,
    message: integration.connectionTest.message,
    errorCode: integration.connectionTest.errorCode,
    responseTime: integration.connectionTest.responseTime,
  }
}

/**
 * Get integration dashboard summary for Store Admin
 * Returns counts by status for dashboard widgets
 */
export function getIntegrationDashboardSummary(): {
  total: number
  connected: number
  issues: number
  notConfigured: number
  issueDetails: { name: string; message: string; severity: string }[]
} {
  const total = mockIntegrationStatus.length
  const connected = mockIntegrationStatus.filter(
    (i) => i.status === "connected"
  ).length
  const issues = mockIntegrationStatus.filter(
    (i) => i.status === "issue"
  ).length
  const notConfigured = mockIntegrationStatus.filter(
    (i) => i.status === "not_connected" || i.status === "not_tested"
  ).length

  const issueDetails = mockIntegrationStatus
    .filter((i) => i.issue)
    .map((i) => ({
      name: i.name,
      message: i.issue!.message,
      severity: i.issue!.severity,
    }))

  return { total, connected, issues, notConfigured, issueDetails }
}

// ============================================================================
// Lab Kit Helpers
// ============================================================================

export function getLabKitById(id: string): LabKit | undefined {
  return mockLabKits.find((kit) => kit.id === id)
}

export function getLabKitsByCategory(category: string): LabKit[] {
  return mockLabKits.filter((kit) => kit.category === category)
}

export function getLabKitsOnStore(): LabKit[] {
  return mockLabKits.filter((kit) => kit.onStore)
}

export function getLabKitCategories(): string[] {
  return [...new Set(mockLabKits.map((kit) => kit.category))]
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
export function getPatientWithDetails(
  patientId: string
): PatientWithDetails | null {
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
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  // Get active consultation (in progress or pending)
  const activeConsultation =
    mockConsultations.find(
      (c) =>
        c.patientId === patientId &&
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
export function getProviderDashboard(
  providerId: string
): ProviderDashboardData | null {
  const provider = mockProviders.find((p) => p.id === providerId)
  if (!provider) return null

  // Get all patients assigned to this provider
  const patients = mockPatients.filter(
    (p) => p.assignedProviderId === providerId
  )

  // Get pending consultations for this provider
  const pendingConsultations = mockConsultations.filter(
    (c) => c.providerId === providerId && c.status === "PENDING_REVIEW"
  )

  // Get today's appointments
  const today = new Date()
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
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
export function getPatientPortalData(
  patientId: string
): PatientPortalData | null {
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
    .sort(
      (a, b) =>
        new Date(a.startAtLocal).getTime() - new Date(b.startAtLocal).getTime()
    )

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
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
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
