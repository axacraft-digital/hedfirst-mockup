// src/app/store-admin/settings/navigation/[id]/components/menu-item-row.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MenuItem, MenuItemLink } from '@/data/navigation/schemas'
import { LinkPicker } from './link-picker'

interface Props {
  item: MenuItem
  isEditing: boolean
  onEdit: () => void
  onSave: (item: MenuItem) => void
  onCancel: () => void
  onDelete: () => void
}

export function MenuItemRow({
  item,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const [localLabel, setLocalLabel] = useState(item.label)
  const [localLink, setLocalLink] = useState<MenuItemLink | undefined>(item.link)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  // NOTE: Inline styles are required for @dnd-kit transforms — this is a documented
  // exception to the "no inline styles" rule. DnD libraries apply dynamic transforms
  // that cannot be expressed as Tailwind classes.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Reset local state when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setLocalLabel(item.label)
      setLocalLink(item.link)
    }
  }, [isEditing, item])

  function handleSave() {
    if (!localLabel.trim()) return // Don't save empty labels
    onSave({
      ...item,
      label: localLabel.trim(),
      link: localLink,
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 rounded-md border bg-card p-2"
      >
        {/* Drag handle (disabled during edit) */}
        <div className="cursor-not-allowed text-muted-foreground/50">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Label input */}
        <Input
          value={localLabel}
          onChange={(e) => setLocalLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Label"
          className="h-9 flex-1"
          autoFocus
        />

        {/* Link picker */}
        <LinkPicker
          value={localLink}
          onChange={setLocalLink}
        />

        {/* Actions */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSave}
          disabled={!localLabel.trim()}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Save</span>
        </Button>
        <Button size="icon" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 rounded-md border bg-card p-2',
        isDragging && 'opacity-50'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
        <span className="sr-only">Drag to reorder</span>
      </button>

      {/* Label */}
      <span className="flex-1 font-medium">{item.label || '(no label)'}</span>

      {/* Link badge */}
      <Badge variant="secondary" className="font-normal">
        {item.link?.label || item.link?.url || '(no link)'}
      </Badge>

      {/* Actions */}
      <Button size="icon" variant="ghost" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={onDelete}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  )
}
