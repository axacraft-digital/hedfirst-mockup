# Tenant Branding Migration Guide

**Created:** December 10, 2025
**Version:** 1.0
**Purpose:** How to unhardcode Hedfirst branding and create unique tenant branding
**Scope:** Patient Portal + Admin Portal

---

## Overview

This document covers:
1. **Unhardcoding Strategy** - How to remove hardcoded Hedfirst references
2. **Replacement Strategy** - What replaces them (tenant config vs empty)
3. **New Tenant Branding Setup** - MVP process for creating new tenant branding
4. **Component-by-Component Guide** - Specific files and how to migrate them
5. **Ops Responsibilities** - Who enters what, where, and how
6. **All Portals** - Patient Portal, Store Admin, Provider Admin branding

**Portals Covered:**
- Patient Portal (customer-facing store)
- Store Admin (merchant back-office)
- Provider Admin (clinician interface)

**Reference:** See [HARDCODED-REFERENCES-AUDIT.md](./HARDCODED-REFERENCES-AUDIT.md) for the full inventory of 187+ hardcoded references.

---

## Key Decision: Replace with Tenant Data, Not Empty

> **Decision:** All hardcoded branding MUST be replaced with tenant-specific data from the `TenantConfig`. Nothing should be empty or broken for any tenant.

**Rationale:**
- Empty values create broken UX (missing logos, blank footers)
- "Hedfirst" as fallback would leak to other tenants
- Each tenant must have complete, independent branding

**Exception:** Optional fields (social media links, blog URL) can be omitted if tenant doesn't have them - components should conditionally render.

---

## Hedfirst Migration: Making Hedfirst "Just Another Tenant"

**Critical Concept:** Hedfirst is NOT an exception. After migration, Hedfirst becomes the first tenant in the multi-tenant system. All its branding comes from tenant config, just like any other tenant.

### Migration Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ BEFORE: Hedfirst-specific codebase                                          │
│                                                                              │
│   Code has hardcoded:                                                        │
│   - "Hedfirst" brand name                                                    │
│   - #1A56DB colors                                                           │
│   - support@hedfirst.com                                                     │
│   - Logo imports                                                             │
│   - Navigation items                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ AFTER: Tenant-aware codebase                                                │
│                                                                              │
│   Code reads from tenant config:                                             │
│   - tenant.name                                                              │
│   - tenant.branding.colors.primary                                           │
│   - tenant.footer.supportEmail                                               │
│   - tenant.branding.logo                                                     │
│   - tenant.navigation.main                                                   │
│                                                                              │
│   Hedfirst config contains current values                                    │
│   Renewell config contains different values                                  │
│   → Same code, different output                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Create Hedfirst Tenant Config

Extract ALL current hardcoded values into a Hedfirst tenant config:

```typescript
// Hedfirst tenant config (extracted from current hardcoded values)
export const hedfirstConfig: TenantConfig = {
  slug: "hedfirst",
  storeId: "HEDFIRST_STORE_ID",
  organizationId: "HEDFIRST_ORG_ID",
  name: "Hedfirst",
  tagline: "Your Health, Your Way",

  branding: {
    logo: "/img/hedfirst-logo.svg",
    logoWhite: "/img/hedfirst-logo-white.svg",
    favicon: "/favicon.ico",
    ogImage: "/img/hedfirst-membership-lander.png",
    colors: {
      primary: "#1A56DB",
      primaryHover: "#1E40AF",
      secondary: "#6B7280",
      accent: "#F59E0B",
      background: "#FFFFFF",
      text: "#111827",
    },
  },

  features: {
    showSearch: true,
    showFilters: true,
    showCategories: true,
    catalogLayout: "flat-grid",
  },

  navigation: {
    main: [
      // Extract from nav-Item-config.ts
      { id: "womens-health", label: "Women's Health", href: "/catalog?category=womens-health", children: [...] },
      { id: "mens-health", label: "Men's Health", href: "/catalog?category=mens-health", children: [...] },
      // ... all current nav items
    ],
  },

  footer: {
    links: [
      // Extract from footer.constants.ts
      { label: "Terms of Service", href: "https://hedfirst.com/terms-of-service" },
      { label: "Privacy Policy", href: "https://hedfirst.com/privacy-policy" },
      // ... all current footer links
    ],
    copyright: "Hedfirst",
    supportEmail: "support@hedfirst.com",
    supportPhone: "+1 (888) 427-1796",
  },

  socialMedia: {
    facebook: "https://www.facebook.com/profile.php?id=61574217832791",
    instagram: "https://www.instagram.com/hedfirst.health",
    linkedin: "https://www.linkedin.com/company/hedfirst",
  },

  legal: {
    termsOfService: "https://hedfirst.com/terms-of-service",
    privacyPolicy: "https://hedfirst.com/privacy-policy",
    hipaaNotice: "https://hedfirst.com/notice-of-privacy-practices",
    consentToTreatment: "https://hedfirst.com/consent-to-treatment",
    smsTerms: "https://hedfirst.com/sms-terms-conditions",
    consentSensitiveData: "https://hedfirst.com/consent-for-sensitive-data-processing",
    pharmacyDisclaimer: "https://hedfirst.com/pharmacy-disclaimer",
    companyName: "Hedfirst LLC",
    jurisdiction: "Delaware",
  },

  businessHours: "Monday–Friday, 8 am–5 pm MTN",

  externalLinks: {
    website: "https://www.hedfirst.com",
    blog: "https://www.hedfirst.com/blog",
    about: "https://www.hedfirst.com/about-us",
    contact: "https://www.hedfirst.com/contact-us",
    howItWorks: "https://www.hedfirst.com/how-hedfirst-works",
  },

  verification: {
    legitScriptId: "LEGITSCRIPT_ID_HERE",
    showHipaaCompliance: true,
    showFdaRegulated: true,
  },

  checkoutFlow: {
    type: "payment-first",
  },

  integrations: {
    dosespot: { mode: "platform" },
    payment: { payTheoryMerchantId: "HEDFIRST_MERCHANT_ID" },
  },
};
```

### Step 2: Replace Hardcoded Values with Config Reads

| File | Current (Hardcoded) | Target (Config-driven) |
|------|---------------------|------------------------|
| `company-logo.tsx` | `import Logo from "@public/img/hedfirst-logo.svg"` | `<Image src={tenant.branding.logo} />` |
| `dictionary.ts:191` | `brand.name = "Hedfirst"` | `brand.name = tenant.name` |
| `support-contacts.ts` | `SUPPORT_EMAIL = "support@hedfirst.com"` | DELETE file, use `tenant.footer.supportEmail` |
| `footer.constants.ts` | Hardcoded link arrays | DELETE file, use `tenant.footer.links` |
| `nav-Item-config.ts` | Hardcoded nav structure | Use `tenant.navigation.main` |
| Email templates | `<img src="hedfirst-logo.png">` | `<img src="{{logoUrl}}">` |

### Step 3: Verification - Hedfirst Should Look Identical

After migration, Hedfirst should look **exactly the same** to users:
- Same logo
- Same colors
- Same navigation
- Same footer
- Same contact info

The only difference is WHERE the values come from (config vs hardcoded).

**Test Checklist:**
- [ ] Visit `/hedfirst/catalog` - looks identical to current `/catalog`
- [ ] All navigation links work
- [ ] Footer displays correctly
- [ ] Logo appears in header and footer
- [ ] Colors match current site
- [ ] Contact info is correct
- [ ] Legal links work
- [ ] Emails send with correct branding

### Step 4: Then Add New Tenants

Once Hedfirst works from config:
1. Create Renewell config with different values
2. Visit `/renewell/catalog` - see Renewell branding
3. Visit `/hedfirst/catalog` - see Hedfirst branding
4. Same codebase, different configs

### Hedfirst-Specific Migration Files

**High Priority (Hedfirst branding must be extracted):**

