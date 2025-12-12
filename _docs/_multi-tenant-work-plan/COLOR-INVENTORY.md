# Comprehensive Color Inventory

**Created:** 2025-12-11
**Purpose:** Complete inventory of ALL colors used across Teligant/Hedfirst repos with source locations
**Note:** The "primary" blues appear to be Flowbite colors, not standard Tailwind

---

## Summary

| Repo | Color Source | Notes |
|------|--------------|-------|
| Patient Portal | `tailwind.config.ts` | Custom primary palette + extra colors |
| Store Admin | `tailwind.config.ts` | Different primary palette (standard Tailwind blue) |
| Doctor Portal | `tailwind.config.ts` | Same as Store Admin |
| Super Admin | `tailwind.config.ts` | Same as Store Admin |
| Mobile App | `theme.ts` (Shopify Restyle) | Completely different system |
| Email Templates | Inline hex codes | Hardcoded in HTML |

**Critical Finding:** Patient Portal uses different blue values than other portals.

---

## 1. Patient Portal Colors

**Source:** `node-hedfirst-patient/tailwind.config.ts`

### Primary Palette (Flowbite Blue)
| Name | Hex | Usage |
|------|-----|-------|
| `primary-50` | `#EBF5FF` | Light backgrounds |
| `primary-100` | `#E1EFFE` | Hover states |
| `primary-200` | `#C3DDFD` | Borders |
| `primary-300` | `#A4CAFE` | - |
| `primary-400` | `#76A9FA` | - |
| `primary-500` | `#3F83F8` | Secondary actions |
| `primary-600` | `#1C64F2` | Primary buttons |
| `primary-700` | `#1A56DB` | **Main brand color** |
| `primary-800` | `#1E429F` | Dark accents |
| `primary-900` | `#233876` | Very dark |

### Custom Colors
| Name | Hex | Usage |
|------|-----|-------|
| `accent` | `#dcd7fe` | Light purple accent |
| `graphite` | `#222222` | Dark text |
| `plum` | `#7e22ce` | Purple highlight |
| `dark-plum` | `#530e8f` | Dark purple |
| `neutral-dark` | `#444444` | Secondary text |
| `deep-black` | `#010101` | Near black |
| `eerie-black` | `#1F1F1F` | Dark backgrounds |

### Opacity Colors
| Name | Hex | Usage |
|------|-----|-------|
| `dark-16` | `#181e2529` | 16% dark overlay |
| `dark-32` | `#181e2552` | 32% dark overlay |
| `dark-48` | `#181e257a` | 48% dark overlay |
| `dark-49` | `#181e25a3` | 49% dark overlay |
| `dark-64` | `#181e25a3` | 64% dark overlay |
| `light-64` | `#ffffffa3` | 64% white overlay |
| `light-48` | `#ffffff7a` | 48% white overlay |

---

## 2. Store Admin / Doctor Portal / Super Admin Colors

**Source:** `node-hedfirst-frontend/tailwind.config.ts` (identical in all three)

### Primary Palette (Standard Tailwind Blue)
| Name | Hex | Usage |
|------|-----|-------|
| `primary-50` | `#eff6ff` | Light backgrounds |
| `primary-100` | `#dbeafe` | Hover states |
| `primary-200` | `#bfdbfe` | Borders |
| `primary-300` | `#93c5fd` | - |
| `primary-400` | `#60a5fa` | - |
| `primary-500` | `#3b82f6` | Secondary actions |
| `primary-600` | `#2563eb` | Primary buttons |
| `primary-700` | `#1d4ed8` | **Main brand color** |
| `primary-800` | `#1e40af` | Dark accents |
| `primary-900` | `#1e3a8a` | Very dark |

**Note:** No additional custom colors defined. Uses Tailwind defaults for gray, red, green, yellow.

---

## 3. Primary Color Comparison: Patient vs Admin Portals

