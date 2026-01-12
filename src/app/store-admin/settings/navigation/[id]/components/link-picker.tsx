// src/app/store-admin/settings/navigation/[id]/components/link-picker.tsx
'use client'

import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Home,
  Package,
  Grid3X3,
  Info,
  Mail,
  FileText,
  User,
  ShoppingBag,
  MessageSquare,
  Shield,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { MenuItemLink, InternalPageOption } from '@/data/navigation/schemas'
import { INTERNAL_PAGE_OPTIONS, PAGE_CATEGORIES } from '@/data/navigation/internal-pages'

interface Props {
  value?: MenuItemLink
  onChange: (link: MenuItemLink | undefined) => void
}

export function LinkPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>(
    value?.type === 'external' ? 'external' : 'internal'
  )
  const [externalUrl, setExternalUrl] = useState(
    value?.type === 'external' ? value.url : ''
  )
  const [externalLabel, setExternalLabel] = useState(
    value?.type === 'external' ? value.label : ''
  )

  function handleSelectInternal(page: InternalPageOption) {
    onChange({
      type: 'internal',
      url: page.url,
      label: page.label,
    })
    setOpen(false)
  }

  function handleApplyExternal() {
    if (!externalUrl.trim()) return
    onChange({
      type: 'external',
      url: externalUrl.trim(),
      // Label falls back to URL if empty — satisfies schema requirement that link.label is non-empty
      label: externalLabel.trim() || externalUrl.trim(),
    })
    setOpen(false)
  }

  const displayLabel = value?.label || value?.url || 'Select link'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between"
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'internal' | 'external')}>
          <TabsList className="w-full">
            <TabsTrigger value="internal" className="flex-1">
              Internal Pages
            </TabsTrigger>
            <TabsTrigger value="external" className="flex-1">
              External URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="max-h-64 overflow-y-auto p-2">
            {Object.entries(PAGE_CATEGORIES).map(([categoryKey, categoryLabel]) => {
              const categoryPages = INTERNAL_PAGE_OPTIONS.filter(
                (p) => p.category === categoryKey
              )
              if (categoryPages.length === 0) return null

              return (
                <div key={categoryKey} className="mb-2">
                  <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {categoryLabel}
                  </p>
                  {categoryPages.map((page) => {
                    const Icon = getLucideIcon(page.icon)
                    const isSelected =
                      value?.type === 'internal' && value?.url === page.url

                    return (
                      <button
                        key={page.url}
                        onClick={() => handleSelectInternal(page)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent',
                          isSelected && 'bg-accent'
                        )}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-left">{page.label}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="external" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="external-url">URL</Label>
              <Input
                id="external-url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="external-label">Display label</Label>
              <Input
                id="external-label"
                value={externalLabel}
                onChange={(e) => setExternalLabel(e.target.value)}
                placeholder="Example Site"
              />
            </div>
            <Button
              onClick={handleApplyExternal}
              disabled={!externalUrl.trim()}
              className="w-full"
            >
              Apply
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

// Helper to get Lucide icon component by name
function getLucideIcon(name: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    Home,
    Package,
    Grid3X3,
    Info,
    Mail,
    FileText,
    User,
    ShoppingBag,
    MessageSquare,
    Shield,
    RotateCcw,
  }
  return icons[name] || FileText
}
