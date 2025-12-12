"use client"

import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Shield,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { IntegrationDetail } from "../data/integration-details"

interface AISafetyTabProps {
  integration: IntegrationDetail
}

const useCaseLabels: Record<string, { label: string; description: string }> = {
  clinical_documentation: {
    label: "Clinical Documentation",
    description: "Generate SOAP notes, progress notes, and clinical summaries",
  },
  patient_communication: {
    label: "Patient Communication",
    description: "Draft personalized messages and care instructions",
  },
  chart_summarization: {
    label: "Chart Summarization",
    description: "Summarize patient medical history and treatment plans",
  },
  treatment_planning: {
    label: "Treatment Planning",
    description: "Assist with treatment options and care recommendations",
  },
  medication_guidance: {
    label: "Medication Guidance",
    description: "Drug interactions, dosing info, and medication education",
  },
  lab_interpretation: {
    label: "Lab Result Interpretation",
    description: "Analyze lab results and flag abnormal values",
  },
}

const baaConfig = {
  signed: {
    label: "Signed",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  not_required: {
    label: "Not Required",
    icon: XCircle,
    color: "text-gray-500",
  },
}

export function AISafetyTab({ integration }: AISafetyTabProps) {
  const safety = integration.aiSafety

  if (!safety) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          No safety configuration available for this integration.
        </p>
      </div>
    )
  }

  const baaStatus = baaConfig[safety.baaStatus]
  const BaaIcon = baaStatus.icon

  return (
    <>
      {/* HIPAA Compliance */}
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <Shield className="h-4 w-4" />
          HIPAA Compliance
        </h3>
        <p className="text-muted-foreground text-sm">
          Regulatory compliance status for this AI provider.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 lg:max-w-2xl">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <p className="font-medium">HIPAA Compliant</p>
            <p className="text-muted-foreground text-sm">
              Provider meets HIPAA security and privacy requirements
            </p>
          </div>
          <Badge variant={safety.hipaaCompliant ? "default" : "secondary"}>
            {safety.hipaaCompliant ? "Yes" : "No"}
          </Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <p className="font-medium">Business Associate Agreement (BAA)</p>
            <p className="text-muted-foreground text-sm">
              Legal agreement for handling protected health information
            </p>
          </div>
          <div className={`flex items-center gap-2 ${baaStatus.color}`}>
            <BaaIcon className="h-5 w-5" />
            <span className="font-medium">{baaStatus.label}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Cost Controls */}
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <DollarSign className="h-4 w-4" />
          Cost Controls
        </h3>
        <p className="text-muted-foreground text-sm">
          Set spending limits and configure budget alerts.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 lg:max-w-xl">
        <div className="grid gap-2">
          <Label htmlFor="dailyLimit">Daily Spending Limit</Label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              $
            </span>
            <Input
              id="dailyLimit"
              type="number"
              defaultValue={(safety.costControls.dailyLimit / 100).toFixed(2)}
              className="pl-7"
              step="0.01"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Maximum amount to spend per day (resets at midnight UTC)
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="monthlyLimit">Monthly Spending Limit</Label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              $
            </span>
            <Input
              id="monthlyLimit"
              type="number"
              defaultValue={(safety.costControls.monthlyLimit / 100).toFixed(2)}
              className="pl-7"
              step="0.01"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Maximum amount to spend per month (resets on 1st of month)
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="alertThreshold">Alert Threshold</Label>
          <div className="relative">
            <Input
              id="alertThreshold"
              type="number"
              defaultValue={safety.costControls.alertThreshold}
              className="pr-8"
              min="0"
              max="100"
            />
            <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
              %
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            Send alert when spending reaches this percentage of limit
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="alertEmail">Alert Email</Label>
          <Input
            id="alertEmail"
            type="email"
            defaultValue={safety.costControls.alertEmail}
            placeholder="admin@example.com"
          />
          <p className="text-muted-foreground text-xs">
            Email address to receive cost alert notifications
          </p>
        </div>
      </div>

      <Separator />

      {/* Clinical Use Cases */}
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-4 w-4" />
          Approved Clinical Use Cases
        </h3>
        <p className="text-muted-foreground text-sm">
          Select which clinical workflows are authorized to use this AI
          provider.
        </p>
      </div>
      <Separator />

      <div className="grid gap-3 lg:max-w-xl">
        {Object.entries(useCaseLabels).map(([key, { label, description }]) => {
          const isChecked = safety.clinicalUseCases.includes(key)
          return (
            <div
              key={key}
              className="flex items-start space-x-3 rounded-lg border p-3"
            >
              <Checkbox
                id={key}
                defaultChecked={isChecked}
                className="mt-0.5"
              />
              <div className="grid gap-1 leading-none">
                <label
                  htmlFor={key}
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
                <p className="text-muted-foreground text-xs">{description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" asChild>
          <Link href="/store-admin/integrations">Cancel</Link>
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Safety settings saved",
              description:
                "Cost controls and compliance settings have been updated.",
            })
          }}
        >
          Save Changes
        </Button>
      </div>
    </>
  )
}