| Shade | Patient Portal | Admin Portals | Match? |
|-------|---------------|---------------|--------|
| 50 | `#EBF5FF` | `#eff6ff` | **No** |
| 100 | `#E1EFFE` | `#dbeafe` | **No** |
| 200 | `#C3DDFD` | `#bfdbfe` | **No** |
| 300 | `#A4CAFE` | `#93c5fd` | **No** |
| 400 | `#76A9FA` | `#60a5fa` | **No** |
| 500 | `#3F83F8` | `#3b82f6` | **No** |
| 600 | `#1C64F2` | `#2563eb` | **No** |
| 700 | `#1A56DB` | `#1d4ed8` | **No** |
| 800 | `#1E429F` | `#1e40af` | **No** |
| 900 | `#233876` | `#1e3a8a` | **No** |

**Patient Portal uses Flowbite blue palette.**
**Admin Portals use standard Tailwind blue palette.**

---

## 4. Mobile App Colors (React Native)

**Source:** `hedfirst-app/src/providers/theme/theme.ts`

Uses Shopify Restyle theming system (not Tailwind).

### Palette
| Name | Hex | Usage |
|------|-----|-------|
| `primary` | `#007AFF` | iOS system blue |
| `primaryDark` | `#0A84FF` | Dark mode primary |
| `stone/800` | `#282524` | Dark gray |
| `stone/900` | `#1B1917` | Near black |
| `stone/400` | `#77716C` | Medium gray |
| `white` | `#FFFFFF` | White |
| `red` | `#C0392B` | Error/danger |

**Note:** Mobile app uses iOS-style colors, completely different from web.

---

## 5. Email Template Colors

### Patient Portal (`order-summary.html`, `reset-password.html`)

| Hex | Color | Usage |
|-----|-------|-------|
| `#1A56DB` | Primary blue | Buttons, links |
| `#057A55` | Dark green | Success states |
| `#0E9F6E` | Green | Success states |
| `#BCF0DA` | Light green | Success backgrounds |
| `#F3FAF7` | Very light green | Success backgrounds |
| `#111928` | Near black | Primary text |
| `#1F2A37` | Dark gray | Secondary text |
| `#374151` | Gray | Body text |
| `#6B7280` | Medium gray | Muted text |
| `#E5E7EB` | Light gray | Borders |
| `#F9FAFB` | Off-white | Backgrounds |
| `#ffffff` | White | Backgrounds |
| `#000000` | Black | Text |

### Store Admin (`reactivation-email.html`, `reset-password.html`, `store-admin.html`)

| Hex | Color | Usage |
|-----|-------|-------|
| `#1A56DB` | Primary blue | Buttons, links |
| `#111928` | Near black | Primary text |
| `#1F2A37` | Dark gray | Secondary text |
| `#6B7280` | Medium gray | Muted text |
| `#777777` | Gray | Footer text |
| `#E5E7EB` | Light gray | Borders |
| `#f7f7f7` | Off-white | Backgrounds |
| `#F9FAFB` | Off-white | Backgrounds |
| `#ffffff` | White | Backgrounds |
| `#000000` | Black | Text |

---

## 6. CSS Animation Colors

**Source:** `node-hedfirst-frontend/src/app/styles/globals.css`

| Hex | Tailwind Name | Usage |
|-----|---------------|-------|
| `#9CA3AF` | gray-400 | Loading dot pulse start |
| `#D1D5DB` | gray-300 | Loading dot pulse mid |
| `#E5E7EB` | gray-200 | Loading dot pulse end |

---

## 7. Button Theme Colors

**Source:** `node-hedfirst-patient/src/components/buttons/button/button.theme.ts`

Uses Tailwind class names (not hex values):

| Color Key | Tailwind Classes |
|-----------|------------------|
| `primary` | `bg-blue-700`, `hover:bg-blue-600`, `text-blue-700` |
| `white` | `bg-white`, `text-gray-900`, `border-gray-200` |
| `red` | `bg-red-600`, `text-red-700` |
| `dark` | `bg-gray-800`, `text-graphite` |
| `outlined-red` | `text-red-700`, `border-red-700` |
| `outlined-dark` | `text-graphite`, `border-graphite` |

