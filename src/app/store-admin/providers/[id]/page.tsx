"use client"

import { use, useState } from "react"
import Link from "next/link"
import { getProviderById } from "@/data"
import { IconEdit, IconPencil, IconUpload } from "@tabler/icons-react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Props {
  params: Promise<{ id: string }>
}

// Reusable field display component matching production style
function Field({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="py-2">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  )
}

// Status badge styles
const statusStyles: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  INACTIVE: {
    label: "Inactive",
    className:
      "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
  },
  SUSPENDED: {
    label: "Suspended",
    className:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  PENDING: {
    label: "Pending",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  },
}

export default function ProviderDetailPage({ params }: Props) {
  const { id } = use(params)
  const provider = getProviderById(id)
  const [activeTab, setActiveTab] = useState("overview")

  if (!provider) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Provider not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/store-admin/providers">Back to providers</Link>
        </Button>
      </div>
    )
  }

  const statusStyle = statusStyles[provider.status] ?? statusStyles.INACTIVE

  // Format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="border-muted flex h-auto w-full items-center justify-start gap-0 rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="licenses"
            className="rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            License information
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="rounded-none border-b-2 border-transparent px-4 py-2.5 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Supporting documents
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Consolidated Contact Details + Medical Credentials */}
        <TabsContent
          value="overview"
          className="mt-6 w-full max-w-3xl space-y-6"
        >
          {/* Personal Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Personal details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-0">
                <Field label="First name" value={provider.firstName} />
                <Field label="Last name" value={provider.lastName} />
                <Field label="Email" value={provider.email} />
                <Field label="Phone number" value={provider.phone} />
                <Field
                  label="Street address"
                  value={provider.address?.streetAddress}
                />
                <Field
                  label="Apartment, suite, etc."
                  value={provider.address?.apartment}
                />
                <Field label="City" value={provider.address?.city} />
                <Field label="State" value={provider.address?.state} />
                <Field label="ZIP code" value={provider.address?.zipCode} />
              </dl>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardContent className="pt-6">
              <dl className="grid gap-0">
                <div className="py-2">
                  <dt className="text-muted-foreground text-sm">Status</dt>
                  <dd className="mt-1">
                    <Badge
                      variant="outline"
                      className={cn("font-normal", statusStyle.className)}
                    >
                      {statusStyle.label}
                    </Badge>
                  </dd>
                </div>
                <Field
                  label="Added on"
                  value={formatDate(provider.createdAt)}
                />
                <Field
                  label="Last login"
                  value={formatDate(provider.lastLoginAt)}
                />
              </dl>
            </CardContent>
          </Card>

          {/* Medical Qualifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Medical qualifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-0">
                <Field label="Medical degree" value={provider.degree?.name} />
                <Field label="Specialty" value={provider.speciality?.name} />
                <Field
                  label="NPI number"
                  value={provider.doctorCredential?.npiNumber}
                />
                <Field
                  label="DEA number"
                  value={provider.doctorCredential?.deaNumber}
                />
                <Field
                  label="Board certifications"
                  value={provider.doctorCredential?.boardCertification}
                />
              </dl>
            </CardContent>
          </Card>

          {/* Additional Qualifications Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Additional qualifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={
                  provider.additionalQualifications
                    ? "font-medium"
                    : "text-muted-foreground"
                }
              >
                {provider.additionalQualifications || "—"}
              </p>
            </CardContent>
          </Card>

          {/* Edit Button */}
          <Button variant="outline" asChild>
            <Link href={`/store-admin/providers/${id}/edit`}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit credentials
            </Link>
          </Button>

          {/* Deactivate Provider Section */}
          <div className="mt-10 mb-4 flex w-full flex-col items-start justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
            <div className="flex flex-col items-start text-sm">
              <p className="font-bold tracking-wide">Deactivate Provider</p>
              <p className="text-muted-foreground font-medium">
                Remove provider from active rotation. This can be reversed.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-500">
                  Deactivate Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will deactivate {provider.firstName}{" "}
                    {provider.lastName}&apos;s account. They will no longer be
                    able to review patients or prescribe treatments. This action
                    can be reversed by reactivating the account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Deactivate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>

        {/* License Information Tab */}
        <TabsContent value="licenses" className="mt-6 w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                State Licenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {provider.licenses && provider.licenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>State</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {provider.licenses.map((license, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {license.state}
                        </TableCell>
                        <TableCell>{license.licenseNumber}</TableCell>
                        <TableCell>{formatDate(license.expiryDate)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <IconPencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No licenses on file</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supporting Documents Tab */}
        <TabsContent value="documents" className="mt-6 w-full max-w-3xl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Supporting documents
              </CardTitle>
              <Button variant="outline" size="sm">
                <IconUpload className="mr-2 h-4 w-4" />
                Upload document
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Medical License - Texas
                    </TableCell>
                    <TableCell>11/15/2024</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconPencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      DEA Certificate
                    </TableCell>
                    <TableCell>11/15/2024</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconPencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Board Certification
                    </TableCell>
                    <TableCell>11/10/2024</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconPencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
