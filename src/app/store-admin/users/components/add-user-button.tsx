"use client"

import { IconUserPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export function AddUserButton() {
  return (
    <Button className="space-x-1">
      <span>Add User</span>
      <IconUserPlus size={18} />
    </Button>
  )
}
