"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { IconCheck, IconX } from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
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
import { getPatientDetailById } from "./data/patient-detail-data"
import { formatHeight, formatWeight } from "./data/patient-detail-types"

interface Props {
  params: Promise<{ id: string }>
}

// Reusable field display component
function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="py-2">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  )
}

// Section wrapper component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Separator />
      <dl className="grid gap-1">{children}</dl>
    </section>
  )
}

export default function PatientOverviewPage({ params }: Props) {
  const { id } = use(params)
  const patient = getPatientDetailById(id)

  if (!patient) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Patient not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/store-admin/patients">Back to patients</Link>
        </Button>
      </div>
    )
  }

  const { generalInfo, healthInfo, demographicInfo, healthRiskFactors, healthcareInfo, emergencyContact, shippingAddress, idVerification } = patient

  return (
    <div className="flex flex-1 flex-col">
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 space-y-8 px-1.5 pt-4 lg:max-w-xl">
          {/* General Information */}
          <Section title="General Information">
            <Field label="First Name" value={generalInfo.firstName} />
            <Field label="Last Name" value={generalInfo.lastName} />
            <Field
              label="Date of Birth"
              value={new Date(generalInfo.dateOfBirth).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            />
            <Field label="Email" value={generalInfo.email} />
            <Field label="Phone Number" value={generalInfo.phone} />
            <Field label="Sex at Birth" value={generalInfo.sexAtBirth} />
            <Field label="Race/Ethnicity" value={generalInfo.raceEthnicity} />
            <Field label="Primary language spoken" value={generalInfo.primaryLanguage} />
            <Field label="Preferred language for medical communication" value={generalInfo.preferredMedicalLanguage} />
            <Field label="Preferred contact method" value={generalInfo.preferredContactMethod} />
            <Field label="Assigned Provider" value={generalInfo.assignedProviderName} />

            {/* Subscription status */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-1.5">
                {generalInfo.emailSubscribed ? (
                  <IconCheck className="size-4 text-green-600" />
                ) : (
                  <IconX className="text-muted-foreground size-4" />
                )}
                <span className={generalInfo.emailSubscribed ? "text-green-600" : "text-muted-foreground"}>
                  Email {generalInfo.emailSubscribed ? "subscribed" : "not subscribed"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {generalInfo.smsSubscribed ? (
                  <IconCheck className="size-4 text-green-600" />
                ) : (
                  <IconX className="text-muted-foreground size-4" />
                )}
                <span className={generalInfo.smsSubscribed ? "text-green-600" : "text-muted-foreground"}>
                  SMS {generalInfo.smsSubscribed ? "subscribed" : "not subscribed"}
                </span>
              </div>
            </div>
          </Section>

          {/* Health Information */}
          <Section title="Health Information">
            <Field label="Height" value={formatHeight(healthInfo.heightFeet, healthInfo.heightInches)} />
            <Field label="Weight" value={formatWeight(healthInfo.weightLbs)} />
            <Field label="BMI" value={healthInfo.bmi.toString()} />
          </Section>

          {/* Social & Demographic Information */}
          <Section title="Social & Demographic Information">
            <Field label="Education Level" value={demographicInfo.educationLevel} />
            <Field label="Employment Status" value={demographicInfo.employmentStatus} />
            <Field label="Marital Status" value={demographicInfo.maritalStatus} />
            <Field label="Household Size" value={`${demographicInfo.householdSize} person(s)`} />
            <Field label="Primary Occupation" value={demographicInfo.primaryOccupation} />
          </Section>

          {/* Health Risk Factors */}
          <Section title="Health Risk Factors">
            <Field label="Nicotine Usage" value={healthRiskFactors.nicotineUsage} />
            <Field label="Nicotine Frequency" value={healthRiskFactors.nicotineFrequency} />
            <Field label="Nicotine Type" value={healthRiskFactors.nicotineType} />
            <Field label="Alcohol Use" value={healthRiskFactors.alcoholUse} />
            <Field label="Alcohol Frequency" value={healthRiskFactors.alcoholFrequency} />
          </Section>

          {/* Healthcare Information */}
          <Section title="Healthcare Information">
            <Field label="Most Recent Primary Care Provider" value={healthcareInfo.mostRecentPrimaryCareProvider} />
            <Field label="Provider Name" value={healthcareInfo.providerName} />
            <Field label="Provider Email" value={healthcareInfo.providerEmail} />
            <Field label="Provider Phone" value={healthcareInfo.providerPhone} />
            <Field label="Preferred Local Pharmacy" value={healthcareInfo.preferredLocalPharmacy} />
            <Field label="Pharmacy Address" value={healthcareInfo.pharmacyAddress} />
            <Field label="Allergies or Substances" value={healthcareInfo.allergiesOrSubstances} />
          </Section>

          {/* Emergency Contact */}
          <Section title="Emergency Contact">
            <Field label="Name" value={emergencyContact?.name} />
            <Field label="Relationship" value={emergencyContact?.relationship} />
            <Field label="Phone Number" value={emergencyContact?.phone} />
          </Section>

          {/* Shipping Address */}
          <Section title="Shipping Address">
            <Field label="Street address" value={shippingAddress.streetAddress} />
            <Field label="Apartment, suite, etc." value={shippingAddress.apartment} />
            <Field label="City" value={shippingAddress.city} />
            <Field label="State" value={shippingAddress.state} />
            <Field label="Zip Code" value={shippingAddress.zipCode} />
            <Field label="Country" value={shippingAddress.country} />
          </Section>

          {/* ID Verification */}
          <Section title="ID Verification">
            <div className="grid gap-4">
              {idVerification.selfiePhoto && (
                <div className="overflow-hidden rounded-lg border">
                  <Image
                    src={idVerification.selfiePhoto}
                    alt="Patient selfie"
                    width={400}
                    height={300}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
              {idVerification.idFrontPhoto && (
                <div className="overflow-hidden rounded-lg border">
                  <Image
                    src={idVerification.idFrontPhoto}
                    alt="ID front"
                    width={400}
                    height={250}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
              {idVerification.idBackPhoto && (
                <div className="overflow-hidden rounded-lg border">
                  <Image
                    src={idVerification.idBackPhoto}
                    alt="ID back"
                    width={400}
                    height={250}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
              {!idVerification.selfiePhoto && !idVerification.idFrontPhoto && !idVerification.idBackPhoto && (
                <p className="text-muted-foreground">No ID verification documents uploaded</p>
              )}
            </div>
          </Section>

          {/* Actions */}
          <section className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400">Deactivate Account</h3>
                <p className="text-muted-foreground text-sm">
                  This will deactivate the patient&apos;s account and cancel all active subscriptions.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Deactivate account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will deactivate {generalInfo.firstName} {generalInfo.lastName}&apos;s account.
                      All active subscriptions will be canceled. This action can be reversed by reactivating the account.
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
          </section>

          {/* Edit patient details link */}
          <div className="flex items-center gap-4 pb-8">
            <Button variant="outline" asChild>
              <Link href={`/store-admin/patients/${id}/edit`}>
                Edit patient details
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
