"use client"

import { use } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Consultation detail type
type ConsultationStatus = "processed" | "pending" | "scheduled" | "completed" | "canceled"

interface ConsultationDetail {
  id: string
  patientId: string
  masterOrderId: string
  consultationOrderId: string
  date: string
  diseaseState: string
  status: ConsultationStatus
  provider: {
    name: string
    title: string
    npi: string
  }
  consultation: {
    type: string
    price: number // in cents
    duration: string
  }
  payment: {
    subtotal: number
    discount: number
    shipping: number
    tax: number
    total: number
  }
  history: {
    date: string
    event: string
  }[]
}

// Mock consultation details
const mockConsultationDetails: ConsultationDetail[] = [
  {
    id: "consult_001",
    patientId: "usr_pat001",
    masterOrderId: "HF-1129",
    consultationOrderId: "HF-1129-OTP",
    date: "2025-11-16T17:00:00Z",
    diseaseState: "Hormone Optimization",
    status: "processed",
    provider: {
      name: "Dr. Nicole Baldwin",
      title: "MD, Board Certified",
      npi: "1234567890",
    },
    consultation: {
      type: "TRT Consultation",
      price: 9000,
      duration: "30 minutes",
    },
    payment: {
      subtotal: 17900,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 17900,
    },
    history: [
      {
        date: "2025-12-02T14:38:00Z",
        event: "Subscription HF-1129-S-1 canceled",
      },
      {
        date: "2025-11-17T07:44:00Z",
        event: "Subscription HF-1129-S-1 approved",
      },
      {
        date: "2025-11-16T17:00:00Z",
        event: "Order HF-1129 created",
      },
      {
        date: "2025-11-16T17:00:00Z",
        event: "Consultation HF-1129-OTP paid",
      },
    ],
  },
  {
    id: "consult_002",
    patientId: "usr_pat001",
    masterOrderId: "HF-1128",
    consultationOrderId: "HF-1128-OTP",
    date: "2025-11-16T17:00:00Z",
    diseaseState: "Hormone Optimization",
    status: "pending",
    provider: {
      name: "Dr. Nicole Baldwin",
      title: "MD, Board Certified",
      npi: "1234567890",
    },
    consultation: {
      type: "TRT Consultation",
      price: 9000,
      duration: "30 minutes",
    },
    payment: {
      subtotal: 9000,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 9000,
    },
    history: [
      {
        date: "2025-11-16T17:00:00Z",
        event: "Consultation scheduled",
      },
    ],
  },
  {
    id: "consult_003",
    patientId: "usr_pat001",
    masterOrderId: "HF-1100",
    consultationOrderId: "HF-1100-OTP",
    date: "2025-10-01T09:00:00Z",
    diseaseState: "Weight Management",
    status: "completed",
    provider: {
      name: "Dr. Sarah Chen",
      title: "MD, Endocrinology",
      npi: "0987654321",
    },
    consultation: {
      type: "Weight Management Consultation",
      price: 9000,
      duration: "45 minutes",
    },
    payment: {
      subtotal: 9000,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 9000,
    },
    history: [
      {
        date: "2025-10-01T10:00:00Z",
        event: "Consultation completed",
      },
      {
        date: "2025-10-01T09:00:00Z",
        event: "Consultation started",
      },
      {
        date: "2025-09-30T14:00:00Z",
        event: "Consultation HF-1100-OTP paid",
      },
    ],
  },
]

// Get consultation by ID
function getConsultationById(consultationId: string): ConsultationDetail | undefined {
  return mockConsultationDetails.find((c) => c.id === consultationId)
}

// Format currency
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

// Format date
function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(isoString))
}

// Format timestamp
function formatTimestamp(isoString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoString))
}

// Status badge styles
const statusStyles: Record<
  ConsultationStatus,
  { label: string; className: string }
> = {
  processed: {
    label: "Processed",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  completed: {
    label: "Completed",
    className:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  },
  canceled: {
    label: "Canceled",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
}

interface Props {
  params: Promise<{ id: string; consultationId: string }>
}

export default function ConsultationDetailPage({ params }: Props) {
  const { id, consultationId } = use(params)
  const consultation = getConsultationById(consultationId)

  if (!consultation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Consultation not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={`/store-admin/patients/${id}/consultations`}>
            Back to consultations
          </Link>
        </Button>
      </div>
    )
  }

  const statusStyle = statusStyles[consultation.status]

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/store-admin/patients/${id}/consultations`}>
            <IconArrowLeft className="size-4" />
            <span className="sr-only">Back to consultations</span>
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Consultation Details</h3>
            <Badge variant="outline" className={statusStyle.className}>
              {statusStyle.label}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {consultation.diseaseState} • {formatDate(consultation.date)}
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="space-y-6">
          {/* Consultation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consultation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm">Consultation ID</p>
                  <p className="font-mono font-medium">
                    {consultation.consultationOrderId}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Parent Order</p>
                  <Link
                    href={`/store-admin/orders/${consultation.masterOrderId}`}
                    className="font-mono font-medium hover:underline"
                  >
                    #{consultation.masterOrderId}
                  </Link>
                </div>
              </div>

              <Separator />

              <div className="rounded-md border p-4">
                <div className="grid gap-3">
                  <div>
                    <p className="text-muted-foreground text-sm">Type</p>
                    <p className="font-medium">{consultation.consultation.type}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground text-sm">Duration</p>
                      <p>{consultation.consultation.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Price</p>
                      <p className="font-medium">
                        {formatCurrency(consultation.consultation.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-sm">Name</p>
                  <p className="font-medium">{consultation.provider.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Credentials</p>
                  <p>{consultation.provider.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">NPI</p>
                  <p className="font-mono">{consultation.provider.npi}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(consultation.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(consultation.payment.discount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(consultation.payment.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(consultation.payment.tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(consultation.payment.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultation.history.map((item, index) => (
                  <div key={index}>
                    <p className="text-muted-foreground text-sm">
                      {formatTimestamp(item.date)}
                    </p>
                    <p>{item.event}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
