# Tenant Branding Implementation Guide

**Created:** 2025-12-12
**Author:** Kelly (documented from Serhii's proof-of-concept)
**Status:** Approved approach, ready for implementation
**Related:** `hedfirst-tenant-config.json`, `store-b-mvp-config.json`, `COLOR-INVENTORY.md`

---

## Overview

This document describes the technical approach for multi-tenant branding, based on Serhii's working proof-of-concept demonstrated on 2025-12-12. The system allows each store to have its own brand colors and logos without code changes or rebuilds.

---

## MVP Scope: What's Configurable

### In Scope

| Category | Field | Purpose |
|----------|-------|---------|
| **Identity** | slug | URL identifier (e.g., `renewell`) |
| | storeId | Database reference |
| | organizationId | Parent org reference |
| | name | Display name |
| **Colors** | primary (50-900) | Full 10-shade brand color palette |
| **Logos** | primary | Main logo (SVG recommended) |
| | white | For dark backgrounds |
| | favicon | Browser tab icon |

### Out of Scope (Future Phases)

- Contact information (email, phone)
- Legal page URLs
- Copyright text
- Navigation structure
- Footer content
- Social media links
- Email template colors
- Content strings / taglines

---

## Understanding "Primary Color"

### What Primary Color Controls

The **primary color** is the brand's main accent color. It communicates "this is interactive" or "this is our brand." It controls:

- **Buttons** — Filled/solid buttons
- **Links** — Text links and hover states
- **Active states** — Selected tabs, checked checkboxes, active radio buttons
- **Focus rings** — Keyboard navigation indicators
- **Progress indicators** — Loading bars, step indicators
- **Accent badges** — Tags indicating selection or action

### What Primary Color Does NOT Control

These elements use **Tailwind's default gray palette** and are consistent across all tenants:

| Element | Typical Classes | Why Not Configurable |
|---------|-----------------|----------------------|
| Body text | `text-gray-900`, `text-gray-700` | Readability/accessibility |
| Secondary text | `text-gray-500`, `text-gray-600` | Hierarchy consistency |
| Form input borders | `border-gray-300` | Standard UI convention |
| Card borders | `border-gray-200` | Visual consistency |
| Page backgrounds | `bg-gray-50`, `bg-gray-100` | Neutral canvas |
| Disabled states | `text-gray-400`, `bg-gray-100` | Accessibility convention |
| Error states | `text-red-600`, `border-red-600` | Universal meaning |
| Success states | `text-green-600`, `border-green-600` | Universal meaning |

### Why No "Secondary" Color?

In design systems, "secondary" typically means outlined buttons or less prominent CTAs. In our implementation:

- Secondary actions use `primary-*` with different treatment (outlined vs filled)
- Neutral actions use `gray-*` classes
- No separate secondary brand color is needed for MVP

If a tenant needs an additional accent color (like Hedfirst's purple `plum` accents), this can be added in a future phase as an optional `accent` color field.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Request Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User visits store URL                                       │
│           ↓                                                     │
│  2. Frontend extracts storeId from URL/subdomain                │
│           ↓                                                     │
│  3. ColorConfigLayout fetches tenant config from API            │
│           ↓                                                     │
│  4. API returns JSON config for that store                      │
│           ↓                                                     │
│  5. Layout injects CSS variables into document.documentElement  │
│           ↓                                                     │
│  6. Tailwind classes (bg-primary-700) resolve to tenant colors  │
│           ↓                                                     │
│  7. Components render with correct brand colors                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Details

### 1. Backend: Tenant Config API

**Location:** `node-hedfirst/src/apps/patient/core/modules/tenant-config/`

```
tenant-config/
├── assets/
│   ├── first.json           # Store 1 config (Hedfirst)
│   └── second.json          # Store 2 config (test tenant)
├── tenant-config.controller.ts
├── tenant-config.module.ts
└── tenant-config.service.ts
```

**Controller** (`tenant-config.controller.ts`):

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import TenantConfigService from './tenant-config.service';
import { SkipAuth } from '@shared/guards/skip-auth.guard';
import { ApiOrgIdParam, StoreIdParam } from '@shared/decorators/org-store-id';

@ApiTags('Tenant Config')
@Controller('organizations/:organizationId/stores/:storeId/tenant-config')
export default class TenantConfigController {
  constructor(
    private readonly tenantConfigService: TenantConfigService,
  ) {}

  @SkipAuth()  // Config needed before auth for initial page render
  @ApiResponse({
    description: 'Get tenant configuration by storeId',
    status: 200,
  })
  @ApiOrgIdParam()
  @Get()
  async getConfig(
    @StoreIdParam() storeId: string,
  ) {
    return this.tenantConfigService.getConfigByStoreId(storeId);
  }
}
```

**Key points:**
- `@SkipAuth()` — Config is public because it's needed before user authenticates
- Route: `GET /organizations/:orgId/stores/:storeId/tenant-config`
- Currently reads from JSON files; will migrate to database

### 2. Config JSON Structure

**Store 1 — Hedfirst** (`first.json`):

```json
{
  "identity": {
    "slug": "hedfirst",
    "storeId": "1",
    "organizationId": "1",
    "name": "Hedfirst"
  },
  "branding": {
    "colors": {
      "primary": {
        "50": "#EBF5FF",
        "100": "#E1EFFE",
        "200": "#C3DDFD",
        "300": "#A4CAFE",
        "400": "#76A9FA",
        "500": "#3F83F8",
        "600": "#1C64F2",
        "700": "#1A56DB",
        "800": "#1E429F",
        "900": "#233876"
      }
    },
    "logos": {
      "primary": "/tenants/hedfirst/logo.svg",
      "white": "/tenants/hedfirst/logo-white.svg",
      "favicon": "/tenants/hedfirst/favicon.ico"
    }
  }
}
```

**Store 2 — Test Tenant** (`second.json`):

```json
{
  "identity": {
    "slug": "wellness-plus",
    "storeId": "2",
    "organizationId": "1",
    "name": "Wellness Plus"
  },
  "branding": {
    "colors": {
      "primary": {
        "50": "#F9FAFB",
        "100": "#F3F4F6",
        "200": "#E5E7EB",
        "300": "#D1D5DB",
        "400": "#9CA3AF",
        "500": "#6B7280",
        "600": "#4B5563",
        "700": "#374151",
        "800": "#1F2937",
        "900": "#111827"
      }
    },
    "logos": {
      "primary": "/tenants/wellness-plus/logo.svg",
      "white": "/tenants/wellness-plus/logo-white.svg",
      "favicon": "/tenants/wellness-plus/favicon.ico"
    }
  }
}
```

### 3. Frontend: CSS Variable Injection

**Location:** `node-hedfirst-patient/src/layouts/color-config.layout.tsx`

```typescript
import { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useGetTenantConfigQuery } from '@/store/api/tenant-config.api';

export default function ColorConfigLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { storeId } = useParams<{ storeId: string }>();
  const organizationId = "1";  // Will come from context in production

  const { data: tenantConfig } = useGetTenantConfigQuery(
    { organizationId, storeId: storeId as string },
    { skip: !organizationId || !storeId },
  );

  // Set CSS custom properties when tenant config loads
  useEffect(() => {
    if (!tenantConfig) {
      return undefined;
    }

    const root = document.documentElement;
    const colors = tenantConfig.branding.colors.primary;

    // Set all primary color shades as CSS variables
    Object.entries(colors).forEach(([shade, color]) => {
      root.style.setProperty(`--primary-${shade}`, color);
    });

    // Cleanup: remove CSS variables when component unmounts or config changes
    return () => {
      Object.keys(colors).forEach((shade) => {
        root.style.removeProperty(`--primary-${shade}`);
      });
    };
  }, [tenantConfig]);

  return children;
}
```

**Key points:**
- Extracts `storeId` from URL parameters
- Fetches config using RTK Query (cached)
- Sets CSS variables on `document.documentElement` (`:root`)
- Cleanup function removes variables on unmount

### 4. Tailwind Configuration

**Location:** `node-hedfirst-patient/tailwind.config.ts`

```typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "var(--primary-50, #EBF5FF)",
          100: "var(--primary-100, #E1EFFE)",
          200: "var(--primary-200, #C3DDFD)",
          300: "var(--primary-300, #A4CAFE)",
          400: "var(--primary-400, #76A9FA)",
          500: "var(--primary-500, #3F83F8)",
          600: "var(--primary-600, #1C64F2)",
          700: "var(--primary-700, #1A56DB)",
          800: "var(--primary-800, #1E429F)",
          900: "var(--primary-900, #233876)",
        },
      },
    },
  },
};
```

**Key pattern:**
```typescript
50: "var(--primary-50, #EBF5FF)",
//   ↑ CSS variable    ↑ Fallback (Hedfirst blue)
```

- Uses CSS variable if set by `ColorConfigLayout`
- Falls back to Hedfirst colors if no tenant config loaded
- Allows Tailwind classes like `bg-primary-700` to work dynamically

### 5. Component Usage

Components don't need any changes. They simply use Tailwind's `primary-*` classes:

```tsx
// Button component - no tenant awareness needed
<button className="bg-primary-700 hover:bg-primary-600 text-white">
  Submit
