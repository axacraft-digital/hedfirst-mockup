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
import {
  getTreatmentsForUI,
  filterTreatmentsByType,
  type UITreatment,
} from "@/data/treatments"

// Treatment types (derived from UI helper)
type _TreatmentType = UITreatment["type"]
type TreatmentStatus = UITreatment["status"]
type TreatmentTab = "all" | "subscriptions" | "one-time" | "membership"

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

  const allTreatments = getTreatmentsForUI(id)

  const filteredTreatments = useMemo(() => {
    let result = filterTreatmentsByType(allTreatments, activeTab)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          (t.masterOrderId?.toLowerCase().includes(query) ?? false) ||
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
                              {treatment.masterOrderId ?? `#${treatment.id.slice(0, 10)}`}
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
