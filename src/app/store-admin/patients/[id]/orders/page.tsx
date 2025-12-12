"use client"

import { Fragment, use, useState } from "react"
import Link from "next/link"
import { mockOrders } from "@/data"
import {
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { cn } from "@/lib/utils"
import type { Order, OrderStatus } from "@/data/types"

// Get orders by patient ID
function getOrdersByPatientId(patientId: string): Order[] {
  return mockOrders
    .filter((o) => o.userId === patientId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
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

// Status badge styles (maps to centralized OrderStatus type)
const statusStyles: Record<OrderStatus, { label: string; className: string }> =
  {
    NEW: {
      label: "New",
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    AWAITING_REVIEW: {
      label: "Awaiting Review",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    },
    APPROVED: {
      label: "Approved",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    },
    PAID: {
      label: "Paid",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    SENT_TO_PHARMACY: {
      label: "Sent to Pharmacy",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    ORDER_SHIPPED: {
      label: "Shipped",
      className: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    },
    COMPLETED: {
      label: "Completed",
      className:
        "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
    },
    DENIED: {
      label: "Denied",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    CANCELED: {
      label: "Canceled",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    PAUSED: {
      label: "Paused",
      className:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
    ACTIVE: {
      label: "Active",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    FAILED: {
      label: "Failed",
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
                            "hover:bg-muted/50 cursor-pointer transition-colors",
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
                                ({order.lineItems?.length ?? 0} item
                                {(order.lineItems?.length ?? 0) !== 1
                                  ? "s"
                                  : ""}
                                )
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusStyle?.className ?? ""}
                            >
                              {statusStyle?.label ?? order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(order.amount)}
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
                                {order.lineItems?.map((item, idx) => (
                                  <div
                                    key={`${order.id}-item-${idx}`}
                                    className="flex items-center justify-between py-3 pr-4 pl-14"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {item.productName}
                                      </span>
                                      {(item.qty ?? 1) > 1 && (
                                        <span className="text-muted-foreground text-sm">
                                          x{item.qty}
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
