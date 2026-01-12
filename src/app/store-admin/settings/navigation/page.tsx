// src/app/store-admin/settings/navigation/page.tsx

import { MenuListClient } from './components/menu-list-client'

/**
 * Menu List Page — Thin server shell
 *
 * This page is intentionally minimal. All state and interactivity
 * lives in MenuListClient, which handles:
 * - Data fetching from localStorage (client-side only)
 * - Page header with Create button
 * - Table/empty state rendering
 * - Dialog management
 */
export default function NavigationPage() {
  return <MenuListClient />
}
