# Tenant Intake Questionnaire

**Purpose:** Gather all branding and configuration requirements from a new tenant before development begins.
**Audience:** PM collects from tenant, then hands off to developer
**Reference:** Maps to `hedfirst-tenant-config.json` and `TENANT-BRANDING-INVENTORY.md`

---

## Instructions

1. PM schedules intake call with tenant
2. Walk through each section below
3. Collect all assets (logos, colors, legal URLs)
4. Developer uses completed questionnaire to configure tenant

**Note:** Any field left blank will need a follow-up before launch.

---

## Section 1: Business Identity

| Question | Tenant Response |
|----------|-----------------|
| **Store name** (displayed to customers) | |
| **Legal entity name** (for copyright, e.g., "Renewell LLC") | |
| **State/jurisdiction of incorporation** | |
| **Store tagline** (optional, 5-10 words) | |
| **URL slug** (e.g., "renewell" for teligant.com/renewell) | |

---

## Section 2: Brand Assets

### Logos

| Asset | Provided? | File Format | Notes |
|-------|-----------|-------------|-------|
| **Primary logo** (dark background safe) | ☐ Yes ☐ No | SVG preferred | |
| **White/light logo** (for dark footers) | ☐ Yes ☐ No | SVG preferred | |
| **Favicon** | ☐ Yes ☐ No | .ico or .png | |
| **Social sharing image** (OG image, 1200x630px) | ☐ Yes ☐ No | PNG/JPG | |

### Brand Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Primary color** | #________ | Buttons, links, headers |
| **Primary hover** (darker shade) | #________ | Button hover states |
| **Secondary color** (optional) | #________ | Accents |
| **Background color** (if not white) | #________ | Page backgrounds |

**Note:** If tenant only provides primary color, developer will generate shade scale.

---

## Section 3: Contact Information

| Field | Value |
|-------|-------|
| **Customer support email** | |
| **Customer support phone** | |
| **Phone display format** (e.g., "+1 888 427-1796") | |
| **Business hours** (e.g., "Monday–Friday, 9am–5pm EST") | |
| **Physical address** (if displayed publicly) | |

---

## Section 4: Social Media

| Platform | URL | Display in footer? |
|----------|-----|-------------------|
| Facebook | | ☐ Yes ☐ No |
| Instagram | | ☐ Yes ☐ No |
| LinkedIn | | ☐ Yes ☐ No |
| Twitter/X | | ☐ Yes ☐ No |
| TikTok | | ☐ Yes ☐ No |

---

## Section 5: Legal Pages

**Important:** Tenants must host their own legal pages. We link to them.

| Page | URL | Required? |
|------|-----|-----------|
| **Terms of Service** | | ☐ Required |
| **Privacy Policy** | | ☐ Required |
| **HIPAA Notice of Privacy Practices** | | ☐ Required for healthcare |
| **Consent to Treatment** | | ☐ If applicable |
| **SMS Terms & Conditions** | | ☐ If using SMS |
| **Pharmacy Disclaimer** | | ☐ If selling Rx |

**Q: Does tenant have existing legal pages?**
☐ Yes, provide URLs above
☐ No, tenant needs to create them before launch

---

## Section 6: Copyright & Compliance

| Field | Value |
|-------|-------|
| **Copyright holder name** (e.g., "Renewell") | |
| **Short copyright** (e.g., "© Renewell.com") | |
| **Full copyright text** (optional, for footer) | |
| **Show "HIPAA Compliant" badge?** | ☐ Yes ☐ No |
| **Show "FDA Regulated" badge?** | ☐ Yes ☐ No |
| **LegitScript verification URL** (if applicable) | |

---

## Section 7: External Website Links

| Link | URL | Display in nav/footer? |
|------|-----|------------------------|
| **Main website** (e.g., renewell.com) | | |
| **About Us page** | | ☐ Yes ☐ No |
| **Contact Us page** | | ☐ Yes ☐ No |
| **Blog** | | ☐ Yes ☐ No |
| **How It Works page** | | ☐ Yes ☐ No |
| **FAQ page** | | ☐ Yes ☐ No |

---

## Section 8: Product Catalog

| Question | Response |
|----------|----------|
| **Approximate number of products** | |
| **Product categories** (list them) | |
| **Show search bar?** | ☐ Yes ☐ No |
| **Show filter sidebar?** | ☐ Yes ☐ No |
| **Catalog layout preference** | ☐ Flat grid ☐ Grouped by category |

