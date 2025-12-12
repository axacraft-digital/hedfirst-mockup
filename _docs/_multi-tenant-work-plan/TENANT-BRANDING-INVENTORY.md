# Tenant Branding Inventory - Code Audit Results

**Created:** 2025-12-11
**Purpose:** Consolidated inventory of all branding-related code across repos, extracted from actual codebase
**Source:** `discovery/raw-repos/` (updated 2025-12-11)

---

## Executive Summary

| Category | Patient Portal | Store Admin | Doctor Portal | Super Admin |
|----------|----------------|-------------|---------------|-------------|
| Hedfirst text mentions | 99 | 82 | TBD | TBD |
| Files with brand refs | 37 | 28 | TBD | TBD |
| Color definitions | Tailwind + custom | Tailwind only | Tailwind only | Tailwind only |
| Email templates | 2 | 3 | 0 | 0 |

---

## 1. Color Definitions

> **Full color audit available in:** `COLOR-INVENTORY.md`

### Summary of Color Sources

| Source Location | Repo(s) | Format |
|-----------------|---------|--------|
| `tailwind.config.ts` | All 4 web portals | Tailwind color objects |
| `globals.css` | Store Admin | Inline hex in animations |
| `button.theme.ts` | Patient Portal | Tailwind class strings |
| `theme.ts` | Mobile App (hedfirst-app) | Shopify Restyle palette |
| Email templates (5 files) | Patient + Store Admin | Inline hex in HTML |

### Critical Finding: Inconsistent Primary Palettes

**Patient Portal uses Flowbite blue palette. Admin portals use standard Tailwind blue.**

| Shade | Patient Portal (Flowbite) | Admin Portals (Tailwind) | Match? |
|-------|---------------------------|--------------------------|--------|
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

### Patient Portal Custom Colors

**Source:** `node-hedfirst-patient/tailwind.config.ts`

| Name | Hex | Usage |
|------|-----|-------|
| `accent` | `#dcd7fe` | Light purple accent |
| `graphite` | `#222222` | Dark text |
| `plum` | `#7e22ce` | Purple highlight |
| `dark-plum` | `#530e8f` | Dark purple |
| `neutral-dark` | `#444444` | Secondary text |
| `deep-black` | `#010101` | Near black |
| `eerie-black` | `#1F1F1F` | Dark backgrounds |
| `dark-16` | `#181e2529` | 16% dark overlay |
| `dark-32` | `#181e2552` | 32% dark overlay |
| `dark-48` | `#181e257a` | 48% dark overlay |
| `dark-64` | `#181e25a3` | 64% dark overlay |
| `light-64` | `#ffffffa3` | 64% white overlay |
| `light-48` | `#ffffff7a` | 48% white overlay |

**Admin portals have NO custom colors** - only the primary palette.

### Mobile App Colors (Separate System)

**Source:** `hedfirst-app/src/providers/theme/theme.ts`

Uses Shopify Restyle (not Tailwind):

| Name | Hex | Notes |
|------|-----|-------|
| `primary` | `#007AFF` | iOS system blue |
| `primaryDark` | `#0A84FF` | Dark mode |
| `stone/800` | `#282524` | Dark gray |
| `stone/900` | `#1B1917` | Near black |
| `stone/400` | `#77716C` | Medium gray |
| `red` | `#C0392B` | Error |

### Email Template Colors (Hardcoded)

5 email templates contain 20+ hardcoded hex values:

| Hex | Usage | Templates |
|-----|-------|-----------|
| `#1A56DB` | Primary blue (buttons/links) | All 5 |
| `#057A55` | Dark green (success) | order-summary |
| `#0E9F6E` | Green (success) | order-summary |
| `#111928` | Near black (text) | All |
| `#6B7280` | Gray (muted text) | All |
| `#E5E7EB` | Light gray (borders) | All |
| `#F9FAFB` | Off-white (backgrounds) | All |

