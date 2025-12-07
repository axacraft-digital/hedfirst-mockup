"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2, Lock, RefreshCw, Webhook } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { testIntegrationConnection } from "@/data"
import { CredentialField } from "../components/credential-field"
import { WebhookScenarios } from "../components/webhook-scenarios"
import { AddWebhookDialog } from "../components/add-webhook-dialog"
import { AIIntegrationDetailView } from "../components/ai-integration-detail-view"
import { integrationDetails } from "../data/integration-details"

// Check if an integration is an AI provider
function isAIIntegration(slug: string): boolean {
  return ["claude-ai", "openai", "google-ai"].includes(slug)
}

export default function IntegrationDetailPage() {
  const params = useParams()
  const integrationSlug = params.integration as string
  const integration = integrationDetails[integrationSlug]
  const [isTesting, setIsTesting] = useState(false)

  // Test connection using centralized data
  const handleTestConnection = () => {
    setIsTesting(true)

    // Show loading toast
    const toastId = toast.loading(`Testing connection to ${integration?.name}...`)

    // Simulate API call delay, then get result from centralized data
    setTimeout(() => {
      setIsTesting(false)

      const result = testIntegrationConnection(integrationSlug)

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

  // Derive UI state from integration data
  const isNotConnected = integration?.validation.status === "not_connected"

  // Check if any credentials are configured
  const hasConfiguredCredentials =
    integration?.credentials.some((cred) => cred.configured) ?? false

  // Check if any config fields have values (non-empty strings for text fields)
  const hasConfigValues =
    integration?.config.some((field) => {
      if (field.type === "text") {
        return typeof field.value === "string" && field.value.trim() !== ""
      }
      return false // Select and checkbox always have default values
    }) ?? false

  // Check if any webhook scenarios have URLs configured
  const hasWebhookScenarios =
    integration?.webhookScenarios && integration.webhookScenarios.length > 0
  const hasConfiguredWebhooks =
    integration?.webhookScenarios?.some(
      (scenario) => scenario.webhookUrl.trim() !== ""
    ) ?? false

  // Can save if there's any data entered (config values, credentials, or webhooks)
  const hasDataToSave =
    hasConfigValues || hasConfiguredCredentials || hasConfiguredWebhooks

  // Can delete only if something has been configured
  const canDelete = hasConfiguredCredentials || hasConfiguredWebhooks

  if (!integration) {
    return (
      <>
        <Header />
        <div className="space-y-6 p-4">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold">Integration not found</h2>
            <p className="text-muted-foreground mt-2">
              The integration &quot;{integrationSlug}&quot; does not exist.
            </p>
            <Button asChild className="mt-4">
              <Link href="/store-admin/integrations">Back to Integrations</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Render AI-specific view for AI integrations
  if (isAIIntegration(integrationSlug)) {
    return (
      <>
        <Header />
        <AIIntegrationDetailView integration={integration} />
      </>
    )
  }

  // Standard integration view
  return (
    <>
      <Header />
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
          <h1 className="text-2xl font-bold tracking-tight">
            {integration.name}
          </h1>
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

        {/* Status Toggle */}
        <div className="flex items-center gap-4">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <div className="flex items-center gap-2">
            <Switch
              id="status"
              defaultChecked={integration.enabled}
              disabled={isNotConnected}
            />
            <span className="text-muted-foreground text-sm">
              {isNotConnected
                ? "Configure credentials to enable"
                : integration.enabled
                  ? "Enabled"
                  : "Disabled"}
            </span>
          </div>
        </div>

        <Separator />

        {/* General Settings Section */}
        <div className="space-y-1">
          <h3 className="text-lg font-medium">General Settings</h3>
          <p className="text-muted-foreground text-sm">
            Configure the basic settings for this integration.
          </p>
        </div>
        <Separator />

        <div className="grid gap-4 lg:max-w-xl">
          {integration.config.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === "text" && (
                <div className="space-y-1">
                  <Input
                    id={field.key}
                    defaultValue={field.value as string}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className={
                      field.error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {field.error && (
                    <p className="text-sm text-red-500">{field.error}</p>
                  )}
                </div>
              )}
              {field.type === "select" && (
                <Select defaultValue={field.value as string}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    defaultChecked={field.value as boolean}
                  />
                  <label
                    htmlFor={field.key}
                    className="text-muted-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.description}
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Credentials Section */}
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <Lock className="h-4 w-4" />
            Credentials
          </h3>
          <p className="text-muted-foreground text-sm">
            Secure credentials for API authentication. Leave blank to keep
            existing values.
          </p>
        </div>
        <Separator />

        <div className="grid gap-4 lg:max-w-xl">
          {integration.credentials.map((credential) => (
            <CredentialField
              key={credential.key}
              label={credential.label}
              configured={credential.configured}
              lastUpdated={credential.lastUpdated}
              lastUpdatedBy={credential.lastUpdatedBy}
            />
          ))}
        </div>

        {/* Webhook Scenarios Section (Slack-specific) */}
        {hasWebhookScenarios && (
          <>
            <Separator />
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="flex items-center gap-2 text-lg font-medium">
                  <Webhook className="h-4 w-4" />
                  Webhook Scenarios
                </h3>
                <p className="text-muted-foreground text-sm">
                  Configure webhook URLs for each alert type. Each scenario can
                  post to a different Slack channel.
                </p>
              </div>
              <AddWebhookDialog />
            </div>
            <Separator />
            <div className="lg:max-w-2xl">
              <WebhookScenarios scenarios={integration.webhookScenarios!} />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          {canDelete ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Remove Integration</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Remove {integration.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the {integration.name}{" "}
                    integration and delete all associated credentials. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90">
                    Remove Integration
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div /> // Empty placeholder to maintain flex justify-between layout
          )}

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/store-admin/integrations">Cancel</Link>
            </Button>
            <Button
              disabled={!hasDataToSave}
              onClick={() => {
                toast.success("Changes saved", {
                  description: `${integration.name} integration settings have been updated.`,
                  action: {
                    label: "Close",
                    onClick: () => {},
                  },
                })
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
