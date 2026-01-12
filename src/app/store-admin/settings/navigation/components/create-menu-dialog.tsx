// src/app/store-admin/settings/navigation/components/create-menu-dialog.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  type Menu,
  type CreateMenuInput,
  createMenuSchema,
  generateHandle,
} from '@/data/navigation/schemas'
import { MOCK_STORE_ID } from '@/data/navigation/constants'
import { getMenus, saveMenu } from '@/data/navigation/storage'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (menu: Menu) => void
}

export function CreateMenuDialog({ open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateMenuInput>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: { name: '' },
  })

  const watchedName = form.watch('name')
  const previewHandle = watchedName ? generateHandle(watchedName) : ''

  async function onSubmit(data: CreateMenuInput) {
    setIsSubmitting(true)
    try {
      const handle = generateHandle(data.name)

      // Check for handle collision
      const existingMenus = getMenus()
      const collision = existingMenus.some((m) => m.handle === handle)
      if (collision) {
        form.setError('name', {
          type: 'manual',
          message: 'A menu with this handle already exists. Try a different name.',
        })
        setIsSubmitting(false)
        return
      }

      const now = new Date().toISOString()
      const newMenu: Menu = {
        id: crypto.randomUUID(),
        storeId: MOCK_STORE_ID,
        name: data.name,
        handle,
        items: [],
        createdAt: now,
        updatedAt: now,
      }

      // Persist to storage
      saveMenu(newMenu)

      form.reset()
      onSuccess(newMenu)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when dialog closes
  function handleOpenChange(open: boolean) {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create menu</DialogTitle>
          <DialogDescription>
            Add a new navigation menu for your store.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Main Menu"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                  {previewHandle && (
                    <p className="text-sm text-muted-foreground">
                      Handle: {previewHandle}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create menu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
