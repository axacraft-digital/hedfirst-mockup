// src/data/navigation/internal-pages.ts

import type { InternalPageOption } from '@/data/navigation/schemas'

export const INTERNAL_PAGE_OPTIONS: InternalPageOption[] = [
  // Store pages
  { label: 'Home', url: '/', category: 'store', icon: 'Home' },
  { label: 'Products', url: '/products', category: 'store', icon: 'Package' },
  { label: 'Collections', url: '/collections', category: 'store', icon: 'Grid3X3' },
  { label: 'About Us', url: '/about', category: 'store', icon: 'Info' },
  { label: 'Contact', url: '/contact', category: 'store', icon: 'Mail' },
  { label: 'Blog', url: '/blog', category: 'store', icon: 'FileText' },

  // Account pages
  { label: 'My Account', url: '/account', category: 'account', icon: 'User' },
  { label: 'My Orders', url: '/account/orders', category: 'account', icon: 'ShoppingBag' },
  { label: 'Messages', url: '/account/messages', category: 'account', icon: 'MessageSquare' },

  // Legal pages
  { label: 'Privacy Policy', url: '/privacy', category: 'legal', icon: 'Shield' },
  { label: 'Terms of Service', url: '/terms', category: 'legal', icon: 'FileText' },
  { label: 'Refund Policy', url: '/refund-policy', category: 'legal', icon: 'RotateCcw' },
]

export const PAGE_CATEGORIES = {
  store: 'Store Pages',
  account: 'Customer Account',
  legal: 'Legal Pages',
} as const
