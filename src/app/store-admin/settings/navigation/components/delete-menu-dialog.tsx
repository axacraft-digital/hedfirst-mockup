// src/app/store-admin/settings/navigation/components/delete-menu-dialog.tsx
'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Menu } from '@/data/navigation/schemas'
import { deleteMenu } from '@/data/navigation/storage'

interface Props {
  menu: Menu | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (deletedId: string) => void
}

export function DeleteMenuDialog({ menu, open, onOpenChange, onSuccess }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!menu) return

    setIsDeleting(true)
    try {
      deleteMenu(menu.id)
      onSuccess(menu.id)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!menu) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete menu</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{menu.name}&quot;?
            {menu.items.length > 0 && (
              <> This will remove all {menu.items.length} menu item{menu.items.length !== 1 ? 's' : ''}.</>
            )}
            {' '}This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
