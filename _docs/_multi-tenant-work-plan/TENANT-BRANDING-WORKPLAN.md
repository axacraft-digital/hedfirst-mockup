# Tenant Branding & Configuration Workplan

**Created:** 2025-12-05
**Status:** Planning
**Prerequisite:** Integration API keys layer (in progress by developer)

---

## Executive Summary

Each tenant must have complete control over their storefront branding, contact information, navigation, and legal pages. No Hedfirst references should appear for any tenant - if a field is not configured, the element should be hidden rather than showing defaults.

---

## Tenant Configuration Model

### Complete Configuration Schema

```typescript
interface TenantBrandingConfig {
  // ═══════════════════════════════════════════════════════════
  // IDENTITY
  // ═══════════════════════════════════════════════════════════

  storeName: string;                    // Required - Display name
  tagline?: string;                     // Optional - Shown in header/footer

  // Logos
  logoUrl: string;                      // Required - Primary logo
  logoWhiteUrl: string;                 // Required - White/light variant for dark backgrounds
  faviconUrl: string;                   // Required - Browser favicon
  ogImageUrl?: string;                  // Optional - Social sharing image

  // Colors
  primaryColor: string;                 // Required - Main brand color (buttons, links)
  secondaryColor: string;               // Required - Secondary brand color
  accentColor: string;                  // Required - Accent/highlight color

  // ═══════════════════════════════════════════════════════════
  // CONTACT INFORMATION
  // ═══════════════════════════════════════════════════════════

  supportEmail: string;                 // Required - Primary support email
  supportPhone: string;                 // Required - Support phone number
  supportPhoneDisplay: string;          // Required - Formatted display version
  businessHours: string;                // Required - e.g., "Monday–Friday, 9am–5pm EST"

  // Optional additional contacts
  securityEmail?: string;               // For security inquiries
  billingEmail?: string;                // For billing inquiries

  // ═══════════════════════════════════════════════════════════
  // SOCIAL MEDIA
  // ═══════════════════════════════════════════════════════════

  facebookUrl?: string;                 // Optional - hide if not set
  instagramUrl?: string;                // Optional - hide if not set
  linkedinUrl?: string;                 // Optional - hide if not set
  twitterUrl?: string;                  // Optional - hide if not set
  youtubeUrl?: string;                  // Optional - hide if not set

  // ═══════════════════════════════════════════════════════════
  // LEGAL & COMPLIANCE
  // ═══════════════════════════════════════════════════════════

  privacyPolicyUrl: string;             // Required
  termsOfServiceUrl: string;            // Required
  hipaaNoticeUrl: string;               // Required - Notice of Privacy Practices
  consentToTreatmentUrl: string;        // Required
  consentForSensitiveDataUrl?: string;  // Optional
  smsTermsUrl?: string;                 // Optional - if SMS features used
  pharmacyDisclaimerUrl?: string;       // Optional - if pharmacy services used

  // ═══════════════════════════════════════════════════════════
  // COMPANY INFORMATION
  // ═══════════════════════════════════════════════════════════

  companyLegalName: string;             // Required - e.g., "Acme Health LLC"
  companyJurisdiction?: string;         // Optional - e.g., "Delaware Corporation"
  copyrightName: string;                // Required - Used in footer "© 2025 {copyrightName}"

  // ═══════════════════════════════════════════════════════════
  // EXTERNAL LINKS
  // ═══════════════════════════════════════════════════════════

  websiteUrl?: string;                  // Main marketing site (if separate)
  blogUrl?: string;                     // Blog/resources
  aboutUrl?: string;                    // About page
  contactPageUrl?: string;              // External contact page
  howItWorksUrl?: string;               // How it works page
  faqUrl?: string;                      // FAQ page

  // ═══════════════════════════════════════════════════════════
  // COMPLIANCE BADGES
  // ═══════════════════════════════════════════════════════════

  showHipaaCompliant: boolean;          // Show HIPAA badge
  showFdaRegulated: boolean;            // Show FDA badge
  legitScriptId?: string;               // LegitScript verification ID
}
```

