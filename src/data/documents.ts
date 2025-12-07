import type { PatientDocument } from "./types"

/**
 * Mock patient documents data
 * Shared across Store Admin, Provider Admin, and Patient Admin portals
 * Primarily questionnaire responses, with some manual uploads
 */

export const patientDocuments: PatientDocument[] = [
  // Jacob Henderson (usr_pat_jacob)
  {
    id: "doc_001",
    patientId: "usr_pat_jacob",
    name: "Weight Loss Intake Questionnaire",
    uploadedAt: "2024-08-15T10:35:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 245000,
  },
  {
    id: "doc_002",
    patientId: "usr_pat_jacob",
    name: "Medical History Questionnaire",
    uploadedAt: "2024-08-15T10:42:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 312000,
  },
  {
    id: "doc_003",
    patientId: "usr_pat_jacob",
    name: "Lifestyle Assessment",
    uploadedAt: "2024-08-15T10:48:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 189000,
  },
  {
    id: "doc_004",
    patientId: "usr_pat_jacob",
    name: "Previous Lab Results - Lipid Panel",
    uploadedAt: "2024-08-20T14:22:00Z",
    source: "Patient Upload",
    fileType: "pdf",
    fileSize: 1240000,
  },
  {
    id: "doc_005",
    patientId: "usr_pat_jacob",
    name: "Consent for Treatment",
    uploadedAt: "2024-08-15T11:05:00Z",
    source: "System Generated",
    fileType: "pdf",
    fileSize: 98000,
  },
  {
    id: "doc_006",
    patientId: "usr_pat_jacob",
    name: "Follow-up Questionnaire - Week 4",
    uploadedAt: "2024-09-12T09:15:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 156000,
  },
  {
    id: "doc_007",
    patientId: "usr_pat_jacob",
    name: "Provider Notes - Initial Consultation",
    uploadedAt: "2024-08-16T16:30:00Z",
    source: "Provider Upload",
    fileType: "docx",
    fileSize: 45000,
    uploadedBy: "Dr. Nicole Baldwin",
  },

  // Sarah Johnson (usr_pat001)
  {
    id: "doc_101",
    patientId: "usr_pat001",
    name: "Hair Loss Intake Questionnaire",
    uploadedAt: "2024-06-15T10:35:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 234000,
  },
  {
    id: "doc_102",
    patientId: "usr_pat001",
    name: "Medical History Questionnaire",
    uploadedAt: "2024-06-15T10:45:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 287000,
  },
  {
    id: "doc_103",
    patientId: "usr_pat001",
    name: "Previous Dermatology Records",
    uploadedAt: "2024-06-18T11:20:00Z",
    source: "EHR Import",
    fileType: "pdf",
    fileSize: 2450000,
  },
  {
    id: "doc_104",
    patientId: "usr_pat001",
    name: "Insurance Card - Front",
    uploadedAt: "2024-06-15T10:50:00Z",
    source: "Patient Upload",
    fileType: "jpg",
    fileSize: 890000,
  },
  {
    id: "doc_105",
    patientId: "usr_pat001",
    name: "Insurance Card - Back",
    uploadedAt: "2024-06-15T10:51:00Z",
    source: "Patient Upload",
    fileType: "jpg",
    fileSize: 756000,
  },
  {
    id: "doc_106",
    patientId: "usr_pat001",
    name: "Follow-up Questionnaire - Month 3",
    uploadedAt: "2024-09-15T14:20:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 198000,
  },
  {
    id: "doc_107",
    patientId: "usr_pat001",
    name: "Progress Photos - September",
    uploadedAt: "2024-09-15T14:25:00Z",
    source: "Patient Upload",
    fileType: "pdf",
    fileSize: 3200000,
  },

  // Michael Thompson (usr_pat002)
  {
    id: "doc_201",
    patientId: "usr_pat002",
    name: "Weight Loss Intake Questionnaire",
    uploadedAt: "2024-03-10T08:20:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 267000,
  },
  {
    id: "doc_202",
    patientId: "usr_pat002",
    name: "Medical History Questionnaire",
    uploadedAt: "2024-03-10T08:35:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 345000,
  },
  {
    id: "doc_203",
    patientId: "usr_pat002",
    name: "Diabetes Management Records",
    uploadedAt: "2024-03-12T10:00:00Z",
    source: "EHR Import",
    fileType: "pdf",
    fileSize: 4100000,
  },
  {
    id: "doc_204",
    patientId: "usr_pat002",
    name: "Recent A1C Lab Results",
    uploadedAt: "2024-03-12T10:05:00Z",
    source: "Patient Upload",
    fileType: "pdf",
    fileSize: 567000,
  },
  {
    id: "doc_205",
    patientId: "usr_pat002",
    name: "Consent for Treatment",
    uploadedAt: "2024-03-10T09:00:00Z",
    source: "System Generated",
    fileType: "pdf",
    fileSize: 98000,
  },
  {
    id: "doc_206",
    patientId: "usr_pat002",
    name: "Cardiac Clearance Letter",
    uploadedAt: "2024-03-15T11:30:00Z",
    source: "Manual Upload",
    fileType: "pdf",
    fileSize: 234000,
    uploadedBy: "Admin Staff",
  },
  {
    id: "doc_207",
    patientId: "usr_pat002",
    name: "Follow-up Questionnaire - Month 6",
    uploadedAt: "2024-09-10T09:45:00Z",
    source: "Questionnaire Response",
    fileType: "pdf",
    fileSize: 178000,
  },
  {
    id: "doc_208",
    patientId: "usr_pat002",
    name: "Weight Loss Progress Report",
    uploadedAt: "2024-09-10T14:00:00Z",
    source: "System Generated",
    fileType: "pdf",
    fileSize: 145000,
  },
]

// Get documents for a specific patient
export function getDocumentsByPatientId(patientId: string): PatientDocument[] {
  return patientDocuments
    .filter((doc) => doc.patientId === patientId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
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
