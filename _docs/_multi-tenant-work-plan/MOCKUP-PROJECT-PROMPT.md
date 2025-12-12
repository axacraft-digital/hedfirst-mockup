# Prompt for hedfirst-mockup Project

**Created:** 2025-12-12
**Purpose:** Context handoff to start building the Store Branding Configuration page
**Target Project:** `/Users/kellysmith/Projects/hedfirst-mockup`

---

## Copy This Prompt to the hedfirst-mockup Claude Session

---

I need to create a new page in the Store Admin portal: **Store Branding Configuration**.

## Background

Our production team has built a multi-tenant branding system. Each store can have its own brand colors and logos. The backend API and CSS variable injection are done. Now we need an admin UI where store administrators can configure their branding.

## What the Page Should Do

This is a **settings page** where store admins configure:

1. **Store Identity** (read-only display for context)
   - Store name

2. **Primary Color** (editable)
   - Single color picker input
   - System auto-generates full 50-900 palette from this base color
   - Live preview of generated palette (10 color swatches)

3. **Logo Uploads** (editable)
   - Primary logo (for light backgrounds)
   - White logo (for dark backgrounds)
   - Favicon
   - Each with upload button + preview

4. **Live Component Preview**
   - Show how the colors affect real UI elements
   - Display: Button (filled), Button (outlined), Active tab, Checkbox, Progress bar
   - Updates live as color changes

## Important: What "Primary Color" Means

The **primary color** controls brand accent elements:
- Buttons (filled)
- Links
- Active/selected states (tabs, checkboxes, radio buttons)
- Focus rings
- Progress indicators

It does NOT control:
- Body text (uses gray scale)
- Form input borders (uses gray)
- Card borders (uses gray)
- Backgrounds (uses gray/white)
- Error states (uses red)
- Success states (uses green)

These remain consistent across all tenants using Tailwind defaults.

## Page Location

Create at: `/store-admin/settings/branding`

Add to the Store Admin sidebar under a "Settings" section if one doesn't exist.

## Wireframe Reference

```
┌─────────────────────────────────────────────────────────────┐
│ Store Branding Configuration                                │
│ Configure your store's visual identity                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ IDENTITY                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Store Name: Hedfirst                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ PRIMARY COLOR                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Base Color: [#1A56DB] [color picker]                    │ │
│ │                                                         │ │
│ │ Generated Palette:                                      │ │
│ │ ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐    │ │
│ │ │ 50 │100 │200 │300 │400 │500 │600 │700 │800 │900 │    │ │
│ │ └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘    │ │
│ │ (swatches showing generated colors with hex values)     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ LOGOS                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Primary Logo     White Logo        Favicon              │ │
│ │ ┌──────────┐    ┌──────────┐      ┌──────────┐         │ │
│ │ │  preview │    │  preview │      │  preview │         │ │
│ │ │          │    │ (dark bg)│      │  16x16   │         │ │
│ │ └──────────┘    └──────────┘      └──────────┘         │ │
│ │ [Upload]        [Upload]          [Upload]              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ PREVIEW                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ See how your brand colors appear in the interface       │ │
│ │                                                         │ │
│ │ [Primary Button]  [Outlined Button]                     │ │
│ │                                                         │ │
│ │ Tab One | Tab Two | Tab Three    (Tab Two active)       │ │
│ │                                                         │ │
│ │ ☑ Selected checkbox   ○ Radio option (selected)         │ │
│ │ ☐ Unselected          ○ Radio option                    │ │
│ │                                                         │ │
│ │ Progress: [████████░░░░░░░░] 60%                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                              [Cancel]  [Save Changes]       │
└─────────────────────────────────────────────────────────────┘
```

## Technical Notes

### Color Palette Generation

For generating the 50-900 palette from a single base color, you can use:
- A library like `chroma-js`
- Or hardcode a simple algorithm that lightens/darkens the base

The base color typically maps to the 600 or 700 shade. Lighter shades (50-400) are tints, darker shades (800-900) are shades.

### Mock Data

Use this as the initial state:

```typescript
const mockBrandingConfig = {
  identity: {
    name: "Hedfirst",
  },
  colors: {
    primary: {
      base: "#1A56DB",  // The editable input
      // Generated palette (computed from base):
      50: "#EBF5FF",
      100: "#E1EFFE",
      200: "#C3DDFD",
      300: "#A4CAFE",
      400: "#76A9FA",
      500: "#3F83F8",
      600: "#1C64F2",
      700: "#1A56DB",
      800: "#1E429F",
      900: "#233876",
    },
  },
  logos: {
    primary: "/tenants/hedfirst/logo.svg",
    white: "/tenants/hedfirst/logo-white.svg",
    favicon: "/tenants/hedfirst/favicon.ico",
  },
};
```

### Shadcn Components to Use

- `Card` — for each section
- `Input` — for color hex input
- `Button` — for actions and preview
- `Tabs` — for preview section
- `Checkbox` — for preview
- `Progress` — for preview
- `Label` — for form fields

### This is a Mockup

- No actual API calls needed
- No actual file uploads needed (just show the UI)
- State can be local React state
- Focus on visual polish for screenshots

## Reference

The production implementation details are documented in:
`/Users/kellysmith/Projects/teligant-prod/_docs/_multi-tenant-work-plan/TENANT-BRANDING-IMPLEMENTATION.md`

But you don't need to read that — this prompt contains everything needed for the mockup.

---

## End of Prompt

---
