// src/app/store-admin/settings/navigation/[id]/components/menu-items-card.tsx
'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import type { MenuItem } from '@/data/navigation/schemas'
import { MenuItemRow } from './menu-item-row'

interface Props {
  menuId: string
  items: MenuItem[]
  onItemsChange: (items: MenuItem[]) => void
}

export function MenuItemsCard({ menuId, items, onItemsChange }: Props) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /**
   * Edge case handler: Cancel edit mode when drag starts.
   * Per Edge Case §8.4: "Drag item while another is in edit mode → Cancel edit mode, then allow drag"
   */
  function handleDragStart() {
    if (editingItemId !== null) {
      setEditingItemId(null) // Cancel any active edit
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      const now = new Date().toISOString()
      const reordered = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({ ...item, order: index, updatedAt: now })
      )

      onItemsChange(reordered)
    }
  }

  function handleAddItem() {
    const now = new Date().toISOString()
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      menuId,
      label: '',
      link: { type: 'internal', url: '', label: '' },
      order: items.length,
      createdAt: now,
      updatedAt: now,
    }
    onItemsChange([...items, newItem])
    setEditingItemId(newItem.id)
  }

  function handleUpdateItem(updatedItem: MenuItem) {
    const now = new Date().toISOString()
    onItemsChange(
      items.map((item) =>
        item.id === updatedItem.id ? { ...updatedItem, updatedAt: now } : item
      )
    )
  }

  function handleDeleteItem(itemId: string) {
    // Find the item to delete (for undo)
    const deletedItem = items.find((item) => item.id === itemId)
    if (!deletedItem) return

    // Store the deleted item's original position
    const deletedIndex = items.findIndex((item) => item.id === itemId)

    // Remove from list and reorder
    const newItems = items
      .filter((item) => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index }))

    onItemsChange(newItems)

    // Show undo toast (5 seconds)
    toast({
      title: 'Item deleted',
      description: `"${deletedItem.label || 'Untitled item'}" was removed.`,
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            // Restore the item at its original position
            const restored = [...newItems]
            restored.splice(deletedIndex, 0, deletedItem)
            onItemsChange(restored.map((item, index) => ({ ...item, order: index })))
          }}
        >
          Undo
        </ToastAction>
      ),
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Menu items</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">No items in this menu</p>
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add menu item
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    isEditing={editingItemId === item.id}
                    onEdit={() => setEditingItemId(item.id)}
                    onSave={(updated) => {
                      handleUpdateItem(updated)
                      setEditingItemId(null)
                    }}
                    onCancel={() => setEditingItemId(null)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {items.length > 0 && (
          <Button
            variant="ghost"
            className="mt-4 w-full justify-start"
            onClick={handleAddItem}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add menu item
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
