# Order List View — Filter Specification

> **Purpose**: Defines the filtering, search, and sorting UX for the admin orders list.
> **Audience**: UI/UX designers and developers implementing the orders list view.
> **Last Updated**: December 2024
> **See Also**: `orders-design-brief.txt`, `order-system-logic.md`, `order-list-view-expanded.txt`

---

## Design Philosophy

The question to ask is: **Why is someone opening the orders list right now?**

That tells us what filters matter. Filters should map to real workflows, not just database fields.

---

## Page Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  ORDERS                                                                                │
│                                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search by patient, email, or order ID (HF-XXXX)...                          │   │
│  └────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                        │
│  ┌───────┬──────────────────┬──────────────────┬─────────────────┬────────────────┐   │
│  │  All  │  Needs Review 12 │  Payment Failed 3│  Labs Ready 5   │  Denied 4      │   │
│  └───────┴──────────────────┴──────────────────┴─────────────────┴────────────────┘   │
│                                                                                        │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │Provider ▾│ │Contains ▾│ │ Date ▾ │ │ Sort ▾ │ │ More ▾ │            [Clear All]   │
│  └──────────┘ └──────────┘ └────────┘ └────────┘ └────────┘                          │
│                                                                                        │
│  Applied: [Last 7 Days ×] [Has Prescription ×]                       238 orders       │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

**Key principles:**
- Quick-access tabs for most common workflows (one-click, not dropdown → scan → select)
- Filter dropdowns for secondary criteria
- Applied filters shown as removable tags
- Result count updates live as filters change

---

## Quick-Access Tabs (Always Visible)

Tabs are the **primary** filter — representing the most common operational workflows.

### Tab Definitions

| Tab            | Shows Orders Where...                                        | Use Case                                  |
|----------------|--------------------------------------------------------------|-------------------------------------------|
| All            | No action-needed filter applied                              | General browsing                          |
| Needs Review   | Any child has status `AWAITING_REVIEW` and is a prescription | Provider assignment, clinical workflow    |
| Payment Failed | Any child has status `PAYMENT_FAILED` or subscription in retry | Customer outreach, card updates         |
| Labs Ready     | Lab results received, prescription pending those results     | Clinical workflow continuation            |
| Denied         | Any prescription child was denied                            | Customer follow-up, refunds, alternatives |

### Tab Behavior

- Tabs are **mutually exclusive** (selecting one deselects others)
- "All" clears the action-needed filter but **preserves other filters**
- Counts update live based on other applied filters
- Badge styling:
  - **Red** for urgent: Payment Failed, Denied
  - **Amber** for action-needed: Needs Review, Labs Ready

---

## Search Behavior

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🔍  HF-112                                                                            │
│  ┌────────────────────────────────────────────────────────────────────────────────┐   │
│  │  ORDER MATCHES                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │   │
│  │  │  HF-1127  •  Sarah Mitchell  •  Dec 5, 2024                              │  │   │
│  │  │  HF-1126  •  Michael Chen    •  Dec 4, 2024                              │  │   │
│  │  │  HF-1125  •  Jennifer Adams  •  Dec 4, 2024                              │  │   │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                                 │   │
│  │  PATIENT MATCHES                                                                │   │
│  │  ┌──────────────────────────────────────────────────────────────────────────┐  │   │
│  │  │  No matches                                                              │  │   │
│  │  └──────────────────────────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Search Priorities

1. **Exact Order ID match** (`HF-XXXX`) — highlighted first, this is the #1 support call pattern
2. **Patient name** (partial match)
3. **Patient email**
4. **Phone number** (last 4 digits)

---

## Filter Dropdowns — Full Spec

### Provider Filter

```
┌─────────────────────────────────────────────┐
│  PROVIDER                                   │
│  ─────────────────────────────────────────  │
│  ○ All Providers                            │
│  ○ Unassigned (7)                           │
│  ─────────────────────────────────────────  │
│  ○ Dr. Sarah Chen (23)                      │
│  ○ Dr. Michael Torres (18)                  │
│  ○ Dr. Amanda Foster (12)                   │
└─────────────────────────────────────────────┘
```

**Notes:**
- Only visible for stores with multiple providers
- For single-provider stores, hide this filter entirely
- "Unassigned" is critical for workflow — shows prescriptions waiting for provider pickup

---

### Contains Filter

```
┌─────────────────────────────────────────────┐
│  ORDER CONTAINS                             │
│  ─────────────────────────────────────────  │
│  ☐ Prescription                             │
│  ☐ Membership                               │
│  ☐ Lab Kit                                  │
│  ☐ Appointment                              │
│  ─────────────────────────────────────────  │
│  ☐ Consultation Only (no Rx/membership)     │
└─────────────────────────────────────────────┘
```

**Notes:**
- Multi-select checkboxes
- "Consultation Only" is **exclusive** — selecting it clears other selections
- Use case for "Consultation Only": Identify patients who paid for consult but didn't convert (price sensitivity, denial, abandonment)

---

### Date Filter

