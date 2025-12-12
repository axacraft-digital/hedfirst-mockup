import { mockPatients, mockProviders } from "./index"
import messagesJson from "./mock/communication/messages.json"
import type { ChatParticipant, Conversation, Message } from "./types"

/**
 * Messages data - using centralized mock data with UI-shaped helpers
 * Transforms threaded conversation data to flat thread view for UI
 */

export const conversations = messagesJson as Conversation[]

// UI-shaped types (what the UI expects)
type SenderType = "patient" | "provider" | "admin"
type MessageStatus = "unread" | "open" | "resolved"

export interface UIMessageThread {
  id: string
  patientId: string
  subject: string
  lastMessage: {
    preview: string
    senderType: SenderType
    senderName: string
    date: string
  }
  status: MessageStatus
  messageCount: number
  createdAt: string
}

// Get sender type from participant role
function getSenderType(role: string): SenderType {
  switch (role.toUpperCase()) {
    case "PATIENT":
      return "patient"
    case "PROVIDER":
      return "provider"
    case "ADMIN":
    default:
      return "admin"
  }
}

// Get sender name from user ID
function getSenderName(
  senderId: string,
  participants: ChatParticipant[]
): {
  name: string
  type: SenderType
} {
  const participant = participants.find((p) => p.userId === senderId)
  const role = participant?.role ?? "ADMIN"
  const senderType = getSenderType(role)

  // Look up in patients
  const patient = mockPatients.find((p) => p.id === senderId)
  if (patient) {
    return { name: `${patient.firstName} ${patient.lastName}`, type: "patient" }
  }

  // Look up in providers
  const provider = mockProviders.find((p) => p.id === senderId)
  if (provider) {
    return {
      name: `Dr. ${provider.firstName} ${provider.lastName}`,
      type: "provider",
    }
  }

  // Default for admin/system
  if (senderId.startsWith("admin")) {
    return { name: "Support Team", type: "admin" }
  }

  return { name: "Unknown", type: senderType }
}

// Get patient ID from conversation participants
function getPatientId(participants: ChatParticipant[]): string | null {
  const patient = participants.find((p) => p.role === "PATIENT")
  return patient?.userId ?? null
}

// Generate subject from first message
function generateSubject(messages: Message[]): string {
  if (messages.length === 0) return "No Subject"

  const firstMessage = messages[0]
  const text = firstMessage.text

  // Take first sentence or first 60 chars
  const firstSentence = text.split(/[.!?]/)[0]
  if (firstSentence.length <= 60) return firstSentence
  return firstSentence.slice(0, 57) + "..."
}

// Determine thread status
function determineStatus(messages: Message[]): MessageStatus {
  if (messages.length === 0) return "open"

  // Check if any messages are unread
  const hasUnread = messages.some((m) => m.read === false)
  if (hasUnread) return "unread"

  // Check if conversation seems resolved (last message is old or from support)
  const lastMessage = messages[messages.length - 1]
  const lastMessageDate = new Date(lastMessage.createdAt)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  if (lastMessageDate < weekAgo) return "resolved"

  return "open"
}

// Transform conversation to UI thread shape
function toUIMessageThread(conversation: Conversation): UIMessageThread | null {
  const patientId = getPatientId(conversation.participants)
  if (!patientId) return null

  const messages = conversation.messages
  const lastMessage = messages[messages.length - 1]

  if (!lastMessage) {
    return null
  }

  const senderInfo = getSenderName(
    lastMessage.senderId,
    conversation.participants
  )

  return {
    id: conversation.id,
    patientId,
    subject: generateSubject(messages),
    lastMessage: {
      preview:
        lastMessage.text.length > 150
          ? lastMessage.text.slice(0, 147) + "..."
          : lastMessage.text,
      senderType: senderInfo.type,
      senderName: senderInfo.name,
      date: lastMessage.createdAt,
    },
    status: determineStatus(messages),
    messageCount: messages.length,
    createdAt: conversation.createdAt,
  }
}

// Get message threads for a specific patient (UI-shaped)
export function getMessageThreadsForUI(patientId: string): UIMessageThread[] {
  return conversations
    .map(toUIMessageThread)
    .filter(
      (thread): thread is UIMessageThread =>
        thread !== null && thread.patientId === patientId
    )
    .sort(
      (a, b) =>
        new Date(b.lastMessage.date).getTime() -
        new Date(a.lastMessage.date).getTime()
    )
}

// Get conversation by ID (raw)
export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id)
}

// Get all conversations (raw)
export function getAllConversations(): Conversation[] {
  return conversations
}

// Get unread count for a patient
export function getUnreadCountForPatient(patientId: string): number {
  return getMessageThreadsForUI(patientId).filter((t) => t.status === "unread")
    .length
}
