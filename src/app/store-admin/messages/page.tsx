import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Header } from "@/components/layout/header"
import { MessagesList } from "./components/messages-list"
import { messages } from "./data/messages-data"

export default function MessagesPage() {
  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Breadcrumb and Header */}
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/store-admin/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Messages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
              <p className="text-muted-foreground text-sm">
                {unreadCount > 0
                  ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
                  : "All messages read"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <MessagesList messages={messages} />
      </div>
    </>
  )
}