| File | Lines | What to Extract |
|------|-------|-----------------|
| `src/shared/constants/support-contacts.ts` | All | Email, phone → config |
| `src/shared/constants/footer.constants.ts` | All | Links, social → config |
| `src/components/company-logo/company-logo.tsx` | 3-4, 15-16 | Logo paths, alt text → config |
| `src/dictionaries/dictionary.ts` | 191, 210, 237-238, 252-257, 1383 | Brand name, contact, copyright → config |
| `src/dictionaries/nav-Item-config.ts` | All | Nav structure → config |
| `src/providers/navigation/index.ts` | 261-281 | External links → config |
| `src/app/layout.tsx` | 8, 13, 40 | OG image, schema logo, email → config |

**Page Metadata (NEW - found in codebase scan):**

| File | Lines | What to Extract |
|------|-------|-----------------|
| `src/app/catalog/page.tsx` | 18-19 | Page title "Medications \| Hedfirst" → `tenant.name` |
| `src/app/catalog/lab-tests/page.tsx` | 19-20 | Page title "Lab Tests \| Hedfirst" → `tenant.name` |
| `src/app/catalog/[slug]/page.tsx` | 42-44, 104 | Product page title, JSON-LD name → `tenant.name` |
| `src/app/(internal)/.../starting-quiz/layout.tsx` | 10-11, 25 | Quiz page title, description, OG alt → `tenant.name` |
| `src/shared/helpers/generate-metadata.helper.ts` | 2, 17, 23 | Default title, OG image import → tenant config |

**Branded Components (NEW):**

| File | Lines | Issue | Solution |
|------|-------|-------|----------|
| `src/components/icons/hedfirst-card-test.tsx` | All | HedfirstCardText SVG icon | Rename to generic or make tenant-aware |
| `src/layouts/modals/ai-medical-assessment-modal.tsx` | 11, 98 | Uses HedfirstCardText | Use generic icon or hide per tenant |

**Checkout & Analytics (NEW):**

| File | Lines | What to Extract |
|------|-------|-----------------|
| `src/app/(internal)/.../checkout/_constants/testimonial.constants.ts` | 21 | "Getting medication from Hedfirst..." → tenant-specific or generic |
| `src/app/(internal)/.../checkout/_constants/disclaimers.constants.ts` | 2-5 | 4 hedfirst.com legal URLs → `tenant.legal.*` |
| `src/app/(internal)/.../checkout/(checkout)/page.tsx` | 564 | `affiliation: "Hedfirst"` → `tenant.name` (analytics) |

**Third-Party Verification (NEW):**

| File | Lines | Issue | Solution |
|------|-------|-------|----------|
| `src/layouts/buttons/legit-script-button.tsx` | 7, 9, 14 | Hardcoded hedfirst.com verification URLs | Conditionally render based on `tenant.verification.legitScriptId` |

**Decision:** LegitScript certification is tenant's responsibility. Some tenants will have it, some won't. Component should:
- Only render if `tenant.verification.legitScriptId` is provided
- Use tenant-specific verification URL

**S3/CDN Images (Infrastructure - Note Only):**

| File | Lines | Issue |
|------|-------|-------|
| `src/app/(internal)/.../medical-questionnaire/page.tsx` | 13 | Doctor image URL with AWS account ID |
| `src/app/(internal)/.../visit-completed.modal.tsx` | 25 | Doctor image URL with AWS account ID |
| `src/app/(internal)/.../starting-quiz/_data/quiz.data.json` | 10, 28, 46, 64 | Quiz images on s3.onix-systems.com |

**Decision:** These are shared infrastructure images (generic doctor photos, quiz imagery). Keep as-is for MVP - not tenant-branded content.

**Tailwind Config (NEW):**

| File | Lines | Issue | Solution |
|------|-------|-------|----------|
| `tailwind.config.ts` | 51 | `700: "#1A56DB"` brand blue | Use CSS variables instead: `var(--color-primary)` |

**Email Templates:**

| Template | What to Replace |
|----------|-----------------|
| `order-summary.html` | Logo, phone, email, copyright, colors |
| `reset-password.html` | Logo, copyright (fix Met-Tech!), colors |
| `store-admin.html` | Logo, copyright (fix Met-Tech!), colors |
| `reactivation-email.html` | Logo, email, copyright, colors |

### Migration Order

```
Phase 1: Foundation
├── Create TenantConfig type (with all fields identified)
├── Create TenantContext provider
├── Create Hedfirst tenant config file
├── Set up middleware to inject tenant
└── Update Tailwind config to use CSS variables

Phase 2: Core Components
├── Migrate CompanyLogo component
├── Migrate Footer component
├── Migrate Header/Nav component
├── Apply CSS variables for colors (root layout injection)
├── Delete support-contacts.ts, footer.constants.ts
└── Rename/genericize HedfirstCardText icon

Phase 3: Page Metadata & SEO
├── Update generate-metadata.helper.ts to use tenant config
├── Migrate catalog/page.tsx title
├── Migrate catalog/lab-tests/page.tsx title
├── Migrate catalog/[slug]/page.tsx title and JSON-LD
├── Migrate starting-quiz layout metadata
└── Update layout.tsx OG images and schema

Phase 4: Dictionary & Content
├── Migrate dictionary.ts brand references (see detailed list below)
├── Migrate navigation providers external links
├── Migrate checkout disclaimers.constants.ts
├── Migrate checkout testimonial.constants.ts (or make generic)
└── Migrate checkout page affiliation for analytics

Phase 5: Conditional Features
├── Make LegitScript button conditional (render only if tenant has ID)
├── Configure verification badges per tenant
└── Handle tenant-specific features (showSearch, showFilters, etc.)

Phase 6: Email Templates
├── Add variable placeholders to all templates
├── Create email variable injection service
├── Fix Met-Tech bug in reset-password.html
└── Fix wrong phone in order-summary.html

Phase 7: Verification & Testing
├── Full regression test of Hedfirst (must look identical)
├── grep -r "hedfirst" src/ (verify no hardcoded remains)
├── grep -r "Hedfirst" src/ (verify no hardcoded remains)
├── Add Renewell config and test
└── Test both tenants end-to-end
```

### Dictionary.ts Lines Requiring Migration

Full list of lines in `src/dictionaries/dictionary.ts` with "Hedfirst" references:

| Line | Context | Migration |
|------|---------|-----------|
| 43 | "only use the email address you used to create your Hedfirst account" | Use generic "your account" |
| 47 | "consultations... with a Hedfirst provider" | `${tenant.name} provider` |
| 56 | "Hedfirst AI processes your interview" | `${tenant.name} AI` or generic |
| 113 | "Hedfirst Messages" | `${tenant.name} Messages` |
| 121-122 | "Hedfirst Messages", "View all Hedfirst messages" | `${tenant.name} Messages` |
| 191 | `brand.name = "Hedfirst"` | `tenant.name` |
| 210 | "Welcome to the chat with a Hedfirst provider" | `${tenant.name} provider` |
| 252-257 | Footer text, copyright, disclaimer | `tenant.footer.*`, `tenant.legal.*` |
| 367 | "Get a consultation with the hedfirst healthcare provider" | Generic or `tenant.name` |
| 603 | `title: "Hedfirst"` | `tenant.name` |
| 723-724 | "Hedfirst mobile app is coming soon", "Hedfirst Mobile App" | `${tenant.name} Mobile App` or hide |
| 1038 | "Create your Hedfirst account" | `Create your ${tenant.name} account` |
| 1351, 1353 | SMS consent mentions Hedfirst | `${tenant.name}` |
| 1383 | Subscription terms with Hedfirst, phone, email | Full replacement with tenant config |
| 1510 | "The Hedfirst Medical Questionnaire" | `The ${tenant.name} Medical Questionnaire` |
| 1659 | "how Hedfirst's AI Care membership works" | `${tenant.name}'s` or generic |

---

## Ops Process: Who Enters What, Where, and How

### MVP Process (No Admin UI)

Since there's no admin UI for tenant configuration in MVP, here's the operational process:

