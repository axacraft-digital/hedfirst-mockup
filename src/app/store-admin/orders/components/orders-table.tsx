"use client"

import { Fragment, useState } from "react"
import {
  IconChevronDown,
  IconChevronRight,
  IconMessageCircle,
  IconUser,
  IconTestPipe,
  IconPill,
  IconCalendar,
  IconRefresh,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  type OrderWithPatient,
  type ChildOrder,
  type ChildOrderProductType,
  getItemCount,
  formatCurrency,
  parentStatusInfo,
  childStatusInfo,
} from "../data/orders-types"

interface Props {
  orders: OrderWithPatient[]
}

// Icon mapping for child order types
const productTypeIcons: Record<ChildOrderProductType, typeof IconPill> = {
  SERVICE: IconMessageCircle,
  MEMBERSHIP: IconUser,
  LAB_TEST: IconTestPipe,
  PHYSICAL_PRODUCT: IconPill,
  APPOINTMENT: IconCalendar,
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatShortDate(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

// Child order row component
function ChildOrderRow({ child }: { child: ChildOrder }) {
  const Icon = productTypeIcons[child.productType]
  const statusStyle = childStatusInfo[child.status]
  const isRecurring = child.billingCycle !== "ONE_TIME_PAYMENT"

  return (
    <div className="flex items-center justify-between py-2 pl-8 pr-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{child.productName}</span>
            {child.dosages?.strength && (
              <span className="text-muted-foreground text-sm">
                {child.dosages.strength}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={statusStyle.className}>{statusStyle.label}</span>
            {isRecurring && child.nextBillDate && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <IconRefresh className="h-3 w-3" />
                  Next: {formatShortDate(child.nextBillDate)}
                </span>
              </>
            )}
            {child.tracking && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Tracking: {child.tracking.slice(0, 10)}...
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">
          {formatCurrency(child.amount - (child.discount || 0))}
          {isRecurring && (
            <span className="text-muted-foreground text-sm font-normal">
              /{child.billingCycle === "MONTHLY" ? "mo" : child.billingCycle === "ANNUAL" ? "yr" : "cycle"}
            </span>
          )}
        </div>
        {child.discount && child.discount > 0 && (
          <div className="text-sm text-muted-foreground line-through">
            {formatCurrency(child.amount)}
          </div>
        )}
      </div>
    </div>
  )
}

export function OrdersTable({ orders }: Props) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="w-[100px]">Order</TableHead>
            <TableHead className="w-[60px] text-center">Items</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[160px]">Date</TableHead>
            <TableHead className="w-[100px] text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => {
              const isExpanded = expandedRows.has(order.id)
              const hasChildren = order.children && order.children.length > 0
              const itemCount = getItemCount(order)
              const statusStyle = parentStatusInfo[order.status]

              return (
                <Fragment key={order.id}>
                  <TableRow
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      isExpanded && "bg-muted/30"
                    )}
                    onClick={() => hasChildren && toggleRow(order.id)}
                  >
                    <TableCell className="pl-4">
                      {hasChildren && (
                        <button
                          className="p-1 hover:bg-muted rounded"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleRow(order.id)
                          }}
                        >
                          {isExpanded ? (
                            <IconChevronDown className="h-4 w-4" />
                          ) : (
                            <IconChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {order.publicOrderId}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm">
                        {itemCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.patient.firstName} {order.patient.lastName}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {order.patient.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusStyle.variant} className={statusStyle.className}>
                        {statusStyle.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.amount)}
                    </TableCell>
                  </TableRow>

                  {/* Expanded children */}
                  {isExpanded && hasChildren && (
                    <TableRow key={`${order.id}-children`}>
                      <TableCell colSpan={7} className="bg-muted/20 p-0">
                        <div className="divide-y">
                          {order.children!.map((child) => (
                            <ChildOrderRow key={child.id} child={child} />
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
              <TableCell colSpan={7} className="h-24 text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
