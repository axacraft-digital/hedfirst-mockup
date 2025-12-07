"use client"

import { use } from "react"
import Link from "next/link"
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Payment method detail type
interface PaymentMethodDetail {
  id: string
  patientId: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  cardholderName: string
  billingAddress: {
    street: string
    apartment?: string
    city: string
    state: string
    zipCode: string
    country?: string
  }
  linkedItems: {
    type: "order" | "consultation" | "subscription"
    id: string
    label: string
  }[]
}

// Mock payment method details
const mockPaymentDetails: PaymentMethodDetail[] = [
  {
    id: "pm_001",
    patientId: "usr_pat_jacob",
    brand: "Visa",
    last4: "8292",
    expMonth: 12,
    expYear: 2025,
    cardholderName: "Jacob Henderson",
    billingAddress: {
      street: "2073 N Affirmed Ave",
      apartment: undefined,
      city: "Springfield",
      state: "Missouri",
      zipCode: "65802",
      country: undefined,
    },
    linkedItems: [
      { type: "order", id: "HF-1129", label: "Order #HF-1129" },
      {
        type: "consultation",
        id: "HF-1129-OTP",
        label: "Consultation #HF-1129-OTP",
      },
      {
        type: "subscription",
        id: "HF-1129-S-1",
        label: "Subscription #HF-1129-S-1",
      },
    ],
  },
  {
    id: "pm_002",
    patientId: "usr_pat_jacob",
    brand: "Mastercard",
    last4: "4521",
    expMonth: 3,
    expYear: 2026,
    cardholderName: "Jacob Henderson",
    billingAddress: {
      street: "2073 N Affirmed Ave",
      city: "Springfield",
      state: "Missouri",
      zipCode: "65802",
    },
    linkedItems: [],
  },
]

// Get payment method by ID
function getPaymentMethodById(id: string): PaymentMethodDetail | undefined {
  return mockPaymentDetails.find((pm) => pm.id === id)
}

// Detail row component
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-2">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="mt-1 font-medium">{value || "—"}</dd>
    </div>
  )
}

interface Props {
  params: Promise<{ id: string; paymentId: string }>
}

export default function PaymentMethodDetailPage({ params }: Props) {
  const { id, paymentId } = use(params)
  const paymentMethod = getPaymentMethodById(paymentId)

  if (!paymentMethod) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Payment method not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={`/store-admin/patients/${id}/payments`}>
            Back to payment methods
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Back button */}
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/store-admin/patients/${id}/payments`}>
            <IconArrowLeft className="mr-2 size-4" />
            Back to Payment Methods
          </Link>
        </Button>
      </div>

      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 space-y-6 px-1.5 lg:max-w-xl">
          {/* Linked Items */}
          {paymentMethod.linkedItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  This payment method is used for
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {paymentMethod.linkedItems.map((item) => (
                    <li
                      key={item.id}
                      className="text-muted-foreground text-sm"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <DetailRow
                  label="Full name (as displayed on card)"
                  value={paymentMethod.cardholderName}
                />
                <DetailRow
                  label="Card number"
                  value={`**** **** **** ${paymentMethod.last4}`}
                />
                <DetailRow label="CVC" value="***" />
                <DetailRow
                  label="Expiration date"
                  value={`${paymentMethod.expMonth.toString().padStart(2, "0")}/${paymentMethod.expYear.toString().slice(-2)}`}
                />
              </dl>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Billing address</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <DetailRow
                  label="Street address"
                  value={paymentMethod.billingAddress.street}
                />
                <DetailRow
                  label="Apartment, suite, etc. (optional)"
                  value={paymentMethod.billingAddress.apartment || "—"}
                />
                <DetailRow label="City" value={paymentMethod.billingAddress.city} />
                <DetailRow label="State" value={paymentMethod.billingAddress.state} />
                <DetailRow
                  label="ZIP code"
                  value={paymentMethod.billingAddress.zipCode}
                />
                <DetailRow
                  label="Country"
                  value={paymentMethod.billingAddress.country || "—"}
                />
              </dl>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3 pb-8">
            <Button variant="outline" asChild>
              <Link
                href={`/store-admin/patients/${id}/payments/${paymentId}/edit`}
              >
                <IconEdit className="mr-2 size-4" />
                Edit payment details
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <IconTrash className="mr-2 size-4" />
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove payment method?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove this {paymentMethod.brand}{" "}
                    card ending in {paymentMethod.last4}?
                    {paymentMethod.linkedItems.length > 0 && (
                      <>
                        {" "}
                        This will affect {paymentMethod.linkedItems.length}{" "}
                        linked item
                        {paymentMethod.linkedItems.length > 1 ? "s" : ""}.
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
