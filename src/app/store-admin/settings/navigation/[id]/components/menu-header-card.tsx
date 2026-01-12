// src/app/store-admin/settings/navigation/[id]/components/menu-header-card.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  name: string
  handle: string
  onNameChange: (name: string) => void
}

export function MenuHeaderCard({ name, handle, onNameChange }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Menu details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="menu-name">Name</Label>
          <Input
            id="menu-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Main Menu"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Handle: <code className="bg-muted px-1 py-0.5 rounded">{handle}</code>
        </div>
      </CardContent>
    </Card>
  )
}
