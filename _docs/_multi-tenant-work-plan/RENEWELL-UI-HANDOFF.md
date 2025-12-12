# Renewell UI Implementation Handoff

**Created**: 2025-12-10
**Live Demo**: https://node-hedfirst-patient.vercel.app/renewell/catalog
**Local Dev**: http://localhost:3000/renewell/catalog

---

## Overview

This document provides everything needed to implement the Renewell store UI as a tenant-aware, production-ready feature. The current implementation is a working prototype with mock data - the developer needs to integrate it with the tenant configuration system and real API data.

---

## 1. Prototype Files (Current Location)

All prototype files are in the `node-hedfirst-patient` repo.

> **Note**: The prototype was initially built under the name "peptidebarn" but the store is now called **Renewell**. The files need to be renamed as indicated below.

### Tenant Configuration
| Current Path | Rename To | Purpose |
|--------------|-----------|---------|
| `src/config/tenants/peptidebarn.ts` | `renewell.ts` | Tenant config |
| `src/config/tenants/peptidebarn-products.ts` | (delete) | Mock products - remove after API integration |

### Components
| Current Path | Rename To | Purpose |
|--------------|-----------|---------|
| `src/components/tenants/peptidebarn/` | `renewell/` | Component folder |
| `CategoryGroupedCatalog.tsx` | (keep name) | Category-grouped product grid |
| `PeptideBarnHeader.tsx` | `RenewellHeader.tsx` | Simple header |
| `PeptideBarnFooter.tsx` | `RenewellFooter.tsx` | Minimal footer |
| `index.ts` | (update exports) | Export file |

### Routes (Already Named Correctly)
```
src/app/renewell/
├── layout.tsx        # Tenant layout wrapper
├── page.tsx          # Redirects to /catalog
└── catalog/
    └── page.tsx      # Catalog page
```

---

## 2. Tenant Configuration Schema

### TypeScript Interface (To Create)

```typescript
// src/types/tenant.types.ts

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface TenantColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TenantFeatures {
  showSearch: boolean;
  showFilters: boolean;
  catalogLayout: "flat-grid" | "category-grouped";
}

export interface TenantCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

export interface TenantConfig {
  // Identity
  slug: string;                    // URL path: "renewell"
  storeId: string;                 // Backend store ID
  organizationId: string;          // Backend org ID
  name: string;                    // Display: "Renewell"
  tagline?: string;

  // Visual Branding
  logo: string;
  favicon: string;
  colors: TenantColors;

  // Structural Branding
  features: TenantFeatures;

  // Navigation
  navigation: {
    main: NavItem[];
  };

  // Footer
  footer: {
    links: FooterLink[];
    copyright: string;
    supportEmail: string;
    supportPhone: string;
  };

  // Categories (for category-grouped layout)
  categories?: TenantCategory[];
}
```

### Renewell Config Values

```typescript
// src/config/tenants/renewell.ts

export const renewellConfig: TenantConfig = {
  // Identity
  slug: "renewell",
  storeId: "STORE_ID_FROM_DB",        // TODO: Get from DB
  organizationId: "ORG_ID_FROM_DB",   // TODO: Get from DB
  name: "Renewell",
  tagline: "Renew Your Wellness",

  // Visual Branding
  logo: "/tenants/renewell/logo.svg",
  favicon: "/tenants/renewell/favicon.ico",
  colors: {
    primary: "#2D5A27",      // Forest green
    primaryHover: "#1E3D1A",
    secondary: "#8B4513",    // Saddle brown
    accent: "#F4A460",       // Sandy brown
    background: "#FAFAF5",   // Off-white
    text: "#1A1A1A",
  },

  // Structural Branding
  features: {
    showSearch: false,       // Only 5 products, no search needed
    showFilters: false,      // Only 2 categories, no filters needed
    catalogLayout: "category-grouped",
  },

  // Navigation
  navigation: {
    main: [
      { id: "glp1", label: "GLP-1 Treatments", href: "/renewell/catalog#glp1" },
      { id: "peptides", label: "Peptide Therapy", href: "/renewell/catalog#peptides" },
      { id: "resources", label: "Resources", href: "/renewell/resources" },
      { id: "about", label: "About Us", href: "/renewell/about" },
    ],
  },

  // Footer
  footer: {
    links: [
      { label: "GLP-1 Treatments", href: "/renewell/catalog#glp1" },
      { label: "Peptide Therapy", href: "/renewell/catalog#peptides" },
      { label: "Resources", href: "/renewell/resources" },
      { label: "About Us", href: "/renewell/about" },
      { label: "Privacy Policy", href: "/renewell/privacy" },
      { label: "Terms of Service", href: "/renewell/terms" },
    ],
    copyright: "Renewell",
    supportEmail: "support@renewell.com",
    supportPhone: "+1 (555) 123-4567",
  },

  // Categories
  categories: [
    {
      id: "glp1",
      name: "GLP-1 Treatments",
      description: "FDA-approved weight management solutions",
      slug: "glp-1-treatments",
    },
    {
      id: "peptides",
      name: "Peptide Therapy",
      description: "Advanced peptide formulations for wellness",
      slug: "peptide-therapy",
    },
  ],
};
```

