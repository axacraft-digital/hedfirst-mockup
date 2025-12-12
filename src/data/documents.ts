import documentsJson from "./mock/documents/documents.json"
import type { PatientDocument } from "./types"

/**
 * Patient documents data - now using centralized mock data
 * Shared across Store Admin, Provider Admin, and Patient Admin portals
 */

export const patientDocuments = documentsJson as PatientDocument[]

// Get documents for a specific patient
export function getDocumentsByPatientId(patientId: string): PatientDocument[] {
  return patientDocuments
    .filter((doc) => doc.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
}

// Get document by ID
export function getDocumentById(id: string): PatientDocument | undefined {
  return patientDocuments.find((doc) => doc.id === id)
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
