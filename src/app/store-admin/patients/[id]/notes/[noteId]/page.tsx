"use client"

import { use } from "react"
import Link from "next/link"
import { getNoteById } from "@/data"
import { IconArrowLeft, IconTrash } from "@tabler/icons-react"
import { format } from "date-fns"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Props {
  params: Promise<{ id: string; noteId: string }>
}

export default function NoteDetailPage({ params }: Props) {
  const { id, noteId } = use(params)
  const note = getNoteById(noteId)

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

  if (!note) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-muted-foreground">Note not found</p>
        <Button variant="link" asChild className="mt-2">
          <Link href={`/store-admin/patients/${id}/notes`}>Back to notes</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/store-admin/patients/${id}/notes`}>
              <IconArrowLeft className="size-4" />
              <span className="sr-only">Back to notes</span>
            </Link>
          </Button>
          <div>
            <h3 className="text-lg font-medium">{note.title}</h3>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>
                {format(new Date(note.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
              </span>
              <span>•</span>
              <span>{note.createdBy}</span>
              <Badge
                variant="outline"
                className={`text-xs ${getRoleBadgeVariant(note.createdByRole)}`}
              >
                {note.createdByRole}
              </Badge>
            </div>
          </div>
        </div>
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
              <AlertDialogTitle>Delete note?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{note.title}&quot;? This
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
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="-mx-1 px-1.5 lg:max-w-xl">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {note.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
