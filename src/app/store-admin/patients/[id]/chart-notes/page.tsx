"use client"

import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  IconPlus,
  IconNotes,
  IconFileText,
  IconProgress,
  IconPhone,
  IconChevronDown,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getChartNotesByPatientId, getChartNoteProviderName } from "@/data"

const chartNoteTypes = [
  {
    type: "soap",
    label: "SOAP Note",
    description: "Structured clinical encounter",
    icon: IconFileText,
  },
  {
    type: "quick",
    label: "Quick Note",
    description: "Brief unstructured note",
    icon: IconNotes,
  },
  {
    type: "progress",
    label: "Progress Note",
    description: "Follow-up status update",
    icon: IconProgress,
  },
  {
    type: "telehealth",
    label: "Phone/Video Encounter",
    description: "Telehealth visit documentation",
    icon: IconPhone,
  },
]

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientChartNotesPage({ params }: Props) {
  const { id } = use(params)
  const chartNotes = getChartNotesByPatientId(id)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Chart Notes</h3>
          <p className="text-muted-foreground text-sm">
            Clinical documentation from encounters with this patient.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <IconPlus className="mr-2 size-4" />
              Add Chart Note
              <IconChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {chartNoteTypes.map((noteType) => (
              <DropdownMenuItem key={noteType.type} asChild>
                <Link
                  href={`/store-admin/patients/${id}/chart-notes/new?type=${noteType.type}`}
                  className="flex cursor-pointer items-start gap-3 py-2"
                >
                  <noteType.icon className="mt-0.5 size-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{noteType.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {noteType.description}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Date</TableHead>
                  <TableHead className="w-[180px]">Provider</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartNotes.length > 0 ? (
                  chartNotes.map((note) => (
                    <TableRow key={note.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link
                          href={`/store-admin/patients/${id}/chart-notes/${note.id}`}
                          className="block"
                        >
                          <div className="font-medium">
                            {format(new Date(note.createdAt), "MMM dd, yyyy")}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {format(new Date(note.createdAt), "h:mm a")}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Link
                          href={`/store-admin/patients/${id}/chart-notes/${note.id}`}
                          className="block"
                        >
                          {getChartNoteProviderName(note)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/store-admin/patients/${id}/chart-notes/${note.id}`}
                          className="block"
                        >
                          {note.subjective.chiefComplaint}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No chart notes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