### Navigation Configuration Schema

```typescript
interface TenantNavigationConfig {
  // ═══════════════════════════════════════════════════════════
  // MAIN NAVIGATION (Header)
  // ═══════════════════════════════════════════════════════════

  mainNav: NavCategory[];

  // ═══════════════════════════════════════════════════════════
  // FOOTER NAVIGATION
  // ═══════════════════════════════════════════════════════════

  footerSections: FooterSection[];
}

interface NavCategory {
  id: string;
  label: string;                        // Display text
  href?: string;                        // Direct link (if no children)
  children?: NavItem[];                 // Dropdown items
  highlight?: boolean;                  // Featured/highlighted style
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  description?: string;                 // Shown in mega menu
  icon?: string;                        // Icon identifier
  badge?: string;                       // e.g., "New", "Popular"
  external?: boolean;                   // Opens in new tab
}

interface FooterSection {
  id: string;
  title: string;                        // Section header
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}
```

---

## Database Schema

### Add to Store Model

```prisma
model Store {
  // ... existing fields

  // Tenant Branding Configuration
  brandingConfig    Json?               // TenantBrandingConfig
  navigationConfig  Json?               // TenantNavigationConfig

  // Branding assets stored in S3, URLs in config
  // Logo uploads handled via existing file upload system
}
```

---

## Store Admin UI

### New Section: Store Branding

**Location:** Store Settings → Branding (new page)

#### Tab 1: Brand Identity

