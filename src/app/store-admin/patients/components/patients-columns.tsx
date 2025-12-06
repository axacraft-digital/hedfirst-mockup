"use client"

import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LongText from "@/components/long-text"
import { orders, getProviderById, getProviderDisplayName } from "@/data"
import type { Patient } from "@/data/types"
import { DataTableColumnHeader } from "./data-table-column-header"

// Get the most recent order for a patient
function getLastOrderDate(patientId: string): Date | null {
  const patientOrders = orders.filter((o) => o.userId === patientId)
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
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        "sticky md:table-cell left-0 z-10 rounded-tl",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
        <Button variant="link" className="h-auto p-0 font-medium" asChild>
          <Link href={`/store-admin/patients/${row.original.id}`}>
            <LongText className="max-w-36">{fullName}</LongText>
          </Link>
        </Button>
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
      const provider = getProviderById(providerId)
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
    header: "Actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Send Message</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Deactivate Patient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