---

## 3. UI Specifications

### Header

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Logo] Renewell    GLP-1 | Peptides | Resources | About   [Login] [Get Started]
└─────────────────────────────────────────────────────────────────────────┘
```

**Desktop (>1070px)**:
- Logo (RW placeholder or SVG) + store name
- 4 nav items inline
- Login link + "Get Started" CTA button

**Mobile (<1070px)**:
- Logo only (name hidden)
- Hamburger menu
- Full-screen mobile nav with same items + Login/CTA

**Sticky**: Yes, `position: sticky; top: 0; z-index: 50;`

### Catalog Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Our Treatments                                  │
│    Premium peptide therapies and GLP-1 treatments, delivered to your... │
│                                                                          │
│  ────────────────────────────────────────────────────────────────────── │
│  GLP-1 Treatments (2 products)                                          │
│  ┌─────────────┐  ┌─────────────┐                                       │
│  │ [Popular]   │  │ [New]       │                                       │
│  │    [S]      │  │    [T]      │                                       │
│  │ Semaglutide │  │ Tirzepatide │                                       │
│  │ $299.00     │  │ $399.00     │                                       │
│  │ [View]      │  │ [View]      │                                       │
│  └─────────────┘  └─────────────┘                                       │
│                                                                          │
│  ────────────────────────────────────────────────────────────────────── │
│  Peptide Therapy (3 products)                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │
│  │    [L]      │  │ [Best Seller]│  │    [P]      │                      │
│  │  Lipo-B     │  │    NAD+     │  │   PT-141    │                      │
│  │  $89.00     │  │  $149.00    │  │  $129.00    │                      │
│  │  [View]     │  │  [View]     │  │  [View]     │                      │
│  └─────────────┘  └─────────────┘  └─────────────┘                      │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │              Need help choosing?                                 │    │
│  │              [Start Free Consultation]                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Layout**:
- NO search bar
- NO filter sidebar
- Products grouped by category with section headers
- Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
- Bottom CTA section

### Product Card

```
┌─────────────────┐
│ [Badge]         │  <- Optional: "Popular", "New", "Best Seller"
│                 │
│    [Image]      │  <- Square aspect ratio, placeholder shows first letter
│                 │
│─────────────────│
│ Product Name    │  <- font-semibold, text-base
│ Description...  │  <- text-sm, text-gray-500, line-clamp-2
│                 │
│ $XX.XX          │  <- text-lg, font-bold
│ [View Details]  │  <- Full-width button, primary color
└─────────────────┘
```

**Hover**: `shadow-lg` transition

### Footer

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [RW] Renewell        Quick Links           Contact & Legal             │
│  Premium peptide...   - GLP-1 Treatments    - support@renewell.com      │
│                       - Peptide Therapy     - +1 (555) 123-4567         │
│                       - Resources           - Privacy Policy            │
│                       - About Us            - Terms of Service          │
│─────────────────────────────────────────────────────────────────────────│
│  © 2025 Renewell. All rights reserved.     HIPAA Compliant | FDA Reg.  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Colors**: `bg-gray-900`, white text, `text-gray-400` for secondary

---

## 4. Key Differences from Hedfirst

| Feature | Hedfirst | Renewell |
|---------|----------|----------|
| Search bar | Yes | No |
| Filter sidebar | Yes | No |
| Catalog layout | Flat grid | Category-grouped |
| Products | 187+ | 5 |
| Navigation | Mega menus | Simple links |
| Footer | 4+ sections | 3 columns minimal |
| Color | Blue | Green (#2D5A27) |

---

## 5. Integration Tasks

### Task 1: Rename Prototype Files

Rename from "peptidebarn" to "renewell":

```bash
# Components folder
mv src/components/tenants/peptidebarn src/components/tenants/renewell

