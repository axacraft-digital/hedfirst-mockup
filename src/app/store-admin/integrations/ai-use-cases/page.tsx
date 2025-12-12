"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Header } from "@/components/layout/header"
import { type AIUseCase, aiUseCases } from "./data/ai-use-cases"

export default function AIUseCasesPage() {
  const [mappings, setMappings] = useState<AIUseCase[]>(aiUseCases)

  const handleProviderChange = (useCaseId: string, provider: string) => {
    setMappings((prev) =>
      prev.map((uc) =>
        uc.id === useCaseId ? { ...uc, selectedProvider: provider } : uc
      )
    )
  }

  const handleEnabledChange = (useCaseId: string, enabled: boolean) => {
    setMappings((prev) =>
      prev.map((uc) => (uc.id === useCaseId ? { ...uc, enabled } : uc))
    )
  }

  const handleSave = () => {
    toast({
      title: "AI use case mappings saved",
      description: "All business functions have been mapped to AI providers.",
    })
  }

  const enabledCount = mappings.filter((m) => m.enabled).length

  return (
    <>
      <Header />
      <div className="space-y-6 p-4 pb-16">
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
                <Link href="/store-admin/integrations">Integrations</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AI Use Cases</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/store-admin/integrations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Integrations
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Sparkles className="h-6 w-6" />
            AI Use Cases
          </h1>
          <p className="text-muted-foreground">
            Map business functions to AI providers. Each use case will use the
            selected provider when invoked.
          </p>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {enabledCount} of {mappings.length} use cases enabled
          </Badge>
        </div>

        <Separator />

        {/* Use Case Mappings */}
        <div className="grid gap-4 lg:max-w-4xl">
          {mappings.map((useCase) => (
            <Card key={useCase.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{useCase.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {useCase.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`enabled-${useCase.id}`}
                      checked={useCase.enabled}
                      onCheckedChange={(checked) =>
                        handleEnabledChange(useCase.id, checked)
                      }
                    />
                    <Label
                      htmlFor={`enabled-${useCase.id}`}
                      className="text-muted-foreground text-sm"
                    >
                      {useCase.enabled ? "Enabled" : "Disabled"}
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`provider-${useCase.id}`}>
                      AI Provider
                    </Label>
                    <Select
                      value={useCase.selectedProvider}
                      onValueChange={(value) =>
                        handleProviderChange(useCase.id, value)
                      }
                      disabled={!useCase.enabled}
                    >
                      <SelectTrigger id={`provider-${useCase.id}`}>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {useCase.availableProviders.map((provider) => (
                          <SelectItem
                            key={provider.value}
                            value={provider.value}
                          >
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Recommended Model</Label>
                    <div className="text-muted-foreground bg-muted/50 flex h-9 items-center rounded-md border px-3 text-sm">
                      {useCase.recommendedModel}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/store-admin/integrations">Cancel</Link>
          </Button>
          <Button onClick={handleSave}>Save Mappings</Button>
        </div>
      </div>
    </>
  )
}
