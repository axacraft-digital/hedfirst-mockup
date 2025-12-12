export interface Message {
  id: string
  patientId: string
  patientName: string
  preview: string
  timestamp: string // ISO string
  isRead: boolean
  hasAttachment: boolean
}

export const messages: Message[] = [
  {
    id: "msg-001",
    patientId: "pat-001",
    patientName: "Sarah Johnson",
    preview:
      "Hi, I wanted to follow up on my recent prescription. I've been experiencing some side effects and wanted to ask about...",
    timestamp: "2025-01-15T14:43:00Z",
    isRead: false,
    hasAttachment: false,
  },
  {
    id: "msg-002",
    patientId: "pat-002",
    patientName: "Michael Chen",
    preview:
      "Thank you for the quick response. I'll pick up the medication tomorrow morning as suggested.",
    timestamp: "2025-01-15T13:22:00Z",
    isRead: false,
    hasAttachment: false,
  },
  {
    id: "msg-003",
    patientId: "pat-003",
    patientName: "Emily Rodriguez",
    preview:
      "I've attached the lab results from my doctor. Could you please review them before my next consultation?",
    timestamp: "2025-01-15T11:05:00Z",
    isRead: false,
    hasAttachment: true,
  },
  {
    id: "msg-004",
    patientId: "pat-004",
    patientName: "James Wilson",
    preview:
      "Is it possible to change my delivery address for this month? I'll be staying at a different location...",
    timestamp: "2025-01-15T09:30:00Z",
    isRead: true,
    hasAttachment: false,
  },
  {
    id: "msg-005",
    patientId: "pat-005",
    patientName: "Amanda Foster",
    preview:
      "The new dosage seems to be working much better. No more dizziness in the mornings.",
    timestamp: "2025-01-14T16:45:00Z",
    isRead: true,
    hasAttachment: false,
  },
  {
    id: "msg-006",
    patientId: "pat-006",
    patientName: "David Park",
    preview:
      "I need to reschedule my upcoming appointment. Would next Tuesday at 2pm work instead?",
    timestamp: "2025-01-14T14:20:00Z",
    isRead: true,
    hasAttachment: false,
  },
  {
    id: "msg-007",
    patientId: "pat-007",
    patientName: "Lisa Thompson",
    preview:
      "Quick question - can I take this medication with food or should it be on an empty stomach?",
    timestamp: "2025-01-14T11:15:00Z",
    isRead: true,
    hasAttachment: false,
  },
  {
    id: "msg-008",
    patientId: "pat-008",
    patientName: "Robert Martinez",
    preview:
      "I received my package today. Everything looks good, thank you for the fast shipping!",
    timestamp: "2025-01-14T09:00:00Z",
    isRead: true,
    hasAttachment: false,
  },
  {
    id: "msg-009",
    patientId: "pat-009",
    patientName: "Jennifer Lee",
    preview:
      "Attached is the insurance form you requested. Please let me know if you need anything else.",
    timestamp: "2025-01-13T15:30:00Z",
    isRead: true,
    hasAttachment: true,
  },
  {
    id: "msg-010",
    patientId: "pat-010",
    patientName: "Christopher Brown",
    preview:
      "I'm having trouble logging into my patient portal. Can you help me reset my password?",
    timestamp: "2025-01-13T12:10:00Z",
    isRead: true,
    hasAttachment: false,
  },
  {
    id: "msg-011",
    patientId: "pat-011",
    patientName: "Michelle Davis",
    preview:
      "My insurance changed this month. Here's my new information for the pharmacy records.",
    timestamp: "2025-01-13T10:45:00Z",
    isRead: true,
    hasAttachment: true,
  },
  {
    id: "msg-012",
    patientId: "pat-012",
    patientName: "Kevin Taylor",
    preview:
      "Following up on the prior authorization. Has there been any update from the insurance company?",
    timestamp: "2025-01-12T16:20:00Z",
    isRead: true,
    hasAttachment: false,
  },
]
