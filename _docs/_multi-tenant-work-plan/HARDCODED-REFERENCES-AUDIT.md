# Hardcoded References Audit - Branding & Contact Information

**Created:** 2025-12-05
**Scope:** Patient Portal (node-hedfirst-patient) + Admin Portal (node-hedfirst-frontend)
**Purpose:** Identify all hardcoded references that must be tenant-configurable for B2B multi-tenant

---

## Executive Summary

| Category | Patient Portal | Admin Portal | Total |
|----------|----------------|--------------|-------|
| Email Addresses | 5 | 1 | 6 |
| Phone Numbers | 6 | 0 | 6 |
| Domain Names | 12 | 4 | 16 |
| Brand Name ("Hedfirst") | 25+ | 16 | 41+ |
| Social Media Links | 3 | 0 | 3 |
| Legal/Policy Links | 12 | 4 | 16 |
| Logo References | 4 | 0 | 4 |
| Navigation Items | 50+ | 10+ | 60+ |
| Product Categories | 30+ | 0 | 30+ |
| Email Templates | 2 | 3 | 5 |
| **TOTAL** | **149+** | **38+** | **187+** |

### Critical Issues Found

1. **Phone Number Discrepancy:** Order summary template uses `+1-888-427-7196` but other files use `+1 888-427-1796`
2. **Brand Inconsistency:** Reset-password and store-admin email templates reference "Met-Tech" instead of "Hedfirst"
3. **Placeholder URLs:** Email templates contain `https://example.com/` placeholder links
4. **AWS Account ID Exposed:** S3 bucket URLs contain hardcoded account ID `438465124128`

---

## Patient Portal (node-hedfirst-patient)

### 1. Contact Information

#### Email Addresses

| File | Line | Value | Context |
|------|------|-------|---------|
| `src/shared/constants/support-contacts.ts` | 3 | `support@hedfirst.com` | Support email constant |
| `src/app/layout.tsx` | 40 | `support@hedfirst.com` | JSON-LD schema for SEO |
| `src/app/catalog/_components/empty-results.tsx` | 30 | `support@hedfirst.com` | Empty catalog results fallback |
| `public/templates/order-summary.html` | 329 | `support@hedfirst.com` | Order confirmation email |
| `src/dictionaries/dictionary.ts` | 1383 | `support@hedfirst.com` | Subscription terms hint |

#### Phone Numbers

| File | Line | Value | Context |
|------|------|-------|---------|
| `src/shared/constants/support-contacts.ts` | 2 | `+1 888-427-1796` | Support phone constant |
| `src/dictionaries/dictionary.ts` | 237-238 | `+18884271796` / `+1 888 427-1796` | Footer phone (tel + display) |
| `src/app/catalog/_components/empty-results.tsx` | 28-29 | `+1 888-427-1796` | Empty results fallback |
| `src/dictionaries/dictionary.ts` | 1383 | `+1 888–427–1796` | Subscription terms with hours |
| `public/templates/order-summary.html` | 330 | `+1-888-427-7196` | ⚠️ **DIFFERENT NUMBER** |

#### Social Media Links

| File | Line | Platform | URL |
|------|------|----------|-----|
| `src/shared/constants/footer.constants.ts` | 77 | Facebook | `https://www.facebook.com/profile.php?id=61574217832791` |
| `src/shared/constants/footer.constants.ts` | 78 | Instagram | `https://www.instagram.com/hedfirst.health` |
| `src/shared/constants/footer.constants.ts` | 79 | LinkedIn | `https://www.linkedin.com/company/hedfirst` |

#### Business Hours

| File | Line | Value | Context |
|------|------|-------|---------|
| `src/dictionaries/dictionary.ts` | 1383 | `Monday–Friday, 8 am–5 pm MTN` | Support availability |

---

### 2. Brand References

#### Brand Name ("Hedfirst")

| File | Lines | Context |
|------|-------|---------|
| `src/dictionaries/dictionary.ts` | 191 | `brand.name = "Hedfirst"` |
| `src/dictionaries/dictionary.ts` | 43, 47, 113, 121 | Dashboard welcome messages |
| `src/dictionaries/dictionary.ts` | 210, 252, 255, 257 | Footer text, copyright |
| `src/dictionaries/dictionary.ts` | 367 | "Get a consultation with the hedfirst healthcare provider" |
| `src/dictionaries/templates/ai-medical-assessment-membership.ts` | 156 | AI assessment privacy text |
| `src/components/company-logo/company-logo.tsx` | 15-16 | Alt text: "Hedfirst" |

#### Domain Names

