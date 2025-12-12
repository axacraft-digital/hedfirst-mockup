# Catalog Category Logic Workplan

**Created:** 2025-12-05
**Status:** Planning
**Priority:** High - Affects tenant storefront quality

---

## Problem Statement

Currently, the catalog displays **all 40 disease state categories** regardless of whether the tenant has products in those categories. This results in:

1. **Empty category pages** - Users click a category and see "No products found"
2. **Poor UX** - Navigation shows irrelevant categories for the tenant's offerings
3. **Unprofessional appearance** - Empty PLPs with contact info suggest incomplete setup

---

## Current Implementation

### How Categories Are Built (Problem)

**File:** `src/app/catalog/catalog.client.tsx` (Lines 50-56)

```typescript
// CURRENT: Shows ALL categories from enum, regardless of product availability
const categories: Category[] = useMemo(
  () =>
    Object.entries(diseaseStateNames)
      .filter(
        ([key]) =>
          key !== StoreProductDiseaseStateEnum.NONE &&
          key !== StoreProductDiseaseStateEnum.MULTIPLE
      )
      .map(([key, label]) => ({
        key: key as StoreProductDiseaseStateEnum,
        label,
      })),
  []
)
```

**Result:** 38 categories always displayed (40 minus NONE and MULTIPLE)

### Where Categories Appear

| Location               | File                                              | Issue                    |
| ---------------------- | ------------------------------------------------- | ------------------------ |
| Catalog sidebar filter | `src/app/catalog/_components/category-filter.tsx` | Shows all 38 categories  |
| Header mega menu       | `src/dictionaries/nav-Item-config.ts`             | Hardcoded category links |
| Footer links           | `src/shared/constants/footer.constants.ts`        | Hardcoded category links |
| Sidebar nav            | `src/layouts/sidebar.tsx`                         | Uses nav-Item-config     |

### Current API

**Endpoint:** `GET /products/physicals`

```typescript
// Query params
{
  page: number,
  perPage: number,
  orderBy: string,
  search?: string,
  diseaseStates?: StoreProductDiseaseStateEnum[]  // Filter by category
}
```

**Problem:** No endpoint exists to get categories with product counts.

---

## Proposed Solution

### Strategy: Backend-Driven Categories

Instead of hardcoding all categories, fetch only categories that have active products for the tenant's store.

### New Backend Endpoint

**Endpoint:** `GET /organizations/:orgId/stores/:storeId/products/categories`

**Response:**

```typescript
interface CategoryWithCount {
  diseaseState: StoreProductDiseaseStateEnum;
  name: string;           // Human-readable name
  slug: string;           // URL-friendly slug
  productCount: number;   // Number of active products
}

// Response
{
  categories: CategoryWithCount[];
  totalProducts: number;
}
```

**Example Response:**

```json
{
  "categories": [
    {
      "diseaseState": "DERMATOLOGY",
      "name": "Dermatology",
      "slug": "dermatology",
      "productCount": 12
    },
    {
      "diseaseState": "WEIGHT_MANAGEMENT",
      "name": "Weight Management",
      "slug": "weight-management",
      "productCount": 8
    },
    {
      "diseaseState": "HAIR_SCALP",
      "name": "Hair & Scalp",
      "slug": "hair-scalp",
      "productCount": 5
    }
  ],
  "totalProducts": 25
}
```

**Query Logic:**

```sql
SELECT
  disease_state,
  COUNT(*) as product_count
FROM store_products
WHERE
  store_id = :storeId
  AND status = 'ACTIVE'
  AND disease_state IS NOT NULL
  AND disease_state NOT IN ('NONE', 'MULTIPLE')
GROUP BY disease_state
HAVING COUNT(*) > 0
ORDER BY disease_state ASC
```

---

## Implementation Steps

### Step 1: Backend - Create Categories Endpoint

**Files to Create/Modify:**

**New Controller Method:**
`src/apps/store-admin/modules/products/products.controller.ts`