### Tailwind Default Colors Used

These are NOT customized but used extensively:

| Color Family | Usage Count (Patient Portal) |
|--------------|------------------------------|
| `gray-*` | 984+ occurrences |
| `red-*` | ~180 occurrences |
| `blue-*` | ~140 occurrences |
| `green-*` | ~50 occurrences |
| `yellow-*` | ~15 occurrences |
| `white` | 290 occurrences |
| `black` | 47 occurrences |

### Button Theme Colors

**Source:** `node-hedfirst-patient/src/components/buttons/button/button.theme.ts`

**Issue:** Uses `blue-700` directly instead of `primary-700` in some places:

```typescript
primary: "text-white bg-blue-700 enabled:hover:bg-blue-600"
```

This bypasses the tenant-configurable primary color.

---

## 2. Contact Information

### Source File
`node-hedfirst-patient/src/shared/constants/support-contacts.ts`

```typescript
export const SUPPORT_CONTACTS = {
  phone: "+1 888-427-1796",
  email: "support@hedfirst.com",
  bugReportUrl: "https://docs.google.com/forms/d/1JZj63aatNiVZRvqddv7e0tYvfW_JMIVJNfRvffDp8jA/edit",
};
```

### Other Locations
| File | Line | Value |
|------|------|-------|
| `dictionary.ts` | 238 | `telDisplay: "+1 888 427-1796"` |
| `dictionary.ts` | 1383 | Full subscription terms with phone, email, hours |
| `layout.tsx` | 40 | `email: "support@hedfirst.com"` (JSON-LD) |
| `empty-results.tsx` | 28-30 | Phone and email defaults |

### Business Hours
`dictionary.ts:1383`: `"Monday–Friday, 8 am–5 pm MTN"`

---

## 3. Logo References

### Patient Portal

| File | Import | Alt Text |
|------|--------|----------|
| `company-logo.tsx:3` | `@public/img/hedfirst-logo.svg` | "Hedfirst" |
| `company-logo.tsx:4` | `@public/img/hedfirst-logo-white.svg` | "Hedfirst" |
| `layout.tsx:13` | `@public/img/hedfirst-logo-white.svg` | (JSON-LD schema) |

### Logo Files Location
```
public/img/
├── hedfirst-logo.svg         # Primary logo (dark)
├── hedfirst-logo-white.svg   # Footer logo (light)
└── hedfirst-membership-lander.png  # OG image
```

---

## 4. Legal/Policy URLs

### Source File
`node-hedfirst-patient/src/shared/constants/footer.constants.ts`

```typescript
// LEGAL section links
{ label: "Terms of Service", href: "/terms-of-service" },
{ label: "Privacy Policy", href: "/privacy-policy" },
{ label: "SMS Terms & Conditions", href: "/sms-terms-conditions" },
{ label: "Consent to Treatment", href: "/consent-to-treatment" },
{ label: "Consent for Sensitive Data Processing", href: "/consent-for-sensitive-data-processing" },
{ label: "Notice of Privacy Practices", href: "/notice-of-privacy-practices" },
{ label: "Pharmacy Disclaimer", href: "/pharmacy-disclaimer" },
{ label: "CA, MA, RH, VT Licensure", href: "/ca-ma-rh-vt-licensure" },
```

**Note:** These are relative paths pointing to Webflow-hosted pages on hedfirst.com.

---

## 5. Social Media Links

### Source File
`node-hedfirst-patient/src/shared/constants/footer.constants.ts:76-79`

```typescript
export const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61574217832791", icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/hedfirst.health", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/hedfirst", icon: LinkedinIcon },
];
```

---

## 6. Navigation Structure

### Main Navigation (Patient Portal)
**Source:** `node-hedfirst-patient/src/dictionaries/nav-Item-config.ts`

