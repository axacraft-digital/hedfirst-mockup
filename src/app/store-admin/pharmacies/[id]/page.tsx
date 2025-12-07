"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconAlertTriangle } from "@tabler/icons-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { toast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { mockPharmacies as pharmacies } from "@/data"

interface Props {
  params: Promise<{ id: string }>
}

export default function PharmacyDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const pharmacy = pharmacies.find((p) => p.id === id)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Form state (for mockup - values are editable but don't persist)
  const [name, setName] = useState(pharmacy?.name ?? "")
  const [address, setAddress] = useState(pharmacy?.address ?? "")
  const [phone, setPhone] = useState(pharmacy?.phone ?? "")
  const [pic, setPic] = useState(pharmacy?.pic ?? "")
  const [externalId, setExternalId] = useState(pharmacy?.externalPharmacyId ?? "")

  if (!pharmacy) {
    return (
      <>
        <Header />
        <div className="p-4">
          <p className="text-muted-foreground">Pharmacy not found.</p>
        </div>
      </>
    )
  }

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Pharmacy details have been updated.",
    })
  }

  const handleDelete = () => {
    setDeleteDialogOpen(false)
    toast({
      title: "Pharmacy deleted",
      description: `${pharmacy.name} has been removed.`,
    })
    router.push("/store-admin/pharmacies")
  }

  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/store-admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/store-admin/pharmacies">Pharmacies</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pharmacy.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{pharmacy.name}</h1>
          <p className="text-muted-foreground text-sm">{pharmacy.address}</p>
        </div>

        {/* Content - max width constrained */}
        <div className="max-w-3xl space-y-6">
          {/* Pharmacy Details Form */}
          <div className="space-y-6">
            {/* Name */}
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <div>
                <Label className="text-sm font-medium">Pharmacy Name</Label>
                <p className="text-muted-foreground text-sm">
                  Display name for this pharmacy
                </p>
              </div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>

            <Separator />

            {/* Address */}
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-muted-foreground text-sm">
                  Full street address
                </p>
              </div>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>

            <Separator />

            {/* Phone */}
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-muted-foreground text-sm">
                  Contact phone number
                </p>
              </div>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>

            <Separator />

            {/* Person in Charge */}
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <div>
                <Label className="text-sm font-medium">Person in Charge</Label>
                <p className="text-muted-foreground text-sm">
                  Pharmacist or main contact
                </p>
              </div>
              <Input
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>

            <Separator />

            {/* External ID */}
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <div>
                <Label className="text-sm font-medium">External Pharmacy ID</Label>
                <p className="text-muted-foreground text-sm">
                  DoseSpot or integration identifier
                </p>
              </div>
              <Input
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                className="w-full font-mono text-sm md:w-[300px]"
              />
            </div>

            {/* Save Button */}
            <Button onClick={handleSave}>Save Changes</Button>
          </div>

          {/* Destructive Actions Section */}
          <div className="mt-10 flex w-full flex-col items-start justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
            <div className="flex flex-col items-start text-sm">
              <p className="font-bold tracking-wide">Remove Pharmacy</p>
              <p className="text-muted-foreground font-medium">
                Permanently delete this pharmacy from the system.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Pharmacy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        handleConfirm={handleDelete}
        title={
          <span className="text-destructive">
            <IconAlertTriangle
              className="stroke-destructive mr-1 inline-block"
              size={18}
            />{" "}
            Delete Pharmacy
          </span>
        }
        desc={
          <p>
            Are you sure you want to delete <strong>{pharmacy.name}</strong>?
            This action cannot be undone. Products using this pharmacy will need
            to be reassigned.
          </p>
        }
        confirmText="Delete"
        destructive
      />
    </>
  )
}
