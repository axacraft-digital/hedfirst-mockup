"use client"

import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  IconMail,
  IconMailOpened,
  IconPlus,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Message thread types
type MessageStatus = "unread" | "open" | "resolved"
type SenderType = "patient" | "provider" | "admin"

interface MessageThread {
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

// Mock message threads
const mockThreads: MessageThread[] = [
  {
    id: "thread_001",
    patientId: "usr_pat001",
    subject: "Question about medication dosage",
    lastMessage: {
      preview:
        "Hi Daria! Thank you for providing this info. I will begin therapy with the provided dose as I understand it has already been shipped...",
      senderType: "patient",
      senderName: "Jacob Henderson",
      date: "2024-11-17T15:30:00Z",
    },
    status: "unread",
    messageCount: 3,
    createdAt: "2024-11-17T09:30:00Z",
  },
  {
    id: "thread_006",
    patientId: "usr_pat001",
    subject: "Lab results ready for review",
    lastMessage: {
      preview:
        "Your recent bloodwork results are in. Your testosterone levels look good at 780 ng/dL. Let's discuss at your next...",
      senderType: "provider",
      senderName: "Dr. Nicole Baldwin",
      date: "2024-11-15T11:20:00Z",
    },
    status: "open",
    messageCount: 1,
    createdAt: "2024-11-15T11:20:00Z",
  },
  {
    id: "thread_007",
    patientId: "usr_pat001",
    subject: "Welcome to Hedfirst - Getting Started",
    lastMessage: {
      preview:
        "Thanks for the thorough onboarding info! I've reviewed everything and scheduled my initial consultation for next week.",
      senderType: "patient",
      senderName: "Jacob Henderson",
      date: "2024-11-12T09:45:00Z",
    },
    status: "resolved",
    messageCount: 4,
    createdAt: "2024-09-28T14:00:00Z",
  },
  {
    id: "thread_002",
    patientId: "usr_pat001",
    subject: "Shipping delay inquiry",
    lastMessage: {
      preview:
        "Your order has been shipped and should arrive within 2-3 business days. Tracking number has been sent to your email.",
      senderType: "admin",
      senderName: "Support Team",
      date: "2024-11-10T16:45:00Z",
    },
    status: "resolved",
    messageCount: 4,
    createdAt: "2024-11-08T11:20:00Z",
  },
  {
    id: "thread_008",
    patientId: "usr_pat001",
    subject: "Prescription renewal reminder",
    lastMessage: {
      preview:
        "Hi Jacob, this is a friendly reminder that your CJC/Ipamorelin prescription will need renewal in 2 weeks. Would you like us to...",
      senderType: "admin",
      senderName: "Care Coordinator",
      date: "2024-11-05T10:00:00Z",
    },
    status: "open",
    messageCount: 1,
    createdAt: "2024-11-05T10:00:00Z",
  },
  {
    id: "thread_003",
    patientId: "usr_pat001",
    subject: "Follow-up on injection technique",
    lastMessage: {
      preview:
        "Great question! For subcutaneous injections, pinch a fold of skin and insert the needle at a 45-degree angle...",
      senderType: "provider",
      senderName: "Dr. Nicole Baldwin",
      date: "2024-10-20T14:30:00Z",
    },
    status: "resolved",
    messageCount: 2,
    createdAt: "2024-10-20T10:15:00Z",
  },
  {
    id: "thread_004",
    patientId: "usr_pat001",
    subject: "Appointment rescheduling request",
    lastMessage: {
      preview:
        "November 25th at 2:00 PM works perfectly.",
      senderType: "patient",
      senderName: "Jacob Henderson",
      date: "2024-10-15T09:00:00Z",
    },
    status: "open",
    messageCount: 5,
    createdAt: "2024-10-12T14:00:00Z",
  },
  // Other patients
  {
    id: "thread_005",
    patientId: "usr_pat001",
    subject: "Hair loss treatment progress",
    lastMessage: {
      preview: "I've noticed some improvement after 3 months. Should I continue with the same dosage?",
      senderType: "patient",
      senderName: "Sarah Johnson",
      date: "2024-11-15T10:00:00Z",
    },
    status: "unread",
    messageCount: 2,
    createdAt: "2024-11-15T10:00:00Z",
  },
]

// Get threads by patient ID
function getThreadsByPatientId(patientId: string): MessageThread[] {
  return mockThreads
    .filter((t) => t.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.lastMessage.date).getTime() -
        new Date(a.lastMessage.date).getTime()
    )
}

// Status badge styles
const statusStyles: Record<
  MessageStatus,
  { label: string; className: string }
> = {
  unread: {
    label: "Unread",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
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

// Sender type labels
const senderTypeLabels: Record<SenderType, string> = {
  patient: "Patient",
  provider: "Provider",
  admin: "Support",
}

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientMessagesPage({ params }: Props) {
  const { id } = use(params)
  const threads = getThreadsByPatientId(id)

  const unreadCount = threads.filter((t) => t.status === "unread").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Messages</h3>
          <p className="text-muted-foreground text-sm">
            {threads.length} conversation{threads.length !== 1 ? "s" : ""}
            {unreadCount > 0 && (
              <span className="ml-1 text-blue-600 dark:text-blue-400">
                • {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <Button asChild>
          <Link href={`/store-admin/patients/${id}/messages/new`}>
            <IconPlus className="mr-2 size-4" />
            New Message
          </Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="w-[120px]">From</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {threads.length > 0 ? (
                  threads.map((thread) => {
                    const statusStyle = statusStyles[thread.status]
                    const isUnread = thread.status === "unread"

                    return (
                      <TableRow
                        key={thread.id}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="pl-4">
                          {isUnread ? (
                            <IconMail className="size-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <IconMailOpened className="text-muted-foreground size-4" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/store-admin/patients/${id}/messages/${thread.id}`}
                            className="block"
                          >
                            <div
                              className={
                                isUnread ? "font-semibold" : "font-medium"
                              }
                            >
                              {thread.subject}
                              {thread.messageCount > 1 && (
                                <span className="text-muted-foreground ml-2 text-sm font-normal">
                                  ({thread.messageCount})
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                              {thread.lastMessage.preview}
                            </p>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/store-admin/patients/${id}/messages/${thread.id}`}
                            className="block"
                          >
                            <div className="text-sm">
                              {thread.lastMessage.senderName.split(" ")[0]}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {senderTypeLabels[thread.lastMessage.senderType]}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <Link
                            href={`/store-admin/patients/${id}/messages/${thread.id}`}
                            className="block"
                          >
                            {format(
                              new Date(thread.lastMessage.date),
                              "MMM d, yyyy"
                            )}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/store-admin/patients/${id}/messages/${thread.id}`}
                            className="block"
                          >
                            <Badge
                              variant="outline"
                              className={statusStyle.className}
                            >
                              {statusStyle.label}
                            </Badge>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No messages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
