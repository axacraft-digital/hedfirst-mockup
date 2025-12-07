"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { toast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"

// Billing cycle options for memberships
const membershipBillingCycles = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Quarterly", value: "QUARTERLY" },
  { label: "Annual", value: "ANNUAL" },
]

interface MembershipFeature {
  id: string
  text: string
}

export default function NewMembershipPage() {
  const router = useRouter()

  // Form state
  const [onStore, setOnStore] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [billingCycle, setBillingCycle] = useState("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState(0)
  const [features, setFeatures] = useState<MembershipFeature[]>([])

  // Feature handlers
  const addFeature = () => {
    setFeatures([
      ...features,
      { id: `feat_${Date.now()}`, text: "" },
    ])
  }

  const updateFeature = (id: string, text: string) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, text } : f)))
  }

  const removeFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id))
  }

  const handleCreate = () => {
    // Validation
    if (!name.trim()) {
      toast({
        title: "Validation error",
        description: "Membership name is required.",
        variant: "destructive",
      })
      return
    }

    if (!billingCycle) {
      toast({
        title: "Validation error",
        description: "Please select a billing cycle.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Membership created",
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
          <h1 className="text-2xl font-bold tracking-tight">Create Membership</h1>
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
              <BreadcrumbPage>New Membership</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Content - max width constrained */}
        <div className="max-w-xl space-y-8">
          {/* ========================================
              SECTION: Membership Details
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Membership Details</h2>
              <p className="text-muted-foreground text-sm">
                Information about this membership plan
              </p>
            </div>

            <Separator />

            {/* Membership Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Membership Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Care Membership (Monthly)"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this membership includes..."
                rows={4}
                maxLength={500}
              />
              <p className="text-muted-foreground text-xs">
                {description.length}/500 characters
              </p>
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g., MEM-CARE-MONTHLY"
                className="font-mono"
              />
            </div>
          </section>

          {/* ========================================
              SECTION: Pricing & Billing
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Pricing & Billing</h2>
              <p className="text-muted-foreground text-sm">
                Set the price and billing frequency
              </p>
            </div>

            <Separator />

            {/* Billing Cycle */}
            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={setBillingCycle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  {membershipBillingCycles.map((cycle) => (
                    <SelectItem key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                {billingCycle === "MONTHLY"
                  ? "Charged monthly"
                  : billingCycle === "QUARTERLY"
                    ? "Charged every 3 months"
                    : billingCycle === "ANNUAL"
                      ? "Charged once per year"
                      : "Select a billing cycle"}
              </p>
            </div>
          </section>

          {/* ========================================
              SECTION: Membership Features
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Membership Features</h2>
              <p className="text-muted-foreground text-sm">
                List the benefits included in this membership
              </p>
            </div>

            <Separator />

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={feature.id} className="flex items-center gap-2">
                  <Input
                    value={feature.text}
                    onChange={(e) => updateFeature(feature.id, e.target.value)}
                    placeholder={`Feature ${index + 1}, e.g., Unlimited messaging with providers`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(feature.id)}
                    className="text-muted-foreground hover:text-destructive h-9 w-9"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {features.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No features added yet. Add benefits to show customers what&apos;s included.
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add feature
              </Button>
            </div>
          </section>

          {/* Create Button */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link href="/store-admin/products">Cancel</Link>
            </Button>
            <Button onClick={handleCreate}>Create Membership</Button>
          </div>
        </div>
      </div>
    </>
  )
}
