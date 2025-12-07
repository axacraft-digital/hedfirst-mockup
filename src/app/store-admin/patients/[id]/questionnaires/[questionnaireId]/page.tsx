"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  IconArrowLeft,
  IconCalendar,
  IconDownload,
  IconFile,
  IconPencil,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Types
interface FileUpload {
  id: string
  name: string
  size: string
  uploadedDate: string
}

interface QuestionAnswer {
  question: string
  answer: string
}

interface QuestionnaireVersion {
  id: string
  versionNumber: number
  startedDate: string
  completedDate: string
  nextDueDate: string
  status: "completed" | "in_progress"
}

interface QuestionnaireDetail {
  id: string
  patientId: string
  diseaseState: string
  versions: QuestionnaireVersion[]
  primaryGoals: string
  uploads: FileUpload[]
  questions: QuestionAnswer[]
}

// Mock questionnaire details
const mockQuestionnaireDetails: QuestionnaireDetail[] = [
  {
    id: "quest_000",
    patientId: "usr_pat001",
    diseaseState: "Hormone Optimization",
    versions: [
      {
        id: "v1",
        versionNumber: 1,
        startedDate: "2025-11-16",
        completedDate: "2025-11-16",
        nextDueDate: "2026-11-16",
        status: "completed",
      },
    ],
    primaryGoals: `My primary goals are to support recovery, improve energy levels, increase lean muscle mass, and enhance overall body composition. I train consistently and have noticed declining energy and slower recovery over the past year. I've had labs done that show my testosterone is on the lower end of normal, and I'm interested in testosterone replacement therapy to help optimize my hormone levels, improve recovery between workouts, support muscle growth, and restore my energy throughout the day.`,
    uploads: [
      {
        id: "file_001",
        name: "My Premise Health Details 2.pdf",
        size: "20.99 KB",
        uploadedDate: "2025-11-16",
      },
      {
        id: "file_002",
        name: "My Premise Health Details 4.pdf",
        size: "23.32 KB",
        uploadedDate: "2025-11-16",
      },
      {
        id: "file_003",
        name: "My Premise Health Details 3.pdf",
        size: "31.11 KB",
        uploadedDate: "2025-11-16",
      },
      {
        id: "file_004",
        name: "Recent Lab Results.pdf",
        size: "48.79 KB",
        uploadedDate: "2025-11-16",
      },
    ],
    questions: [
      {
        question:
          "Which of the following health and wellness goals are you most interested in?",
        answer:
          "Muscle growth and recovery, Improved sleep quality, Injury recovery and healing, Athletic performance enhancement, Enhanced cognitive function and focus, Increased energy and vitality, Anti-aging and longevity, Stress management and mood",
      },
      {
        question: "Have you used testosterone replacement therapy before?",
        answer: "No, this is my first time considering TRT",
      },
      {
        question:
          "Are you comfortable with self-administering intramuscular injections?",
        answer: "Yes, but I would need instruction",
      },
      {
        question:
          "Do you have experience with any of the following injection-based therapies?",
        answer: "No experience with injections",
      },
      {
        question:
          "Are you currently taking any medications or supplements?",
        answer: "Yes: Multivitamin (one a day), creatine (5g a day)",
      },
      {
        question:
          "Do you currently have or have you been diagnosed with any of these medical conditions?",
        answer: "None of the above",
      },
      {
        question:
          "Do you have any known allergies to medications or injectable substances?",
        answer: "No known allergies",
      },
      {
        question: "What is your current activity level and exercise routine?",
        answer: "Active - exercise 4-5 times per week",
      },
      {
        question:
          "How would you describe your current diet and nutrition approach?",
        answer: "Balanced diet with focus on whole foods",
      },
      {
        question:
          "For women: Are you currently pregnant, trying to become pregnant, or breastfeeding?",
        answer: "Not applicable (I am male)",
      },
      {
        question: "How often do you drink alcohol?",
        answer: "Rarely (special occasions only)",
      },
      {
        question:
          "Do you currently use tobacco or nicotine products (including vaping)?",
        answer: "No",
      },
      {
        question:
          "Have you had any recent surgeries or medical procedures in the past year?",
        answer: "No recent surgeries or procedures",
      },
      {
        question:
          "What is your primary motivation for considering testosterone replacement therapy?",
        answer: "General health optimization and wellness",
      },
      {
        question:
          "Are you currently experiencing any of these concerning symptoms?",
        answer: "None of these",
      },
      {
        question:
          "Is there anything else about your health history, fitness goals, or lifestyle that would be important for your provider to know when considering hormone therapy?",
        answer:
          "I'm very active and work out daily. I've had some minor overuse issues in the past from training, so recovery and injury prevention are important to me. No major medical conditions, but I want to support my body as I continue to train consistently. My energy has been declining over the past year despite consistent training.",
      },
    ],
  },
  {
    id: "quest_001",
    patientId: "usr_pat001",
    diseaseState: "Weight Management",
    versions: [
      {
        id: "v1",
        versionNumber: 1,
        startedDate: "2025-10-01",
        completedDate: "2025-10-01",
        nextDueDate: "2026-10-01",
        status: "completed",
      },
    ],
    primaryGoals: `I'm looking to lose approximately 15-20 pounds while maintaining my current muscle mass. I've tried various diets in the past with limited long-term success. I'm interested in a medically supervised approach to help me achieve sustainable weight loss.`,
    uploads: [],
    questions: [
      {
        question: "What is your current weight?",
        answer: "195 lbs",
      },
      {
        question: "What is your goal weight?",
        answer: "175-180 lbs",
      },
      {
        question: "Have you tried weight loss medications before?",
        answer: "No, this is my first time",
      },
      {
        question: "Do you have any history of eating disorders?",
        answer: "No",
      },
      {
        question: "What diets or weight loss programs have you tried?",
        answer: "Intermittent fasting, low-carb diet, calorie counting",
      },
    ],
  },
]

