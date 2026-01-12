// src/app/store-admin/settings/navigation/components/menu-table-columns.tsx
'use client'

import type { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Menu } from '@/data/navigation/schemas'
import { DataTableColumnHeader } from './data-table-column-header'

export function menuColumns(
  onDelete: (menu: Menu) => void
): ColumnDef<Menu>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Menu" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/store-admin/settings/navigation/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      id: 'items',
      accessorKey: 'items',
      header: 'Menu items',
      cell: ({ row }) => {
        const items = row.original.items
        if (items.length === 0) {
          return <span className="text-muted-foreground">No items</span>
        }

        const displayItems = items.slice(0, 5)
        const remaining = items.length - 5
        const labels = displayItems.map((item) => item.label).join(', ')

        return (
          <span className="text-muted-foreground">
            {labels}
            {remaining > 0 && `, +${remaining} more`}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/store-admin/settings/navigation/${row.original.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
