// src/app/store-admin/settings/navigation/components/menu-list-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'

export function MenuListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Table header skeleton */}
      <div className="flex items-center gap-4 border-b pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      {/* Table rows skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  )
}