- [ ] Add `GET /products/categories` endpoint
- [ ] Query products grouped by disease_state
- [ ] Return only categories with count > 0
- [ ] Include human-readable name and slug in response
- [ ] Cache response (categories don't change frequently)

**New Service Method:**
`src/apps/store-admin/modules/products/products.service.ts`

- [ ] Create `getCategoriesWithCounts(storeId: string)` method
- [ ] Use Prisma groupBy or raw query for efficiency
- [ ] Filter out NONE and MULTIPLE disease states
- [ ] Map enum to display names and slugs

**Patient App Endpoint:**
`src/apps/patient/modules/products/products.controller.ts`

- [ ] Add same endpoint for patient-facing API
- [ ] Ensure it uses storeId from deployment config

### Step 2: Frontend - Update RTK Query

**File:** `src/providers/store/api/products/products.ts`

- [ ] Add `getCategories` endpoint

```typescript
getCategories: builder.query<CategoriesResponse, void>({
  query: () => ({
    url: `organizations/${storeId}/stores/${storeId}/products/categories`,
    method: 'GET',
  }),
  providesTags: [ApiTags.Categories],
}),
```

- [ ] Add `ApiTags.Categories` cache tag
- [ ] Invalidate when products are added/removed/updated

### Step 3: Frontend - Update Catalog Page

**File:** `src/app/catalog/catalog.client.tsx`

- [ ] Replace hardcoded categories with API call

```typescript
// NEW: Fetch categories with product counts
const { data: categoriesData, isLoading: categoriesLoading } =
  useGetCategoriesQuery()

const categories: Category[] = useMemo(
  () =>
    categoriesData?.categories.map((cat) => ({
      key: cat.diseaseState,
      label: cat.name,
      count: cat.productCount,
    })) ?? [],
  [categoriesData]
)
```

- [ ] Show loading state while categories load
- [ ] Handle empty categories gracefully (hide filter if no categories)

### Step 4: Frontend - Update Category Filter Component

**File:** `src/app/catalog/_components/category-filter.tsx`

- [ ] Accept categories as prop (already does, just verify)
- [ ] Optionally show product count next to category name

```typescript
// Optional: Show count
<button>
  {category.label}
  {category.count && <span className="text-gray-400 ml-1">({category.count})</span>}
</button>
```

- [ ] Handle empty categories list (don't render filter section)

### Step 5: Handle Navigation Menus

The header and footer navigation is being addressed in the **Tenant Branding Workplan** where navigation becomes tenant-configurable. For this workplan, we focus only on the catalog page filter.

However, as an interim improvement:

**File:** `src/dictionaries/nav-Item-config.ts`

- [ ] Consider making nav items data-driven from categories API
- [ ] OR defer to branding workplan where nav is fully configurable

### Step 6: Update Empty State

**File:** `src/app/catalog/_components/empty-results.tsx`

Current empty state shows when a category has no products. With the new logic, users should never see empty category pages because empty categories won't appear in the filter.

However, empty state can still occur from:

- Search with no results
- Products removed after page load

- [ ] Simplify empty state message for search scenarios
- [ ] Remove category-specific messaging (won't happen anymore)

---

## Edge Cases

### 1. Category Becomes Empty After Products Removed

**Scenario:** Admin removes last product from a category while user is browsing.

**Solution:**

- API returns empty results
- Show search empty state
- Categories refresh on next page load

### 2. New Category Added

**Scenario:** Admin adds first product in a new disease state.

**Solution:**

- Invalidate categories cache when product is created/updated
- New category appears after cache refresh

### 3. Store Has No Products

**Scenario:** New tenant with no products configured.

**Solution:**

- Categories API returns empty array
- Hide category filter entirely
- Show friendly "Coming soon" or setup message

---

## Files Summary

### Backend Changes

| File                                                           | Action                                |
| -------------------------------------------------------------- | ------------------------------------- |
| `src/apps/store-admin/modules/products/products.controller.ts` | Add categories endpoint               |
| `src/apps/store-admin/modules/products/products.service.ts`    | Add getCategoriesWithCounts method    |
| `src/apps/patient/modules/products/products.controller.ts`     | Add categories endpoint (patient API) |

### Frontend Changes

| File                                              | Action                                  |
| ------------------------------------------------- | --------------------------------------- |
| `src/providers/store/api/products/products.ts`    | Add getCategories RTK Query endpoint    |
| `src/app/catalog/catalog.client.tsx`              | Use API categories instead of hardcoded |
| `src/app/catalog/_components/category-filter.tsx` | Handle empty state, optional counts     |
| `src/app/catalog/_components/empty-results.tsx`   | Simplify messaging                      |

---

## API Response Caching

### Cache Strategy

Categories don't change frequently, so aggressive caching is appropriate:

**Backend:**

- Cache categories response for 5 minutes
- Invalidate cache on product create/update/delete

**Frontend (RTK Query):**

- `keepUnusedDataFor: 300` (5 minutes)
- Invalidate on `ApiTags.Products` mutations

---

## Verification Checklist

- [ ] Categories endpoint returns only categories with products
- [ ] Catalog filter shows dynamic categories from API
- [ ] Empty categories do not appear in filter
- [ ] Clicking a category shows products (never empty)
- [ ] Search still works with empty results state
- [ ] Store with no products handles gracefully
- [ ] Cache invalidates when products change
- [ ] Lab tests section unaffected (separate logic)

---

## Definition of Done

Catalog category logic is complete when:

- [ ] New backend endpoint created and tested
- [ ] Frontend fetches categories from API
- [ ] Only categories with products are displayed
- [ ] Users never see empty category PLPs
- [ ] Cache invalidation works correctly
- [ ] Empty store state handled gracefully
