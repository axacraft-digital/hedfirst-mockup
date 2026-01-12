// src/data/navigation/schemas.ts
import { z } from 'zod'

// ============================================================================
// CORE SCHEMAS (Single Source of Truth)
// ============================================================================

/**
 * Link type enumeration
 */
export const linkTypeSchema = z.enum(['internal', 'external'])

/**
 * Link configuration for a menu item
 *
 * - For 'internal': url is relative path like '/products'
 * - For 'external': url is full URL like 'https://example.com'
 */
export const menuItemLinkSchema = z.object({
  type: linkTypeSchema,
  url: z.string().min(1, 'URL is required'),
  label: z.string().min(1, 'Link label is required'),
})

/**
 * Single navigation item within a menu
 *
 * Note: id uses z.string() (not .uuid()) for mockup readability.
 * Production will enforce UUID format at the database level.
 */
export const menuItemSchema = z.object({
  id: z.string().min(1),
  menuId: z.string().min(1),
  label: z.string().min(1, 'Label is required').max(50, 'Label must be 50 characters or less'),
  link: menuItemLinkSchema.optional(), // Optional — items without links are headers
  order: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * Navigation menu (e.g., "Main Menu", "Footer Menu")
 *
 * Note: id/storeId use z.string() (not .uuid()) for mockup readability.
 * Production will enforce UUID format at the database level.
 */
export const menuSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  handle: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Handle must be lowercase alphanumeric with dashes'),
  items: z.array(menuItemSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * Internal page option for link picker
 * (Not persisted — static configuration data)
 */
export const internalPageOptionSchema = z.object({
  label: z.string(),
  url: z.string(),
  category: z.enum(['store', 'account', 'legal']),
  icon: z.string(),
})

// ============================================================================
// FORM SCHEMAS (Subset for user input validation)
// ============================================================================

export const createMenuSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
})

export const menuItemFormSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50, 'Label must be 50 characters or less'),
  link: menuItemLinkSchema.optional(), // Optional — items without links are valid (headers)
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate URL-safe handle from menu name
 *
 * Rules:
 * 1. Convert to lowercase
 * 2. Replace spaces with dashes
 * 3. Remove non-alphanumeric characters (except dashes)
 * 4. Collapse multiple dashes into single dash
 * 5. Trim leading/trailing dashes
 *
 * Examples:
 * - "Main Menu" → "main-menu"
 * - "Footer Navigation" → "footer-navigation"
 * - "FAQ & Support" → "faq-support"
 * - "  Spaced  Out  " → "spaced-out"
 */
export function generateHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // spaces → dashes
    .replace(/[^a-z0-9-]/g, '')     // remove special chars
    .replace(/-+/g, '-')            // collapse multiple dashes
    .replace(/^-|-$/g, '')          // trim leading/trailing dashes
}

// ============================================================================
// TYPE EXPORTS (Inferred from schemas — NEVER define separately)
// ============================================================================

export type LinkType = z.infer<typeof linkTypeSchema>
export type MenuItemLink = z.infer<typeof menuItemLinkSchema>
export type MenuItem = z.infer<typeof menuItemSchema>
export type Menu = z.infer<typeof menuSchema>
export type InternalPageOption = z.infer<typeof internalPageOptionSchema>
export type CreateMenuInput = z.infer<typeof createMenuSchema>
export type MenuItemFormInput = z.infer<typeof menuItemFormSchema>