| Data Type | Who Gathers | Who Enters | Where Entered | Format |
|-----------|-------------|------------|---------------|--------|
| Brand colors | Tenant/PM | Developer | `Tenant.config` JSON in DB | Hex codes |
| Logo files | Tenant/PM | Developer | `/public/tenants/{slug}/` or S3 | SVG/PNG |
| Contact info | Tenant | PM → Developer | `Tenant.config` JSON | String |
| Nav items | PM | Developer | `Tenant.config` JSON | JSON array |
| Footer links | PM | Developer | `Tenant.config` JSON | JSON array |
| Legal URLs | Tenant | Developer | `Tenant.config` JSON | URL strings |
| Products | Tenant/PM | Store Admin | Store Admin UI | Via UI |
| Questionnaires | PM/Clinical | Developer | Database migration | JSON |
| Disease states | PM | Developer | `Tenant.config` JSON | JSON array |

### Detailed Color Setup

**Required Colors (6 total):**

| Color | Purpose | Example (Renewell) | Where Used |
|-------|---------|-------------------|------------|
| `primary` | Main brand color, buttons, links | `#2D5A27` (forest green) | CTA buttons, active states, links |
| `primaryHover` | Hover state for primary | `#1E3D1A` (darker green) | Button hover, link hover |
| `secondary` | Secondary actions, accents | `#8B4513` (saddle brown) | Secondary buttons, borders |
| `accent` | Highlights, badges, alerts | `#F4A460` (sandy brown) | Badges, notifications, highlights |
| `background` | Page background | `#FAFAF5` (off-white) | Body background, card backgrounds |
| `text` | Primary text color | `#1A1A1A` (near-black) | All body text |

**How to Gather Colors from Tenant:**

1. Ask tenant for brand guidelines PDF or style guide
2. If no style guide, ask for:
   - Primary brand color (hex code)
   - Logo file (we can extract secondary colors)
   - Preference: light or dark background?
3. Use color tool to generate complementary colors:
   - https://coolors.co/ - palette generator
   - https://colorhunt.co/ - curated palettes

**Color Entry Format:**
```json
"colors": {
  "primary": "#2D5A27",
  "primaryHover": "#1E3D1A",
  "secondary": "#8B4513",
  "accent": "#F4A460",
  "background": "#FAFAF5",
  "text": "#1A1A1A"
}
```

**Where Colors Are Applied:**
```typescript
// In TenantProvider or root layout
<style>{`
  :root {
    --color-primary: ${tenant.branding.colors.primary};
    --color-primary-hover: ${tenant.branding.colors.primaryHover};
    --color-secondary: ${tenant.branding.colors.secondary};
    --color-accent: ${tenant.branding.colors.accent};
    --color-background: ${tenant.branding.colors.background};
    --color-text: ${tenant.branding.colors.text};
  }
`}</style>
```

**Tailwind Integration:**
```javascript
// tailwind.config.js - reference CSS variables
module.exports = {
  theme: {
    extend: {
      colors: {
        tenant: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          background: 'var(--color-background)',
          text: 'var(--color-text)',
        }
      }
    }
  }
}
```

Then use in components: `bg-tenant-primary`, `text-tenant-text`, etc.

### Navigation Setup

**Main Navigation (Header):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `label` | string | Yes | Display text |
| `href` | string | Yes | Link destination |
| `children` | array | No | Dropdown items (if mega menu) |

**Entry Format:**
```json
"navigation": {
  "main": [
    { "id": "glp1", "label": "GLP-1 Treatments", "href": "/renewell/catalog#glp1" },
    { "id": "peptides", "label": "Peptide Therapy", "href": "/renewell/catalog#peptides" },
    { "id": "resources", "label": "Resources", "href": "https://renewell.com/resources" },
    { "id": "about", "label": "About Us", "href": "https://renewell.com/about" }
  ]
}
```

**For Complex Navigation (Hedfirst-style with mega menus):**
```json
"navigation": {
  "main": [
    {
      "id": "womens-health",
      "label": "Women's Health",
      "href": "/catalog?category=womens-health",
      "children": [
        { "id": "weight-loss", "label": "Weight Loss", "href": "/catalog?disease=weight-loss" },
        { "id": "hormone", "label": "Hormone Therapy", "href": "/catalog?disease=hormone" }
      ]
    }
  ]
}
```

### Footer Setup

**Footer Links:**
```json
"footer": {
  "links": [
    { "label": "GLP-1 Treatments", "href": "/renewell/catalog#glp1" },
    { "label": "Peptide Therapy", "href": "/renewell/catalog#peptides" },
    { "label": "Privacy Policy", "href": "https://renewell.com/privacy" },
    { "label": "Terms of Service", "href": "https://renewell.com/terms" }
  ],
  "copyright": "Renewell Health LLC",
  "supportEmail": "support@renewell.com",
  "supportPhone": "+1 (555) 123-4567"
}
```

### Ops Workflow for New Tenant

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: PM gathers requirements from tenant                                  │
│ - Brand colors (or brand guidelines PDF)                                     │
│ - Logo files (SVG preferred)                                                 │
│ - Contact info (support email, phone)                                        │
│ - Legal page URLs                                                            │
│ - Product list with categories                                               │
│ - Questionnaire requirements                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: PM creates tenant config document                                    │
│ - Fill out TENANT-CONFIG-TEMPLATE.md (see below)                            │
│ - Review with tenant for accuracy                                            │
│ - Get sign-off                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Developer implements                                                 │
│ - Upload logo files to /public/tenants/{slug}/ or S3                        │
│ - Create Tenant.config JSON from PM doc                                      │
│ - Insert DB records (Organization, Store, Tenant)                            │
│ - Add to TENANT_MAP in middleware                                            │
│ - Create questionnaire records if needed                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: PM/Ops creates products                                              │
│ - Use Store Admin to add products                                            │
│ - Assign products to correct categories                                      │
│ - Upload product images                                                      │
│ - Set pricing                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: QA/PM tests                                                          │
│ - Visit /{tenant}/catalog                                                    │
│ - Verify branding, colors, logo                                              │
│ - Test checkout flow                                                         │
│ - Verify emails have correct branding                                        │
│ - Check no "Hedfirst" leakage                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Branding Categories & Migration Strategy

### Category 1: Contact Information

| Element | Current | Migration Strategy |
|---------|---------|-------------------|
| Support Email | `support@hedfirst.com` | `tenant.footer.supportEmail` |
| Support Phone | `+1 888-427-1796` | `tenant.footer.supportPhone` |
| Business Hours | `Monday–Friday, 8 am–5 pm MTN` | `tenant.businessHours` (new field) |
| Security Email | `security@hedfirst.com` | ❌ **REMOVE** - Not used, file bug to delete |

**Phone Number Format (Unified):**

Store ONE format in config: `+1 (555) 123-4567`

The code handles conversion:
- Display: Use as-is from config
- `tel:` link: Strip non-digits → `tel:+15551234567`

```typescript
// Standard phone display pattern
<a href={`tel:+${tenant.footer.supportPhone.replace(/\D/g, '')}`}>
  {tenant.footer.supportPhone}
</a>
```

> **Bug Found:** Order summary email uses `+1-888-427-7196` but other files use `+1 888-427-1796`. This must be fixed during migration.

**Files to Update:**
- `src/shared/constants/support-contacts.ts` → DELETE, use `useTenant()` hook
- `src/app/catalog/_components/empty-results.tsx` → Use `useTenant()`
- `src/dictionaries/dictionary.ts` (lines 237-238, 1383) → Dynamic from config
- `public/templates/reactivation-email.html` → Remove `security@hedfirst.com` reference

**Code Pattern:**
```typescript
// BEFORE
const SUPPORT_EMAIL = "support@hedfirst.com";
const SUPPORT_PHONE = "+1 888-427-1796";

// AFTER
import { useTenant } from "@/contexts/tenant.context";

function SupportInfo() {
  const tenant = useTenant();
  return (
    <div>
      <a href={`mailto:${tenant.footer.supportEmail}`}>{tenant.footer.supportEmail}</a>
      <a href={`tel:${tenant.footer.supportPhone.replace(/\D/g, '')}`}>
        {tenant.footer.supportPhone}
      </a>
    </div>
  );
}
```

---

### Category 2: Brand Identity (Name, Logo, Colors)

