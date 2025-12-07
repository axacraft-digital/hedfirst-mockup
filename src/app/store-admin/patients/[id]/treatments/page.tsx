"use client"

import { use, useState, useMemo, Fragment } from "react"
import Link from "next/link"
import {
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconSearch,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { cn } from "@/lib/utils"

// Treatment types matching the screenshot
type TreatmentType = "subscription" | "one-time" | "membership"
type TreatmentStatus = "active" | "paused" | "canceled" | "completed"
type TreatmentTab = "all" | "subscriptions" | "one-time" | "membership"

interface Treatment {
  id: string
  masterOrderId: string
  patientId: string
  productName: string
  orderDate: string
  billingCycle: string | null
  nextBilledDate: string | null
  status: TreatmentStatus
  value: number // in cents
  type: TreatmentType
  children?: TreatmentChild[]
}

interface TreatmentChild {
  id: string
  productName: string
  status: TreatmentStatus
  value: number
}

// Mock treatments data for Jacob Henderson
const mockTreatments: Treatment[] = [
  {
    id: "treat_001",
    masterOrderId: "#HF-1129",
    patientId: "usr_pat_jacob",
    productName: "CJC/ Ipamorelin 5mL",
    orderDate: "2024-11-16T10:30:00Z",
    billingCycle: "Every 30 days",
    nextBilledDate: null,
    status: "canceled",
    value: 27300,
    type: "subscription",
    children: [
      {
        id: "treat_001_child_001",
        productName: "CJC/ Ipamorelin 5mL - Initial Fill",
        status: "canceled",
        value: 27300,
      },
    ],
  },
  {
    id: "treat_002",
    masterOrderId: "#HF-1128",
    patientId: "usr_pat_jacob",
    productName: "CJC/ Ipamorelin 5mL",
    orderDate: "2024-11-16T09:15:00Z",
    billingCycle: "Every 30 days",
    nextBilledDate: null,
    status: "active",
    value: 27300,
    type: "subscription",
  },
  {
    id: "treat_003",
    masterOrderId: "#HF-1100",
    patientId: "usr_pat_jacob",
    productName: "Telehealth Membership",
    orderDate: "2024-10-01T14:00:00Z",
    billingCycle: "Monthly",
    nextBilledDate: "2024-12-01T00:00:00Z",
    status: "active",
    value: 1900,
    type: "membership",
  },
  // Add some treatments for other patients for testing
  {
    id: "treat_004",
    masterOrderId: "#HF-1050",
    patientId: "usr_pat001",
    productName: "Finasteride 1mg",
    orderDate: "2024-09-15T11:00:00Z",
    billingCycle: "Every 90 days",
    nextBilledDate: "2024-12-15T00:00:00Z",
    status: "active",
    value: 8500,
    type: "subscription",
  },
  {
    id: "treat_005",
    masterOrderId: "#HF-1045",
    patientId: "usr_pat002",
    productName: "Semaglutide 0.5mg",
    orderDate: "2024-08-20T09:30:00Z",
    billingCycle: "Every 30 days",
    nextBilledDate: "2024-12-20T00:00:00Z",
    status: "active",
    value: 34900,
    type: "subscription",
  },
]

// Get treatments by patient ID
function getTreatmentsByPatientId(patientId: string): Treatment[] {
  return mockTreatments.filter((t) => t.patientId === patientId)
}

// Filter treatments by tab
function filterTreatmentsByTab(treatments: Treatment[], tab: TreatmentTab): Treatment[] {
  switch (tab) {
    case "subscriptions":
      return treatments.filter((t) => t.type === "subscription")
    case "one-time":
      return treatments.filter((t) => t.type === "one-time")
    case "membership":
      return treatments.filter((t) => t.type === "membership")
    default:
      return treatments
  }
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
  const date = new Date(isoString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

// Status badge styles
const statusStyles: Record<TreatmentStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  paused: {
    label: "Paused",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  canceled: {
    label: "Canceled",
    className: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  },
  completed: {
    label: "Completed",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  },
}

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientTreatmentsPage({ params }: Props) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState<TreatmentTab>("subscriptions")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const allTreatments = getTreatmentsByPatientId(id)

  const filteredTreatments = useMemo(() => {
    let result = filterTreatmentsByTab(allTreatments, activeTab)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.masterOrderId.toLowerCase().includes(query) ||
          t.productName.toLowerCase().includes(query)
      )
    }

    return result
  }, [allTreatments, activeTab, searchQuery])

  const toggleRow = (treatmentId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(treatmentId)) {
      newExpanded.delete(treatmentId)
    } else {
      newExpanded.add(treatmentId)
    }
    setExpandedRows(newExpanded)
  }

  // Count by type for tabs
  const subscriptionCount = allTreatments.filter((t) => t.type === "subscription").length
  const oneTimeCount = allTreatments.filter((t) => t.type === "one-time").length
  const membershipCount = allTreatments.filter((t) => t.type === "membership").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Treatments</h3>
          <p className="text-muted-foreground text-sm">
            Active prescriptions and treatment plans for this patient.
          </p>
        </div>
      </div>
      <Separator className="my-4" />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TreatmentTab)}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="subscriptions">
            Subscriptions{subscriptionCount > 0 && ` (${subscriptionCount})`}
          </TabsTrigger>
          <TabsTrigger value="one-time">
            One-Time Products{oneTimeCount > 0 && ` (${oneTimeCount})`}
          </TabsTrigger>
          <TabsTrigger value="membership">
            Membership{membershipCount > 0 && ` (${membershipCount})`}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <IconSearch className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search by order ID, patient name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[120px]">Master Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-[120px]">Order/Fill Date</TableHead>
                  <TableHead className="w-[130px]">Billing Cycle</TableHead>
                  <TableHead className="w-[130px]">Next Billed Date</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px] text-right">Value</TableHead>
                  <TableHead className="w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTreatments.length > 0 ? (
                  filteredTreatments.map((treatment) => {
                    const isExpanded = expandedRows.has(treatment.id)
                    const hasChildren = treatment.children && treatment.children.length > 0
                    const statusStyle = statusStyles[treatment.status]

                    return (
                      <Fragment key={treatment.id}>
                        <TableRow
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-muted/50",
                            isExpanded && "bg-muted/30"
                          )}
                          onClick={() => hasChildren && toggleRow(treatment.id)}
                        >
                          <TableCell className="pl-4">
                            {hasChildren && (
                              <button
                                className="hover:bg-muted rounded p-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleRow(treatment.id)
                                }}
                              >
                                {isExpanded ? (
                                  <IconChevronDown className="size-4" />
                                ) : (
                                  <IconChevronRight className="size-4" />
                                )}
                              </button>
                            )}
                          </TableCell>
                          <TableCell className="font-mono font-medium">
                            <Link
                              href={`/store-admin/patients/${id}/treatments/${treatment.id}`}
                              className="text-blue-600 hover:underline dark:text-blue-400"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {treatment.masterOrderId}
                            </Link>
                          </TableCell>
                          <TableCell>{treatment.productName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(treatment.orderDate)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {treatment.billingCycle || "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {treatment.nextBilledDate
                              ? formatDate(treatment.nextBilledDate)
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {treatment.status !== "active" ? (
                              <Badge variant="outline" className={statusStyle.className}>
                                {statusStyle.label}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(treatment.value)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <IconDotsVertical className="size-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/store-admin/patients/${id}/treatments/${treatment.id}`}>
                                    View Order
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Pause Subscription</DropdownMenuItem>
                                <DropdownMenuItem>Cancel Subscription</DropdownMenuItem>
                                <DropdownMenuItem>Process Refill</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {/* Expanded children */}
                        {isExpanded && hasChildren && (
                          <TableRow>
                            <TableCell colSpan={9} className="bg-muted/20 p-0">
                              <div className="divide-y">
                                {treatment.children!.map((child) => {
                                  const childStatusStyle = statusStyles[child.status]
                                  return (
                                    <div
                                      key={child.id}
                                      className="flex items-center justify-between py-3 pl-14 pr-4"
                                    >
                                      <div>
                                        <span className="font-medium">
                                          {child.productName}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <Badge
                                          variant="outline"
                                          className={childStatusStyle.className}
                                        >
                                          {childStatusStyle.label}
                                        </Badge>
                                        <span className="font-medium">
                                          {formatCurrency(child.value)}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No treatments found.
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
