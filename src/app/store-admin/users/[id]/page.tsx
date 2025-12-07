"use client"

import { use } from "react"
import Link from "next/link"
import { getStoreUserById } from "@/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

// Reusable field display component
function Field({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="py-2">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  )
}

// Status badge styles
const statusStyles: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  INACTIVE: {
    label: "Inactive",
    className:
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
  },
  INVITED: {
    label: "Invited",
    className:
      "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  },
}

// Role display labels
const roleLabels: Record<string, string> = {
  admin: "Administrator",
  manager: "Manager",
  support: "Support Agent",
}

export default function UserDetailPage({ params }: Props) {
  const { id } = use(params)
  const user = getStoreUserById(id)

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/store-admin/users">Back to users</Link>
        </Button>
      </div>
    )
  }

  const statusStyle = statusStyles[user.status] ?? statusStyles.INACTIVE

  // Format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="flex w-full max-w-3xl flex-col space-y-6">
      {/* Personal Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Personal details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-0">
            <Field label="First name" value={user.firstName} />
            <Field label="Last name" value={user.lastName} />
            <Field label="Email" value={user.email} />
          </dl>
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Account information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-0">
            <Field label="Role" value={roleLabels[user.role] ?? user.role} />
            <div className="py-2">
              <dt className="text-muted-foreground text-sm">Status</dt>
              <dd className="mt-1">
                <Badge
                  variant="outline"
                  className={cn("font-normal", statusStyle.className)}
                >
                  {statusStyle.label}
                </Badge>
              </dd>
            </div>
            <Field label="Added on" value={formatDate(user.createdAt)} />
            <Field label="Last login" value={formatDate(user.lastLoginAt)} />
          </dl>
        </CardContent>
      </Card>

      {/* Revoke Access Button */}
      <Button
        variant="outline"
        className="w-full text-red-500 hover:text-red-600"
      >
        Revoke access
      </Button>
    </div>
  )
}