// Get questionnaire by ID
function getQuestionnaireById(
  questionnaireId: string
): QuestionnaireDetail | undefined {
  return mockQuestionnaireDetails.find((q) => q.id === questionnaireId)
}

// Format date
function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString))
}

interface Props {
  params: Promise<{ id: string; questionnaireId: string }>
}

export default function QuestionnaireDetailPage({ params }: Props) {
  const { id, questionnaireId } = use(params)
  const questionnaire = getQuestionnaireById(questionnaireId)
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  )

  if (!questionnaire) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Questionnaire not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={`/store-admin/patients/${id}/questionnaires`}>
            Back to questionnaires
          </Link>
        </Button>
      </div>
    )
  }

  // Get current version (default to latest)
  const currentVersion =
    questionnaire.versions.find((v) => v.id === selectedVersionId) ||
    questionnaire.versions[questionnaire.versions.length - 1]

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-0.5">
            <Link href={`/store-admin/patients/${id}/questionnaires`}>
              <IconArrowLeft className="size-4" />
              <span className="sr-only">Back to questionnaires</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">
                {questionnaire.diseaseState} Medical Questionnaire
              </h3>
              <Badge
                variant="outline"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
              >
                Completed
              </Badge>
            </div>

            {/* Version selector - cleaner than a dropdown */}
            {questionnaire.versions.length > 1 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-muted-foreground text-sm">Version:</span>
                <div className="flex gap-1">
                  {questionnaire.versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersionId(version.id)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        currentVersion.id === version.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {formatDate(version.completedDate)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meta info */}
            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="flex items-center gap-1">
                <IconCalendar className="size-4" />
                Started: {formatDate(currentVersion.startedDate)}
              </span>
              <span>Completed: {formatDate(currentVersion.completedDate)}</span>
              <span>Next due: {formatDate(currentVersion.nextDueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="space-y-6">
          {/* Primary Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Primary Health Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg border p-4">
                <p className="text-sm leading-relaxed">
                  {questionnaire.primaryGoals}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          {questionnaire.uploads.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Uploaded Documents
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Medical records, lab results, or previous therapy records
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {questionnaire.uploads.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                          <IconFile className="text-muted-foreground size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {file.size} • Uploaded {formatDate(file.uploadedDate)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <IconDownload className="mr-1.5 size-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questions & Answers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Questionnaire Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {questionnaire.questions.map((qa, index) => (
                  <div key={index}>
                    <p className="text-muted-foreground text-sm">
                      {qa.question}
                    </p>
                    <p className="mt-1 font-medium">{qa.answer}</p>
                    {index < questionnaire.questions.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Update Button */}
          <div className="pb-4">
            <Button className="w-full sm:w-auto">
              <IconPencil className="mr-2 size-4" />
              Update questionnaire
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
