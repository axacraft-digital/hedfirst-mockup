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
import { Checkbox } from "@/components/ui/checkbox"
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
import { mockPharmacies as pharmacies } from "@/data"
import {
  diseaseStateLabels,
  treatmentTypeLabels,
  treatmentUseOptions,
  formFactorOptions,
  dosageUnitOptions,
  billingCycleOptions,
  supplyDurationOptions,
  type DiseaseState,
  type PhysicalTreatmentType,
  type TreatmentUse,
  type ProductIngredient,
  type ProductVariant,
} from "../../data/products-types"

export default function NewPhysicalProductPage() {
  const router = useRouter()

  // Form state - all starting empty/default
  const [onStore, setOnStore] = useState(false)
  const [name, setName] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [badge, setBadge] = useState("")
  const [slug, setSlug] = useState("")
  const [marketingDescription, setMarketingDescription] = useState("")
  const [diseaseState, setDiseaseState] = useState<DiseaseState | "">("")
  const [treatmentType, setTreatmentType] = useState<PhysicalTreatmentType | "">("")
  const [treatmentUse, setTreatmentUse] = useState<TreatmentUse | "">("")

  // Pharmacy Partner state
  const [pharmacyId, setPharmacyId] = useState("")
  const [requiresPrescription, setRequiresPrescription] = useState(true)
  const [allowMultiplePurchase, setAllowMultiplePurchase] = useState(false)

  // Ingredients state
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([])

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([])

  // SEO state
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")

  // Variant handlers
  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants(
      variants.map((v) => (v.id === id ? { ...v, ...updates } : v))
    )
  }

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}`,
      showOnStore: true,
      formFactor: "",
      medicationName: name,
      dosage: "",
      units: "mg",
      quantity: 1,
      supplyDays: 30,
      billingCycle: "EVERY_DAY_30",
      refills: 11,
      price: 0,
      showComparePrice: false,
      sku: "",
    }
    setVariants([...variants, newVariant])
  }

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id))
  }

  // Ingredient handlers
  const addIngredient = () => {
    const newIngredient: ProductIngredient = {
      id: `ing_${Date.now()}`,
      name: "",
    }
    setIngredients([...ingredients, newIngredient])
  }

  const updateIngredient = (id: string, ingredientName: string) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, name: ingredientName } : ing))
    )
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const handleCreate = () => {
    // Validation
    if (!name.trim()) {
      toast({
        title: "Validation error",
        description: "Product name is required.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Product created",
      description: `${name} has been added to the catalog.`,
    })
    router.push("/store-admin/products")
  }

  // Generate slug preview URL
  const slugPreview = slug ? `https://shop.hedfirst.com/products/${slug}` : ""

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
          <h1 className="text-2xl font-bold tracking-tight">Create Physical Product</h1>
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
              <BreadcrumbPage>New Physical Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Content - max width constrained */}
        <div className="max-w-3xl space-y-8">
          {/* ========================================
              SECTION: Product Details
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Product Details</h2>
              <p className="text-muted-foreground text-sm">
                Core information about this product
              </p>
            </div>

            <Separator />

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Brief description shown under title"
              />
            </div>

            {/* Badge Name */}
            <div className="space-y-2">
              <Label htmlFor="badge">Badge name</Label>
              <Input
                id="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g., Weight Loss, Hair Growth"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="product-url-slug"
              />
              {slugPreview && (
                <p className="text-muted-foreground text-xs">{slugPreview}</p>
              )}
            </div>

            {/* Marketing Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Marketing Description</Label>
              <Textarea
                id="description"
                value={marketingDescription}
                onChange={(e) => setMarketingDescription(e.target.value)}
                placeholder="Product marketing copy displayed on the storefront..."
                rows={5}
                maxLength={2000}
              />
              <p className="text-muted-foreground text-xs">
                {marketingDescription.length}/2000 characters
              </p>
            </div>

            <Separator />

            {/* Disease State */}
            <div className="space-y-2">
              <Label>Disease State</Label>
              <Select
                value={diseaseState}
                onValueChange={(v) => setDiseaseState(v as DiseaseState)}
              >
                <SelectTrigger className="w-full md:w-[300px]">
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

            {/* Treatment Type */}
            <div className="space-y-2">
              <Label>Treatment Type</Label>
              <Select
                value={treatmentType}
                onValueChange={(v) => setTreatmentType(v as PhysicalTreatmentType)}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select treatment type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(treatmentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Treatment Use */}
            <div className="space-y-2">
              <Label>Treatment Use</Label>
              <Select
                value={treatmentUse}
                onValueChange={(v) => setTreatmentUse(v as TreatmentUse)}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select treatment use" />
                </SelectTrigger>
                <SelectContent>
                  {treatmentUseOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* ========================================
              SECTION: Pharmacy Partner
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Pharmacy Partner</h2>
              <p className="text-muted-foreground text-sm">
                Select the pharmacy partner responsible for fulfilling this product
              </p>
            </div>

            <Separator />

            {/* Pharmacy Dropdown */}
            <div className="space-y-2">
              <Label>Pharmacy</Label>
              <Select value={pharmacyId} onValueChange={setPharmacyId}>
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select pharmacy" />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies.map((pharmacy) => (
                    <SelectItem key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rules */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="allow-multiple"
                  checked={allowMultiplePurchase}
                  onCheckedChange={(checked) =>
                    setAllowMultiplePurchase(checked === true)
                  }
                />
                <Label
                  htmlFor="allow-multiple"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Allow purchasing more than one item per order
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="requires-prescription"
                  checked={requiresPrescription}
                  onCheckedChange={(checked) =>
                    setRequiresPrescription(checked === true)
                  }
                />
                <Label
                  htmlFor="requires-prescription"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This product requires a prescription
                </Label>
              </div>

              {requiresPrescription && pharmacyId && (
                <p className="text-muted-foreground ml-7 text-sm">
                  <span className="font-medium">Prescription Required:</span> This
                  product will require provider approval and will be fulfilled
                  through the selected pharmacy partner.
                </p>
              )}
            </div>
          </section>

          {/* ========================================
              SECTION: Product Images
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Product Images</h2>
              <p className="text-muted-foreground text-sm">
                0/7 images
              </p>
            </div>

            <Separator />

            {/* Image Grid - Empty state for new product */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-muted/50 flex aspect-square items-center justify-center rounded-lg border border-dashed"
                >
                  <span className="text-muted-foreground text-xs">
                    No image
                  </span>
                </div>
              ))}
            </div>

            {/* Upload area */}
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Upload up to 7 product images
              </p>
              <p className="text-muted-foreground text-xs">
                JPG, HEIC, PNG up to 5MB each
              </p>
              <Button variant="outline" size="sm" disabled>
                Upload image
              </Button>
            </div>
          </section>

          {/* ========================================
              SECTION: Primary Product Ingredients
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Primary Product Ingredients</h2>
              <p className="text-muted-foreground text-sm">
                List the active ingredients in this product
              </p>
            </div>

            <Separator />

            {/* Ingredient List */}
            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      Ingredient {index + 1}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={ingredient.name}
                        onChange={(e) =>
                          updateIngredient(ingredient.id, e.target.value)
                        }
                        placeholder="Medication/ingredient name"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="text-muted-foreground hover:text-destructive h-9 w-9"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {ingredients.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No ingredients added yet.
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add ingredient
              </Button>
            </div>
          </section>

          {/* ========================================
              SECTION: Product Variants
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Product Variants</h2>
              <p className="text-muted-foreground text-sm">
                Configure pricing and fulfillment options for this product
              </p>
            </div>

            <Separator />

            {/* Variant Cards */}
            <div className="space-y-6">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="space-y-4 rounded-lg border p-4"
                >
                  {/* Variant Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Variant {index + 1}</h3>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`show-on-store-${variant.id}`}
                        className="text-sm"
                      >
                        Show on store
                      </Label>
                      <Switch
                        id={`show-on-store-${variant.id}`}
                        checked={variant.showOnStore}
                        onCheckedChange={(checked) =>
                          updateVariant(variant.id, { showOnStore: checked })
                        }
                      />
                    </div>
                  </div>

                  {/* Form Factor */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      Form factor
                    </Label>
                    <Select
                      value={variant.formFactor}
                      onValueChange={(value) =>
                        updateVariant(variant.id, { formFactor: value })
                      }
                    >
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select form" />
                      </SelectTrigger>
                      <SelectContent>
                        {formFactorOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Medication Name, Dosage, Units Row */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Medication name
                      </Label>
                      <Input
                        value={variant.medicationName}
                        onChange={(e) =>
                          updateVariant(variant.id, {
                            medicationName: e.target.value,
                          })
                        }
                        placeholder="Medication name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Dosage
                      </Label>
                      <Input
                        value={variant.dosage}
                        onChange={(e) =>
                          updateVariant(variant.id, { dosage: e.target.value })
                        }
                        placeholder="e.g., 200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Units
                      </Label>
                      <Select
                        value={variant.units}
                        onValueChange={(value) =>
                          updateVariant(variant.id, { units: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {dosageUnitOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity, Supply Row */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          updateVariant(variant.id, {
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="e.g., 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Supply
                      </Label>
                      <Select
                        value={String(variant.supplyDays)}
                        onValueChange={(value) =>
                          updateVariant(variant.id, {
                            supplyDays: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select supply" />
                        </SelectTrigger>
                        <SelectContent>
                          {supplyDurationOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Billing Cycle, Refills Row */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Billing cycle
                      </Label>
                      <Select
                        value={variant.billingCycle}
                        onValueChange={(value) =>
                          updateVariant(variant.id, { billingCycle: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          {billingCycleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Refills
                      </Label>
                      <Input
                        type="number"
                        value={variant.refills}
                        onChange={(e) =>
                          updateVariant(variant.id, {
                            refills: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="e.g., 11"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Price Row */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Price
                      </Label>
                      <div className="relative">
                        <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                          $
                        </span>
                        <Input
                          type="number"
                          value={(variant.price / 100).toFixed(2)}
                          onChange={(e) =>
                            updateVariant(variant.id, {
                              price: Math.round(parseFloat(e.target.value) * 100) || 0,
                            })
                          }
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-xs">
                        Compare at price
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                            $
                          </span>
                          <Input
                            type="number"
                            value={
                              variant.compareAtPrice
                                ? (variant.compareAtPrice / 100).toFixed(2)
                                : ""
                            }
                            onChange={(e) =>
                              updateVariant(variant.id, {
                                compareAtPrice: e.target.value
                                  ? Math.round(parseFloat(e.target.value) * 100)
                                  : undefined,
                              })
                            }
                            className="pl-7"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Checkbox
                            id={`show-compare-${variant.id}`}
                            checked={variant.showComparePrice}
                            onCheckedChange={(checked) =>
                              updateVariant(variant.id, {
                                showComparePrice: checked === true,
                              })
                            }
                          />
                          <Label
                            htmlFor={`show-compare-${variant.id}`}
                            className="text-xs"
                          >
                            Show
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SKU */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">SKU</Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(variant.id, { sku: e.target.value })
                      }
                      placeholder="e.g., TESTCYP30-01"
                      className="font-mono md:w-[250px]"
                    />
                  </div>

                  {/* Pharmacy Notes */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      Variant Pharmacy Notes
                    </Label>
                    <Textarea
                      value={variant.pharmacyNotes ?? ""}
                      onChange={(e) =>
                        updateVariant(variant.id, {
                          pharmacyNotes: e.target.value,
                        })
                      }
                      placeholder="Insert Pharmacy Notes..."
                      rows={2}
                    />
                  </div>

                  {/* Patient Directions */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs">
                      Variant Patient Directions
                    </Label>
                    <Textarea
                      value={variant.patientDirections ?? ""}
                      onChange={(e) =>
                        updateVariant(variant.id, {
                          patientDirections: e.target.value,
                        })
                      }
                      placeholder="Insert Patient Directions..."
                      rows={2}
                    />
                  </div>

                  {/* Remove Variant Button */}
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(variant.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <IconTrash className="mr-2 h-4 w-4" />
                      Remove variant
                    </Button>
                  </div>
                </div>
              ))}

              {variants.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No variants configured yet. Add at least one variant to set pricing.
                </p>
              )}

              {/* Add Variant Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add variant
              </Button>
            </div>
          </section>

          {/* ========================================
              SECTION: Search Engine Optimization
              ======================================== */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                Search Engine Optimization (optional)
              </h2>
              <p className="text-muted-foreground text-sm">
                Customize how this product appears in search results
              </p>
            </div>

            <Separator />

            {/* Page Title */}
            <div className="space-y-2">
              <Label htmlFor="seo-title">Page title</Label>
              <Input
                id="seo-title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="e.g., Semaglutide - Weight Loss Medication"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <Label htmlFor="seo-description">Meta description</Label>
              <Textarea
                id="seo-description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="A brief summary of the page content..."
                rows={3}
                maxLength={160}
              />
              <p className="text-muted-foreground text-xs">
                {seoDescription.length}/160 characters
              </p>
            </div>
          </section>

          {/* Create Button */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link href="/store-admin/products">Cancel</Link>
            </Button>
            <Button onClick={handleCreate}>Create Product</Button>
          </div>
        </div>
      </div>
    </>
  )
}
