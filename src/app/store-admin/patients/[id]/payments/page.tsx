"use client"

import { use } from "react"
import Link from "next/link"
import {
  IconBrandMastercard,
  IconBrandVisa,
  IconCreditCard,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import {
  paymentMethods as allPaymentMethods,
  getPaymentHistoryByPatientId,
  getPaymentMethodsByPatientId,
} from "@/data/payments"
import type { CardBrand, PaymentTransactionStatus } from "@/data/types"

// Card brand display info
const cardBrandInfo: Record<
  CardBrand,
  { label: string; icon: typeof IconCreditCard; color: string }
> = {
  VISA: {
    label: "Visa",
    icon: IconBrandVisa,
    color: "text-blue-600 dark:text-blue-400",
  },
  MASTERCARD: {
    label: "Mastercard",
    icon: IconBrandMastercard,
    color: "text-orange-600 dark:text-orange-400",
  },
  AMEX: {
    label: "American Express",
    icon: IconCreditCard,
    color: "text-sky-600 dark:text-sky-400",
  },
  DISCOVER: {
    label: "Discover",
    icon: IconCreditCard,
    color: "text-amber-600 dark:text-amber-400",
  },
}

// Format expiration date
function formatExpiration(month: number, year: number): string {
  return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`
}

// Check if card is expired or expiring soon
function getExpirationStatus(
  month: number,
  year: number
): "expired" | "expiring" | "valid" {
  const now = new Date()
  const expDate = new Date(year, month - 1) // month is 0-indexed
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

  if (expDate < now) return "expired"
  if (expDate < threeMonthsFromNow) return "expiring"
  return "valid"
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
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(isoString))
}

// Payment status styles
const paymentStatusStyles: Record<
  PaymentTransactionStatus,
  { label: string; className: string }
> = {
  COMPLETED: {
    label: "Processed",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  REFUNDED: {
    label: "Refunded",
    className:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  },
  PARTIALLY_REFUNDED: {
    label: "Partial Refund",
    className:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  },
}

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientPaymentsPage({ params }: Props) {
  const { id } = use(params)
  const paymentMethods = getPaymentMethodsByPatientId(id)
  const paymentHistory = getPaymentHistoryByPatientId(id)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Payments</h3>
          <p className="text-muted-foreground text-sm">
            Payment methods and transaction history for this patient.
          </p>
        </div>
        <Button asChild>
          <Link href={`/store-admin/patients/${id}/payments/add`}>
            <IconPlus className="mr-2 size-4" />
            Add Payment Method
          </Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 space-y-8 px-1.5">
          {/* Payment Methods Section */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Payment Methods</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Card</TableHead>
                    <TableHead className="w-[100px]">Last 4</TableHead>
                    <TableHead className="w-[100px]">Expires</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead>Cardholder</TableHead>
                    <TableHead className="w-[60px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => {
                      const brandInfo = method.cardBrand
                        ? cardBrandInfo[method.cardBrand]
                        : null
                      const BrandIcon = brandInfo?.icon ?? IconCreditCard
                      const expStatus = getExpirationStatus(
                        method.expiryMonth ?? 0,
                        method.expiryYear ?? 0
                      )

                      return (
                        <TableRow key={method.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BrandIcon
                                className={`size-6 ${brandInfo?.color ?? "text-muted-foreground"}`}
                              />
                              <span className="font-medium">
                                {brandInfo?.label ?? "Card"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">
                            •••• {method.lastFour}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                expStatus === "expired"
                                  ? "text-destructive"
                                  : expStatus === "expiring"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-muted-foreground"
                              }
                            >
                              {formatExpiration(
                                method.expiryMonth ?? 0,
                                method.expiryYear ?? 0
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {method.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                >
                                  Default
                                </Badge>
                              )}
                              {expStatus === "expired" && (
                                <Badge variant="destructive">Expired</Badge>
                              )}
                              {expStatus === "expiring" && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                >
                                  Expiring Soon
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {method.cardholderName}
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
                                    href={`/store-admin/patients/${id}/payments/${method.id}`}
                                  >
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                {!method.isDefault && (
                                  <DropdownMenuItem>
                                    Set as Default
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No payment methods found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Payment History Section */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Payment History</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead className="w-[110px]">Date</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Amount
                    </TableHead>
                    <TableHead className="w-[160px]">Method</TableHead>
                    <TableHead className="w-[130px]">Order</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((txn) => {
                      // Look up payment method for card details
                      const paymentMethod = allPaymentMethods.find(
                        (pm) => pm.id === txn.paymentMethodId
                      )
                      const brandInfo = paymentMethod?.cardBrand
                        ? cardBrandInfo[paymentMethod.cardBrand]
                        : null
                      const BrandIcon = brandInfo?.icon ?? IconCreditCard
                      const statusStyle = paymentStatusStyles[txn.status]

                      return (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono text-sm">
                            #{txn.id.slice(0, 20)}...
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(txn.createdAt)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(txn.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BrandIcon
                                className={`size-5 ${brandInfo?.color ?? "text-muted-foreground"}`}
                              />
                              <span className="text-muted-foreground text-sm">
                                ••••{paymentMethod?.lastFour ?? "****"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {txn.orderId ? (
                              <Link
                                href={`/store-admin/orders/${txn.orderId}`}
                                className="font-mono text-sm hover:underline"
                              >
                                {txn.orderId}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusStyle.className}
                            >
                              {statusStyle.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No payment history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