| File | Line | URL | Context |
|------|------|-----|---------|
| `src/providers/navigation/index.ts` | 261 | `https://www.hedfirst.com/blog` | Nav link |
| `src/providers/navigation/index.ts` | 266 | `https://www.hedfirst.com/about-us` | Nav link |
| `src/providers/navigation/index.ts` | 271 | `https://www.hedfirst.com/how-hedfirst-works` | Nav link |
| `src/providers/navigation/index.ts` | 281 | `https://www.hedfirst.com/contact-us` | Nav link |
| `src/app/(internal)/.../disclaimers.constants.ts` | 2-5 | Multiple hedfirst.com URLs | Legal disclaimers |
| `src/layouts/buttons/legit-script-button.tsx` | 7, 9, 14 | LegitScript verification URLs | Verification badge |

#### Logo References

| File | Line | Path | Context |
|------|------|------|---------|
| `src/components/company-logo/company-logo.tsx` | 3 | `@public/img/hedfirst-logo.svg` | Primary logo |
| `src/components/company-logo/company-logo.tsx` | 4 | `@public/img/hedfirst-logo-white.svg` | White logo variant |
| `src/app/layout.tsx` | 8 | `hedfirst-membership-lander.png` | OG image |
| `src/app/layout.tsx` | 13 | `hedfirst-logo-white.svg` | Schema.org logo |

---

### 3. Legal/Policy Content

#### Policy Links

| File | Line | Label | Path/URL |
|------|------|-------|----------|
| `src/shared/constants/footer.constants.ts` | 59 | Terms of Service | `/terms-of-service` |
| `src/shared/constants/footer.constants.ts` | 60 | Privacy Policy | `/privacy-policy` |
| `src/shared/constants/footer.constants.ts` | 61 | SMS Terms & Conditions | `/sms-terms-conditions` |
| `src/shared/constants/footer.constants.ts` | 62 | Consent to Treatment | `/consent-to-treatment` |
| `src/shared/constants/footer.constants.ts` | 63 | Consent for Sensitive Data | `/consent-for-sensitive-data-processing` |
| `src/shared/constants/footer.constants.ts` | 64 | Notice of Privacy Practices | `/notice-of-privacy-practices` |
| `src/shared/constants/footer.constants.ts` | 65 | Pharmacy Disclaimer | `/pharmacy-disclaimer` |

#### Copyright Notices

| File | Line | Value |
|------|------|-------|
| `src/dictionaries/dictionary.ts` | 255 | "Hedfirst LLC is a registered Delaware Limited Liability Company... © Hedfirst™" |
| `src/dictionaries/dictionary.ts` | 257 | "© Hedfirst.com @[date]" |
| `public/templates/order-summary.html` | 366 | "© 2025 Hedfirst. All rights reserved." |
| `public/templates/reset-password.html` | 121 | ⚠️ "© 2024 Met-Tech. All rights reserved." |

#### HIPAA/Compliance Notices

| File | Line | Value |
|------|------|-------|
| `src/dictionaries/nav-Item-config.ts` | 80 | "HIPAA compliant & FDA regulated" |
| `src/dictionaries/dictionary.ts` | 348, 407 | "HIPAA Compliant" badge |
| `src/dictionaries/dictionary.ts` | 1693 | "Your privacy is protected under HIPAA regulations" |
| `src/dictionaries/templates/ai-medical-assessment-membership.ts` | 156 | "All health information is HIPAA-compliant and encrypted" |

---

### 4. Navigation & Menu Items

#### Footer Navigation
**File:** `src/shared/constants/footer.constants.ts`

| Category | Items |
|----------|-------|
| Popular care areas | Skin Care, Hair & Scalp, Migraines, Nausea |
| AI Care Membership | Treatment Support, AI Care Coordinator |
| Company | FAQs, About, How it Works, Contact, Blog |
| LEGAL | Terms, Privacy, SMS Terms, Consents, HIPAA Notice |

#### Header Navigation
**File:** `src/dictionaries/nav-Item-config.ts`

| Category | Subcategories |
|----------|---------------|
| AI Care Membership | Treatment Support, AI Care Coordinator |
| Women's Health | Fertility, Birth Control, PCOS, Skin Care, Anti-Aging, Melasma, Peptides, GLP-1, Thyroid |
| Men's Health | ED, Premature Ejaculation, Hair Loss, Peptides, GLP-1, Sleep Apnea |
| Lab Kits | Various lab test kits |
| More Treatments | Inflammation, GI issues, Metabolic, Antifungal |

#### Panel Navigation (Authenticated)
**File:** `src/providers/navigation/index.ts`

- Dashboard, Consultations, Subscriptions, Appointments
- Messages, Lab Tests, Documents, Orders
- Account Settings, Help & Support

---

### 5. Product/Category References

#### Disease States (Hardcoded in nav-Item-config.ts)

**Women's Health:**
- Fertility Support, Birth Control, PCOS Management
- Acne Treatment, Anti-Aging Skincare, Melasma & Hyperpigmentation
- Peptide Therapy, GLP-1 Weight Loss, Metabolic optimization, Thyroid Support

