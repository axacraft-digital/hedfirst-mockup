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
import { AddPharmacyButton } from "./components/add-pharmacy-button"
import { PharmaciesTable } from "./components/pharmacies-table"
import { mockPharmacies as pharmacies } from "@/data"

export default function PharmaciesPage() {
  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
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
              <BreadcrumbPage>Pharmacies</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header row: Title on left, Add button on right */}
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pharmacies</h1>
            <p className="text-muted-foreground text-sm">
              Manage pharmacy partners for prescription fulfillment
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <AddPharmacyButton />
          </div>
        </div>

        {/* Pharmacies table */}
        <PharmaciesTable pharmacies={pharmacies} />
      </div>
    </>
  )
}
