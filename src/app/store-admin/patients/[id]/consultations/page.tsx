"use client"

import { use } from "react"
import Link from "next/link"
import { IconDotsVertical } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Consultation types
type ConsultationStatus = "processed" | "pending" | "scheduled" | "completed" | "canceled"

interface Consultation {
  id: string
  patientId: string
  masterOrderId: string
  date: string
  diseaseState: string
  doctor: string
  value: number | null // in cents, null if included
  status: ConsultationStatus
}

// Mock consultations data
const mockConsultations: Consultation[] = [
  {
    id: "consult_001",
    patientId: "usr_pat001",
    masterOrderId: "HF-1129",
    date: "2025-11-16T17:00:00Z",
    diseaseState: "Peptide Therapy",
    doctor: "Nicole Baldwin",
    value: null,
    status: "processed",
  },
  {
    id: "consult_002",
    patientId: "usr_pat001",
    masterOrderId: "HF-1128",
    date: "2025-11-16T17:00:00Z",
    diseaseState: "Peptide Therapy",
    doctor: "Nicole Baldwin",
    value: null,
    status: "pending",
  },
  {
    id: "consult_003",
    patientId: "usr_pat001",
    masterOrderId: "HF-1100",
    date: "2025-10-01T09:00:00Z",
    diseaseState: "Weight Management",
    doctor: "Sarah Chen",
    value: 9000,
    status: "completed",
  },
]

// Get consultations by patient ID
function getConsultationsByPatientId(patientId: string): Consultation[] {
  return mockConsultations
    .filter((c) => c.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Format date
function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(isoString))
}

// Format currency
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
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
  params: Promise<{ id: string }>
}

export default function PatientConsultationsPage({ params }: Props) {
  const { id } = use(params)
  const consultations = getConsultationsByPatientId(id)

  return (
    <div className="flex flex-1 flex-col">
      <div>
        <h3 className="text-lg font-medium">Consultations</h3>
        <p className="text-muted-foreground text-sm">
          Orders that included a consultation with a provider.
        </p>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px]">Master Order</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Disease State</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="w-[100px] text-right">Value</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.length > 0 ? (
                  consultations.map((consultation) => {
                    const statusStyle = statusStyles[consultation.status]

                    return (
                      <TableRow key={consultation.id}>
                        <TableCell>
                          <Link
                            href={`/store-admin/orders/${consultation.masterOrderId}`}
                            className="font-mono font-medium hover:underline"
                          >
                            #{consultation.masterOrderId}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(consultation.date)}
                        </TableCell>
                        <TableCell>{consultation.diseaseState}</TableCell>
                        <TableCell>{consultation.doctor}</TableCell>
                        <TableCell className="text-muted-foreground text-right">
                          {consultation.value
                            ? formatCurrency(consultation.value)
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusStyle.className}
                          >
                            {statusStyle.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                <IconDotsVertical className="size-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/store-admin/patients/${id}/consultations/${consultation.id}`}
                                >
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/store-admin/orders/${consultation.masterOrderId}`}
                                >
                                  View Parent Order
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No consultations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
