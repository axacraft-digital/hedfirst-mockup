"use client"

import Link from "next/link"
import { Building2, Heart, Stethoscope } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
    disabled: true,
  },
  {
    title: "Provider Portal",
    description:
      "Review patients, write prescriptions, and manage consultations",
    href: "/provider-admin/dashboard",
    icon: Stethoscope,
    gradient: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
    disabled: true,
  },
  {
    title: "Store Admin",
    description: "Manage orders, patients, products, and store settings",
    href: "/store-admin/dashboard",
    icon: Building2,
    gradient: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-500",
    disabled: false,
  },
]

function PortalCard({ portal }: { portal: (typeof portals)[number] }) {
  const cardContent = (
    <Card
      className={`group relative h-full overflow-hidden transition-all ${
        portal.disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:shadow-primary/5 hover:shadow-lg"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 transition-opacity ${
          portal.disabled ? "" : "group-hover:opacity-100"
        }`}
      />
      <CardHeader className="relative">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
            portal.disabled
              ? "bg-muted text-muted-foreground"
              : `bg-muted ${portal.iconColor}`
          }`}
        >
          <portal.icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{portal.title}</CardTitle>
        {portal.disabled ? (
          <Badge variant="secondary" className="w-fit text-xs">
            Coming Soon
          </Badge>
        ) : (
          <Badge className="w-fit bg-emerald-500/10 text-xs text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
            Ready to Review
          </Badge>
        )}
        <CardDescription>{portal.description}</CardDescription>
      </CardHeader>
    </Card>
  )

  if (portal.disabled) {
    return <div>{cardContent}</div>
  }

  return <Link href={portal.href}>{cardContent}</Link>
}

export default function PortalPickerPage() {
  return (
    <div className="from-background to-muted/20 flex min-h-svh flex-col items-center justify-center bg-gradient-to-b p-4">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Teligant</h1>
        <p className="text-muted-foreground">
          Select a portal to view the mockup screens
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
        {portals.map((portal) => (
          <PortalCard key={portal.href} portal={portal} />
        ))}
      </div>

      <p className="text-muted-foreground mt-12 text-sm">
        These are UI mockups for marketing purposes. No real patient data is
        displayed.
      </p>
    </div>
  )
}
