// src/data/navigation/storage.ts

import type { Menu } from '@/data/navigation/schemas'
import { MOCK_MENUS } from './mock-menus'
import { MOCK_STORE_ID } from './constants'

const STORAGE_KEY = 'teligant-navigation-menus'

/**
 * Get all menus for the current store.
 *
 * Called from useEffect in client components — never on server.
 * Initializes localStorage with mock data on first access.
 */
export function getMenus(): Menu[] {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    // First visit: seed localStorage with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MENUS))
    return MOCK_MENUS.filter((m) => m.storeId === MOCK_STORE_ID)
  }

  const allMenus: Menu[] = JSON.parse(stored)
  return allMenus.filter((m) => m.storeId === MOCK_STORE_ID)
}

/**
 * Get a single menu by ID.
 */
export function getMenuById(id: string): Menu | undefined {
  const menus = getMenus()
  return menus.find((m) => m.id === id)
}

/**
 * Save a menu (create or update).
 */
export function saveMenu(menu: Menu): void {
  const stored = localStorage.getItem(STORAGE_KEY)
  const allMenus: Menu[] = stored ? JSON.parse(stored) : []

  const existingIndex = allMenus.findIndex((m) => m.id === menu.id)
  if (existingIndex >= 0) {
    allMenus[existingIndex] = menu
  } else {
    allMenus.push(menu)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allMenus))
}

/**
 * Delete a menu by ID.
 */
export function deleteMenu(id: string): void {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return

  const allMenus: Menu[] = JSON.parse(stored)
  const filtered = allMenus.filter((m) => m.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}