```
┌─────────────────────────────────────────────┐
│  DATE RANGE                                 │
│  ─────────────────────────────────────────  │
│  ● Last 7 Days  ← default                   │
│  ○ Today                                    │
│  ○ Yesterday                                │
│  ○ Last 30 Days                             │
│  ○ All Time                                 │
│  ─────────────────────────────────────────  │
│  ○ Custom: [____] to [____]                 │
└─────────────────────────────────────────────┘
```

**Notes:**
- Default to **Last 7 Days** for faster load and operational relevance
- "All Time" should warn if dataset is large (>1000 orders)

---

### Sort Options

```
┌─────────────────────────────────────────────┐
│  SORT BY                                    │
│  ─────────────────────────────────────────  │
│  ● Newest First  ← default                  │
│  ○ Oldest First                             │
│  ○ Waiting Longest (days in current status) │
│  ○ Total Amount (high to low)               │
│  ○ Next Renewal Date                        │
└─────────────────────────────────────────────┘
```

| Sort Option                  | When It's Useful                          |
|------------------------------|-------------------------------------------|
| Newest first (default)       | General browsing, recent activity         |
| Oldest first                 | Working through a backlog                 |
| Waiting Longest              | Clearing stuck reviews, finding blockers  |
| Total Amount (high→low)      | Prioritizing high-value orders            |
| Next Renewal Date            | Subscription management, proactive support|

---

### More Filter (Less Common)

```
┌─────────────────────────────────────────────┐
│  MORE FILTERS                               │
│  ─────────────────────────────────────────  │
│  SUBSCRIPTION STATUS                        │
│  ○ All                                      │
│  ○ Has Active Subscription                  │
│  ○ No Subscriptions (one-time only)         │
│  ○ Paused (winback candidates)              │
│  ○ Canceled (churned)                       │
│  ─────────────────────────────────────────  │
│  UPCOMING RENEWALS                          │
│  ☐ Renewal in Next 7 Days                   │
│     ⓘ 47 orders (52 subscription items)     │
│  ─────────────────────────────────────────  │
│  PRODUCT                                    │
│  [Search products...]                       │
│  Recent: Semaglutide • Finasteride          │
└─────────────────────────────────────────────┘
```

**Subscription Status Notes:**
- "No Subscriptions" = orders with only one-time items
- "Paused (winback candidates)" = subscriptions temporarily suspended, opportunity for outreach
- "Canceled (churned)" = terminated subscriptions, historical/reporting use

**Renewal Count Note:**
- Show both order count AND item count: "47 orders (52 subscription items)"
- One parent order can have multiple subscriptions with different renewal dates

**Product Filter Use Case:**
- "Show me everyone on Semaglutide with an active subscription"
- Useful for: recalls, pricing changes, targeted outreach, clinical updates

---

## Action-Needed States Not in Tabs

Not every action-needed state deserves a tab. These are available in the "More" dropdown:

| State                | Why Not a Tab                                                 |
|----------------------|---------------------------------------------------------------|
| Paused Subscriptions | Important but not urgent. Winback is proactive, not reactive. |
| Renewal in 7 Days    | High volume, not "action needed" — more like "heads up."      |
| Shipment Delayed     | Depends on carrier integration. May be low volume.            |

---

## Default Page State

On initial load:
- **Tab**: All
- **Date**: Last 7 Days
- **Sort**: Newest First
- **All other filters**: None

This gives a fast, relevant view without requiring any clicks.

---

## Saved Views (Power User Feature)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ★ SAVED VIEWS                                                [+ New View]  │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ★ My Review Queue     Needs Review + Provider: Me + Last 7 Days            │
│  ★ Unassigned Rx       Needs Review + Provider: Unassigned                  │
│  ★ GLP-1 Patients      Has Prescription + Product: Semaglutide/Tirzepatide  │
│  ★ Winback List        Paused Subscriptions + Last 30 Days                  │
│  ★ Failed Today        Payment Failed + Today                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Saved views persist filter + tab + sort combinations
- Views are per-user (staff member)
- Consider team-shared views for common workflows

---

## Filters Intentionally Omitted

| Filter                       | Why Not                                    |
|------------------------------|--------------------------------------------|
| Payment method (Visa/MC)     | Rarely useful for workflow                 |
| Exact dollar amount          | Search handles this better                 |
| Created by (staff member)    | Edge case, not worth prominent placement   |
| Billing cycle (30/60/90 day) | Too granular for most workflows            |

---

## Implementation Notes

### Filter State Management
- Filters should be reflected in URL params for shareability
- Example: `/orders?tab=needs-review&date=7d&provider=unassigned`

### Performance
- Tab counts should be fetched efficiently (consider caching for counts)
- "All Time" queries should be paginated or lazy-loaded
- Consider skeleton loading for filter dropdowns with counts

### Accessibility
- All filter controls must be keyboard navigable
- Tab badges should have aria-labels: "Needs Review, 12 orders"
- Applied filter tags should announce when added/removed

---

## Changelog

| Version | Date       | Changes                                    |
|---------|------------|--------------------------------------------|
| 1.0     | Dec 2024   | Initial specification                      |
