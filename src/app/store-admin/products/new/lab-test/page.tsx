"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { labKitCatalog } from "@/data"
import { toast } from "@/hooks/use-toast"
import { IconArrowLeft, IconPlus, IconTrash } from "@tabler/icons-react"
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
import { Header } from "@/components/layout/header"
import type { LabKitCategory } from "@/data/types"

// Lab kit categories from Choose Health
const labKitCategories: LabKitCategory[] = [
  "Metabolic",
  "Liver",
  "Endocrine",
  "Female Hormone",
  "Male Hormone",
]

// Collection methods
const collectionMethods = [
  { label: "Finger-Prick Blood Test", value: "finger-prick" },
  { label: "Venous Blood Draw", value: "venous" },
  { label: "Saliva Collection", value: "saliva" },
  { label: "Urine Sample", value: "urine" },
  { label: "At-Home Kit", value: "at-home" },
]

interface Biomarker {
  id: string
  name: string
}

export default function NewLabTestPage() {
  const router = useRouter()

  // Form state
  const [onStore, setOnStore] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState<LabKitCategory | "">("")
  const [description, setDescription] = useState("")
  const [focus, setFocus] = useState("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState(0)
  const [collectionMethod, setCollectionMethod] = useState("finger-prick")
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([])

  // Biomarker handlers
  const addBiomarker = () => {
    setBiomarkers([...biomarkers, { id: `bio_${Date.now()}`, name: "" }])
  }

  const updateBiomarker = (id: string, name: string) => {
    setBiomarkers(biomarkers.map((b) => (b.id === id ? { ...b, name } : b)))
  }

  const removeBiomarker = (id: string) => {
    setBiomarkers(biomarkers.filter((b) => b.id !== id))
  }

  const handleCreate = () => {
    // Validation
    if (!name.trim()) {
      toast({
        title: "Validation error",
        description: "Lab test name is required.",
        variant: "destructive",
      })
      return
    }

    if (!category) {
      toast({
        title: "Validation error",
        description: "Please select a category.",
        variant: "destructive",
      })
      return
    }

    if (biomarkers.length === 0) {
      toast({
        title: "Validation error",
        description: "Please add at least one biomarker.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Lab test created",
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
          <h1 className="text-2xl font-bold tracking-tight">Create Lab Test</h1>
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
              <BreadcrumbPage>New Lab Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Content - max width constrained */}
        <div className="max-w-2xl space-y-8">
          {/* ========================================
              SECTION: Lab Partner
              ======================================== */}
          <section className="space-y-4">
            <div className="bg-muted/50 rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <span className="text-primary text-lg font-semibold">CH</span>
                </div>
                <div>
                  <p className="font-medium">{labKitCatalog.source}</p>
                  <p className="text-muted-foreground text-sm">
                    Lab Partner • {labKitCatalog.collectionMethod}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================
              SECTION: Test Details
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Test Details</h2>
              <p className="text-muted-foreground text-sm">
                Basic information about this lab test
              </p>
            </div>

            <Separator />

            {/* Test Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Test Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Comprehensive Metabolic Test"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as LabKitCategory)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {labKitCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this test measures and who it's for..."
                rows={3}
                maxLength={500}
              />
              <p className="text-muted-foreground text-xs">
                {description.length}/500 characters
              </p>
            </div>

            {/* Focus Area */}
            <div className="space-y-2">
              <Label htmlFor="focus">Focus Area</Label>
              <Input
                id="focus"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g., metabolic health, thyroid function, hormone balance"
              />
              <p className="text-muted-foreground text-xs">
                Brief description of the test&apos;s clinical focus
              </p>
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g., LAB-COMP-METAB"
                className="font-mono"
              />
            </div>

            {/* Collection Method */}
            <div className="space-y-2">
              <Label>Collection Method</Label>
              <Select
                value={collectionMethod}
                onValueChange={setCollectionMethod}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select collection method" />
                </SelectTrigger>
                <SelectContent>
                  {collectionMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* ========================================
              SECTION: Biomarkers
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Biomarkers Tested</h2>
              <p className="text-muted-foreground text-sm">
                List all biomarkers included in this panel ({biomarkers.length}{" "}
                total)
              </p>
            </div>

            <Separator />

            {/* Biomarkers List */}
            <div className="space-y-3">
              {biomarkers.map((biomarker, index) => (
                <div key={biomarker.id} className="flex items-center gap-2">
                  <span className="text-muted-foreground w-6 text-sm">
                    {index + 1}.
                  </span>
                  <Input
                    value={biomarker.name}
                    onChange={(e) =>
                      updateBiomarker(biomarker.id, e.target.value)
                    }
                    placeholder="e.g., TSH (Thyroid Stimulating Hormone)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBiomarker(biomarker.id)}
                    className="text-muted-foreground hover:text-destructive h-9 w-9"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {biomarkers.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No biomarkers added yet. Add the markers this test measures.
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBiomarker}
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add biomarker
              </Button>
            </div>
          </section>

          {/* ========================================
              SECTION: Pricing
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Pricing</h2>
              <p className="text-muted-foreground text-sm">
                Set the price for this lab test
              </p>
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative w-[200px]">
                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
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
                One-time fee for the lab test kit
              </p>
            </div>
          </section>

          {/* Create Button */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link href="/store-admin/products">Cancel</Link>
            </Button>
            <Button onClick={handleCreate}>Create Lab Test</Button>
          </div>
        </div>
      </div>
    </>
  )
}
