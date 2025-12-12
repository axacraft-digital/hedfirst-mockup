# Questions for Serhii - Multi-Tenant Branding

**Created:** 2025-12-11
**Context:** Based on branding inventory and color audit findings
**Related:** `hedfirst-tenant-config.json`, `COLOR-INVENTORY.md`, `TENANT-BRANDING-INVENTORY.md`

---

## 1. `button.theme.ts` Uses `blue-700` Instead of `primary-700`

**Finding:** The button theme file hardcodes `bg-blue-700` instead of using the configurable `primary-700`.

**Questions:**
- Are there other components that bypass `primary-*` and use `blue-*` directly?
- Is this a quick fix or does it have ripple effects?

---

## 2. CSS Variables vs Tailwind Config

**Finding:** To make colors tenant-configurable at runtime, we'd need CSS variables. Currently colors are baked into Tailwind at build time.

**Questions:**
- What's your preferred approach for dynamic tenant colors?
- Have you done CSS variable injection with Tailwind before?
- Does this affect build/deploy pipeline (one build per tenant vs one build for all)?

---

## 3. Email Template Colors

**Finding:** 5 email templates have 20+ hardcoded hex values inline in HTML.

**Questions:**
- How are email templates currently rendered? (Backend templating? Static HTML?)
- What's the fastest path to variable injection for these?

---

## 4. The JSON Config Structure

**Finding:** I created `hedfirst-tenant-config.json` as a reference and `store-b-mvp-config.json` as minimum viable.

**Questions:**
- Does the structure make sense to you?
- What fields are missing that you'd need?
- Where should this config live - database (like integrations) or file system?

---

## 5. Integration with Your Tenant Integration System

**Finding:** You already built `TenantIntegrationConfig` for PayTheory, DoseSpot, etc.

**Questions:**
- Should tenant branding config follow the same pattern?
- Same database table structure? Same caching approach?
- Or is branding different enough to warrant a separate system?

---

## Priority Order (Suggestion)

1. Unify color palettes across all portals
2. Fix `button.theme.ts` to use `primary-*` instead of `blue-*`
3. Create TypeScript interface from the JSON structure
4. Implement TenantContext following integration pattern
5. Email template variable injection