| Element | Current | Migration Strategy |
|---------|---------|-------------------|
| Brand Name | `"Hedfirst"` | `tenant.name` |
| Tagline | Various | `tenant.tagline` |
| Primary Logo | `hedfirst-logo.svg` | `tenant.branding.logo` |
| White Logo | `hedfirst-logo-white.svg` | `tenant.branding.logoWhite` (new field) |
| Favicon | `favicon.ico` | `tenant.branding.favicon` |
| Primary Color | `#1A56DB` | `tenant.branding.colors.primary` |

**Files to Update:**
- `src/components/company-logo/company-logo.tsx` → Dynamic logo from config
- `src/dictionaries/dictionary.ts` (line 191) → `tenant.name`
- `src/app/layout.tsx` → Dynamic metadata
- All email templates → Variable injection

**Logo Component Pattern:**
```typescript
// BEFORE
import Logo from "@public/img/hedfirst-logo.svg";
import LogoWhite from "@public/img/hedfirst-logo-white.svg";

// AFTER
import { useTenant } from "@/contexts/tenant.context";
import Image from "next/image";

function CompanyLogo({ variant = "default" }) {
  const tenant = useTenant();
  const logoUrl = variant === "white"
    ? tenant.branding.logoWhite
    : tenant.branding.logo;

  return (
    <Image
      src={logoUrl}
      alt={tenant.name}
      width={120}
      height={40}
    />
  );
}
```

**Color Application Pattern:**
```typescript
// In root layout or TenantProvider
<style>{`
  :root {
    --color-primary: ${tenant.branding.colors.primary};
    --color-primary-hover: ${tenant.branding.colors.primaryHover};
    --color-secondary: ${tenant.branding.colors.secondary};
    --color-accent: ${tenant.branding.colors.accent};
    --color-background: ${tenant.branding.colors.background};
    --color-text: ${tenant.branding.colors.text};
  }
`}</style>
```

---

### Category 3: Navigation (Header & Footer)

| Element | Current | Migration Strategy |
|---------|---------|-------------------|
| Main Nav Items | Hardcoded in `nav-Item-config.ts` | `tenant.navigation.main[]` |
| Footer Links | Hardcoded in `footer.constants.ts` | `tenant.footer.links[]` |
| Social Media | Hardcoded URLs | `tenant.socialMedia` (new object) |
| Panel Nav | Hardcoded in `navigation/index.ts` | Shared (same for all tenants) |

**Decision: What's Tenant-Specific vs Shared**

| Navigation Area | Tenant-Specific? | Reason |
|-----------------|------------------|--------|
| Header Main Nav | Yes | Different products/categories |
| Footer Links | Yes | Different legal pages, about pages |
| Social Media Links | Yes | Different accounts per tenant |
| Panel/Dashboard Nav | **No (Shared)** | Same functionality for all patients |
| Auth Flow Nav | **No (Shared)** | Same sign-in/sign-up flow |

**Files to Update:**
- `src/dictionaries/nav-Item-config.ts` → Read from `tenant.navigation.main`
- `src/shared/constants/footer.constants.ts` → DELETE, use config
- `src/layouts/footers/footer.tsx` → Dynamic from `useTenant()`

**Header Navigation Pattern:**
```typescript
// BEFORE (nav-Item-config.ts)
export const NAV_ITEMS = [
  { label: "Women's Health", items: [...] },
  { label: "Men's Health", items: [...] },
];

// AFTER (dynamic from config)
function MainNav() {
  const tenant = useTenant();

  return (
    <nav>
      {tenant.navigation.main.map(item => (
        <NavItem key={item.id} href={item.href}>
          {item.label}
        </NavItem>
      ))}
    </nav>
  );
}
```

**Footer Pattern:**
```typescript
function Footer() {
  const tenant = useTenant();

  return (
    <footer>
      {/* Brand Column */}
      <div>
        <CompanyLogo variant="white" />
        <p>{tenant.tagline}</p>
      </div>

      {/* Links */}
      <div>
        {tenant.footer.links.map(link => (
          <a key={link.label} href={link.href}>{link.label}</a>
        ))}
      </div>

      {/* Contact */}
      <div>
        <a href={`mailto:${tenant.footer.supportEmail}`}>
          {tenant.footer.supportEmail}
        </a>
        <a href={`tel:${tenant.footer.supportPhone.replace(/\D/g, '')}`}>
          {tenant.footer.supportPhone}
        </a>
      </div>

      {/* Social Media (conditional) */}
      {tenant.socialMedia && (
        <div>
          {tenant.socialMedia.facebook && (
            <a href={tenant.socialMedia.facebook}>Facebook</a>
          )}
          {tenant.socialMedia.instagram && (
            <a href={tenant.socialMedia.instagram}>Instagram</a>
          )}
        </div>
      )}

      {/* Copyright */}
      <p>© {new Date().getFullYear()} {tenant.footer.copyright}. All rights reserved.</p>
    </footer>
  );
}
```

---

### Category 4: Legal & Compliance

| Element | Current Path | Migration Strategy |
|---------|--------------|-------------------|
| Terms of Service | `/terms-of-service` | `tenant.legal.termsOfService` |
| Privacy Policy | `/privacy-policy` | `tenant.legal.privacyPolicy` |
| SMS Terms & Conditions | `/sms-terms-conditions` | `tenant.legal.smsTerms` |
| Consent to Treatment | `/consent-to-treatment` | `tenant.legal.consentToTreatment` |
| Consent for Sensitive Data | `/consent-for-sensitive-data-processing` | `tenant.legal.consentSensitiveData` |
| Notice of Privacy Practices (HIPAA) | `/notice-of-privacy-practices` | `tenant.legal.hipaaNotice` |
| Pharmacy Disclaimer | `/pharmacy-disclaimer` | `tenant.legal.pharmacyDisclaimer` |
| Copyright Text | `© Hedfirst™` | `tenant.footer.copyright` |
| Company Legal Name | `Hedfirst LLC` | `tenant.legal.companyName` |

**Decision: Option C - External URLs (All Legal Pages)**

ALL legal/consent pages are hosted by the tenant on their own website. The platform links out to these external URLs.

**Rationale:**
- Tenant maintains full control over legal content
- No platform liability for legal content accuracy
- Easiest to implement - just store URLs in config
- Tenant can update legal pages without platform deployment
- Different tenants may have different legal requirements

**Config Structure:**
```typescript
legal: {
  // Required
  termsOfService: "https://renewell.com/terms",
  privacyPolicy: "https://renewell.com/privacy",
  hipaaNotice: "https://renewell.com/hipaa",
  consentToTreatment: "https://renewell.com/consent-treatment",

  // Optional (render link only if provided)
  smsTerms: "https://renewell.com/sms-terms",
  consentSensitiveData: "https://renewell.com/consent-sensitive",
  pharmacyDisclaimer: "https://renewell.com/pharmacy-disclaimer",

  // Company info
  companyName: "Renewell Health LLC",
  jurisdiction: "Delaware"
}
```

**Conditional Rendering:**
If a tenant doesn't have a certain legal page (e.g., no SMS terms because they don't use SMS), omit from config and the link won't render:

```typescript
{tenant.legal.smsTerms && (
  <a href={tenant.legal.smsTerms}>SMS Terms & Conditions</a>
)}
```

---

### Category 5: Email Templates

| Template | Current Issues | Migration Strategy |
|----------|----------------|-------------------|
| `order-summary.html` | Hedfirst branding, wrong phone | Variable injection |
| `reset-password.html` | Says "Met-Tech" (!!) | Variable injection |
| `store-admin.html` | Says "Met-Tech" | Variable injection |
| `reactivation-email.html` | Hedfirst branding | Variable injection |

**Variable Injection Approach:**

Email templates use placeholders that get replaced at send time:

```html
<!-- BEFORE -->
<img src="https://hedfirst.com/logo.png" alt="Hedfirst">
<p>© 2025 Hedfirst. All rights reserved.</p>
<a href="mailto:support@hedfirst.com">support@hedfirst.com</a>

<!-- AFTER -->
<img src="{{logoUrl}}" alt="{{storeName}}">
<p>© {{year}} {{copyright}}. All rights reserved.</p>
<a href="mailto:{{supportEmail}}">{{supportEmail}}</a>
```

