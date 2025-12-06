"use client"

import Link from "next/link"
import { Building2, Heart, Stethoscope } from "lucide-react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const portals = [
  {
    title: "Patient Portal",
    description: "View orders, prescriptions, and message your provider",
    href: "/patient-admin/dashboard",
    icon: Heart,
    gradient: "from-rose-500/10 to-rose-500/5",
    iconColor: "text-rose-500",
  },
  {
    title: "Provider Portal",
    description: "Review patients, write prescriptions, and manage consultations",
    href: "/provider-admin/dashboard",
    icon: Stethoscope,
    gradient: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    title: "Store Admin",
    description: "Manage orders, patients, products, and store settings",
    href: "/store-admin/dashboard",
    icon: Building2,
    gradient: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-500",
  },
]

export default function PortalPickerPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Teligant</h1>
        <p className="text-muted-foreground">
          Select a portal to view the mockup screens
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
        {portals.map((portal) => (
          <Link key={portal.href} href={portal.href}>
            <Card className="group relative h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <CardHeader className="relative">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${portal.iconColor}`}
                >
                  <portal.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{portal.title}</CardTitle>
                <CardDescription>{portal.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        These are UI mockups for marketing purposes. No real patient data is
        displayed.
      </p>
    </div>
  )
}
