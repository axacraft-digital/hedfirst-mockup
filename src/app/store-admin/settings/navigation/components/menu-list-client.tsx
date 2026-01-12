// src/app/store-admin/settings/navigation/components/menu-list-client.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu as MenuIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Menu } from '@/data/navigation/schemas'
import { getMenus } from '@/data/navigation/storage'
import { EmptyState } from '@/components/empty-state'
import { ContentSection } from '../../components/content-section'
import { MenuTable } from './menu-table'
import { MenuListSkeleton } from './menu-list-skeleton'
import { CreateMenuDialog } from './create-menu-dialog'
import { DeleteMenuDialog } from './delete-menu-dialog'

export function MenuListClient() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null)
  const router = useRouter()

  // Fetch menus from localStorage on mount (client-side only)
  useEffect(() => {
    const loadMenus = () => {
      const data = getMenus()
      setMenus(data)
      setIsLoading(false)
    }
    loadMenus()
  }, [])

  // Called when Create Menu dialog submits successfully
  const handleCreateSuccess = (newMenu: Menu) => {
    setMenus((prev) => [...prev, newMenu])
    setCreateDialogOpen(false)
    // Navigate to new menu's editor
    router.push(`/store-admin/settings/navigation/${newMenu.id}`)
  }

  // Called when Delete Menu dialog confirms
  const handleDeleteSuccess = (deletedId: string) => {
    setMenus((prev) => prev.filter((m) => m.id !== deletedId))
    setDeleteTarget(null)
    // No navigation needed — stay on list page
  }

  // Loading state
  if (isLoading) {
    return (
      <ContentSection
        title="Navigation"
        desc="Manage your store's navigation menus."
      >
        <MenuListSkeleton />
      </ContentSection>
    )
  }

  // Empty state
  if (menus.length === 0) {
    return (
      <ContentSection
        title="Navigation"
        desc="Manage your store's navigation menus."
      >
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create menu
          </Button>
        </div>
        <EmptyState
          icon={MenuIcon}
          title="No menus yet"
          description="Create your first navigation menu to get started."
        />
        <CreateMenuDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      </ContentSection>
    )
  }

  // Populated state
  return (
    <ContentSection
      title="Navigation"
      desc="Manage your store's navigation menus."
    >
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create menu
        </Button>
      </div>
      <MenuTable
        menus={menus}
        onDelete={(menu) => setDeleteTarget(menu)}
      />
      <CreateMenuDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
      <DeleteMenuDialog
        menu={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
      />
    </ContentSection>
  )
}