**Required Template Variables:**

| Variable | Source |
|----------|--------|
| `{{storeName}}` | `tenant.name` |
| `{{logoUrl}}` | `tenant.branding.logo` |
| `{{primaryColor}}` | `tenant.branding.colors.primary` |
| `{{supportEmail}}` | `tenant.footer.supportEmail` |
| `{{supportPhone}}` | `tenant.footer.supportPhone` |
| `{{copyright}}` | `tenant.footer.copyright` |
| `{{year}}` | `new Date().getFullYear()` |
| `{{termsUrl}}` | `tenant.legal.termsOfService` |
| `{{privacyUrl}}` | `tenant.legal.privacyPolicy` |

**Backend Implementation:**
```typescript
// In email service
async function sendOrderConfirmation(orderId: string) {
  const order = await getOrder(orderId);
  const tenant = await getTenantConfig(order.storeSlug);

  const template = await loadTemplate('order-summary.html');
  const html = injectVariables(template, {
    storeName: tenant.name,
    logoUrl: tenant.branding.logo,
    primaryColor: tenant.branding.colors.primary,
    supportEmail: tenant.footer.supportEmail,
    supportPhone: tenant.footer.supportPhone,
    copyright: tenant.footer.copyright,
    year: new Date().getFullYear(),
  });

  await sendEmail({ to: order.email, html });
}
```

---

### Category 6: Catalog & Product Configuration

This is a critical section - each tenant can have completely different catalog structures.

#### Catalog Layout Types

| Layout | Description | Example Tenant | Config Value |
|--------|-------------|----------------|--------------|
| `flat-grid` | All products in single grid with filters | Hedfirst (187 products) | `"catalogLayout": "flat-grid"` |
| `category-grouped` | Products grouped by category sections | Renewell (5 products) | `"catalogLayout": "category-grouped"` |

#### Catalog Features Toggle

| Feature | Hedfirst | Renewell | Config Field |
|---------|----------|----------|--------------|
| Search Bar | Yes | No | `features.showSearch` |
| Filter Sidebar | Yes | No | `features.showFilters` |
| Category Nav | Yes (mega menu) | No | `features.showCategories` |

**Config Example:**
```json
"features": {
  "showSearch": false,
  "showFilters": false,
  "showCategories": false,
  "catalogLayout": "category-grouped"
}
```

#### Disease States / Categories Setup

**What are Disease States?**
Disease states are the product categories shown in navigation (e.g., "Weight Loss", "Hair Loss", "Hormone Therapy").

**Hedfirst Approach (Complex):**
- 40+ disease states
- Organized under parent categories (Women's Health, Men's Health, etc.)
- Mega menus with dropdowns
- Products tagged with disease states in DB

**Renewell Approach (Simple):**
- 2 categories: "GLP-1 Treatments", "Peptide Therapy"
- Simple nav links
- Products have `categoryId` in DB

**MVP Setup Process:**

1. **Define Categories in Config:**
```json
"categories": [
  {
    "id": "glp1",
    "name": "GLP-1 Treatments",
    "description": "FDA-approved weight management solutions",
    "slug": "glp-1-treatments"
  },
  {
    "id": "peptides",
    "name": "Peptide Therapy",
    "description": "Advanced peptide formulations",
    "slug": "peptide-therapy"
  }
]
```

2. **Link Nav Items to Categories:**
```json
"navigation": {
  "main": [
    { "id": "glp1", "label": "GLP-1 Treatments", "href": "/{tenant}/catalog#glp1" },
    { "id": "peptides", "label": "Peptide Therapy", "href": "/{tenant}/catalog#peptides" }
  ]
}
```

3. **Create Products with Category Assignment:**
   - In Store Admin, create products
   - Assign each product to a category
   - Category IDs must match config IDs

#### Catalog Component Selection

The catalog page dynamically selects the right component based on tenant config:

```typescript
// src/app/[tenant]/catalog/page.tsx
export default function CatalogPage() {
  const tenant = useTenant();

  // Choose catalog layout based on tenant config
  if (tenant.features.catalogLayout === "category-grouped") {
    return <CategoryGroupedCatalog />;
  }

  // Default: Hedfirst-style flat grid with filters
  return <FlatGridCatalog />;
}
```

**Files Involved:**
| Component | Purpose | Used By |
|-----------|---------|---------|
| `FlatGridCatalog.tsx` | Grid with search/filters | Hedfirst |
| `CategoryGroupedCatalog.tsx` | Sections by category | Renewell |
| `CatalogFilters.tsx` | Filter sidebar | Hedfirst only |
| `CatalogSearch.tsx` | Search bar | Hedfirst only |

#### Product Content & FAQs

**Decision: CMS-Managed, Not Code Templates**

Product-specific content (FAQs, descriptions, how-it-works) is managed via the **lightweight CMS** in Store Admin, NOT code files.

**Current State (Hedfirst - Legacy):**
```
src/dictionaries/templates/
├── indo-relief.ts
├── migra-cream.ts
├── mens-hair-serum.ts
├── womens-hair-serum.ts
├── ai-medical-assessment-membership.ts
└── ... (8+ files with hardcoded FAQs)
```
These are Hedfirst-specific product templates with hardcoded content. They contain "Hedfirst" references and are tied to Hedfirst's specific products.

**Target State (All Tenants):**
- Each tenant creates products via **Store Admin**
- Product FAQs/content entered via **CMS** (per product)
- Colors come from **tenant config** (CSS variables)
- **No code templates needed** - entirely data-driven

**How It Works:**
```
┌─────────────────────────────────────────────────────────────┐
│ Store Admin (Ops/PM)                                         │
│ ├── Create Product                                           │
│ │   ├── Name, price, description                            │
│ │   ├── Category assignment                                  │
│ │   └── Images                                               │
│ └── CMS Section                                              │
│     ├── FAQ entries (question + answer)                      │
│     ├── How It Works steps                                   │
│     └── Safety information                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Patient Portal                                               │
│ ├── Fetches product data from API                           │
│ ├── Fetches FAQ content from CMS                            │
│ ├── Applies tenant colors from config                       │
│ └── Renders product page (shared component)                 │
└─────────────────────────────────────────────────────────────┘
```

**Migration Plan:**
| Item | Action |
|------|--------|
| New tenant products | Use CMS from day one |
| Hedfirst legacy templates | Future: migrate to CMS (separate ticket) |
| Hardcoded "Hedfirst" in templates | Will be eliminated when migrated to CMS |

**No code changes needed for new tenant products** - Ops creates products and content via Store Admin CMS.

---

### Category 7: Admin Portals Branding

**CRITICAL:** All three admin portals currently show Hedfirst branding. This MUST be tenant-aware.

#### Portals to Update

| Portal | Repo | Current State | What Needs Changing |
|--------|------|---------------|---------------------|
| **Patient Portal** | `node-hedfirst-patient` | Hedfirst branded | Logo, colors, nav, footer, contact info |
| **Store Admin** | `node-hedfirst-admin` | Hedfirst branded | Logo, colors, header, support info |
| **Provider Admin** | `node-hedfirst-provider` | Hedfirst branded | Logo, colors, header, support info |

#### Store Admin Portal Changes

**Current Hardcoded Elements:**
- Logo in header (Hedfirst logo)
- Support contact info
- Footer branding
- Email templates sent from admin

**Required Changes:**
```typescript
// Store Admin header should read from tenant config
function AdminHeader() {
  const tenant = useTenant(); // Get from authenticated user's store

  return (
    <header>
      <Image src={tenant.branding.logo} alt={tenant.name} />
      <span>{tenant.name} Admin</span>
    </header>
  );
}
```

**Important Note:** Store Admin users are scoped to ONE store. Their tenant config comes from their store association, not URL path.

#### Provider Admin Portal Changes

**Current Hardcoded Elements:**
- Logo in header
- Support/contact information
- Legal links