</button>

// Active tab
<div className="border-b-2 border-primary-700 text-primary-700">
  Selected Tab
</div>

// Checkbox
<input
  type="checkbox"
  className="text-primary-600 focus:ring-primary-500"
/>
```

The CSS variables handle the rest.

### 6. Palette Generation Algorithm

The Store Admin UI uses `chroma-js` with LCH color space to auto-generate the 50-900 palette from a single base color. This ensures perceptually uniform gradients without the "muddy" results common in simple RGB interpolation.

**Algorithm Logic:**

1.  **Input:** Admin selects a base hex color.
2.  **Conversion:** Extract LCH (Lightness, Chroma, Hue) values.
3.  **Targets:** Map shades to fixed lightness targets to ensure consistent contrast-to-background ratios similar to Tailwind's default palette:
    *   `50`: 97% Lightness (Near white, used for backgrounds)
    *   `100`: 94%
    *   `500`: 55% (Mid-tone)
    *   `600`: 45% (Base target)
    *   `900`: 21% (Near black)
4.  **Chroma Adjustment:**
    *   **Light shades (50-100):** Reduce chroma to avoid neon/garish tints.
    *   **Mid shades:** Preserve full chroma.
    *   **Dark shades (800-900):** Slightly reduce chroma to prevent muddy results.
5.  **Output:** A complete 10-shade hex palette object stored in the Tenant Config JSON.

---

## Runtime Behavior

### Page Load Sequence

1. Browser requests page
2. HTML renders with Tailwind classes using fallback colors
3. React hydrates, `ColorConfigLayout` mounts
4. RTK Query fetches `/organizations/:orgId/stores/:storeId/tenant-config`
5. `useEffect` runs, sets CSS variables on `:root`
6. Browser repaints affected elements with new colors
7. User sees branded UI (may be brief flash of fallback colors)

### Store Switching (Demo Feature)

When switching stores in Serhii's demo:
1. Click "Switch to Store 1" button
2. Navigation changes URL to `/stores/1`
3. `useParams` returns new `storeId`
4. RTK Query fetches new config (or serves from cache)
5. Cleanup function removes old CSS variables
6. New CSS variables set
7. UI updates to new brand colors

---

## File Locations Summary

| Purpose | Location |
|---------|----------|
| Backend controller | `node-hedfirst/src/apps/patient/core/modules/tenant-config/tenant-config.controller.ts` |
| Backend service | `node-hedfirst/src/apps/patient/core/modules/tenant-config/tenant-config.service.ts` |
| Config JSON (temp) | `node-hedfirst/src/apps/patient/core/modules/tenant-config/assets/*.json` |
| Frontend layout | `node-hedfirst-patient/src/layouts/color-config.layout.tsx` |
| Tailwind config | `node-hedfirst-patient/tailwind.config.ts` |
| RTK Query API | `node-hedfirst-patient/src/store/api/tenant-config.api.ts` |

---

## Future Considerations

### Database Storage

Currently using JSON files. Production will store config in database:
- Same structure as JSON
- Retrieved by `storeId`
- Cached with appropriate TTL
- Admin UI for editing (Store Admin branding page)

### Logo Handling

Logos require:
- File upload endpoint
- Storage in tenant-specific S3 path (`/tenants/{slug}/`)
- URL returned in config JSON



---

## Prerequisites Before Hedfirst Rollout

See `DRIFT-FIX-REQUIREMENTS.md` for the list of changes needed before applying this system to the existing Hedfirst store.