```
┌─────────────────────────────────────────────────────────────────────┐
│  Brand Identity                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STORE NAME & TAGLINE                                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Store Name *          [Acme Health_______________________]   │    │
│  │ Tagline               [Your partner in wellness__________]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  LOGOS                                                               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  Primary Logo *        White Logo *          Favicon *       │    │
│  │  ┌──────────────┐     ┌──────────────┐     ┌──────────┐     │    │
│  │  │              │     │              │     │          │     │    │
│  │  │   [logo]     │     │   [logo]     │     │  [icon]  │     │    │
│  │  │              │     │              │     │          │     │    │
│  │  └──────────────┘     └──────────────┘     └──────────┘     │    │
│  │  [Upload]             [Upload]             [Upload]          │    │
│  │  PNG, SVG             PNG, SVG             ICO, PNG          │    │
│  │  Max 500KB            Max 500KB            32x32 or 64x64    │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  BRAND COLORS                                                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  Primary Color *       Secondary Color *    Accent Color *   │    │
│  │  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │    │
│  │  │ [■] #1A56DB  │     │ [■] #6B7280  │     │ [■] #10B981  │ │    │
│  │  └──────────────┘     └──────────────┘     └──────────────┘ │    │
│  │  Buttons, links       Headers, text        Highlights, CTAs  │    │
│  │                                                              │    │
│  │  [Preview Colors on Sample UI]                               │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  COMPANY INFORMATION                                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Legal Company Name *  [Acme Health LLC___________________]   │    │
│  │ Jurisdiction          [Delaware Corporation______________]   │    │
│  │ Copyright Name *      [Acme Health_______________________]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Tab 2: Contact Information

```
┌─────────────────────────────────────────────────────────────────────┐
│  Contact Information                                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PRIMARY SUPPORT                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Support Email *       [support@acmehealth.com____________]   │    │
│  │ Support Phone *       [+1 555-123-4567___________________]   │    │
│  │ Display Format *      [+1 (555) 123-4567_________________]   │    │
│  │ Business Hours *      [Monday–Friday, 9am–5pm EST________]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ADDITIONAL CONTACTS (Optional)                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Security Email        [security@acmehealth.com___________]   │    │
│  │ Billing Email         [billing@acmehealth.com____________]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  SOCIAL MEDIA (Leave blank to hide from storefront)                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Facebook              [https://facebook.com/acmehealth__]   │    │
│  │ Instagram             [https://instagram.com/acmehealth_]   │    │
│  │ LinkedIn              [https://linkedin.com/company/acme]   │    │
│  │ Twitter/X             [_________________________________]   │    │
│  │ YouTube               [_________________________________]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Tab 3: Legal Pages

```
┌─────────────────────────────────────────────────────────────────────┐
│  Legal & Compliance Pages                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ⓘ Enter URLs to your legal pages. These will be linked in the      │
│    footer and checkout process.                                      │
│                                                                      │
│  REQUIRED PAGES                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Privacy Policy *      [https://acmehealth.com/privacy____]   │    │
│  │ Terms of Service *    [https://acmehealth.com/terms______]   │    │
│  │ HIPAA Notice *        [https://acmehealth.com/hipaa______]   │    │
│  │ Consent to Treatment * [https://acmehealth.com/consent___]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  OPTIONAL PAGES                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Sensitive Data Consent [https://acmehealth.com/data-consent] │    │
│  │ SMS Terms              [_________________________________]   │    │
│  │ Pharmacy Disclaimer    [_________________________________]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  COMPLIANCE BADGES                                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ ☑ Show "HIPAA Compliant" badge                               │    │
│  │ ☑ Show "FDA Regulated" badge                                 │    │
│  │ LegitScript ID        [43466879__________________________]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Tab 4: Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│  Navigation Configuration                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  MAIN NAVIGATION (Header Menu)                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │ ≡ Treatments           [Edit] [Delete]              │    │    │
│  │  │   ├─ Weight Loss                                    │    │    │
│  │  │   ├─ Hair Care                                      │    │    │
│  │  │   ├─ Skin Care                                      │    │    │
│  │  │   └─ + Add item                                     │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │ ≡ Lab Tests            [Edit] [Delete]              │    │    │
│  │  │   ├─ Hormone Panel                                  │    │    │
│  │  │   ├─ Metabolic Panel                                │    │    │
│  │  │   └─ + Add item                                     │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │ ≡ About Us             [Edit] [Delete]              │    │    │
│  │  │   (Direct link - no dropdown)                       │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  [+ Add Navigation Category]                                 │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  FOOTER SECTIONS                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │ ≡ Treatments           [Edit] [Delete]              │    │    │
│  │  │   ├─ All Products                                   │    │    │
│  │  │   ├─ Weight Loss                                    │    │    │
│  │  │   └─ + Add link                                     │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │ ≡ Company              [Edit] [Delete]              │    │    │
│  │  │   ├─ About Us                                       │    │    │
│  │  │   ├─ Contact                                        │    │    │
│  │  │   ├─ FAQs                                           │    │    │
│  │  │   └─ + Add link                                     │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │ ≡ Legal               [Edit] [Delete]               │    │    │
│  │  │   ├─ Privacy Policy (auto-linked)                   │    │    │
│  │  │   ├─ Terms of Service (auto-linked)                 │    │    │
│  │  │   └─ + Add link                                     │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                              │    │
│  │  [+ Add Footer Section]                                      │    │
│  │                                                              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  EXTERNAL LINKS                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Main Website           [https://acmehealth.com___________]   │    │
│  │ Blog                   [https://acmehealth.com/blog______]   │    │
│  │ About Page             [https://acmehealth.com/about_____]   │    │
│  │ Contact Page           [https://acmehealth.com/contact___]   │    │
│  │ How It Works           [https://acmehealth.com/how-it-works] │    │
│  │ FAQs                   [https://acmehealth.com/faq_______]   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Implementation

### Patient Portal: Branding Context

```typescript
// src/providers/branding/TenantBrandingProvider.tsx

interface TenantBrandingContextValue {
  branding: TenantBrandingConfig;
  navigation: TenantNavigationConfig;
  isLoaded: boolean;
}

// Loaded once at app initialization from API
// Injected via environment variable: NEXT_PUBLIC_STORE_ID
```

### Component Updates Required

| Component | Current State | New State |
|-----------|---------------|-----------|
| `CompanyLogo` | Imports hardcoded SVG | Uses `branding.logoUrl` |
| `Footer` | Hardcoded links & contact | Uses `branding` + `navigation.footerSections` |
| `Header/Nav` | Hardcoded nav items | Uses `navigation.mainNav` |
| `EmptyResults` | Hardcoded contact info | Uses `branding.supportEmail/Phone` or hides |
| `LegalLinks` | Hardcoded URLs | Uses `branding.*Url` fields |
| `SocialLinks` | Hardcoded URLs | Uses `branding.*Url` fields, hide if empty |
| `ContactSupport` | Hardcoded email/phone | Uses `branding` fields |
| Email Templates | Hardcoded brand | Template variables injected |

### CSS Variables for Colors

```css
/* Generated dynamically from branding config */
:root {
  --color-primary: var(--tenant-primary, #1A56DB);
  --color-secondary: var(--tenant-secondary, #6B7280);
  --color-accent: var(--tenant-accent, #10B981);
}
```

```typescript
// Inject at app root
<style>{`
  :root {
    --tenant-primary: ${branding.primaryColor};
    --tenant-secondary: ${branding.secondaryColor};
    --tenant-accent: ${branding.accentColor};
  }
`}</style>
```

---

## Handling Missing Configuration

### Validation: Required Fields

Before a store can be activated, these fields MUST be configured:
- Store Name
- Primary Logo
- White Logo
- Favicon
- Primary, Secondary, Accent Colors
- Support Email
- Support Phone + Display Format
- Business Hours
- Privacy Policy URL
- Terms of Service URL
- HIPAA Notice URL
- Consent to Treatment URL
- Company Legal Name
- Copyright Name

### Fallback Behavior for Optional Fields

| Field | If Not Configured |
|-------|-------------------|
| Social media URLs | Hide social icons section entirely |
| Security/Billing email | Hide from contact page |
| SMS Terms URL | Hide from footer |
| Pharmacy Disclaimer | Hide from footer |
| Tagline | Don't show tagline area |
| OG Image | Use logo as fallback |
| External links (blog, about, etc.) | Hide those nav/footer items |

### Onboarding Gate

```typescript
// Store cannot serve patients until branding is complete
if (!store.brandingConfig || !isValidBrandingConfig(store.brandingConfig)) {
  // Show "Complete your store setup" message
  // Redirect admin to branding configuration
}
```

---

## Implementation Steps

### Step 1: Database & API

**Backend Files:**
- [ ] Add `brandingConfig Json?` to Store model in `prisma/schema.prisma`
- [ ] Add `navigationConfig Json?` to Store model
- [ ] Run migration
- [ ] Create `src/apps/store-admin/modules/branding/branding.controller.ts`
- [ ] Create `src/apps/store-admin/modules/branding/branding.service.ts`
- [ ] Create DTO with validation for required fields
- [ ] Endpoint: `GET /organizations/:orgId/stores/:storeId/branding`
- [ ] Endpoint: `PATCH /organizations/:orgId/stores/:storeId/branding`
- [ ] Endpoint: `GET /organizations/:orgId/stores/:storeId/navigation`
- [ ] Endpoint: `PATCH /organizations/:orgId/stores/:storeId/navigation`
- [ ] Logo upload endpoint (use existing file upload, store URL in config)

### Step 2: Store Admin UI

**Admin Portal Files:**
- [ ] Create `src/app/panel/store-settings/branding/page.tsx`
- [ ] Create `src/app/panel/store-settings/branding/_components/`
  - [ ] `BrandIdentityTab.tsx`
  - [ ] `ContactInfoTab.tsx`
  - [ ] `LegalPagesTab.tsx`
  - [ ] `NavigationTab.tsx`
  - [ ] `ColorPicker.tsx`
  - [ ] `LogoUploader.tsx`
  - [ ] `NavItemEditor.tsx` (drag-and-drop reordering)
  - [ ] `FooterSectionEditor.tsx`
- [ ] Add "Branding" to store settings navigation
- [ ] Form validation for required fields
- [ ] Preview functionality for colors

### Step 3: Patient Portal - Branding Context

**Patient Portal Files:**
- [ ] Create `src/providers/branding/TenantBrandingProvider.tsx`
- [ ] Create `src/providers/branding/useTenantBranding.ts` hook
- [ ] Create `src/providers/branding/types.ts`
- [ ] Fetch branding config on app init
- [ ] Inject CSS variables for colors
- [ ] Wrap app with provider in `src/app/layout.tsx`

### Step 4: Component Refactoring

**Patient Portal Components:**
- [ ] Refactor `src/components/company-logo/company-logo.tsx`
- [ ] Refactor `src/layouts/footer.tsx`
- [ ] Refactor `src/layouts/header/` (navigation)
- [ ] Refactor `src/app/catalog/_components/empty-results.tsx`
- [ ] Refactor `src/shared/constants/footer.constants.ts` → use context
- [ ] Refactor `src/shared/constants/support-contacts.ts` → use context
- [ ] Refactor `src/dictionaries/nav-Item-config.ts` → use context
- [ ] Update all legal link references to use branding URLs
- [ ] Update social media links component

### Step 5: Email Templates

**Template Files:**
- [ ] Update `public/templates/order-summary.html` - add template variables
- [ ] Update `public/templates/reset-password.html` - add template variables
- [ ] Backend: Inject branding values when sending emails
- [ ] Variables needed: `{{storeName}}`, `{{logoUrl}}`, `{{supportEmail}}`, `{{supportPhone}}`, `{{primaryColor}}`, `{{copyrightName}}`, `{{privacyPolicyUrl}}`, `{{termsOfServiceUrl}}`

### Step 6: Admin Portal Branding (Lower Priority)

**Admin Portal Components:**
- [ ] Update `src/layouts/footer.tsx` to use store branding
- [ ] Update `src/app/layout.tsx` metadata
- [ ] Update email templates in admin portal

### Step 7: Validation & Testing

- [ ] Validate all required fields before store activation
- [ ] Test with missing optional fields (should hide, not error)
- [ ] Test color application across all components
- [ ] Test navigation rendering with various configurations
- [ ] Test email templates with injected values
- [ ] E2E test: Complete branding setup flow

---

## Files Requiring Updates (Reference from Audit)

### High Priority - Patient Portal

| File | Changes Needed |
|------|----------------|
| `src/shared/constants/support-contacts.ts` | Replace with branding context |
| `src/shared/constants/footer.constants.ts` | Replace with navigation context |
| `src/components/company-logo/company-logo.tsx` | Use branding.logoUrl |
| `src/dictionaries/dictionary.ts` | Remove brand references, use context |
| `src/dictionaries/nav-Item-config.ts` | Replace with navigation context |
| `src/providers/navigation/index.ts` | Update to use navigation config |
| `src/layouts/footer.tsx` | Use branding + navigation context |
| `src/app/catalog/_components/empty-results.tsx` | Use branding contact info |
| `src/app/(internal)/.../disclaimers.constants.ts` | Use branding legal URLs |
| `src/layouts/buttons/legit-script-button.tsx` | Use branding.legitScriptId |
| `public/templates/*.html` | Add template variables |

### High Priority - Admin Portal

| File | Changes Needed |
|------|----------------|
| `src/dictionaries/content.ts` | Remove "Hedfirst" references |
| `src/layouts/footer.tsx` | Use store branding |
| `src/app/layout.tsx` | Dynamic metadata from branding |
| `public/templates/*.html` | Fix Met-Tech references, add variables |

---

## Definition of Done

Tenant branding is complete when:

- [ ] Store admin can configure all branding fields via UI
- [ ] Store admin can upload logos (primary, white, favicon)
- [ ] Store admin can set brand colors with preview
- [ ] Store admin can configure main navigation items
- [ ] Store admin can configure footer sections and links
- [ ] Patient portal loads branding dynamically
- [ ] All hardcoded "Hedfirst" references removed
- [ ] All hardcoded contact info removed
- [ ] CSS colors applied from tenant config
- [ ] Navigation renders from tenant config
- [ ] Email templates use tenant branding
- [ ] Missing optional fields hide elements (not show defaults)
- [ ] Store cannot activate without required branding fields
- [ ] No Hedfirst references visible on any tenant storefront
