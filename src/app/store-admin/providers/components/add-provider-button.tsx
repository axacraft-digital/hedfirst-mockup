"use client"

import { IconUserPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function AddProviderButton() {
  return (
    <Button className="space-x-1">
      <span>Add Provider</span>
      <IconUserPlus size={18} />
    </Button>
  )
}
