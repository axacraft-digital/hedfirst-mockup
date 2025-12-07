"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { testIntegrationConnection } from "@/data"
import { AIConfigurationTab } from "./ai-configuration-tab"
import { AISafetyTab } from "./ai-safety-tab"
import { AIMonitoringTab } from "./ai-monitoring-tab"
import type { IntegrationDetail } from "../data/integration-details"

interface AIIntegrationDetailViewProps {
  integration: IntegrationDetail
}

export function AIIntegrationDetailView({
  integration,
}: AIIntegrationDetailViewProps) {
  const [isTesting, setIsTesting] = useState(false)
  const [activeTab, setActiveTab] = useState("configuration")

  // Test connection using centralized data
  const handleTestConnection = () => {
    setIsTesting(true)

    // Show loading toast
    const toastId = toast.loading(`Testing connection to ${integration.name}...`)

    // Simulate API call delay, then get result from centralized data
    setTimeout(() => {
      setIsTesting(false)

      const result = testIntegrationConnection(integration.slug)

      if (result.result === "success") {
        toast.success("Connection successful", {
          id: toastId,
          description: result.message,
          action: {
            label: "Close",
            onClick: () => {},
          },
        })
      } else if (result.result === "not_configured") {
        toast.warning("Not configured", {
          id: toastId,
          description: result.message,
          action: {
            label: "Close",
            onClick: () => {},
          },
        })
      } else {
        toast.error("Connection failed", {
          id: toastId,
          description: result.message,
          action: {
            label: "Close",
            onClick: () => {},
          },
        })
      }
    }, 2000)
  }

  const isNotConnected = integration.validation.status === "not_connected"

  return (
    <div className="space-y-6 p-4 pb-16">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/store-admin/integrations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{integration.name}</h1>
        <p className="text-muted-foreground">{integration.description}</p>
      </div>

      {/* Test Connection */}
      <div>
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={isTesting || isNotConnected}
        >
          {isTesting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isTesting ? "Testing..." : "Test Connection"}
        </Button>
      </div>

      <Separator />

      {/* 3-Tab Layout */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="border-muted flex h-auto w-full items-center justify-start rounded-none border-b bg-transparent p-0!">
          <TabsTrigger
            value="configuration"
            className="rounded-none border-blue-600 py-1 shadow-none! data-[state=active]:border-b-[2px]"
          >
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="safety"
            className="rounded-none border-blue-600 py-1 shadow-none! data-[state=active]:border-b-[2px]"
          >
            Safety & Compliance
          </TabsTrigger>
          <TabsTrigger
            value="monitoring"
            disabled={isNotConnected}
            className="rounded-none border-blue-600 py-1 shadow-none! data-[state=active]:border-b-[2px]"
          >
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          <AIConfigurationTab integration={integration} />
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <AISafetyTab integration={integration} />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <AIMonitoringTab integration={integration} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
