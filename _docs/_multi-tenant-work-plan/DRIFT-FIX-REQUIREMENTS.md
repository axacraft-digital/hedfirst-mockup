# Drift Fix Requirements

**Created:** 2025-12-12
**Purpose:** Changes required before applying tenant branding system to existing Hedfirst store
**Status:** Prerequisite for Hedfirst rollout
**Related:** `TENANT-BRANDING-IMPLEMENTATION.md`, `COLOR-INVENTORY.md`

---

## The Problem

The Hedfirst portals have drifted apart in their color implementations:

| Portal | Primary Palette Source | primary-700 Value |
|--------|----------------------|-------------------|
| Patient Portal | Flowbite blue | `#1A56DB` |
| Store Admin | Tailwind default blue | `#1d4ed8` |
| Doctor Portal | Tailwind default blue | `#1d4ed8` |
| Super Admin | Tailwind default blue | `#1d4ed8` |

If we apply the tenant config system without fixing this:
- Patient Portal gets colors from tenant config
- Admin portals still have hardcoded different blues
- Same brand, visually inconsistent

---

## Decision Required: Which Palette Wins?

**Options:**

1. **Flowbite blue (Patient Portal)** — `#1A56DB` at 700
   - Pro: Already in customer-facing portal
   - Pro: Flowbite component library compatibility
   - Con: Requires updating 3 admin portals

2. **Tailwind default blue (Admin Portals)** — `#1d4ed8` at 700
   - Pro: Standard Tailwind, more documentation
   - Pro: Only 1 portal to update
   - Con: Changes customer-facing colors

**Recommendation:** Use Flowbite palette. Customer-facing consistency matters more, and Flowbite is already proven in the Patient Portal.

---

## Required Changes

### 1. Update Admin Portal Tailwind Configs

**Files:**
- `node-hedfirst-frontend/tailwind.config.ts` (Store Admin)
- `node-hedfirst-doctor/tailwind.config.ts` (Doctor Portal)
- `node-hedfirst-super-admin/tailwind.config.ts` (Super Admin)

**Change:** Replace hardcoded primary colors with CSS variable pattern:

```typescript
// BEFORE (hardcoded Tailwind blue)
colors: {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    // ...
    700: "#1d4ed8",
    // ...
  },
}

// AFTER (CSS variables with Flowbite fallbacks)
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
}
```

### 2. Fix button.theme.ts

**File:** `node-hedfirst-patient/src/components/buttons/button/button.theme.ts`

**Issue:** Uses `blue-700` directly instead of `primary-700`

```typescript
// BEFORE
primary: "text-white bg-blue-700 enabled:hover:bg-blue-600"

// AFTER
primary: "text-white bg-primary-700 enabled:hover:bg-primary-600"
```

**Search for all instances:**
```bash
grep -r "blue-700\|blue-600\|blue-500" --include="*.tsx" --include="*.ts"
```

### 3. Add ColorConfigLayout to Admin Portals

Each admin portal needs the same layout wrapper that Patient Portal uses:

**Files to create:**
- `node-hedfirst-frontend/src/layouts/color-config.layout.tsx`
- `node-hedfirst-doctor/src/layouts/color-config.layout.tsx`
- `node-hedfirst-super-admin/src/layouts/color-config.layout.tsx`

**Note:** Admin portals may get storeId differently (from auth context rather than URL). Implementation may vary.

### 4. Add RTK Query Endpoint to Admin Portals

Each admin portal needs the tenant config API endpoint:

**Files to create:**
- `node-hedfirst-frontend/src/store/api/tenant-config.api.ts`
- `node-hedfirst-doctor/src/store/api/tenant-config.api.ts`
- `node-hedfirst-super-admin/src/store/api/tenant-config.api.ts`

---

## Out of Scope (Defer)

### Email Templates

5 email templates have hardcoded hex colors:
- `node-hedfirst-patient/public/templates/order-summary.html`
- `node-hedfirst-patient/public/templates/reset-password.html`
- `node-hedfirst-frontend/public/templates/reactivation-email.html`
- `node-hedfirst-frontend/public/templates/reset-password.html`
- `node-hedfirst-frontend/public/templates/store-admin.html`

**Why defer:** Requires backend templating system for variable injection. Not blocking for UI branding.

### Mobile App

React Native app uses Shopify Restyle, completely different from Tailwind CSS variables.

**Why defer:** Different tech stack, different solution needed.

### CSS Animation Colors

`node-hedfirst-frontend/src/app/styles/globals.css` has hardcoded gray values for loading animations.

**Why defer:** Uses standard Tailwind grays, not brand colors. Low priority.

---

## Verification Checklist

After changes, verify:

- [ ] Patient Portal primary-700 button matches Store Admin primary-700 button
- [ ] All portals show same blue when given same tenant config
- [ ] Fallback colors work when no tenant config is loaded
- [ ] No visual regressions in existing Hedfirst UI
- [ ] CSS variables appear in browser DevTools on `:root`

---

## Rollout Order

1. **Fix drift** — Update admin portal Tailwind configs + button.theme.ts
2. **Deploy to staging** — Verify visual consistency
3. **Apply to Hedfirst** — Enable tenant config for Store 1
4. **Onboard Store B** — Add Renewell configuration

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Visual regression in Hedfirst | Medium | High | Side-by-side comparison before deploy |
| Missed hardcoded blue references | Medium | Low | Grep audit + visual QA |
| Admin portal auth context issues | Low | Medium | Careful testing of storeId extraction |
