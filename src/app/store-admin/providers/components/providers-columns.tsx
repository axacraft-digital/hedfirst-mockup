"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Provider } from "@/data/types"
import { DataTableColumnHeader } from "./data-table-column-header"

// Status badge styles matching the admin kit
const statusStyles: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-neutral-300/40 border-neutral-300",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  },
  PENDING: {
    label: "Pending",
    className: "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300",
  },
}

function getStatusStyle(status: string) {
  return statusStyles[status] ?? { label: status, className: "bg-neutral-300/40 border-neutral-300" }
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
    header: "Actions",
    cell: ({ row }) => {
      const provider = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/store-admin/providers/${provider.id}`}>
                Provider Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Deactivate Provider
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
