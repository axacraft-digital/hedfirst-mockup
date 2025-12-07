"use client"

import { use, useState, Fragment } from "react"
import Link from "next/link"
import {
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react"
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
import { cn } from "@/lib/utils"

// Order types
type OrderStatus =
  | "pending"
  | "processing"
  | "processed"
  | "shipped"
  | "completed"
  | "canceled"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number // in cents
}

interface PatientOrder {
  id: string
  publicOrderId: string
  patientId: string
  status: OrderStatus
  date: string
  items: OrderItem[]
  total: number // in cents
}

// Mock orders data
const mockOrders: PatientOrder[] = [
  {
    id: "ord_jacob_001",
    publicOrderId: "HF-1129",
    patientId: "usr_pat_jacob",
    status: "processed",
    date: "2024-11-16T10:30:00Z",
    items: [
      {
        id: "item_001",
        name: "CJC/ Ipamorelin 5mL",
        quantity: 1,
        price: 27300,
      },
      {
        id: "item_002",
        name: "Consultation Fee",
        quantity: 1,
        price: 9000,
      },
    ],
    total: 36300,
  },
  {
    id: "ord_jacob_002",
    publicOrderId: "HF-1128",
    patientId: "usr_pat_jacob",
    status: "shipped",
    date: "2024-11-10T14:15:00Z",
    items: [
      {
        id: "item_003",
        name: "CJC/ Ipamorelin 5mL",
        quantity: 1,
        price: 27300,
      },
    ],
    total: 27300,
  },
  {
    id: "ord_jacob_003",
    publicOrderId: "HF-1100",
    patientId: "usr_pat_jacob",
    status: "completed",
    date: "2024-10-01T09:00:00Z",
    items: [
      {
        id: "item_004",
        name: "Telehealth Membership",
        quantity: 1,
        price: 1900,
      },
    ],
    total: 1900,
  },
  // Other patients
  {
    id: "ord_sarah_001",
    publicOrderId: "HF-1050",
    patientId: "usr_pat001",
    status: "processing",
    date: "2024-09-15T11:00:00Z",
    items: [
      {
        id: "item_005",
        name: "Finasteride 1mg (90 day)",
        quantity: 1,
        price: 8500,
      },
    ],
    total: 8500,
  },
]

// Get orders by patient ID
function getOrdersByPatientId(patientId: string): PatientOrder[] {
  return mockOrders
    .filter((o) => o.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
const statusStyles: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  processed: {
    label: "Processed",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  },
  completed: {
    label: "Completed",
    className: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  },
  canceled: {
    label: "Canceled",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
}

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientOrdersPage({ params }: Props) {
  const { id } = use(params)
  const orders = getOrdersByPatientId(id)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (orderId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Orders</h3>
          <p className="text-muted-foreground text-sm">
            Order history for this patient.
          </p>
        </div>
        <Button asChild>
          <Link href={`/store-admin/patients/${id}/orders/new`}>
            <IconPlus className="mr-2 size-4" />
            New Order
          </Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[140px]">Order</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const isExpanded = expandedRows.has(order.id)
                    const statusStyle = statusStyles[order.status]

                    return (
                      <Fragment key={order.id}>
                        <TableRow
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-muted/50",
                            isExpanded && "bg-muted/30"
                          )}
                          onClick={() => toggleRow(order.id)}
                        >
                          <TableCell className="pl-4">
                            <button
                              className="hover:bg-muted rounded p-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleRow(order.id)
                              }}
                            >
                              {isExpanded ? (
                                <IconChevronDown className="size-4" />
                              ) : (
                                <IconChevronRight className="size-4" />
                              )}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-mono font-medium">
                                #{order.publicOrderId}
                              </span>
                              <span className="text-muted-foreground ml-2 text-sm">
                                ({order.items.length} item
                                {order.items.length !== 1 ? "s" : ""})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusStyle.className}
                            >
                              {statusStyle.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(order.date)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(order.total)}
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
                                  <Link
                                    href={`/store-admin/orders/${order.id}`}
                                  >
                                    View Order Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Resend Confirmation
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Issue Refund
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {/* Expanded items */}
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/20 p-0">
                              <div className="divide-y">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between py-3 pl-14 pr-4"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {item.name}
                                      </span>
                                      {item.quantity > 1 && (
                                        <span className="text-muted-foreground text-sm">
                                          x{item.quantity}
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-medium">
                                      {formatCurrency(item.price)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No orders found.
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
