"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Provider } from "@/data/types"
import { DataTableColumnHeader } from "./data-table-column-header"

// Status badge styles matching the admin kit
const statusStyles: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-neutral-300/40 border-neutral-300",
  },
  SUSPENDED: {
    label: "Suspended",
    className:
      "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  },
  PENDING: {
    label: "Pending",
    className: "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
  },
}

function getStatusStyle(status: string) {
  return (
    statusStyles[status] ?? {
      label: status,
      className: "bg-neutral-300/40 border-neutral-300",
    }
  )
}

export const columns: ColumnDef<Provider>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("firstName")}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("lastName")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const style = getStatusStyle(row.getValue("status"))
      return (
        <Badge variant="outline" className={cn("capitalize", style.className)}>
          {style.label}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/store-admin/providers/${row.original.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      )
    },
  },
]
