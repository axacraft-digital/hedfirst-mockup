"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { IntegrationsPrimaryButtons } from "./components/integrations-primary-buttons"
import type { ValidationStatus } from "./data/integration-details"
import { integrations } from "./data/integrations"

const statusBadgeConfig: Record<
  ValidationStatus,
  { label: string; className: string }
> = {
  connected: {
    label: "Connected",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-400",
  },
  issue: {
    label: "Issue",
    className:
      "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-400",
  },
  not_tested: {
    label: "Not Tested",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  not_connected: {
    label: "Not Connected",
    className: "bg-background shadow-xs dark:bg-input/30 dark:border-input",
  },
}

export default function IntegrationsPage() {
  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
            <p className="text-muted-foreground">
              Manage your third-party integrations here.
            </p>
          </div>
          <IntegrationsPrimaryButtons />
        </div>
        <Separator className="shadow-sm" />
        <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const badge = statusBadgeConfig[integration.status]
            return (
              <li key={integration.name}>
                <Link
                  href={`/store-admin/integrations/${integration.slug}`}
                  className="block h-full rounded-lg border p-4 hover:shadow-md"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-lg p-2">
                      {integration.logo}
                    </div>
                    <span
                      className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm font-medium whitespace-nowrap ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h2 className="font-semibold">{integration.name}</h2>
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${
                          integration.enabled
                            ? "text-green-600 dark:text-green-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            integration.enabled ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {integration.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-gray-500">
                      {integration.desc}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