**Complexity:** Providers may serve multiple stores. Need to determine:
- **Option A:** Show Teligant/platform branding (neutral)
- **Option B:** Show provider's primary store branding
- **MVP Recommendation:** Option A - neutral platform branding for Provider Admin

#### Patient Admin Portal Changes (Primary Focus)

This is the customer-facing portal where tenant branding is most important.

**Full Branding Checklist:**
- [ ] Header logo → `tenant.branding.logo`
- [ ] Header navigation → `tenant.navigation.main`
- [ ] Header colors → CSS variables from `tenant.branding.colors`
- [ ] Footer logo → `tenant.branding.logoWhite`
- [ ] Footer links → `tenant.footer.links`
- [ ] Footer contact → `tenant.footer.supportEmail`, `supportPhone`
- [ ] Footer social → `tenant.socialMedia.*` (conditional)
- [ ] Footer legal links → `tenant.legal.*`
- [ ] Page titles → `tenant.name`
- [ ] Favicon → `tenant.branding.favicon`
- [ ] Email templates → Variable injection

---

### Category 8: Questionnaire Setup

Questionnaires are the intake forms patients complete for each product/treatment.

#### Current State

- Questionnaires are stored in database
- Associated with products via `productId`
- Questions are stored as JSON
- Some questions reference "Hedfirst" in text

#### Questionnaire Tenant Scoping

**Data Model:**
```
Product (storeId) → Questionnaire → Questions
```

Since products are scoped to stores, questionnaires are implicitly tenant-scoped.

#### MVP Setup Process for New Tenant Questionnaires

**Step 1: PM Creates Questionnaire Spec**

Document for each product:
- Product name
- Questions (text, type, options)
- Required vs optional
- Conditional logic (if any)
- Compliance requirements (HIPAA, state regs)

**Step 2: Developer Creates Database Records**

```sql
-- Create questionnaire
INSERT INTO "Questionnaire" (id, productId, name, version, status)
VALUES (
  'q_renewell_semaglutide_v1',
  'prod_renewell_semaglutide',
  'Semaglutide Intake Form',
  1,
  'active'
);

-- Create questions
INSERT INTO "Question" (id, questionnaireId, order, type, text, required, options)
VALUES
  ('q1', 'q_renewell_semaglutide_v1', 1, 'text', 'What is your current weight?', true, null),
  ('q2', 'q_renewell_semaglutide_v1', 2, 'select', 'Have you used GLP-1 medications before?', true, '["Yes", "No"]'),
  ...
```

**Step 3: Link to Product in Store Admin**

- In Store Admin, edit product
- Associate questionnaire with product
- Set as required for purchase

#### Questionnaire Branding Considerations

**Check for hardcoded references in question text:**
- ❌ "Hedfirst medical team will review..."
- ✅ "Our medical team will review..."
- ❌ "Contact support@hedfirst.com"
- ✅ Use `{{supportEmail}}` variable

**Use neutral language OR variable injection in questions:**
```json
{
  "text": "By submitting this form, you agree to {{storeName}}'s Terms of Service.",
  "variables": ["storeName"]
}
```

#### Questionnaire Files to Check

| File/Location | Check For |
|---------------|-----------|
| Question text in DB | Hardcoded "Hedfirst" references |
| Questionnaire templates | Brand-specific language |
| Consent forms | Company name, legal entity |
| HIPAA authorization | Covered entity name |

---

### Category 9: Operational Content

These are content pieces that need tenant customization but aren't strictly "branding":

