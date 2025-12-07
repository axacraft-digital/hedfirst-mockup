import type { PatientNote } from "./types"

/**
 * Mock patient notes data
 * Quick notes added by admins, providers, or system
 * Shared across all portals
 */

export const patientNotes: PatientNote[] = [
  // Jacob Henderson (usr_pat_jacob)
  {
    id: "note_001",
    patientId: "usr_pat_jacob",
    title: "Initial consultation follow-up",
    content: `Patient completed initial consultation with Dr. Baldwin. Discussed weight loss goals and treatment options. Patient expressed interest in starting with a conservative approach before considering GLP-1 medications.

Key points discussed:
- Current weight: 160 lbs, goal weight: 145 lbs
- No history of diabetes or cardiovascular issues
- Patient exercises 2-3 times per week
- Diet primarily consists of home-cooked meals

Next steps: Schedule follow-up in 4 weeks to assess progress with lifestyle modifications. If insufficient progress, will discuss Semaglutide as an option.`,
    createdAt: "2024-08-16T14:30:00Z",
    createdBy: "Dr. Nicole Baldwin",
    createdByRole: "Provider",
  },
  {
    id: "note_002",
    patientId: "usr_pat_jacob",
    title: "Insurance verification completed",
    content: `Verified patient's insurance coverage with Blue Cross Blue Shield. Coverage confirmed for telehealth consultations and prescription medications.

Copay: $25 per visit
Prescription coverage: Tier 2 formulary
Prior authorization: Not required for initial prescription`,
    createdAt: "2024-08-15T16:45:00Z",
    createdBy: "Admin Staff",
    createdByRole: "Admin",
  },
  {
    id: "note_003",
    patientId: "usr_pat_jacob",
    title: "Week 4 check-in",
    content: `Patient reports good progress with dietary changes. Has lost 4 lbs since initial consultation. Energy levels improved, sleeping better.

Concerns: Patient mentioned occasional headaches in the first week, which have since resolved. Advised to maintain adequate hydration.

Plan: Continue current approach for another 4 weeks. Patient satisfied with progress and prefers to avoid medication if possible.`,
    createdAt: "2024-09-13T10:15:00Z",
    createdBy: "Dr. Nicole Baldwin",
    createdByRole: "Provider",
  },
  {
    id: "note_004",
    patientId: "usr_pat_jacob",
    title: "Prescription refill request",
    content: `Patient requested refill of vitamin D supplements. Approved and sent to pharmacy.`,
    createdAt: "2024-10-01T09:00:00Z",
    createdBy: "Admin Staff",
    createdByRole: "Admin",
  },

  // Sarah Johnson (usr_pat001)
  {
    id: "note_101",
    patientId: "usr_pat001",
    title: "Treatment plan initiated",
    content: `Started patient on Finasteride 1mg daily for hair loss treatment. Discussed expected timeline for results (3-6 months for visible improvement).

Side effects reviewed:
- Decreased libido (rare)
- Must not handle crushed tablets if pregnant

Patient acknowledged understanding and signed consent form. Will follow up in 3 months to assess progress.`,
    createdAt: "2024-06-16T11:00:00Z",
    createdBy: "Dr. Michelle Chen",
    createdByRole: "Provider",
  },
  {
    id: "note_102",
    patientId: "usr_pat001",
    title: "3-month follow-up",
    content: `Patient reports early signs of improvement. Less hair shedding noted in the shower and on pillowcase. No side effects experienced.

Progress photos taken and compared to baseline - slight improvement in crown area density visible.

Plan: Continue current treatment. Add topical Minoxidil 5% if patient interested in accelerating results. Patient will consider and follow up.`,
    createdAt: "2024-09-16T14:30:00Z",
    createdBy: "Dr. Michelle Chen",
    createdByRole: "Provider",
  },
  {
    id: "note_103",
    patientId: "usr_pat001",
    title: "Patient inquiry - product question",
    content: `Patient called asking about combining Finasteride with biotin supplements. Advised that biotin is safe to take alongside Finasteride and may provide additional support for hair health. No prescription needed for biotin.`,
    createdAt: "2024-08-22T15:20:00Z",
    createdBy: "Admin Staff",
    createdByRole: "Admin",
  },

  // Michael Thompson (usr_pat002)
  {
    id: "note_201",
    patientId: "usr_pat002",
    title: "Weight loss program enrollment",
    content: `Patient enrolled in comprehensive weight loss program. Current weight: 245 lbs, BMI: 34.2. Goal: Lose 50 lbs over 12 months.

Medical history reviewed:
- Type 2 diabetes (well-controlled, A1C 6.8%)
- Hypertension (managed with lisinopril)
- Former smoker (quit 5 years ago)

Started on Semaglutide 0.25mg weekly. Will titrate up every 4 weeks as tolerated. Diet and exercise counseling provided.`,
    createdAt: "2024-03-10T10:00:00Z",
    createdBy: "Dr. Priya Patel",
    createdByRole: "Provider",
  },
  {
    id: "note_202",
    patientId: "usr_pat002",
    title: "Dose increase - Week 4",
    content: `Patient tolerating Semaglutide well. Mild nausea in first week resolved. Weight down 6 lbs.

Increasing dose to 0.5mg weekly as per protocol. Reminded patient to continue hydration and eat slowly.`,
    createdAt: "2024-04-07T09:30:00Z",
    createdBy: "Dr. Priya Patel",
    createdByRole: "Provider",
  },
  {
    id: "note_203",
    patientId: "usr_pat002",
    title: "Lab results reviewed",
    content: `Reviewed 6-month lab results. Excellent progress:
- A1C: 6.2% (down from 6.8%)
- Total cholesterol: 185 (down from 220)
- Weight: 218 lbs (down 27 lbs)

Patient very pleased with results. Blood pressure also improved - discussing with PCP about potentially reducing lisinopril dose.`,
    createdAt: "2024-09-12T11:45:00Z",
    createdBy: "Dr. Priya Patel",
    createdByRole: "Provider",
  },
  {
    id: "note_204",
    patientId: "usr_pat002",
    title: "Shipping address updated",
    content: `Patient called to update shipping address. New address verified and updated in system. Next shipment will go to new address.`,
    createdAt: "2024-07-15T14:00:00Z",
    createdBy: "Admin Staff",
    createdByRole: "Admin",
  },
]

// Get notes for a specific patient
export function getNotesByPatientId(patientId: string): PatientNote[] {
  return patientNotes
    .filter((note) => note.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get note by ID
export function getNoteById(id: string): PatientNote | undefined {
  return patientNotes.find((note) => note.id === id)
}

// Get note preview (first 100 chars of content)
export function getNotePreview(note: PatientNote, length: number = 100): string {
  if (note.content.length <= length) return note.content
  return note.content.substring(0, length).trim() + "..."
}