**Men's Health:**
- Erectile dysfunction, Premature Ejaculation
- Male pattern baldness, Hair thinning treatment
- Peptide Therapy, GLP-1 weight loss, Sleep Apnea

**General Conditions:**
- Chronic Inflammation, Psoriatic Arthritis, Inflammatory Bowel
- Diarrhea, Constipation, IBS, GERD
- Insulin Resistance, Metabolic Syndrome
- Antifungal Treatments, Yeast Infections, Strep Throat

#### Product Templates (Hardcoded FAQ/Content)
**Directory:** `src/dictionaries/templates/`

- indo-relief.ts
- migra-cream.ts (Migraines)
- mens-hair-serum.ts / womens-hair-serum.ts
- mens-anti-aging-cream.ts / womens-anti-aging-cream.ts
- neur-ease.ts
- suma-relief.ts
- zolm-ease.ts
- ai-medical-assessment-membership.ts

---

### 6. Infrastructure References

#### Development/S3 URLs

| File | Value | Issue |
|------|-------|-------|
| `src/configs/public-config.ts` | `https://onix-systems-hedfirst-patient.dev.onix.team` | Dev domain hardcoded |
| `src/app/.../medical-questionnaire/page.tsx` | `https://438465124128-hedfirst.s3.amazonaws.com/...` | AWS account ID exposed |
| `src/app/.../quiz.data.json` | `https://s3.onix-systems.com/hedfirst/...` | CDN URL hardcoded |

---

## Admin Portal (node-hedfirst-frontend)

### 1. Contact Information

#### Email Addresses

| File | Line | Value | Context |
|------|------|-------|---------|
| `public/templates/reactivation-email.html` | 78-79 | `security@hedfirst.com` | Security contact in email |

---

### 2. Brand References

#### Brand Name ("Hedfirst")

| File | Lines | Context |
|------|-------|---------|
| `src/dictionaries/content.ts` | 46 | "Purchase a follow-up appointment with a Hedfirst provider" |
| `src/dictionaries/content.ts` | 120 | "only use the email address the patient used to create the Hedfirst account" |
| `src/dictionaries/content.ts` | 121 | "Schedule @[duration]-minute consultation with Hedfirst provider" |
| `src/dictionaries/content.ts` | 132 | "Manage your consultations... with a Hedfirst provider" |
| `src/dictionaries/content.ts` | 352 | `name: "Hedfirst"` |
| `src/dictionaries/content.ts` | 355 | `title: "Hedfirst"` |
| `src/dictionaries/content.ts` | 2275 | "e.g., Hedfirst Chief Medical Advisor" |
| `src/app/layout.tsx` | 15-17 | Page title, description, keywords |
| `src/layouts/footer.tsx` | 14 | Copyright text |
| `src/app/.../hedfirst-ai/chat/page.tsx` | 160 | "Talk to Hedfirst AI" |
| `src/providers/navigation/index.ts` | 55, 510 | "Hedfirst AI" nav items |

#### Domain Names

| File | Line | URL | Context |
|------|------|-----|---------|
| `src/layouts/footer.tsx` | 14 | `https://hedfirst.com/` | Footer brand link |
| `src/providers/navigation/index.ts` | 634 | `https://www.hedfirst.com/contact-us` | Contact nav link |
| `src/configs/public-config.ts` | 8 | `https://onix-systems-hedfirst-frontend.dev.onix.team` | Dev domain |

#### Brand Colors

| File | Lines | Value | Context |
|------|-------|-------|---------|
| `public/templates/reactivation-email.html` | 15, 49 | `#1A56DB` | Primary brand blue |
| `public/templates/reset-password.html` | 28, 61 | `#1A56DB` | Primary brand blue |
| `public/templates/store-admin.html` | 28, 61 | `#1A56DB` | Primary brand blue |

---

### 3. Legal/Policy Content

#### Policy Links

| File | Line | Value | Issue |
|------|------|-------|-------|
| `src/dictionaries/content.ts` | 1657-1658 | Terms of Service | `href: "#"` ⚠️ Placeholder |
| `src/dictionaries/content.ts` | 1661-1662 | Privacy Policy | `href: "#"` ⚠️ Placeholder |

#### Copyright Notices

| File | Line | Value | Issue |
|------|------|-------|-------|
| `src/layouts/footer.tsx` | 10-15 | "© {currentYear} Hedfirst. All Rights Reserved." | Dynamic year |
| `public/templates/reactivation-email.html` | 87 | "© 2025 Hedfirst. All rights reserved." | Hardcoded year |
| `public/templates/reset-password.html` | 121 | "© 2024 Met-Tech. All rights reserved." | ⚠️ Wrong brand |
| `public/templates/store-admin.html` | 119 | "© 2024 Met-Tech. All rights reserved." | ⚠️ Wrong brand |