```typescript
export const navItems: INavItemConfig[] = [
  { key: NavItemKey.AICareMembership, label: "AI Care Membership", menuType: NavMenuType.Content },
  { key: NavItemKey.WomensHealth, label: "Women's Health", menuType: NavMenuType.Content },
  { key: NavItemKey.MensHealth, label: "Men's Health", menuType: NavMenuType.Content },
  { key: NavItemKey.LabKits, label: "Lab Kits", menuType: NavMenuType.Content },
  { key: NavItemKey.MoreTreatments, label: "More Treatments", menuType: NavMenuType.Grid },
];
```

**Complexity:** Each nav item has nested `menuProps` with `columns` containing hierarchical categories and links.

### Footer Navigation
**Source:** `node-hedfirst-patient/src/shared/constants/footer.constants.ts`

```typescript
export const footerBlocks: FooterBlock[] = [
  { title: "Popular care areas", links: [...] },      // 10 links
  { title: "AI Care Membership", links: [...] },      // 4 links
  { title: "Company", links: [...] },                 // 4 links
  { title: "LEGAL", links: [...] },                   // 8 links
];
```

---

## 7. Copyright & Legal Text

### Source File
`node-hedfirst-patient/src/dictionaries/dictionary.ts`

```typescript
// Line 255
copyright: "Hedfirst LLC is a registered Delaware Limited Liability Company, operating in the United States. Our mission is to innovate in patient-focused healthcare solutions, with an emphasis on addressing migraine and related health challenges. We are committed to adhering to all applicable state and federal regulations while maintaining the highest standards of ethical business practices and patient care. Service not currently available in Mississippi, Alaska and New Jersey. © Hedfirst™ @[data], All Rights Reserved",

// Line 257
shortCopyright: "© Hedfirst.com @[date]",
```

---

## 8. Email Templates

### Patient Portal Templates
| Template | Path | Issues |
|----------|------|--------|
| `order-summary.html` | `public/templates/` | Hedfirst branding, hardcoded colors |
| `reset-password.html` | `public/templates/` | Hedfirst branding |

### Store Admin Templates
| Template | Path | Issues |
|----------|------|--------|
| `reactivation-email.html` | `public/templates/` | Hedfirst branding, `security@hedfirst.com` |
| `reset-password.html` | `public/templates/` | **"Met-Tech" bug** |
| `store-admin.html` | `public/templates/` | **"Met-Tech" bug** |

---

## 9. Brand Name Mentions (Sample)

### Categories of "Hedfirst" usage in `dictionary.ts`:

| Category | Example | Lines |
|----------|---------|-------|
| Brand name | `name: "Hedfirst"` | 191 |
| Welcome messages | `"Hedfirst Messages"` | 113, 121, 122 |
| Provider references | `"Hedfirst provider"` | 47, 210, 367 |
| Chat messages | `"Welcome to the chat with a Hedfirst provider"` | 210 |
| Account creation | `"Create your Hedfirst account"` | 1038 |
| Mobile app | `"Hedfirst mobile app is coming soon"` | 723 |
| Subscription terms | Full legal text with brand | 1383 |
| Product FAQs | `"Hedfirst Chief Medical Advisor"` | Multiple |
| AI references | `"Hedfirst AI"` | 56 |

---

## 10. Hedfirst-Specific Components

### Icons
| File | Component | Issue |
|------|-----------|-------|
| `icons/hedfirst-card-test.tsx` | `HedfirstCardText` | Hardcoded brand SVG |

### Usage
```typescript
// ai-medical-assessment-modal.tsx:98
<HedfirstCardText className="ml-[24px]" />
```

---

## 11. LegitScript Verification

### Source File
`node-hedfirst-patient/src/layouts/buttons/legit-script-button.tsx`

```typescript
title="Verify LegitScript Approval for www.hedfirst.com"
alt="Verify Approval for www.hedfirst.com"
```

---

## Proposed TenantBrandingConfig JSON Structure

Based on this inventory, here is the proposed consolidated configuration:

```json
{
  "$schema": "TenantBrandingConfig",
  "version": "1.0",

  "identity": {
    "slug": "hedfirst",
    "name": "Hedfirst",
    "legalName": "Hedfirst LLC",
    "tagline": "Your Health, Your Way",
    "jurisdiction": "Delaware"
  },

  "branding": {
    "logos": {
      "primary": "/tenants/hedfirst/logo.svg",
      "white": "/tenants/hedfirst/logo-white.svg",
      "favicon": "/tenants/hedfirst/favicon.ico",
      "ogImage": "/tenants/hedfirst/og-image.png"
    },
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
      },
      "accent": "#dcd7fe",
      "background": "#FFFFFF",
      "text": "#111827"
    }
  },

  "contact": {
    "supportEmail": "support@hedfirst.com",
    "supportPhone": "+1 888-427-1796",
    "supportPhoneDisplay": "+1 888 427-1796",
    "businessHours": "Monday–Friday, 8 am–5 pm MTN",
    "bugReportUrl": "https://docs.google.com/forms/d/1JZj63aatNiVZRvqddv7e0tYvfW_JMIVJNfRvffDp8jA/edit"
  },

  "social": {
    "facebook": "https://www.facebook.com/profile.php?id=61574217832791",
    "instagram": "https://www.instagram.com/hedfirst.health",
    "linkedin": "https://www.linkedin.com/company/hedfirst"
  },

  "legal": {
    "termsOfService": "/terms-of-service",
    "privacyPolicy": "/privacy-policy",
    "smsTerms": "/sms-terms-conditions",
    "consentToTreatment": "/consent-to-treatment",
    "consentSensitiveData": "/consent-for-sensitive-data-processing",
    "hipaaNotice": "/notice-of-privacy-practices",
    "pharmacyDisclaimer": "/pharmacy-disclaimer",
    "stateLicensure": "/ca-ma-rh-vt-licensure"
  },

  "copyright": {
    "short": "© Hedfirst.com",
    "full": "Hedfirst LLC is a registered Delaware Limited Liability Company, operating in the United States. Our mission is to innovate in patient-focused healthcare solutions, with an emphasis on addressing migraine and related health challenges. We are committed to adhering to all applicable state and federal regulations while maintaining the highest standards of ethical business practices and patient care. Service not currently available in Mississippi, Alaska and New Jersey. © Hedfirst™, All Rights Reserved"
  },

  "verification": {
    "legitScriptUrl": "https://legitscript.com/verify/hedfirst.com",
    "showHipaaCompliance": true,
    "showFdaRegulated": true
  },

  "navigation": {
    "main": [
      {
        "key": "ai-care",
        "label": "AI Care Membership",
        "menuType": "content",
        "columns": "SEE nav-Item-config.ts FOR FULL STRUCTURE"
      },
      {
        "key": "womens-health",
        "label": "Women's Health",
        "menuType": "content"
      },
      {
        "key": "mens-health",
        "label": "Men's Health",
        "menuType": "content"
      },
      {
        "key": "lab-kits",
        "label": "Lab Kits",
        "menuType": "content"
      },
      {
        "key": "more-treatments",
        "label": "More Treatments",
        "menuType": "grid"
      }
    ],
    "panel": [
      { "key": "shop-medications", "label": "Shop Medications", "href": "/catalog" },
      { "key": "shop-lab-tests", "label": "Shop Lab Tests", "href": "/catalog/lab-tests" },
      { "key": "primary-care", "label": "Primary Care", "href": "/what-we-treat-overview" }
    ]
  },

  "footer": {
    "blocks": [
      {
        "title": "Popular care areas",
        "links": [
          { "label": "Skin Care", "href": "/treatment-categories/skin-care" },
          { "label": "Hair & Scalp", "href": "/treatment-categories/hair-growth" },
          { "label": "Migraines", "href": "/treatment-categories/migraine" }
        ]
      },
      {
        "title": "AI Care Membership",
        "links": [
          { "label": "Get Care", "href": "/ai-powered-medical-care" },
          { "label": "Shop All Medications", "href": "/catalog" }
        ]
      },
      {
        "title": "Company",
        "links": [
          { "label": "Who We Are", "href": "/about-us" },
          { "label": "Contact Us", "href": "/contact-us" }
        ]
      }
    ]
  },

  "features": {
    "showSearch": true,
    "showFilters": true,
    "showCategories": true,
    "catalogLayout": "flat-grid",
    "hasMobileApp": false
  },

  "externalLinks": {
    "website": "https://www.hedfirst.com",
    "blog": "https://www.hedfirst.com/blog",
    "about": "https://www.hedfirst.com/about-us",
    "howItWorks": "https://www.hedfirst.com/how-hedfirst-works",
    "contact": "https://www.hedfirst.com/contact-us"
  }
}
```

