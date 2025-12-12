"use client"

import { use } from "react"
import Link from "next/link"
import { IconMail, IconMailOpened, IconPlus } from "@tabler/icons-react"
import { format } from "date-fns"
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
import { type UIMessageThread, getMessageThreadsForUI } from "@/data/messages"

// Message types (derived from UI helper)
type MessageStatus = UIMessageThread["status"]
type SenderType = UIMessageThread["lastMessage"]["senderType"]

// Status badge styles
const statusStyles: Record<
  MessageStatus,
  { label: string; className: string }
> = {
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
  const threads = getMessageThreadsForUI(id)

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
                        className="hover:bg-muted/50 cursor-pointer"
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