---

### 4. Email Templates

#### Templates with Issues

| Template | Issues |
|----------|--------|
| `reactivation-email.html` | Hardcoded brand, colors, security email |
| `reset-password.html` | ⚠️ References "Met-Tech" instead of Hedfirst, placeholder URLs |
| `store-admin.html` | ⚠️ References "Met-Tech" instead of Hedfirst, placeholder URLs |

#### Placeholder URLs Found

| File | Line | URL |
|------|------|-----|
| `reactivation-email.html` | 50 | `https://example.com/set-new-password` |
| `reset-password.html` | 107 | `https://example.com/setup` |
| `reset-password.html` | 114 | `https://example.com/contact` |
| `store-admin.html` | 108 | `https://example.com/setup` |

---

### 5. Support/Help Content

| File | Line | Value | Context |
|------|------|-------|---------|
| `src/dictionaries/content.ts` | 1555 | "If this is an error, please contact support." | 403 error page |
| `src/dictionaries/content.ts` | 1616-1617 | "Contact support" / "Having trouble?" | Password reset help |

---

## Recommended Tenant Configuration Model

Based on this audit, a tenant configuration should include:

```typescript
interface TenantBrandingConfig {
  // Brand Identity
  name: string;                    // "Hedfirst" → Tenant name
  tagline?: string;

  // Logos
  logoUrl: string;                 // Primary logo
  logoWhiteUrl: string;            // White variant
  faviconUrl: string;
  ogImageUrl: string;              // Social sharing image

  // Colors
  primaryColor: string;            // #1A56DB
  secondaryColor?: string;
  accentColor?: string;

  // Contact Information
  supportEmail: string;            // support@hedfirst.com
  securityEmail?: string;          // security@hedfirst.com
  supportPhone: string;            // +1 888-427-1796
  supportPhoneDisplay: string;     // +1 888 427-1796
  businessHours: string;           // "Monday–Friday, 8 am–5 pm MTN"

  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;

  // Legal
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  consentToTreatmentUrl: string;
  hipaaNoticeUrl: string;
  smsTermsUrl?: string;
  pharmacyDisclaimerUrl?: string;

  // Company Info
  companyLegalName: string;        // "Hedfirst LLC"
  companyJurisdiction: string;     // "Delaware Limited Liability Company"
  copyrightName: string;           // "Hedfirst"

  // External Links
  websiteUrl: string;              // https://www.hedfirst.com
  blogUrl?: string;
  aboutUrl?: string;
  contactUrl?: string;
  howItWorksUrl?: string;

  // Third-Party Verification
  legitScriptId?: string;          // For verification badge

  // Feature Flags
  showHipaaCompliance: boolean;
  showFdaRegulated: boolean;
}

interface TenantNavigationConfig {
  // Main Navigation Categories
  mainNavCategories: NavCategory[];

  // Footer Sections
  footerSections: FooterSection[];

  // Panel/Dashboard Navigation
  panelNavItems: NavItem[];
}

interface TenantProductConfig {
  // Disease State Categories
  diseaseCategories: DiseaseCategory[];

  // Treatment Categories
  treatmentCategories: TreatmentCategory[];

  // Product Templates (FAQ, descriptions)
  productTemplates: ProductTemplate[];
}
```

---

## Priority Files to Refactor

### High Priority (Core Branding)

1. `src/shared/constants/support-contacts.ts` - Central contact config
2. `src/shared/constants/footer.constants.ts` - Footer links & social
3. `src/components/company-logo/company-logo.tsx` - Logo component
4. `src/dictionaries/dictionary.ts` - All UI text
5. `src/dictionaries/content.ts` (admin) - Admin UI text
6. `src/layouts/footer.tsx` - Footer layout
7. `public/templates/*.html` - All email templates

### Medium Priority (Navigation)

1. `src/dictionaries/nav-Item-config.ts` - Header navigation
2. `src/providers/navigation/index.ts` - Panel navigation
3. `src/app/(internal)/.../disclaimers.constants.ts` - Legal disclaimers

### Lower Priority (Product Content)

1. `src/dictionaries/templates/*.ts` - Product-specific content

---

## Definition of Done

Branding externalization is complete when:

- [ ] All hardcoded brand names replaced with tenant config
- [ ] All contact info pulled from tenant config
- [ ] All logos loaded dynamically from tenant config URLs
- [ ] All legal links point to tenant-specific URLs
- [ ] Email templates use tenant branding
- [ ] Navigation items configurable per tenant
- [ ] Disease/treatment categories configurable per tenant
- [ ] No "Hedfirst" or "hedfirst.com" text in codebase (except as fallback)
- [ ] No hardcoded phone numbers or emails
- [ ] All social media links from config