### Category List (if using grouped layout)

| Category Name | Description | Slug |
|---------------|-------------|------|
| | | |
| | | |
| | | |

---

## Section 9: Navigation Structure

### Does tenant want custom navigation?

☐ **Minimal navigation** (just logo + login + CTA)
☐ **Simple navigation** (logo + 3-5 top-level links)
☐ **Full navigation** (mega menus with categories) - requires additional design

### If simple navigation, list items:

| Nav Item Label | Links To |
|----------------|----------|
| | |
| | |
| | |
| | |

### Call-to-action button:

| Field | Value |
|-------|-------|
| **CTA button text** (e.g., "Get Started") | |
| **CTA button URL** | |

---

## Section 10: Footer Structure

### Does tenant want custom footer?

☐ **Minimal footer** (logo + copyright + legal links)
☐ **Standard footer** (2-3 columns with links)
☐ **Full footer** (multiple columns like Hedfirst) - requires additional design

### If standard footer, list sections:

**Column 1:**
| Link Label | URL |
|------------|-----|
| | |
| | |

**Column 2:**
| Link Label | URL |
|------------|-----|
| | |
| | |

---

## Section 11: Email Communications

| Question | Response |
|----------|----------|
| **"From" name for emails** (e.g., "Renewell Support") | |
| **"From" email address** | |
| **Reply-to email address** | |

### Email templates needed:

| Template | Needed? | Custom content? |
|----------|---------|-----------------|
| Order confirmation | ☐ Yes ☐ No | |
| Password reset | ☐ Yes ☐ No | |
| Welcome email | ☐ Yes ☐ No | |
| Subscription reminder | ☐ Yes ☐ No | |

---

## Section 12: Feature Flags

| Feature | Enable? | Notes |
|---------|---------|-------|
| **AI Chat** | ☐ Yes ☐ No | |
| **Lab Kits** | ☐ Yes ☐ No | |
| **Membership/Subscription products** | ☐ Yes ☐ No | |
| **Mobile app promotion** | ☐ Yes ☐ No | |
| **Appointment scheduling** | ☐ Yes ☐ No | |

---

## Section 13: Content & Messaging

### Key text replacements

These phrases appear throughout the app. Provide tenant-specific versions:

| Hedfirst Default | Tenant Version |
|------------------|----------------|
| "Hedfirst provider" | |
| "Hedfirst Chief Medical Advisor" | |
| "Welcome to Hedfirst" | |
| "Create your Hedfirst account" | |
| "Hedfirst mobile app" | |

### Subscription terms

**Does tenant have custom subscription/cancellation policy text?**

☐ Yes (provide below)
☐ No, use standard template with tenant name substituted

Custom text:
```
[Paste here if applicable]
```

---

## Section 14: Integrations

**Which integrations does this tenant need configured?**

| Integration | Needed? | Tenant has credentials? |
|-------------|---------|-------------------------|
| **PayTheory** (payments) | ☐ Yes ☐ No | ☐ Yes ☐ No |
| **DoseSpot** (e-prescribing) | ☐ Yes ☐ No | ☐ Yes ☐ No |
| **ShipStation** (fulfillment) | ☐ Yes ☐ No | ☐ Yes ☐ No |
| **ActiveCampaign** (marketing) | ☐ Yes ☐ No | ☐ Yes ☐ No |
| **Zoom** (telehealth) | ☐ Yes ☐ No | ☐ Yes ☐ No |
| **Slack** (notifications) | ☐ Yes ☐ No | ☐ Yes ☐ No |

---

## Section 15: Custom Domain (Optional)

| Question | Response |
|----------|----------|
| **Does tenant want custom domain?** | ☐ Yes ☐ No |
| **Custom domain** (e.g., shop.renewell.com) | |
| **Who manages DNS?** | |
| **SSL certificate approach** | ☐ Tenant provides ☐ We manage |

---

## Checklist Before Handoff to Developer

☐ All required fields completed
☐ Logo files received (SVG preferred)
☐ Color hex codes confirmed
☐ Legal page URLs verified (links work)
☐ Integration credentials collected (if applicable)
☐ Store record created in database (storeId, organizationId)

---

## Developer Notes

*PM: Add any context from intake call that doesn't fit above*

```
[Notes here]
```

---

## Revision History

| Date | Changed By | Notes |
|------|------------|-------|
| | | |
