"use client"

import { use, useState } from "react"
import Link from "next/link"
import { getNotePreview, getNotesByPatientId } from "@/data"
import { IconPlus } from "@tabler/icons-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientNotesPage({ params }: Props) {
  const { id } = use(params)
  const notes = getNotesByPatientId(id)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")

  const handleSaveNote = () => {
    // In production, this would save to a server
    // For mockup, just close the dialog
    setDialogOpen(false)
    setNoteTitle("")
    setNoteContent("")
  }

  const resetForm = () => {
    setNoteTitle("")
    setNoteContent("")
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Provider":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Admin":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Notes</h3>
          <p className="text-muted-foreground text-sm">
            Quick notes and observations about this patient.
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 size-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
              <DialogDescription>
                Add a quick note to this patient&apos;s record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Follow-up call summary"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Note</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your note here..."
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveNote}
                disabled={!noteTitle || !noteContent}
              >
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[160px]">Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <TableRow
                      key={note.id}
                      className="hover:bg-muted/50 cursor-pointer"
                    >
                      <TableCell>
                        <Link
                          href={`/store-admin/patients/${id}/notes/${note.id}`}
                          className="block"
                        >
                          <div className="font-medium">{note.title}</div>
                          <div className="text-muted-foreground mt-1 text-sm">
                            {getNotePreview(note, 80)}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(note.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">{note.createdBy}</span>
                          <Badge
                            variant="outline"
                            className={`w-fit text-xs ${getRoleBadgeVariant(note.createdByRole)}`}
                          >
                            {note.createdByRole}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No notes found.
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
