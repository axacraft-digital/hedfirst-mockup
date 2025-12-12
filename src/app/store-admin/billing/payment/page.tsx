"use client"

import { useState } from "react"
import { IconBrandVisa, IconCreditCard } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"

// Mock data for existing payment methods
const existingCards = [
  {
    id: "card_1",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2026,
    isDefault: true,
  },
]

// Mock data for billing info
const billingInfo = {
  invoiceEmail: "billing@acmehealth.com",
  companyName: "Acme Health Clinic",
  country: "United States",
  address: "123 Medical Center Dr, Suite 400, San Francisco, CA 94102",
}

export default function BillingPaymentPage() {
  const [invoiceEmail, setInvoiceEmail] = useState(billingInfo.invoiceEmail)
  const [companyName, setCompanyName] = useState(billingInfo.companyName)
  const [country, setCountry] = useState(billingInfo.country)
  const [address, setAddress] = useState(billingInfo.address)

  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your subscription and billing details.
          </p>
        </div>
        <Separator className="shadow-sm" />

        <div className="flex max-w-2xl flex-col space-y-6">
          {/* Payment Method Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Payments for your subscription and usage are made using the
                default card.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {existingCards.length > 0 ? (
                <div className="space-y-3">
                  {existingCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        {card.brand === "visa" ? (
                          <IconBrandVisa className="h-8 w-8" />
                        ) : (
                          <IconCreditCard className="h-8 w-8" />
                        )}
                        <div>
                          <p className="font-medium">
                            •••• •••• •••• {card.last4}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Expires {card.expMonth}/{card.expYear}
                          </p>
                        </div>
                      </div>
                      {card.isDefault && (
                        <span className="text-muted-foreground text-sm">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
                  <IconCreditCard className="text-muted-foreground mb-2 h-10 w-10" />
                  <p className="text-muted-foreground text-sm">
                    No payment methods added
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <p className="text-muted-foreground text-sm">
                At most, three credit cards can be added.
              </p>
              <Button>Add Card</Button>
            </CardFooter>
          </Card>

          {/* Invoice Email Recipient Section */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Email Recipient</CardTitle>
              <CardDescription>
                By default, all invoices will be sent to your account&apos;s
                email address. If you want to use a custom email address
                specifically for receiving invoices, enter it here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="invoice-email" className="sr-only">
                  Invoice Email
                </Label>
                <Input
                  id="invoice-email"
                  type="email"
                  placeholder="billing@example.com"
                  value={invoiceEmail}
                  onChange={(e) => setInvoiceEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <p className="text-muted-foreground text-sm">
                Please use 254 characters at maximum.
              </p>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          {/* Company Name Section */}
          <Card>
            <CardHeader>
              <CardTitle>Company Name</CardTitle>
              <CardDescription>
                By default, your account name is shown on your invoice. If you
                want to show a custom name instead, please enter it here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="company-name" className="sr-only">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Your Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-4">
              <p className="text-muted-foreground text-sm">
                Please use 64 characters at maximum.
              </p>
              <Button>Save</Button>
            </CardFooter>
          </Card>

          {/* Billing Address Section */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-address">Billing Address</Label>
                <Input
                  id="billing-address"
                  type="text"
                  placeholder="Find your address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end border-t pt-4">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
