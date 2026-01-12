// src/app/store-admin/settings/navigation/[id]/components/menu-editor-client.tsx
'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import type { Menu, MenuItem } from '@/data/navigation/schemas'
import { generateHandle } from '@/data/navigation/schemas'
import { saveMenu } from '@/data/navigation/storage'
import { DeleteMenuDialog } from '../../components/delete-menu-dialog'
import { MenuHeaderCard } from './menu-header-card'
import { MenuItemsCard } from './menu-items-card'

interface Props {
  menu: Menu
}

export function MenuEditorClient({ menu }: Props) {
  const router = useRouter()
  const [originalMenu, setOriginalMenu] = useState<Menu>(menu) // Baseline for dirty check
  const [localMenu, setLocalMenu] = useState<Menu>(menu)       // Working copy
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Compare working copy to baseline (not prop) for dirty detection
  const isDirty = useMemo(() => {
    return JSON.stringify(localMenu) !== JSON.stringify(originalMenu)
  }, [localMenu, originalMenu])

  const handleNameChange = (newName: string) => {
    setLocalMenu((prev) => ({
      ...prev,
      name: newName,
      handle: generateHandle(newName),
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleItemsChange = (newItems: MenuItem[]) => {
    setLocalMenu((prev) => ({
      ...prev,
      items: newItems,
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      saveMenu(localMenu)
      setOriginalMenu(localMenu) // Update baseline so isDirty becomes false
      toast({
        title: 'Changes saved',
        description: 'Your menu has been updated.',
      })
    } catch {
      toast({
        title: 'Failed to save',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    setLocalMenu(originalMenu) // Reset to baseline
  }

  const handleDeleteSuccess = () => {
    router.push('/store-admin/settings/navigation')
    toast({
      title: 'Menu deleted',
      description: `"${localMenu.name}" has been removed.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Action buttons row */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete menu
        </Button>
      </div>

      {/* Menu header card (name/handle) */}
      <MenuHeaderCard
        name={localMenu.name}
        handle={localMenu.handle}
        onNameChange={handleNameChange}
      />

      {/* Menu items card */}
      <MenuItemsCard
        menuId={localMenu.id}
        items={localMenu.items}
        onItemsChange={handleItemsChange}
      />

      {/* Action Buttons - matches kit pattern from branding page */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          onClick={handleDiscard}
          disabled={!isDirty || isSaving}
        >
          Discard
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      {/* Delete confirmation */}
      <DeleteMenuDialog
        menu={localMenu}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
