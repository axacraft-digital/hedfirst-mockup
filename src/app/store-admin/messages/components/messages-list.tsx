"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconPaperclip, IconSearch } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import type { Message } from "../data/messages-data"

interface Props {
  messages: Message[]
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  const time = `${hour12}:${minutes} ${ampm}`

  if (isToday) {
    return time
  }

  const month = date.toLocaleString("en-US", { month: "short" })
  const day = date.getDate()
  const year = date.getFullYear()

  return `${month} ${day}, ${year} ${time}`
}

export function MessagesList({ messages }: Props) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMessages = messages.filter(
    (message) =>
      message.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-full sm:w-[300px]">
        <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 pl-9"
        />
      </div>

      {/* Messages List */}
      <div className="rounded-md border">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => router.push(`/store-admin/messages/${message.id}`)}
              className={cn(
                "flex cursor-pointer items-center gap-4 border-b px-4 py-3 transition-colors hover:bg-muted/50 last:border-b-0",
                !message.isRead && "bg-muted/30"
              )}
            >
              {/* Unread indicator */}
              <div className="flex w-2 shrink-0 justify-center">
                {!message.isRead && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>

              {/* Patient name */}
              <div className={cn(
                "w-[180px] shrink-0 truncate",
                !message.isRead ? "font-semibold" : "font-medium"
              )}>
                {message.patientName}
              </div>

              {/* Message preview */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {message.hasAttachment && (
                  <IconPaperclip className="text-muted-foreground h-4 w-4 shrink-0" />
                )}
                <span className={cn(
                  "truncate",
                  message.isRead ? "text-muted-foreground" : "text-foreground"
                )}>
                  {message.preview}
                </span>
              </div>

              {/* Timestamp */}
              <div className={cn(
                "shrink-0 text-sm",
                message.isRead ? "text-muted-foreground" : "font-medium"
              )}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            No messages found.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-muted-foreground px-2 text-sm">
        {filteredMessages.length} message(s) total
      </div>
    </div>
  )
}
