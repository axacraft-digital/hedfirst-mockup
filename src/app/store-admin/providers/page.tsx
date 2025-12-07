import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Header } from "@/components/layout/header"
import { mockProviders as providers } from "@/data"
import { AddProviderButton } from "./components/add-provider-button"
import { columns } from "./components/providers-columns"
import { ProvidersTable } from "./components/providers-table"

export default function ProvidersPage() {
  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Breadcrumb and Header */}
        <div className="flex flex-col gap-2">
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
                  <Link href="/store-admin/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Providers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Providers</h1>
              <p className="text-muted-foreground text-sm">
                Manage medical providers and their access
              </p>
            </div>
            <AddProviderButton />
          </div>
        </div>

        {/* Providers Table */}
        <ProvidersTable data={providers} columns={columns} />
      </div>
    </>
  )
}
