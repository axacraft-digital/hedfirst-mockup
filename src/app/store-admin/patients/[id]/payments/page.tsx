"use client"

import { use } from "react"
import Link from "next/link"
import {
  IconBrandVisa,
  IconBrandMastercard,
  IconCreditCard,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Payment method types
type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "other"
type PaymentStatus = "processed" | "pending" | "failed" | "refunded"

interface PaymentMethod {
  id: string
  patientId: string
  brand: CardBrand
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
  cardholderName: string
}

interface PaymentTransaction {
  id: string
  patientId: string
  transactionId: string
  date: string
  amount: number // in cents
  brand: CardBrand
  last4: string
  orderId: string
  status: PaymentStatus
}

// Mock payment methods data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_001",
    patientId: "usr_pat001",
    brand: "visa",
    last4: "8292",
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
    cardholderName: "Jacob Henderson",
  },
  {
    id: "pm_002",
    patientId: "usr_pat001",
    brand: "mastercard",
    last4: "4521",
    expMonth: 3,
    expYear: 2026,
    isDefault: false,
    cardholderName: "Jacob Henderson",
  },
  {
    id: "pm_003",
    patientId: "usr_pat002",
    brand: "visa",
    last4: "1234",
    expMonth: 8,
    expYear: 2025,
    isDefault: true,
    cardholderName: "Sarah Johnson",
  },
  {
    id: "pm_004",
    patientId: "usr_pat003",
    brand: "amex",
    last4: "3456",
    expMonth: 11,
    expYear: 2026,
    isDefault: true,
    cardholderName: "Michael Thompson",
  },
]

// Mock payment history data
const mockPaymentHistory: PaymentTransaction[] = [
  {
    id: "txn_001",
    patientId: "usr_pat001",
    transactionId: "pt_txn_7cA6a76HXeL4gUnwjTJ4So",
    date: "2025-11-17T10:30:00Z",
    amount: 26488,
    brand: "visa",
    last4: "8292",
    orderId: "HF-1129-S-1",
    status: "processed",
  },
  {
    id: "txn_002",
    patientId: "usr_pat001",
    transactionId: "pt_txn_3x1rnLz9OhszHfb3L7zARH",
    date: "2025-11-16T14:15:00Z",
    amount: 8719,
    brand: "visa",
    last4: "8292",
    orderId: "HF-1129-OTP",
    status: "processed",
  },
  {
    id: "txn_003",
    patientId: "usr_pat001",
    transactionId: "pt_txn_9kLmN2pQrStUvWxYz1234",
    date: "2025-10-17T09:00:00Z",
    amount: 26488,
    brand: "visa",
    last4: "8292",
    orderId: "HF-1129-S-1",
    status: "processed",
  },
  {
    id: "txn_004",
    patientId: "usr_pat001",
    transactionId: "pt_txn_5aBcDeFgHiJkLmNoPqRs",
    date: "2025-09-17T09:00:00Z",
    amount: 26488,
    brand: "mastercard",
    last4: "4521",
    orderId: "HF-1129-S-1",
    status: "processed",
  },
  {
    id: "txn_005",
    patientId: "usr_pat001",
    transactionId: "pt_txn_2TuVwXyZ3AbCdEfGhIjK",
    date: "2025-08-17T09:00:00Z",
    amount: 26488,
    brand: "mastercard",
    last4: "4521",
    orderId: "HF-1129-S-1",
    status: "refunded",
  },
]

// Get payment methods by patient ID
function getPaymentMethodsByPatientId(patientId: string): PaymentMethod[] {
  return mockPaymentMethods.filter((pm) => pm.patientId === patientId)
}

// Get payment history by patient ID
function getPaymentHistoryByPatientId(patientId: string): PaymentTransaction[] {
  return mockPaymentHistory
    .filter((txn) => txn.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Card brand display info
const cardBrandInfo: Record<
  CardBrand,
  { label: string; icon: typeof IconCreditCard; color: string }
> = {
  visa: {
    label: "Visa",
    icon: IconBrandVisa,
    color: "text-blue-600 dark:text-blue-400",
  },
  mastercard: {
    label: "Mastercard",
    icon: IconBrandMastercard,
    color: "text-orange-600 dark:text-orange-400",
  },
  amex: {
    label: "American Express",
    icon: IconCreditCard,
    color: "text-sky-600 dark:text-sky-400",
  },
  discover: {
    label: "Discover",
    icon: IconCreditCard,
    color: "text-amber-600 dark:text-amber-400",
  },
  other: {
    label: "Card",
    icon: IconCreditCard,
    color: "text-muted-foreground",
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
  PaymentStatus,
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
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  refunded: {
    label: "Refunded",
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
                      const brandInfo = cardBrandInfo[method.brand]
                      const BrandIcon = brandInfo.icon
                      const expStatus = getExpirationStatus(
                        method.expMonth,
                        method.expYear
                      )

                      return (
                        <TableRow key={method.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BrandIcon
                                className={`size-6 ${brandInfo.color}`}
                              />
                              <span className="font-medium">
                                {brandInfo.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">
                            •••• {method.last4}
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
                              {formatExpiration(method.expMonth, method.expYear)}
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
                    <TableHead className="w-[100px] text-right">Amount</TableHead>
                    <TableHead className="w-[160px]">Method</TableHead>
                    <TableHead className="w-[130px]">Order</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((txn) => {
                      const brandInfo = cardBrandInfo[txn.brand]
                      const BrandIcon = brandInfo.icon
                      const statusStyle = paymentStatusStyles[txn.status]

                      return (
                        <TableRow key={txn.id}>
                          <TableCell className="font-mono text-sm">
                            #{txn.transactionId.slice(0, 24)}...
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(txn.date)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(txn.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BrandIcon
                                className={`size-5 ${brandInfo.color}`}
                              />
                              <span className="text-muted-foreground text-sm">
                                ••••{txn.last4}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/store-admin/orders/${txn.orderId}`}
                              className="font-mono text-sm hover:underline"
                            >
                              {txn.orderId}
                            </Link>
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
