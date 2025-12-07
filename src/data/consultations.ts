import type { Consultation, ConsultationStatus } from "./types"
import consultationsJson from "./mock/clinical/consultations.json"
import diseaseStatesJson from "./mock/reference/disease-states.json"
import { mockProviders, getProviderDisplayName } from "./index"

/**
 * Consultations data - using centralized mock data with UI-shaped helpers
 * Transforms normalized data to denormalized shape for UI consumption
 */

export const consultations = consultationsJson as Consultation[]

interface DiseaseState {
  id: string
  code: string
  name: string
  description: string
  active: boolean
}

const diseaseStates = diseaseStatesJson as DiseaseState[]

// UI-shaped consultation type (what the UI expects)
export interface UIConsultation {
  id: string
  patientId: string
  masterOrderId: string | null
  date: string
  diseaseState: string
  doctor: string
  value: number | null
  status: "processed" | "pending" | "scheduled" | "completed" | "canceled"
}

// Map centralized status to UI status
function mapStatus(status: ConsultationStatus): UIConsultation["status"] {
  switch (status) {
    case "COMPLETED":
      return "completed"
    case "PENDING_REVIEW":
    case "NEEDS_INFO":
      return "pending"
    case "IN_PROGRESS":
      return "processed"
    case "CANCELLED":
      return "canceled"
    default:
      return "pending"
  }
}

// Get disease state name by ID
function getDiseaseStateName(diseaseStateId: string): string {
  const ds = diseaseStates.find((d) => d.id === diseaseStateId)
  return ds?.name ?? "Unknown"
}

// Get provider name by ID
function getProviderName(providerId: string | undefined): string {
  if (!providerId) return "Pending Assignment"
  const provider = mockProviders.find((p) => p.id === providerId)
  if (provider) {
    return getProviderDisplayName(provider).replace("Dr. ", "")
  }
  return "Unknown Provider"
}

// Transform centralized consultation to UI shape
function toUIConsultation(consultation: Consultation): UIConsultation {
  return {
    id: consultation.id,
    patientId: consultation.patientId,
    masterOrderId: null, // Not available in centralized data
    date: consultation.completedAt ?? consultation.scheduledAt ?? consultation.createdAt,
    diseaseState: getDiseaseStateName(consultation.diseaseStateId),
    doctor: getProviderName(consultation.providerId),
    value: null, // Consultation fee not tracked in centralized data
    status: mapStatus(consultation.status),
  }
}

// Get consultations for a specific patient (UI-shaped)
export function getConsultationsForUI(patientId: string): UIConsultation[] {
  return consultations
    .filter((c) => c.patientId === patientId)
    .map(toUIConsultation)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get consultation by ID (raw)
export function getConsultationById(id: string): Consultation | undefined {
  return consultations.find((c) => c.id === id)
}

// Get all consultations (raw)
export function getAllConsultations(): Consultation[] {
  return consultations
}
