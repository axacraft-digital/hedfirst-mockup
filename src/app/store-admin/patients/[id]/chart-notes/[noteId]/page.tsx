"use client"

import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconUser,
  IconStethoscope,
  IconClipboardCheck,
  IconPrescription,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
import { getChartNoteById, getChartNoteProviderName } from "@/data"

interface Props {
  params: Promise<{ id: string; noteId: string }>
}

export default function ChartNoteDetailPage({ params }: Props) {
  const { id, noteId } = use(params)
  const note = getChartNoteById(noteId)

  if (!note) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Chart note not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={`/store-admin/patients/${id}/chart-notes`}>
            Back to chart notes
          </Link>
        </Button>
      </div>
    )
  }

  const providerName = getChartNoteProviderName(note)

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/store-admin/patients/${id}/chart-notes`}>
              <IconArrowLeft className="size-4" />
              <span className="sr-only">Back to chart notes</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">SOAP Note</h3>
              <Badge variant="outline">Chart Note</Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>
                {format(new Date(note.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
              </span>
              <span>•</span>
              <span>{providerName}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Content */}
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 space-y-6 px-1.5 lg:max-w-3xl">
          {/* Subjective */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconUser className="size-5 text-blue-600" />
                Subjective
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  Chief Complaint
                </p>
                <p className="text-sm font-medium">
                  {note.subjective.chiefComplaint}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  History of Present Illness
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {note.subjective.historyOfPresentIllness}
                </p>
              </div>
              {note.subjective.reviewOfSystems && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                    Review of Systems
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {note.subjective.reviewOfSystems}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Objective */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconStethoscope className="size-5 text-green-600" />
                Objective
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {note.objective.vitalSigns && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                    Vital Signs
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {note.objective.vitalSigns}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  Physical Exam / Observations
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {note.objective.physicalExam}
                </p>
              </div>
              {note.objective.labResults && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                    Lab Results
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {note.objective.labResults}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconClipboardCheck className="size-5 text-amber-600" />
                Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {note.assessment.diagnoses.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                    Diagnoses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {note.assessment.diagnoses.map((diagnosis, index) => (
                      <Badge key={index} variant="secondary">
                        {diagnosis}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {note.assessment.differentialDiagnoses.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                    Differential Diagnoses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {note.assessment.differentialDiagnoses.map((diagnosis, index) => (
                      <Badge key={index} variant="outline">
                        {diagnosis}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  Clinical Impression
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {note.assessment.clinicalImpression}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconPrescription className="size-5 text-purple-600" />
                Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {note.plan.medications.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                    Medications
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    {note.plan.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  Instructions
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {note.plan.instructions}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                  Follow-Up
                </p>
                <p className="text-sm">{note.plan.followUp}</p>
              </div>
              {note.plan.referrals && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
                    Referrals
                  </p>
                  <p className="text-sm">{note.plan.referrals}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-8">
            <Button variant="outline" asChild>
              <Link href={`/store-admin/patients/${id}/chart-notes/${noteId}/edit`}>
                <IconEdit className="mr-2 size-4" />
                Edit Note
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                >
                  <IconTrash className="mr-2 size-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete chart note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this SOAP note from{" "}
                    {format(new Date(note.createdAt), "MMMM dd, yyyy")}? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
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
