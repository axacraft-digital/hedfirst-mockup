"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { MutatePharmacy } from "./mutate-pharmacy"

export function AddPharmacyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add pharmacy
      </Button>

      <MutatePharmacy open={open} setOpen={setOpen} />
    </>
  )
}