---

## Files to Modify (Priority Order)

### High Priority (Colors - See `COLOR-INVENTORY.md` for details)

| File | Repo | Issue | Action |
|------|------|-------|--------|
| `tailwind.config.ts` | Patient Portal | Flowbite blue palette | Convert to CSS variables |
| `tailwind.config.ts` | Store Admin | Tailwind blue palette | Convert to CSS variables |
| `tailwind.config.ts` | Doctor Portal | Tailwind blue palette | Convert to CSS variables |
| `tailwind.config.ts` | Super Admin | Tailwind blue palette | Convert to CSS variables |
| `button.theme.ts` | Patient Portal | Uses `blue-700` not `primary-700` | Fix to use `primary-*` |
| `globals.css` | Store Admin | Hardcoded grays in animation | Use CSS variables |
| `theme.ts` | Mobile App | Separate color system | Needs separate discussion |

### High Priority (Core Branding)
1. `src/shared/constants/support-contacts.ts` - DELETE, use tenant config
2. `src/shared/constants/footer.constants.ts` - DELETE, use tenant config
3. `src/components/company-logo/company-logo.tsx` - Dynamic from config
4. `src/dictionaries/dictionary.ts` - Replace 99 hardcoded mentions

### Medium Priority (Navigation)
1. `src/dictionaries/nav-Item-config.ts` - Externalize to config
2. `src/providers/navigation/index.ts` - External links from config

### Medium Priority (Email Templates - 5 files with hardcoded colors)

| File | Repo | Hardcoded Colors |
|------|------|------------------|
| `order-summary.html` | Patient Portal | `#1A56DB`, `#057A55`, `#0E9F6E`, etc. |
| `reset-password.html` | Patient Portal | `#1A56DB`, `#6B7280`, etc. |
| `reactivation-email.html` | Store Admin | `#1A56DB`, `#111928`, etc. |
| `reset-password.html` | Store Admin | `#1A56DB`, `#6B7280`, etc. |
| `store-admin.html` | Store Admin | `#1A56DB`, `#6B7280`, etc. |

**Action:** Implement variable injection system for email templates.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `COLOR-INVENTORY.md` | Complete color audit with all hex values and sources |
| `hedfirst-tenant-config.json` | Full Hedfirst config (reference) |
| `store-b-mvp-config.json` | Minimal Store B config (actionable) |
| `TENANT-INTAKE-QUESTIONNAIRE.md` | PM intake form for new tenants |

---

## Next Steps

1. **Serhii reviews** this inventory for completeness
2. **Decide:** Unify Patient Portal + Admin Portal primary palettes?
3. **Create TypeScript interface** from the JSON structure
4. **Implement TenantContext provider** to serve config
5. **Convert `tailwind.config.ts`** to use CSS variables
6. **Fix `button.theme.ts`** to use `primary-*` instead of `blue-*`
7. **Migrate Hedfirst values** into first tenant config
8. **Replace hardcoded refs** with `useTenant()` hook calls
