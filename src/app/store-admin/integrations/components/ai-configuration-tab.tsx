"use client"

import Link from "next/link"
import { Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { CredentialField } from "./credential-field"
import type { IntegrationDetail } from "../data/integration-details"

interface AIConfigurationTabProps {
  integration: IntegrationDetail
}

export function AIConfigurationTab({ integration }: AIConfigurationTabProps) {
  const isNotConnected = integration.validation.status === "not_connected"

  // Group config fields by section
  const connectionFields = integration.config.filter((f) =>
    ["apiEndpoint"].includes(f.key)
  )
  const modelFields = integration.config.filter((f) =>
    ["defaultModel", "maxTokens", "temperature"].includes(f.key)
  )
  const promptFields = integration.config.filter((f) =>
    ["systemPrompt"].includes(f.key)
  )

  return (
    <>
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

      {/* Connection Settings */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Connection Settings</h3>
        <p className="text-muted-foreground text-sm">
          Configure the API endpoint and connection details.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 lg:max-w-xl">
        {connectionFields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <Label htmlFor={field.key}>{field.label}</Label>
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
            {field.description && (
              <p className="text-muted-foreground text-xs">{field.description}</p>
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Credentials Section */}
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <Lock className="h-4 w-4" />
          API Credentials
        </h3>
        <p className="text-muted-foreground text-sm">
          Secure API key for authentication. Leave blank to keep existing value.
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

      <Separator />

      {/* Model Settings */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Model Settings</h3>
        <p className="text-muted-foreground text-sm">
          Configure the default model and generation parameters.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 lg:max-w-xl">
        {modelFields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.type === "text" && (
              <Input
                id={field.key}
                defaultValue={field.value as string}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
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
            {field.description && (
              <p className="text-muted-foreground text-xs">{field.description}</p>
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Prompt Configuration */}
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Prompt Configuration</h3>
        <p className="text-muted-foreground text-sm">
          Set the default system prompt for AI requests.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 lg:max-w-xl">
        {promptFields.map((field) => (
          <div key={field.key} className="grid gap-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Textarea
              id={field.key}
              defaultValue={field.value as string}
              placeholder="Enter system prompt"
              rows={4}
            />
            {field.description && (
              <p className="text-muted-foreground text-xs">{field.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" asChild>
          <Link href="/store-admin/integrations">Cancel</Link>
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Changes saved",
              description: `${integration.name} configuration has been updated.`,
            })
          }}
        >
          Save Changes
        </Button>
      </div>
    </>
  )
}