**Note:** Uses `blue-700` not `primary-700` in some places.

---

## 8. Badge/Status Colors

**Source:** `node-hedfirst-patient/src/shared/constants/badge-color.constants.ts`

Semantic color mapping (not hex values):

| Status | Badge Color |
|--------|-------------|
| `warning` | `yellow` |
| `pending` | `yellow` |
| `success` | `green` |
| `danger` | `red` |
| `disabled` | `gray` |
| `unknown` | `gray` |

| Product Type | Badge Color |
|--------------|-------------|
| `CONSULTATION` | `primary` |
| `SUBSCRIPTION_PRESCRIPTION` | `green` |
| `SUBSCRIPTION` | `green` |
| `ONE_TIME_PURCHASE` | `green` |
| `ONE_TIME_PRESCRIPTION` | `green` |
| `MEMBERSHIP` | `purple` |
| `LAB_KIT` | `yellow` |
| `APPOINTMENT` | `primary` |
| `OTHER` | `gray` |

---

## 9. Tailwind Default Colors Used (Not Customized)

These colors are used throughout but come from Tailwind defaults:

### Gray Scale (Tailwind Default)
Used 984+ times in Patient Portal alone.

| Class | Hex (Tailwind Default) |
|-------|------------------------|
| `gray-50` | `#f9fafb` |
| `gray-100` | `#f3f4f6` |
| `gray-200` | `#e5e7eb` |
| `gray-300` | `#d1d5db` |
| `gray-400` | `#9ca3af` |
| `gray-500` | `#6b7280` |
| `gray-600` | `#4b5563` |
| `gray-700` | `#374151` |
| `gray-800` | `#1f2937` |
| `gray-900` | `#111827` |

### Red Scale (Tailwind Default)
Used ~180 times (errors, destructive actions).

### Green Scale (Tailwind Default)
Used ~50 times (success states).

### Yellow Scale (Tailwind Default)
Used ~15 times (warnings).

### Blue Scale (Tailwind Default)
Used ~140 times. **Note:** Sometimes used directly (`blue-700`) instead of `primary-700`.

---

## 10. Flowbite Component Colors

**Source:** `node-hedfirst-frontend/src/components/flowbite/` (custom Flowbite-style components)

These components use Tailwind color classes like:
- `gray-50`, `gray-100`, `gray-200`, `gray-500`, `gray-700`, `gray-900`
- `blue-600`, `blue-700`
- `white`

No hardcoded hex values; relies on Tailwind config.

---

## Key Findings

### 1. Inconsistent Primary Palettes
Patient Portal and Admin Portals use different blue palettes. This could cause visual inconsistency if a user sees both.

### 2. Flowbite vs Tailwind
Patient Portal appears to use Flowbite's blue palette (not standard Tailwind).

### 3. Mobile App is Separate
React Native app uses completely different color system (iOS-style).

### 4. Email Templates are Hardcoded
All email colors are inline hex values, not configurable.

### 5. Mixed Color Reference Styles
Some components use `primary-700`, others use `blue-700` directly.

---

## Recommendations for Multi-Tenant

1. **Unify primary palette** across all web portals
2. **Use CSS variables** for tenant-configurable colors
3. **Email templates** need variable injection system
4. **Mobile app** needs separate theming discussion
5. **Audit `blue-*` vs `primary-*`** usage to ensure consistency

---

## Files Modified for Tenant Colors

| Priority | File | What to Change |
|----------|------|----------------|
| High | `tailwind.config.ts` (all repos) | CSS variables for primary |
| High | Email templates (5 files) | Variable injection |
| Medium | `button.theme.ts` | Use `primary-*` consistently |
| Medium | `globals.css` animation | Use CSS variables |
| Low | Mobile `theme.ts` | Separate discussion |
