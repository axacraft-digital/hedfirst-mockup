import Link from "next/link"
import { IconArrowUpRight, IconCheck } from "@tabler/icons-react"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock data for the current subscription plan
const currentPlan = {
  name: "Pro",
  price: 299,
  content: "$299 / month",
  description: "Billed monthly",
  overview:
    "The Pro plan provides comprehensive telehealth capabilities for growing practices. Enjoy unlimited patient records, multi-provider support, and advanced integrations with leading healthcare platforms.",
  features: [
    "Unlimited patients",
    "Unlimited providers",
    "Priority support",
    "Custom branding",
    "API access",
    "Advanced analytics",
  ],
  additionalResources: [
    "Dedicated account manager",
    "Implementation support",
    "Access to knowledge base",
    "Monthly strategy calls",
  ],
}

export default function BillingPlanPage() {
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

        <div className="flex max-w-3xl flex-col space-y-8">
          {/* Current Plan Card */}
          <div className="w-full max-w-sm">
            <div className="rounded-md border border-blue-500">
              <Card className="w-full border-none">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-blue-700 outline outline-[1px] outline-offset-2 outline-blue-500" />
                      <CardTitle className="text-sm">Current Plan</CardTitle>
                    </div>
                    <Badge className="px-2 py-1 text-xs" variant="outline">
                      {currentPlan.name}
                    </Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="py-3">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-sm">{currentPlan.content}</p>
                    <p className="text-muted-foreground text-xs">
                      {currentPlan.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <h2 className="font-bold">Overview</h2>
            <p className="text-muted-foreground text-sm leading-5">
              {currentPlan.overview}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Features</h2>
              <Button
                className="text-xs font-semibold text-blue-600"
                variant="link"
                asChild
              >
                <Link
                  href="https://www.teligant.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                  <IconArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="border-muted-foreground grid grid-cols-6 gap-4 rounded-md border p-4">
              {currentPlan.features.map((feature) => (
                <div key={feature} className="col-span-3 flex items-center gap-2">
                  <IconCheck size={18} strokeWidth={1.5} />
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Additional Resources</h2>
              <Button
                className="text-xs font-semibold text-blue-600"
                variant="link"
                asChild
              >
                <Link
                  href="https://www.teligant.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                  <IconArrowUpRight />
                </Link>
              </Button>
            </div>
            <div className="border-muted-foreground grid grid-cols-6 gap-4 rounded-md border p-4">
              {currentPlan.additionalResources.map((resource) => (
                <div key={resource} className="col-span-3 flex items-center gap-2">
                  <IconCheck size={18} strokeWidth={1.5} />
                  <p className="text-sm">{resource}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