| Content Type | Location | Tenant-Specific? |
|--------------|----------|------------------|
| FAQ content | Product pages | Yes (per product/store) |
| How It Works | Landing page | Yes (different process per tenant) |
| About Us | Static page | Yes (tenant's company info) |
| Blog posts | CMS/external | Yes (tenant's content) |
| Help articles | Support docs | Partially (some shared, some specific) |

**MVP Approach:**
- FAQ → Stored with product in DB
- How It Works → External URL in config (`tenant.externalLinks.howItWorks`)
- About Us → External URL (`tenant.externalLinks.about`)
- Blog → External URL (`tenant.externalLinks.blog`)

---

### Category 10: Checkout Flow Configuration

Different tenants may want different purchase journeys. This is configurable per tenant with developer support.

#### Flow Types

| Flow Type | Step Order | Use Case |
|-----------|------------|----------|
| `payment-first` | Product → Checkout → Account → Questionnaire → Confirmation | Current Hedfirst flow. Captures payment commitment early. |
| `account-first` | Product → Account → Questionnaire → Checkout → Confirmation | Lead capture before payment. Good when questionnaire may disqualify patient. |
| `custom` | Defined in `steps` array | For unique tenant requirements. Requires dev implementation. |

#### Why Offer Different Flows?

**Payment-First (Hedfirst current):**
- Captures payment commitment early
- Lower drop-off after payment entered
- Works well when approval is near-guaranteed

**Account-First:**
- Questionnaire might disqualify patient (why collect payment for rejected orders?)
- Captures lead (account) before payment friction
- Medical review may be required before payment authorization
- Better UX for prescription products where approval isn't guaranteed
- Patient can be contacted even if they abandon at payment step

#### Config Structure

```json
"checkoutFlow": {
  "type": "account-first",
  "steps": ["product", "account", "questionnaire", "payment", "confirmation"]
}
```

**Note:** The `steps` array is only used when `type` is `"custom"`. For `payment-first` and `account-first`, the steps are predefined.

#### Detailed Step Definitions

| Step | What Happens | Required Data |
|------|--------------|---------------|
| `product` | User selects product, views details | Product ID |
| `account` | User creates account or logs in | Email, password, basic info |
| `questionnaire` | User completes medical intake form | Questionnaire responses |
| `payment` | User enters payment information | Card details, billing address |
| `confirmation` | Order submitted, confirmation shown | - |

#### Implementation Notes

**For `payment-first` (current Hedfirst):**
```
/product/[id] → /checkout → (inline account creation) → /questionnaire → /confirmation
```

**For `account-first`:**
```
/product/[id] → /get-started (account) → /questionnaire/[productId] → /checkout → /confirmation
```

**State Management Considerations:**
- Account-first flow needs to preserve selected product through account creation
- Questionnaire completion must be tracked before allowing checkout
- Cart state persists across steps

#### MVP Implementation

For MVP, we support two preset flows:

| Tenant | Flow Type | Implementation |
|--------|-----------|----------------|
| Hedfirst | `payment-first` | Current implementation (no changes) |
| Renewell | `account-first` | New flow (requires dev work) |

**Custom flows:** If a tenant needs something different, dev implements as `"custom"` type and codes the specific step logic.

#### Ops Process

1. **PM determines flow** - During tenant intake, ask: "Should users create an account before or after entering payment?"
2. **Document in worksheet** - Add to Section 13 (below)
3. **Dev implements** - If new flow type needed, dev builds it
4. **No admin UI** - Flow type is set in tenant config JSON, changed by dev only

#### What This Does NOT Cover (Future)

- Per-product flow configuration (all products same flow for now)
- A/B testing different flows
- Dynamic flow based on product type
- Skip questionnaire option

---

## MVP: New Tenant Branding Setup Process

Since there's no admin UI for MVP, here's the manual process:

### Step 1: Gather Branding Assets

**Checklist for new tenant:**
- [ ] Logo (SVG preferred, PNG fallback) - primary color version
- [ ] Logo (white/light version) - for dark backgrounds
- [ ] Favicon (ICO or PNG, 32x32 and 180x180)
- [ ] Brand colors (primary, secondary, accent, background, text)
- [ ] Support email address
- [ ] Support phone number
- [ ] Business hours
- [ ] Social media URLs (if any)
- [ ] Legal page URLs (terms, privacy, HIPAA)
- [ ] Company legal name and jurisdiction

### Step 2: Upload Assets

**Location:** `/public/tenants/{tenant-slug}/`

```
public/
└── tenants/
    └── renewell/
        ├── logo.svg
        ├── logo-white.svg
        ├── favicon.ico
        └── og-image.png    (optional, for social sharing)
```

**Alternative:** Upload to S3/CDN and use full URLs in config.

### Step 3: Create Tenant Config JSON

Create the JSON config for the database `Tenant.config` column:

```json
{
  "tagline": "Renew Your Wellness",

  "branding": {
    "logo": "/tenants/renewell/logo.svg",
    "logoWhite": "/tenants/renewell/logo-white.svg",
    "favicon": "/tenants/renewell/favicon.ico",
    "ogImage": "/tenants/renewell/og-image.png",
    "colors": {
      "primary": "#2D5A27",
      "primaryHover": "#1E3D1A",
      "secondary": "#8B4513",
      "accent": "#F4A460",
      "background": "#FAFAF5",
      "text": "#1A1A1A"
    }
  },

  "features": {
    "showSearch": false,
    "showFilters": false,
    "catalogLayout": "category-grouped"
  },

  "navigation": {
    "main": [
      { "id": "glp1", "label": "GLP-1 Treatments", "href": "/renewell/catalog#glp1" },
      { "id": "peptides", "label": "Peptide Therapy", "href": "/renewell/catalog#peptides" },
      { "id": "resources", "label": "Resources", "href": "https://renewell.com/resources" },
      { "id": "about", "label": "About Us", "href": "https://renewell.com/about" }
    ]
  },

  "footer": {
    "links": [
      { "label": "GLP-1 Treatments", "href": "/renewell/catalog#glp1" },
      { "label": "Peptide Therapy", "href": "/renewell/catalog#peptides" },
      { "label": "Resources", "href": "https://renewell.com/resources" },
      { "label": "About Us", "href": "https://renewell.com/about" },
      { "label": "Privacy Policy", "href": "https://renewell.com/privacy" },
      { "label": "Terms of Service", "href": "https://renewell.com/terms" }
    ],
    "copyright": "Renewell",
    "supportEmail": "support@renewell.com",
    "supportPhone": "+1 (555) 123-4567"
  },

  "socialMedia": {
    "facebook": null,
    "instagram": "https://instagram.com/renewell",
    "linkedin": null
  },

  "legal": {
    "termsOfService": "https://renewell.com/terms",
    "privacyPolicy": "https://renewell.com/privacy",
    "hipaaNotice": "https://renewell.com/hipaa",
    "companyName": "Renewell Health LLC",
    "jurisdiction": "Delaware"
  },

  "businessHours": "Monday–Friday, 9 am–5 pm EST"
}
```

### Step 4: Insert Database Records

```sql
-- 1. Create Organization (if new)
INSERT INTO "Organization" (id, name, ...)
VALUES ('org_renewell', 'Renewell Health', ...);

-- 2. Create Store
INSERT INTO "Store" (id, name, domain, organizationId, ...)
VALUES ('store_renewell', 'Renewell', 'renewell.com', 'org_renewell', ...);

-- 3. Create Tenant
INSERT INTO "Tenant" (id, slug, storeId, organizationId, name, config, active)
VALUES (
  'tenant_renewell',
  'renewell',
  'store_renewell',
  'org_renewell',
  'Renewell',
  '{ ... JSON config from Step 3 ... }',
  true
);
```

### Step 5: Add Environment Variables (MVP Middleware)

Until database lookup is implemented in middleware:

```bash
# .env.production
RENEWELL_STORE_ID=store_renewell
RENEWELL_ORG_ID=org_renewell
```

And add to `TENANT_MAP` in middleware:
```typescript
const TENANT_MAP = {
  hedfirst: { storeId: process.env.HEDFIRST_STORE_ID, ... },
  renewell: { storeId: process.env.RENEWELL_STORE_ID, ... },
};
```

### Step 6: Create Products

Use Store Admin to create products for the new tenant's store.

### Step 7: Test

- [ ] Visit `/renewell/catalog` - verify branding loads
- [ ] Check logo appears correctly
- [ ] Check colors applied
- [ ] Check navigation links work
- [ ] Check footer displays correctly
- [ ] Test email sends with correct branding
- [ ] Verify no "Hedfirst" text appears anywhere

---

## Implementation Priority Order

### Phase 1: Core Branding (Do First)

| Task | Files | Effort |
|------|-------|--------|
| Create `TenantConfig` type with all branding fields | `src/types/tenant.types.ts` | Low |
| Update `CompanyLogo` component | `src/components/company-logo/` | Low |
| Create CSS variable injection | Root layout | Low |
| Delete `support-contacts.ts`, use config | Multiple files | Low |

### Phase 2: Navigation & Footer

| Task | Files | Effort |
|------|-------|--------|
| Update Footer component to read from config | `src/layouts/footers/footer.tsx` | Medium |
| Delete `footer.constants.ts` | Delete file | Low |
| Update Header nav to read from config | `src/dictionaries/nav-Item-config.ts` | Medium |
| Handle conditional social media links | Footer | Low |

### Phase 3: Dictionary Strings

| Task | Files | Effort |
|------|-------|--------|
| Replace hardcoded brand name in dictionary | `src/dictionaries/dictionary.ts` | Medium |
| Replace contact info in dictionary | `src/dictionaries/dictionary.ts` | Medium |
| Create dictionary helper that injects tenant vars | New utility | Medium |

### Phase 4: Email Templates

| Task | Files | Effort |
|------|-------|--------|
| Add variable placeholders to all templates | `public/templates/*.html` | Medium |
| Fix "Met-Tech" references (urgent bug!) | `reset-password.html`, `store-admin.html` | Low |
| Create email variable injection service | Backend | Medium |

### Phase 5: Metadata & SEO

| Task | Files | Effort |
|------|-------|--------|
| Dynamic page titles | `src/app/layout.tsx` | Low |
| Dynamic OG images | `src/app/layout.tsx` | Low |
| Dynamic JSON-LD schema | `src/app/layout.tsx` | Medium |

---

## Extended TenantConfig Type (Full Branding)

Based on the audit, here's the complete type needed:

```typescript
// src/types/tenant.types.ts

export interface TenantConfig {
  // Identity (DB columns)
  slug: string;
  storeId: string;
  organizationId: string;
  name: string;

  // Extended branding (in config JSON)
  tagline?: string;

  branding: {
    logo: string;
    logoWhite: string;
    favicon: string;
    ogImage?: string;
    colors: {
      primary: string;
      primaryHover: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  };

  features: {
    showSearch: boolean;
    showFilters: boolean;
    showCategories: boolean;
    catalogLayout: "flat-grid" | "category-grouped";
  };

  navigation: {
    main: Array<{
      id: string;
      label: string;
      href: string;
      children?: Array<{ id: string; label: string; href: string }>;
    }>;
  };

  footer: {
    links: Array<{ label: string; href: string }>;
    copyright: string;
    supportEmail: string;
    supportPhone: string;
  };

  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };

  legal: {
    // Required
    termsOfService: string;        // External URL
    privacyPolicy: string;         // External URL
    hipaaNotice: string;           // External URL
    consentToTreatment: string;    // External URL

    // Optional (conditionally rendered)
    smsTerms?: string;             // External URL
    consentSensitiveData?: string; // External URL
    pharmacyDisclaimer?: string;   // External URL

    // Company info
    companyName: string;
    jurisdiction: string;
  };

  businessHours?: string;

  externalLinks?: {
    website?: string;
    blog?: string;
    about?: string;
    contact?: string;
    howItWorks?: string;
  };

  verification?: {
    legitScriptId?: string;
    showHipaaCompliance: boolean;
    showFdaRegulated: boolean;
  };

  categories?: Array<{
    id: string;
    name: string;
    description?: string;
    slug: string;
  }>;

  integrations: {
    dosespot: {
      mode: "platform" | "tenant-owned";
      clinicId?: string;
    };
    payment: {
      payTheoryMerchantId: string;
    };
  };

  checkoutFlow: {
    type: "payment-first" | "account-first" | "custom";
    steps?: Array<"product" | "account" | "questionnaire" | "payment" | "confirmation">;
  };
}
```

---

## Known Issues & Separate Tickets

These items were identified during the audit but are **out of scope** for branding migration. They require separate tickets.

### Bug Fixes (File Immediately)

| Issue | File | Priority | Ticket |
|-------|------|----------|--------|
| **Met-Tech copyright** | `reset-password.html`, `store-admin.html` | Critical | TODO |
| **Wrong phone number** | `order-summary.html` (`+1-888-427-7196` vs `+1 888-427-1796`) | High | TODO |
| **Security email unused** | `reactivation-email.html` references `security@hedfirst.com` | Medium | TODO |
| **Placeholder URLs** | Email templates have `https://example.com/` links | High | TODO |

### Infrastructure (Separate Ticket)

| Issue | Details | Recommendation |
|-------|---------|----------------|
| **Hardcoded AWS Account ID** | S3 URLs contain `438465124128` | Keep as-is for MVP (shared infrastructure) |
| **Dev domain hardcoded** | `onix-systems-hedfirst-patient.dev.onix.team` | Environment variable, not branding |
| **S3/CDN URLs** | `s3.onix-systems.com/hedfirst/...` | Future: tenant-specific buckets |

**Decision:** Infrastructure URLs are shared across all tenants for MVP. Tenant-specific asset storage is a future enhancement.

### Legacy Code (Future Cleanup)

| Issue | Details | Recommendation |
|-------|---------|----------------|
| **Hedfirst product templates** | 8+ files in `src/dictionaries/templates/` | Migrate to CMS (separate ticket) |
| **Dictionary strings** | 25+ "Hedfirst" references in `dictionary.ts` | Part of branding migration |

---

## Checklist: Branding Migration Complete

When branding migration is complete:

- [ ] No hardcoded "Hedfirst" text in codebase (except in comments)
- [ ] No hardcoded `hedfirst.com` URLs
- [ ] No hardcoded `support@hedfirst.com` or phone numbers
- [ ] Logo component reads from `tenant.branding.logo`
- [ ] Colors applied via CSS variables from tenant config
- [ ] Header navigation reads from `tenant.navigation.main`
- [ ] Footer reads from `tenant.footer`
- [ ] Email templates use `{{variable}}` placeholders
- [ ] "Met-Tech" bug fixed in email templates
- [ ] Legal links point to tenant-specific URLs
- [ ] Social media links conditionally render
- [ ] New tenant can be created by inserting DB record + uploading assets

---

## Appendix A: PM Tenant Intake Worksheet

Use this worksheet when gathering requirements for a new tenant. Fill out and hand off to developer.

```markdown
# Tenant Configuration Worksheet

**Tenant Name:** ________________________
**Tenant Slug (URL):** ________________________ (lowercase, no spaces, e.g., "renewell")
**Target Launch Date:** ________________________
**PM Contact:** ________________________

---

## 1. Brand Identity

| Field | Value |
|-------|-------|
| Company Legal Name | |
| Display Name (Store Name) | |
| Tagline | |
| Jurisdiction (State of incorporation) | |

---

## 2. Brand Colors

Provide hex codes (e.g., #2D5A27)

| Color | Hex Code | Notes |
|-------|----------|-------|
| Primary (main brand color) | | Used for buttons, links |
| Primary Hover | | Darker shade of primary |
| Secondary | | Secondary buttons, accents |
| Accent | | Badges, highlights |
| Background | | Page background |
| Text | | Body text color |

---

## 3. Logo Files

| Asset | Filename | Provided? |
|-------|----------|-----------|
| Primary Logo (SVG preferred) | | ☐ Yes ☐ No |
| White/Light Logo (for dark backgrounds) | | ☐ Yes ☐ No |
| Favicon (32x32 and 180x180) | | ☐ Yes ☐ No |
| OG Image (social sharing, 1200x630) | | ☐ Yes ☐ No |

---

## 4. Contact Information

| Field | Value |
|-------|-------|
| Support Email | |
| Support Phone | |
| Business Hours | |

---

## 5. Navigation Items

List the main navigation items for the header:

| Order | Label | Link To |
|-------|-------|---------|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |

---

## 6. Footer Links

| Order | Label | URL |
|-------|-------|-----|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |

---

## 7. Social Media

| Platform | URL (or N/A) |
|----------|--------------|
| Facebook | |
| Instagram | |
| LinkedIn | |
| Twitter/X | |

---

## 8. Legal Pages

| Page | URL |
|------|-----|
| Terms of Service | |
| Privacy Policy | |
| HIPAA Notice | |
| Consent to Treatment | |
| SMS Terms & Conditions | |
| Pharmacy Disclaimer | |

---

## 9. Third-Party Verification (Optional)

**LegitScript Certification:**

☐ Tenant has LegitScript certification
☐ Tenant does NOT have LegitScript certification (badge will not display)

If yes, provide:
| Field | Value |
|-------|-------|
| LegitScript ID | |
| Verification URL | |

**Note:** LegitScript certification is the tenant's responsibility. The platform will only display the verification badge if the tenant provides their certification details.

**Compliance Badges to Display:**

☐ HIPAA Compliant badge
☐ FDA Regulated badge

---

## 10. Catalog Configuration

| Setting | Value |
|---------|-------|
| Number of Products | |
| Number of Categories | |
| Show Search Bar? | ☐ Yes ☐ No |
| Show Filter Sidebar? | ☐ Yes ☐ No |
| Catalog Layout | ☐ Flat Grid ☐ Category Grouped |

**Categories:**

| ID | Name | Description |
|----|------|-------------|
| | | |
| | | |
| | | |

---

## 11. Products (List)

| Product Name | Category | Price | Badge (optional) |
|--------------|----------|-------|------------------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

---

## 12. Questionnaires Required?

☐ Yes (attach questionnaire specs)
☐ No
☐ Use existing templates (specify which): ________________________

---

## 13. External Links

| Link | URL |
|------|-----|
| Main Website | |
| About Us | |
| How It Works | |
| Blog | |
| Contact Page | |

---

## 14. Checkout Flow

**Which checkout flow does this tenant need?**

☐ **Payment-First** (Hedfirst default)
   - Product → Checkout → Account → Questionnaire → Confirmation
   - Best when: Approval is near-guaranteed, want payment commitment early

☐ **Account-First**
   - Product → Account → Questionnaire → Checkout → Confirmation
   - Best when: Questionnaire may disqualify patient, want to capture leads before payment

☐ **Custom** (describe below)
   - Requires dev implementation

**If Custom, describe the desired flow:**

_____________________________________________________________________________

_____________________________________________________________________________

---

## Sign-off

**PM Signature:** ________________________  **Date:** ________________________

**Tenant Rep Approved:** ☐ Yes  **Date:** ________________________
```

---

## Appendix B: Developer Quick Reference

### New Tenant Setup Commands

```bash
# 1. Create tenant folder for assets
mkdir -p public/tenants/{slug}

# 2. Copy logo files
cp /path/to/logo.svg public/tenants/{slug}/
cp /path/to/logo-white.svg public/tenants/{slug}/
cp /path/to/favicon.ico public/tenants/{slug}/

# 3. Add to TENANT_MAP in middleware (temporary until DB lookup)
# Edit: src/middleware.ts

# 4. Run DB migrations/inserts
# Use SQL from Step 4 in "MVP: New Tenant Branding Setup Process"

# 5. Deploy
npm run build
vercel deploy --prod
```

### Quick Test Checklist

```bash
# Visit these URLs after deployment:
/{tenant}/catalog        # Catalog page
/{tenant}/login          # Login page
/{tenant}/get-started    # Sign up flow

# Check for:
# - Correct logo
# - Correct colors (inspect CSS variables)
# - No "Hedfirst" text anywhere
# - Footer shows correct contact info
# - Navigation links work
```

---

## References

- [HARDCODED-REFERENCES-AUDIT.md](./HARDCODED-REFERENCES-AUDIT.md) - Full inventory of 187+ references
- [Multi-Tenant Architecture Proposal.md](./Multi-Tenant%20Architecture%20Proposal.md) - Architecture decisions
- [RENEWELL-UI-HANDOFF.md](./RENEWELL-UI-HANDOFF.md) - Renewell UI implementation
- [PATH-BASED-ROUTING-TICKET.md](./PATH-BASED-ROUTING-TICKET.md) - Middleware implementation details
