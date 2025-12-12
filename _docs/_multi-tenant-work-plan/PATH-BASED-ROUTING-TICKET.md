# TICKET: Path-Based Multi-Tenant Routing

**Type**: Technical Implementation
**Sprint**: Current
**Repo**: `node-hedfirst-patient` (Patient Portal)
**Priority**: High - Blocks all multi-tenant work
**Created**: 2025-12-09

---

## Summary

Implement path-based tenant routing using middleware rewrites. A single deployment serves multiple stores:

```
teligant.com/hedfirst/catalog    → Hedfirst store
teligant.com/peptidebarn/catalog → Peptide Barn store
```

Custom domains handled externally via customer's Cloudflare proxy (no code changes needed).

---

## Why Path-Based (Not Domain-Based)

| Approach | DNS Config | SSL Certs | Works in Staging | Complexity |
|----------|------------|-----------|------------------|------------|
| **Path-based** | None | None | Immediately | Low |
| Subdomain-based | Required | Wildcard needed | Extra setup | Medium |
| Custom domain | Required | Per-domain | Complex | High |

Path-based gives us instant multi-tenant capability with zero infrastructure changes.

---

## Technical Approach: Middleware Rewrites

### Why Rewrites (Not Folder Restructuring)

We will **NOT** restructure `src/app/` to add `[tenant]/` folders. Instead:

1. Middleware intercepts request
2. Extracts tenant slug from path
3. Sets tenant headers (`x-store-id`, `x-organization-id`)
4. Rewrites URL to strip tenant prefix
5. Existing pages serve the request, reading tenant from context

**Benefits**: Zero file moves, lower risk, same outcome.

---

## Implementation Details

### 1. Middleware Logic (`src/middleware.ts`)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// MVP: Hardcoded tenant map (future: database lookup)
const TENANT_MAP: Record<string, { storeId: string; organizationId: string }> = {
  hedfirst: {
    storeId: process.env.HEDFIRST_STORE_ID!,
    organizationId: process.env.HEDFIRST_ORG_ID!,
  },
  peptidebarn: {
    storeId: process.env.PEPTIDEBARN_STORE_ID!,
    organizationId: process.env.PEPTIDEBARN_ORG_ID!,
  },
};

const TENANT_SLUGS = Object.keys(TENANT_MAP);

