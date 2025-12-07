import type { SoapNote } from "./types"
import chartNotesJson from "./mock/clinical/chart-notes.json"
import { mockProviders } from "./index"

/**
 * Chart Notes (SOAP Notes) - now using centralized mock data
 * Clinical documentation for patient encounters
 */

export const chartNotes = chartNotesJson as SoapNote[]

// Get all chart notes
export function getAllChartNotes(): SoapNote[] {
  return chartNotes
}

// Get chart notes for a specific patient
export function getChartNotesByPatientId(patientId: string): SoapNote[] {
  return chartNotes
    .filter((note) => note.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get chart note by ID
export function getChartNoteById(id: string): SoapNote | undefined {
  return chartNotes.find((note) => note.id === id)
}

// Get provider name for a chart note
export function getChartNoteProviderName(note: SoapNote): string {
  const provider = mockProviders.find((p) => p.id === note.authorId)
  if (provider) {
    return `Dr. ${provider.firstName} ${provider.lastName}`
  }
  return "Unknown Provider"
}
