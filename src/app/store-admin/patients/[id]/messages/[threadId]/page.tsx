"use client"

import { use, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  IconArrowLeft,
  IconCheck,
  IconFlag,
  IconPaperclip,
  IconSend,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Message types
type SenderType = "patient" | "provider" | "admin"
type ThreadStatus = "unread" | "open" | "resolved"

interface Message {
  id: string
  senderType: SenderType
  senderName: string
  content: string
  date: string
}

interface MessageThreadDetail {
  id: string
  patientId: string
  subject: string
  status: ThreadStatus
  messages: Message[]
  createdAt: string
}

// Mock thread details with full conversations
const mockThreadDetails: MessageThreadDetail[] = [
  {
    id: "thread_001",
    patientId: "usr_pat_jacob",
    subject: "Question about medication dosage",
    status: "unread",
    createdAt: "2024-11-17T09:30:00Z",
    messages: [
      {
        id: "msg_001a",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content:
          "Hi, I just did my first testosterone injection this morning. I wanted to confirm I did it correctly - I injected 0.5mL into my thigh intramuscularly. Is that the right technique?",
        date: "2024-11-17T09:30:00Z",
      },
      {
        id: "msg_001b",
        senderType: "provider",
        senderName: "Dr. Nicole Baldwin",
        content: `Hi Jacob! Yes, that sounds perfect. The thigh is a great injection site for IM injections. Here are some tips to maximize your results:

**Tips for TRT Success**
• Inject at the **same time each week** for consistency
• Rotate injection sites between thighs and deltoids
• Focus on high-protein meals to support muscle recovery
• Resistance training enhances benefits
• Stay hydrated and get adequate sleep

Let me know if you have any other questions!`,
        date: "2024-11-17T13:04:00Z",
      },
      {
        id: "msg_001c",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content:
          "Thanks Dr. Baldwin! That's really helpful. One more question - I noticed a small amount of oil leaking out after I removed the needle. Is that normal? Should I be concerned about the full dose not being absorbed?",
        date: "2024-11-17T15:30:00Z",
      },
    ],
  },
  {
    id: "thread_002",
    patientId: "usr_pat_jacob",
    subject: "Shipping delay inquiry",
    status: "resolved",
    createdAt: "2024-11-08T11:20:00Z",
    messages: [
      {
        id: "msg_002a",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content:
          "Hi, I placed an order 5 days ago and haven't received any shipping confirmation yet. Can you check on the status?",
        date: "2024-11-08T11:20:00Z",
      },
      {
        id: "msg_002b",
        senderType: "admin",
        senderName: "Support Team",
        content:
          "Hi Jacob, thank you for reaching out. I'm looking into this for you now. Let me check with our pharmacy partner.",
        date: "2024-11-08T14:00:00Z",
      },
      {
        id: "msg_002c",
        senderType: "admin",
        senderName: "Support Team",
        content:
          "Good news! Your order has been processed and shipped today. You should receive a tracking number via email shortly. Expected delivery is within 2-3 business days.",
        date: "2024-11-10T10:30:00Z",
      },
      {
        id: "msg_002d",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content: "Got it, thank you for the update!",
        date: "2024-11-10T16:45:00Z",
      },
    ],
  },
  {
    id: "thread_003",
    patientId: "usr_pat_jacob",
    subject: "Follow-up on injection technique",
    status: "resolved",
    createdAt: "2024-10-20T10:15:00Z",
    messages: [
      {
        id: "msg_003a",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content:
          "This is my first time doing subcutaneous injections. Any tips on proper technique to minimize discomfort?",
        date: "2024-10-20T10:15:00Z",
      },
      {
        id: "msg_003b",
        senderType: "provider",
        senderName: "Dr. Nicole Baldwin",
        content:
          "Great question! For subcutaneous injections, pinch a fold of skin on your abdomen (avoiding the belly button area) and insert the needle at a 45-degree angle. Inject slowly and steadily. Rotate injection sites to prevent tissue irritation. The needles we provide are very fine gauge, so most patients report minimal discomfort. Feel free to reach out if you have any issues!",
        date: "2024-10-20T14:30:00Z",
      },
    ],
  },
  {
    id: "thread_004",
    patientId: "usr_pat_jacob",
    subject: "Appointment rescheduling request",
    status: "open",
    createdAt: "2024-10-12T14:00:00Z",
    messages: [
      {
        id: "msg_004a",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content:
          "I need to reschedule my follow-up appointment that's currently set for October 20th. I have a work conflict that day.",
        date: "2024-10-12T14:00:00Z",
      },
      {
        id: "msg_004b",
        senderType: "admin",
        senderName: "Support Team",
        content:
          "No problem! I can help with that. What dates/times work best for you?",
        date: "2024-10-12T15:30:00Z",
      },
      {
        id: "msg_004c",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content: "Any time after November 20th would work. Preferably afternoon.",
        date: "2024-10-13T09:00:00Z",
      },
      {
        id: "msg_004d",
        senderType: "admin",
        senderName: "Support Team",
        content:
          "I have availability on November 25th at 2:00 PM or November 27th at 3:30 PM. Which works better?",
        date: "2024-10-14T11:00:00Z",
      },
      {
        id: "msg_004e",
        senderType: "patient",
        senderName: "Jacob Henderson",
        content: "November 25th at 2:00 PM works perfectly.",
        date: "2024-10-15T09:00:00Z",
      },
    ],
  },
]

// Get thread by ID
function getThreadById(threadId: string): MessageThreadDetail | undefined {
  return mockThreadDetails.find((t) => t.id === threadId)
}

// Status badge styles
const statusStyles: Record<ThreadStatus, { label: string; className: string }> =
  {
    unread: {
      label: "Unread",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    open: {
      label: "Open",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    },
    resolved: {
      label: "Resolved",
      className:
        "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
    },
  }

// Sender colors
const senderColors: Record<SenderType, string> = {
  patient: "bg-blue-100 dark:bg-blue-900",
  provider: "bg-emerald-100 dark:bg-emerald-900",
  admin: "bg-purple-100 dark:bg-purple-900",
}

const senderLabels: Record<SenderType, string> = {
  patient: "Patient",
  provider: "Provider",
  admin: "Support",
}

interface Props {
  params: Promise<{ id: string; threadId: string }>
}

export default function MessageThreadPage({ params }: Props) {
  const { id, threadId } = use(params)
  const thread = getThreadById(threadId)
  const [replyText, setReplyText] = useState("")

  if (!thread) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Message thread not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={`/store-admin/patients/${id}/messages`}>
            Back to messages
          </Link>
        </Button>
      </div>
    )
  }

  const statusStyle = statusStyles[thread.status]

  const handleSend = () => {
    if (!replyText.trim()) return
    // In production, this would send the message
    setReplyText("")
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/store-admin/patients/${id}/messages`}>
              <IconArrowLeft className="size-4" />
              <span className="sr-only">Back to messages</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{thread.subject}</h3>
              <Badge variant="outline" className={statusStyle.className}>
                {statusStyle.label}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Started {format(new Date(thread.createdAt), "MMMM d, yyyy")} •{" "}
              {thread.messages.length} message
              {thread.messages.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {thread.status !== "resolved" && (
            <Button variant="outline" size="sm">
              <IconCheck className="mr-2 size-4" />
              Mark Resolved
            </Button>
          )}
          <Button variant="outline" size="sm">
            <IconFlag className="mr-2 size-4" />
            Flag Provider
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="mx-auto max-w-2xl space-y-6 py-4">
          {thread.messages.map((message) => (
            <div key={message.id} className="flex gap-4">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  senderColors[message.senderType]
                )}
              >
                {message.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.senderName}</span>
                  <Badge variant="outline" className="text-xs">
                    {senderLabels[message.senderType]}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {format(new Date(message.date), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <div className="mt-2 whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Reply Input */}
      <div className="border-t px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <Textarea
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            className="mb-3 resize-none"
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <IconPaperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button onClick={handleSend} disabled={!replyText.trim()}>
              <IconSend className="mr-2 size-4" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