# Individual files
mv src/components/tenants/renewell/PeptideBarnHeader.tsx src/components/tenants/renewell/RenewellHeader.tsx
mv src/components/tenants/renewell/PeptideBarnFooter.tsx src/components/tenants/renewell/RenewellFooter.tsx

# Config
mv src/config/tenants/peptidebarn.ts src/config/tenants/renewell.ts
rm src/config/tenants/peptidebarn-products.ts  # Remove mock data after API integration

# Update all imports in the renamed files
```

### Task 2: Create TenantContext Provider

```typescript
// src/contexts/tenant.context.tsx

import { createContext, useContext, ReactNode } from "react";
import { TenantConfig } from "@/types/tenant.types";

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({
  config,
  children
}: {
  config: TenantConfig;
  children: ReactNode
}) {
  return (
    <TenantContext.Provider value={config}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
}
```

### Task 3: Generalize Components to Use Context

Current prototype imports config directly (needs refactoring):
```typescript
// Current (prototype) - direct import
import { renewellConfig } from "@/config/tenants/renewell";
const { colors, name } = renewellConfig;
```

Should use context instead:
```typescript
// Target (production) - context-based
import { useTenant } from "@/contexts/tenant.context";
const { colors, name, navigation } = useTenant();
```

### Task 4: Connect to Real API

The `CategoryGroupedCatalog` currently uses mock data. Replace with real API:

```typescript
// Current (prototype) - mock data
import { categorizedProducts } from "@/config/tenants/renewell-products";

// Target (production) - real API
const tenant = useTenant();
const { data: products } = useGetProductsQuery({
  storeId: tenant.storeId,
  // ... other params
});

// Group products by category
const categorizedProducts = groupByCategory(products, tenant.categories);
```

### Task 5: Dynamic Routing

After path-based routing is implemented, select catalog layout based on tenant config:

```typescript
// src/app/[tenant]/catalog/page.tsx

export default function CatalogPage() {
  const tenant = useTenant();

  if (tenant.features.catalogLayout === "category-grouped") {
    return <CategoryGroupedCatalog />;
  }

  return <FlatGridCatalog />;
}
```

---

## 6. Assets Needed

| Asset | Location | Status |
|-------|----------|--------|
| Renewell Logo (SVG) | `/public/tenants/renewell/logo.svg` | TODO |
| Renewell Favicon | `/public/tenants/renewell/favicon.ico` | TODO |
| Product Images | Via API/CDN | TODO |

**Placeholder**: Currently using first letter of product name in a gradient box

---

## 7. Color Tokens

```css
/* Renewell Theme */
--renewell-primary: #2D5A27;
--renewell-primary-hover: #1E3D1A;
--renewell-secondary: #8B4513;
--renewell-accent: #F4A460;
--renewell-background: #FAFAF5;
--renewell-text: #1A1A1A;
```

Consider adding to Tailwind config as tenant-specific theme or use CSS variables.

---

## 8. Responsive Breakpoints

Using existing Hedfirst breakpoints:
- Mobile: < 768px (`md:`)
- Tablet: 768px - 1070px
- Desktop: > 1070px (`lg:`)

Product grid:
- `grid-cols-2` (mobile)
- `md:grid-cols-3` (tablet)
- `lg:grid-cols-4` (desktop)

---

## 9. Testing Checklist

- [ ] Header displays correctly on mobile/desktop
- [ ] Mobile menu opens/closes properly
- [ ] Navigation links work with anchor scrolling (#glp1, #peptides)
- [ ] Product cards display all data correctly
- [ ] Badge displays when product has badge
- [ ] Category sections have proper IDs for anchor links
- [ ] Footer links work
- [ ] Colors match brand guidelines
- [ ] Responsive at all breakpoints
- [ ] Accessibility: keyboard navigation, proper heading hierarchy

---

## 10. Questions for PM/Design

1. **Logo**: Do we have the actual Renewell logo file?
2. **Product images**: Where will these come from?
3. **Badge rules**: What determines if a product gets a badge?
4. **CTA destination**: Where does "Start Free Consultation" go?
5. **Resources/About pages**: Do these need to be tenant-specific or shared?

---

## Appendix: Prototype Component Files

The working prototype code is located at:

```
src/components/tenants/peptidebarn/   <- Rename to renewell/
├── index.ts
├── CategoryGroupedCatalog.tsx
├── PeptideBarnHeader.tsx             <- Rename to RenewellHeader.tsx
└── PeptideBarnFooter.tsx             <- Rename to RenewellFooter.tsx
```

These are fully functional components that can be refactored to use TenantContext.
