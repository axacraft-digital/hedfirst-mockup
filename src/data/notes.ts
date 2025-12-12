import notesJson from "./mock/communication/notes.json"
import type { PatientNote } from "./types"

/**
 * Patient notes data - now using centralized mock data
 * Quick notes added by admins, providers, or system
 * Shared across all portals
 */

export const patientNotes = notesJson as PatientNote[]

// Get notes for a specific patient
export function getNotesByPatientId(patientId: string): PatientNote[] {
  return patientNotes
    .filter((note) => note.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

// Get note by ID
export function getNoteById(id: string): PatientNote | undefined {
  return patientNotes.find((note) => note.id === id)
}

// Get note preview (first 100 chars of content)
export function getNotePreview(
  note: PatientNote,
  length: number = 100
): string {
  if (note.content.length <= length) return note.content
  return note.content.substring(0, length).trim() + "..."
}
