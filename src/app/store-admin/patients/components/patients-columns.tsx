"use client"

import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import LongText from "@/components/long-text"
import { mockOrders, mockProviders, getProviderDisplayName } from "@/data"
import type { Patient } from "@/data/types"
import { DataTableColumnHeader } from "./data-table-column-header"

// Get the most recent order for a patient
function getLastOrderDate(patientId: string): Date | null {
  const patientOrders = mockOrders.filter((o) => o.userId === patientId)
  if (patientOrders.length === 0) return null
  const sorted = patientOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return new Date(sorted[0].createdAt)
}

// Status badge styles matching the admin kit (from users page)
const statusStyles = {
  ACTIVE: {
    label: "Active",
    className: "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  },
  AWAITING_REVIEW: {
    label: "Awaiting Review",
    className: "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200",
  },
  NEEDS_ATTENTION: {
    label: "Needs Attention",
    className: "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  },
  DEACTIVATED: {
    label: "Deactivated",
    className: "bg-neutral-300/40 border-neutral-300",
  },
} as const

function getStatusStyle(status: Patient["patientStatus"]) {
  return statusStyles[status] ?? { label: status, className: "bg-neutral-300/40 border-neutral-300" }
}

export const columns: ColumnDef<Patient>[] = [
  {
    id: "fullName",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      const fullName = `${firstName} ${lastName}`
      return (
        <LongText className="max-w-36 font-medium">{fullName}</LongText>
      )
    },
    meta: { className: "w-40" },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit max-w-[200px] truncate text-nowrap">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    id: "lastActivity",
    accessorKey: "lastActivity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Activity" />
    ),
    cell: ({ row }) => {
      const lastActivity = row.original.lastActivity
      return (
        <div className="w-fit text-nowrap">
          {format(new Date(lastActivity), "MMM dd, yyyy")}
        </div>
      )
    },
  },
  {
    id: "lastOrder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Order" />
    ),
    cell: ({ row }) => {
      const lastOrderDate = getLastOrderDate(row.original.id)
      return (
        <div className="w-fit text-nowrap">
          {lastOrderDate ? format(lastOrderDate, "MMM dd, yyyy") : "No orders"}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
    cell: ({ row }) => {
      const providerId = row.original.assignedProviderId
      if (!providerId) return <span className="text-muted-foreground">Unassigned</span>
      const provider = mockProviders.find((p) => p.id === providerId)
      if (!provider) return <span className="text-muted-foreground">Unknown</span>
      return <div className="w-fit text-nowrap">{getProviderDisplayName(provider)}</div>
    },
    enableSorting: false,
  },
  {
    id: "status",
    accessorKey: "patientStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const style = getStatusStyle(row.original.patientStatus)
      return (
        <Badge variant="outline" className={cn("capitalize", style.className)}>
          {style.label}
        </Badge>
      )
    },
    filterFn: "weakEquals",
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/store-admin/patients/${row.original.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      )
    },
  },
]
