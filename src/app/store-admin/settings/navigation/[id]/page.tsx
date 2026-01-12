// src/app/store-admin/settings/navigation/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { ContentSection } from '../../components/content-section'
import type { Menu } from '@/data/navigation/schemas'
import { getMenuById } from '@/data/navigation/storage'
import { MenuEditorClient } from './components/menu-editor-client'
import { MenuEditorNotFound } from './not-found'

export default function MenuEditorPage() {
  const params = useParams()
  const id = params.id as string
  const [menu, setMenu] = useState<Menu | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadMenu = () => {
      const foundMenu = getMenuById(id)
      if (foundMenu) {
        setMenu(foundMenu)
      } else {
        setNotFound(true)
      }
      setIsLoading(false)
    }
    loadMenu()
  }, [id])

  if (isLoading) {
    return (
      <ContentSection
        title="Edit Menu"
        desc="Loading menu..."
      >
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </ContentSection>
    )
  }

  if (notFound || !menu) {
    return (
      <ContentSection
        title="Menu Not Found"
        desc="The requested menu could not be found."
      >
        <MenuEditorNotFound />
      </ContentSection>
    )
  }

  return (
    <ContentSection
      title={menu.name}
      desc="Edit menu details and items."
    >
      <MenuEditorClient menu={menu} />
    </ContentSection>
  )
}