// Paths that should NOT be tenant-prefixed
const EXCLUDED_PATHS = [
  /^\/_next/,        // Next.js internals
  /^\/api/,          // API routes
  /^\/favicon.ico/,  // Favicon
  /^\/robots.txt/,   // SEO
  /^\/sitemap/,      // SEO
  /\.(svg|png|jpg|ico|css|js)$/, // Static assets
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip excluded paths
  if (EXCLUDED_PATHS.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Extract tenant slug: /peptidebarn/catalog → "peptidebarn"
  const segments = pathname.split("/").filter(Boolean);
  const tenantSlug = segments[0]?.toLowerCase();

  // Valid tenant with just root path → redirect to catalog (home)
  // e.g., /peptidebarn → /peptidebarn/catalog
  if (TENANT_MAP[tenantSlug] && segments.length === 1) {
    return NextResponse.redirect(new URL(`/${tenantSlug}/catalog`, req.url), 301);
  }

  // Unknown or missing tenant
  if (!tenantSlug || !TENANT_MAP[tenantSlug]) {
    // Legacy Hedfirst redirect: /catalog → /hedfirst/catalog
    if (segments.length > 0 && !TENANT_MAP[tenantSlug]) {
      const newPath = `/hedfirst/${pathname.replace(/^\//, "")}`;
      return NextResponse.redirect(new URL(newPath, req.url), 301);
    }
    // Empty path or truly unknown tenant → 404
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  const tenant = TENANT_MAP[tenantSlug];

  // Rewrite URL: /peptidebarn/catalog → /catalog
  const rewrittenPath = "/" + segments.slice(1).join("/") || "/";
  const url = req.nextUrl.clone();
  url.pathname = rewrittenPath;

  const res = NextResponse.rewrite(url);

  // Set tenant headers for downstream consumption
  res.headers.set("x-store-id", tenant.storeId);
  res.headers.set("x-organization-id", tenant.organizationId);
  res.headers.set("x-tenant-slug", tenantSlug);

  // Existing device detection (preserve current behavior)
  const userAgent = req.headers.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  res.headers.set("x-device-type", isMobile ? "mobile" : "desktop");

  // Set cookie for client-side access
  res.cookies.set("tenant-slug", tenantSlug, { path: "/" });
  res.cookies.set("store-id", tenant.storeId, { path: "/" });
  res.cookies.set("organization-id", tenant.organizationId, { path: "/" });

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

### 2. Tenant Context Helper (`src/lib/tenant-context.ts`) - NEW FILE

```typescript
import { headers } from "next/headers";

interface TenantContext {
  storeId: string;
  organizationId: string;
  tenantSlug: string;
}

// Server Components / Server Actions
export function getTenantContext(): TenantContext {
  const headersList = headers();
  return {
    storeId: headersList.get("x-store-id") || "",
    organizationId: headersList.get("x-organization-id") || "",
    tenantSlug: headersList.get("x-tenant-slug") || "",
  };
}

// Client Components
export function getTenantContextClient(): TenantContext {
  if (typeof window === "undefined") {
    return { storeId: "", organizationId: "", tenantSlug: "" };
  }

  const getCookie = (name: string) => {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
    return value || "";
  };

  return {
    storeId: getCookie("store-id"),
    organizationId: getCookie("organization-id"),
    tenantSlug: getCookie("tenant-slug"),
  };
}
```

---

### 3. Update Store ID Hook (`src/hooks/store-id.hook.ts`)

```typescript
// BEFORE
import { publicConfig } from "@/configs/public-config";
export const useStoreId = () => publicConfig.storeId;

// AFTER
import { getTenantContextClient } from "@/lib/tenant-context";
export const useStoreId = () => {
  const { storeId } = getTenantContextClient();
  return storeId;
};
```

---

### 4. Fix organizationId Bug in API Endpoints

**Problem**: 10 endpoints incorrectly use `storeId` for both parameters:

```typescript
// WRONG
url: `/organizations/${publicConfig.storeId}/stores/${publicConfig.storeId}/products`

// CORRECT
url: `/organizations/${organizationId}/stores/${storeId}/products`
```

**Files to fix** (in `src/providers/store/api/`):
- `products/products.ts`
- `auth/auth.ts`
- `subscriptions/subscriptions.ts`
- `orders/orders.ts`
- `consultations/consultations.ts`
- `lab-tests/lab-tests.ts`
- `appointments/appointments.ts`
- `documents/documents.ts`
- `messages/messages.ts`
- `user/user.ts`

**Pattern**: Replace hardcoded `publicConfig.storeId` with template markers, then centralize replacement in `customFetchBase.ts`:

```typescript
// API endpoint definition
url: `/organizations/:orgId/stores/:storeId/products`

// customFetchBase.ts intercepts and replaces
const { storeId, organizationId } = getTenantContextClient();
finalUrl = url
  .replace(":orgId", organizationId)
  .replace(":storeId", storeId);
```

---

### 5. Link Generation - Tenant-Aware Links

Create a helper for generating tenant-prefixed URLs:

```typescript
// src/lib/tenant-links.ts
import { getTenantContextClient } from "./tenant-context";

export function tenantHref(path: string): string {
  const { tenantSlug } = getTenantContextClient();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${tenantSlug}${cleanPath}`;
}

// Usage in components
<Link href={tenantHref("/catalog")}>Shop</Link>
// Renders: /peptidebarn/catalog
```

**Alternatively**: Create a `<TenantLink>` wrapper component.

---

### 6. Environment Variables

Add to `.env.local` and production:

```bash
# Hedfirst (existing tenant)
HEDFIRST_STORE_ID=store_hedfirst_prod
HEDFIRST_ORG_ID=org_hedfirst

# Peptide Barn (new tenant)
PEPTIDEBARN_STORE_ID=store_peptidebarn_prod
PEPTIDEBARN_ORG_ID=org_peptidebarn
```

---

## URL Behavior Summary

| URL | Behavior |
|-----|----------|
| `teligant.com/` | Marketing site (separate, out of scope) |
| `teligant.com/hedfirst` | 301 redirect → `/hedfirst/catalog` |
| `teligant.com/hedfirst/catalog` | Hedfirst catalog (home) |
| `teligant.com/peptidebarn` | 301 redirect → `/peptidebarn/catalog` |
| `teligant.com/peptidebarn/catalog` | Peptide Barn catalog (home) |
| `teligant.com/catalog` | 301 redirect → `/hedfirst/catalog` (legacy support) |
| `teligant.com/unknownstore/catalog` | 404 |
| `shop.peptidebarn.com/catalog` | Customer proxies to `/peptidebarn/catalog` - works automatically |

---

## Files to Modify

| File | Action |
|------|--------|
| `src/middleware.ts` | Major rewrite - tenant detection, rewrites, headers |
| `src/lib/tenant-context.ts` | **NEW** - Server/client context helpers |
| `src/lib/tenant-links.ts` | **NEW** - Tenant-aware link generation |
| `src/hooks/store-id.hook.ts` | Use `getTenantContextClient()` |
| `src/configs/public-config.ts` | Deprecate static `storeId` |
| `src/providers/store/api/customFetchBase.ts` | Centralized URL rewriting with `:orgId`/`:storeId` |
| `src/providers/store/api/**/*.ts` | Replace hardcoded IDs with template markers (14 files) |
| `.env.local` / `.env.production` | Add tenant env vars |

---

## Acceptance Criteria

- [ ] `teligant.com/hedfirst/catalog` loads Hedfirst store with correct products
- [ ] `teligant.com/peptidebarn/catalog` loads Peptide Barn store with correct products
- [ ] `teligant.com/hedfirst` redirects 301 to `/hedfirst/catalog`
- [ ] `teligant.com/peptidebarn` redirects 301 to `/peptidebarn/catalog`
- [ ] `teligant.com/catalog` (legacy) redirects 301 to `/hedfirst/catalog`
- [ ] `teligant.com/unknownstore/anything` shows 404
- [ ] Middleware sets `x-store-id`, `x-organization-id`, `x-tenant-slug` headers
- [ ] Cookies set for client-side tenant access
- [ ] All API calls use correct `organizationId` (bug fixed)
- [ ] Static assets (`/_next/*`, images, favicon) work without tenant prefix
- [ ] Works in staging and production identically
- [ ] Custom domain proxy works (test: add `127.0.0.1 shop.peptidebarn.com` to hosts file)

---

## Testing Checklist

1. **Happy path**: Navigate full flow on `/hedfirst/*` - catalog, sign-in, dashboard
2. **Second tenant**: Navigate full flow on `/peptidebarn/*`
3. **Cross-tenant isolation**: Log in on tenant A, try to access tenant B → should fail/404
4. **Legacy redirects**: Old bookmarked URLs redirect correctly
5. **Tenant root redirects**: `/hedfirst` and `/peptidebarn` redirect to catalog
6. **WebSocket/Chat**: Verify chat connects to correct tenant
7. **API inspection**: Check network tab - all requests use correct org/store IDs

---

## Out of Scope (Separate Tickets)

- Tenant branding (logo, colors, nav, footer)
- Tenant-specific email templates
- Admin portal tenant isolation
- Database-backed tenant config (replacing hardcoded `TENANT_MAP`)
- Seeding products for Peptide Barn store

---

## Dependencies

**This ticket blocks**:
- Tenant branding implementation
- Tenant-specific catalog/categories
- Admin portal multi-tenant support
- Email template personalization

**This ticket depends on**:
- Nothing - can start immediately

---

## Notes

- The `TENANT_MAP` is hardcoded for MVP. Future enhancement: fetch from database via API call in middleware.
- Custom domains work automatically because customer's proxy forwards to our path-based URL. No additional middleware logic needed.
- The organizationId bug fix is included in this ticket since we're touching all API files anyway.
