// src/app/store-admin/settings/navigation/[id]/not-found.tsx
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MenuEditorNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <FileQuestion className="text-muted-foreground h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">Menu not found</h2>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        The menu you&apos;re looking for doesn&apos;t exist or has been deleted.
      </p>
      <Button asChild className="mt-6">
        <Link href="/store-admin/settings/navigation">
          Back to Navigation
        </Link>
      </Button>
    </div>
  )
}

export default function NotFound() {
  return <MenuEditorNotFound />
}
