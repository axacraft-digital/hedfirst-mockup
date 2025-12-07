"use client"

import { use } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// Subscription detail type
interface SubscriptionDetail {
  id: string
  subscriptionId: string
  patientId: string
  status: "active" | "paused" | "canceled" | "completed"
  product: string
  dosage: string
  refills: number
  quantity: number
  nextBilledDate: string | null
  disease: string
  supply: string
  billingCycle: string
  pharmacy: string
  price: number // in cents
}

// Mock subscription details
const mockSubscriptions: SubscriptionDetail[] = [
  {
    id: "treat_001",
    subscriptionId: "HF-1129-S-1",
    patientId: "usr_pat_jacob",
    status: "canceled",
    product: "CJC/ Ipamorelin 5mL",
    dosage: "CJC-1295 (w/o DAC) 1.2mg + Ipamorelin 2mg",
    refills: 11,
    quantity: 1,
    nextBilledDate: "2024-12-17",
    disease: "Peptide Therapy",
    supply: "30 day",
    billingCycle: "every 30 days",
    pharmacy: "Greenwich",
    price: 27300,
  },
  {
    id: "treat_002",
    subscriptionId: "HF-1128-S-1",
    patientId: "usr_pat_jacob",
    status: "active",
    product: "CJC/ Ipamorelin 5mL",
    dosage: "CJC-1295 (w/o DAC) 1.2mg + Ipamorelin 2mg",
    refills: 11,
    quantity: 1,
    nextBilledDate: "2024-12-17",
    disease: "Peptide Therapy",
    supply: "30 day",
    billingCycle: "every 30 days",
    pharmacy: "Greenwich",
    price: 27300,
  },
  {
    id: "treat_003",
    subscriptionId: "HF-1100-M-1",
    patientId: "usr_pat_jacob",
    status: "active",
    product: "Telehealth Membership",
    dosage: "N/A",
    refills: 0,
    quantity: 1,
    nextBilledDate: "2024-12-01",
    disease: "General Wellness",
    supply: "Monthly",
    billingCycle: "Monthly",
    pharmacy: "N/A",
    price: 1900,
  },
  {
    id: "treat_004",
    subscriptionId: "HF-1050-S-1",
    patientId: "usr_pat001",
    status: "active",
    product: "Finasteride 1mg",
    dosage: "Finasteride 1mg tablet",
    refills: 3,
    quantity: 90,
    nextBilledDate: "2024-12-15",
    disease: "Hair Loss",
    supply: "90 day",
    billingCycle: "every 90 days",
    pharmacy: "Empower",
    price: 8500,
  },
  {
    id: "treat_005",
    subscriptionId: "HF-1045-S-1",
    patientId: "usr_pat002",
    status: "active",
    product: "Semaglutide 0.5mg",
    dosage: "Semaglutide 0.5mg/0.5mL injection",
    refills: 11,
    quantity: 1,
    nextBilledDate: "2024-12-20",
    disease: "Weight Management",
    supply: "30 day",
    billingCycle: "every 30 days",
    pharmacy: "Hallandale",
    price: 34900,
  },
]

// Get subscription by ID
function getSubscriptionById(id: string): SubscriptionDetail | undefined {
  return mockSubscriptions.find((s) => s.id === id)
}

// Format date
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

// Status badge styles
const statusStyles: Record<
  SubscriptionDetail["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  paused: {
    label: "Paused",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  canceled: {
    label: "Canceled",
    className:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  },
  completed: {
    label: "Completed",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  },
}

// Detail row component
function DetailRow({
  label,
  value,
  badge,
}: {
  label: string
  value: string | number
  badge?: { label: string; className: string }
}) {
  return (
    <div className="py-2">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="mt-1 font-medium">
        {badge ? (
          <Badge variant="outline" className={badge.className}>
            {badge.label}
          </Badge>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

interface Props {
  params: Promise<{ id: string; treatmentId: string }>
}

export default function SubscriptionDetailPage({ params }: Props) {
  const { id, treatmentId } = use(params)
  const subscription = getSubscriptionById(treatmentId)

  if (!subscription) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Subscription not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={`/store-admin/patients/${id}/treatments`}>
            Back to treatments
          </Link>
        </Button>
      </div>
    )
  }

  const statusStyle = statusStyles[subscription.status]

  return (
    <div className="flex flex-1 flex-col">
      {/* Back button */}
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/store-admin/patients/${id}/treatments`}>
            <IconArrowLeft className="mr-2 size-4" />
            Back to Subscriptions
          </Link>
        </Button>
      </div>

      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5 lg:max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <DetailRow
                  label="Subscription ID"
                  value={subscription.subscriptionId}
                />
                <DetailRow
                  label="Status"
                  value=""
                  badge={statusStyle}
                />
                <DetailRow label="Product" value={subscription.product} />
                <DetailRow label="Dosage" value={subscription.dosage} />
                <DetailRow label="Refills" value={subscription.refills} />
                <DetailRow label="Quantity" value={subscription.quantity} />
                <DetailRow
                  label="Next billed date"
                  value={
                    subscription.nextBilledDate
                      ? formatDate(subscription.nextBilledDate)
                      : "—"
                  }
                />
                <DetailRow label="Disease" value={subscription.disease} />
                <DetailRow label="Supply" value={subscription.supply} />
                <DetailRow
                  label="Billing cycle"
                  value={subscription.billingCycle}
                />
                <DetailRow label="Pharmacy" value={subscription.pharmacy} />
              </dl>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
