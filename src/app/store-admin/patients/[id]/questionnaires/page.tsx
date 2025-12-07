"use client"

import { use, useState } from "react"
import Link from "next/link"
import { IconCheck, IconCopy } from "@tabler/icons-react"
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

// Questionnaire types
type QuestionnaireStatus = "completed" | "in_progress" | "no_purchase"

interface Questionnaire {
  id: string
  patientId: string
  diseaseState: string
  status: QuestionnaireStatus
  startedDate: string | null
  completedDate: string | null
  rxExpireDate: string | null
  questionnaireLink: string
}

// All available disease states (subset for mockup)
const diseaseStates = [
  "Peptide Therapy",
  "Weight Management",
  "Hair Growth",
  "Sexual Wellness",
  "Hormone Therapy",
  "Sleep/Insomnia",
  "Mental Health",
  "Skin Care",
  "Athletic Performance and Recovery",
  "Longevity",
  "Thyroid Function",
  "Diabetes Management",
  "Cardiovascular Health",
  "Pain Management",
  "General Health",
]

// Mock questionnaire data - generates full list with some completed
function generateQuestionnaires(patientId: string): Questionnaire[] {
  return diseaseStates.map((diseaseState, index) => {
    // Make Peptide Therapy and Weight Management completed for our demo patient
    const isCompleted =
      patientId === "usr_pat001" &&
      (diseaseState === "Peptide Therapy" || diseaseState === "Weight Management")

    const isPeptide = diseaseState === "Peptide Therapy"
    const isWeight = diseaseState === "Weight Management"

    return {
      id: `quest_${index.toString().padStart(3, "0")}`,
      patientId,
      diseaseState,
      status: isCompleted ? "completed" : "no_purchase",
      startedDate: isPeptide ? "2025-11-16" : isWeight ? "2025-10-01" : null,
      completedDate: isPeptide ? "2025-11-16" : isWeight ? "2025-10-01" : null,
      rxExpireDate: isPeptide ? "2026-11-16" : isWeight ? "2026-10-01" : null,
      questionnaireLink: `https://app.hedfirst.com/questionnaire/${diseaseState.toLowerCase().replace(/\s+/g, "-")}`,
    }
  })
}

// Format date
function formatDate(dateString: string | null): string {
  if (!dateString) return "—"
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString))
}

// Status display
const statusStyles: Record<
  QuestionnaireStatus,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  no_purchase: {
    label: "No purchase",
    className:
      "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  },
}

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientQuestionnairesPage({ params }: Props) {
  const { id } = use(params)
  const questionnaires = generateQuestionnaires(id)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyLink = async (questionnaire: Questionnaire) => {
    try {
      await navigator.clipboard.writeText(questionnaire.questionnaireLink)
      setCopiedId(questionnaire.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (_err) {
      // Failed to copy - clipboard API not available
    }
  }

  const completedCount = questionnaires.filter(q => q.status === "completed").length

  return (
    <div className="flex flex-1 flex-col">
      <div>
        <h3 className="text-lg font-medium">Questionnaires</h3>
        <p className="text-muted-foreground text-sm">
          Medical intake questionnaires by disease state.
          {completedCount > 0 && (
            <span className="ml-1">
              {completedCount} completed.
            </span>
          )}
        </p>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disease State</TableHead>
                  <TableHead className="w-[120px]">Started</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Rx Expire</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionnaires.map((questionnaire) => {
                  const statusStyle = statusStyles[questionnaire.status]
                  const isCompleted = questionnaire.status === "completed"
                  const isCopied = copiedId === questionnaire.id

                  return (
                    <TableRow key={questionnaire.id}>
                      <TableCell className="font-medium">
                        {questionnaire.diseaseState}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(questionnaire.startedDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusStyle.className}
                        >
                          {statusStyle.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(questionnaire.rxExpireDate)}
                      </TableCell>
                      <TableCell>
                        {isCompleted ? (
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/store-admin/patients/${id}/questionnaires/${questionnaire.id}`}
                            >
                              Details
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(questionnaire)}
                            className="gap-1.5"
                          >
                            {isCopied ? (
                              <>
                                <IconCheck className="size-4 text-emerald-600" />
                                Copied
                              </>
                            ) : (
                              <>
                                <IconCopy className="size-4" />
                                Copy link
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
