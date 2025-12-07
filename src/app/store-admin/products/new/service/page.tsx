"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconArrowLeft } from "@tabler/icons-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import {
  diseaseStateLabels,
  type DiseaseState,
} from "../../data/products-types"

export default function NewServicePage() {
  const router = useRouter()

  // Form state
  const [onStore, setOnStore] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [diseaseState, setDiseaseState] = useState<DiseaseState | "">("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState(0)

  const handleCreate = () => {
    // Validation
    if (!name.trim()) {
      toast({
        title: "Validation error",
        description: "Service name is required.",
        variant: "destructive",
      })
      return
    }

    if (!diseaseState) {
      toast({
        title: "Validation error",
        description: "Please select a disease state.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Service created",
      description: `${name} has been added to the catalog.`,
    })
    router.push("/store-admin/products")
  }

  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Back link */}
        <Button variant="link" asChild className="h-auto p-0 text-sm">
          <Link href="/store-admin/products">
            <IconArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>

        {/* Header row: Title on left, On Store toggle on right */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Create Service</h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="on-store" className="text-sm font-medium">
              On store
            </Label>
            <Switch
              id="on-store"
              checked={onStore}
              onCheckedChange={setOnStore}
            />
          </div>
        </div>

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
                <Link href="/store-admin/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New Service</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Content - max width constrained */}
        <div className="max-w-xl space-y-8">
          {/* ========================================
              SECTION: Service Details
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Service Details</h2>
              <p className="text-muted-foreground text-sm">
                Information about this consultation service
              </p>
            </div>

            <Separator />

            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Weight Loss Consultation"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this consultation service includes..."
                rows={4}
                maxLength={500}
              />
              <p className="text-muted-foreground text-xs">
                {description.length}/500 characters
              </p>
            </div>

            {/* Disease State */}
            <div className="space-y-2">
              <Label>Disease State</Label>
              <Select
                value={diseaseState}
                onValueChange={(v) => setDiseaseState(v as DiseaseState)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select disease state" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(diseaseStateLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g., CONSULT-WEIGHT"
                className="font-mono"
              />
            </div>
          </section>

          {/* ========================================
              SECTION: Pricing
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Pricing</h2>
              <p className="text-muted-foreground text-sm">
                Set the price for this service
              </p>
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative w-[200px]">
                <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  value={(price / 100).toFixed(2)}
                  onChange={(e) =>
                    setPrice(Math.round(parseFloat(e.target.value) * 100) || 0)
                  }
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                One-time fee charged when patient books this consultation
              </p>
            </div>
          </section>

          {/* Create Button */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link href="/store-admin/products">Cancel</Link>
            </Button>
            <Button onClick={handleCreate}>Create Service</Button>
          </div>
        </div>
      </div>
    </>
  )
}
