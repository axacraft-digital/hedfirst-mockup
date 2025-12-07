# Store Admin Dashboard & Analytics Workplan

**Created:** 2025-12-07
**Updated:** 2025-12-07
**Status:** Planning
**Priority:** High - Critical for tenant business operations
**Complexity:** Medium

---

## Executive Summary

Store admins need a dashboard to track the health and performance of their telehealth business. This workplan defines metrics based on **data we can actually track today** - no aspirational metrics that require integrations we don't have.

---

## Data Availability Audit

### What We CAN Track (Data Exists)

| Data Point | Source Table | Notes |
|------------|--------------|-------|
| Revenue (gross/net) | `PayTheoryTransaction` | amount, status, moneyDirection |
| Refunds | `PayTheoryTransaction` | WHERE moneyDirection = OUT |
| Orders by Status | `Order` | Full status enum available |
| Order Creation Date | `Order.createdAt` | ✅ |
| Active Subscriptions | `PayTheorySubscription` | status field |
| Subscription Cancellations | `PayTheorySubscription.canceledAt` | Timestamp only, no reason |
| Questionnaire Completion | `MedicalQuestionnaire` | isCompleted, completedAt |
| Patients Awaiting Review | `Order` | WHERE status = AWAITING_REVIEW |
| Doctor Assignment | `Order.approvalDoctorId` | Which doctor, not when |
| Payment Success/Failure | `PayTheoryTransaction.status` | + failureReasons array |
| Orders Shipped | `Order.status` | ORDER_SHIPPED from ShipStation |
| Products Sold | `OrderLineItem` | Linked to orders |

### What We CANNOT Track (Data Missing)

| Metric | Why Not | Workaround |
|--------|---------|------------|
| Visitors / Cart Abandonment | No analytics integration | None - requires Google Analytics or similar |
| Time to Doctor Approval | No `approvedAt` timestamp | None - would need schema change |
| Time in Review Queue | No timestamp when entered AWAITING_REVIEW | Can only see current queue, not duration |
| Churn Reasons | No cancellation reason field | Would need to add + collect |
| Delivery Confirmation | ShipStation only sends SHIPPED | None - would need enhanced integration |
| Shipping Duration | No `shippedAt` timestamp stored | None - ORDER_SHIPPED status exists but no timestamp |
| Provider Review Duration | `Appointment.reviewedAt` exists, but not on Order | Partial - only for appointments |
| First Purchase Date per Patient | Not a direct field | Query: MIN(Order.createdAt) per user |

---

## Revised Dashboard: Only Trackable Metrics

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STORE ADMIN DASHBOARD                             │
├─────────────────────────────────────────────────────────────────────┤
│  [Today] [This Week] [This Month] [This Quarter] [Custom Range]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    OVERVIEW CARDS                             │   │
│  │  Revenue | Orders | Active Subscriptions | Awaiting Review    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │   REVENUE OVER TIME         │  │   ORDERS BY STATUS          │   │
│  │   (Line Chart)              │  │   (Bar/Pie)                 │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │   SUBSCRIPTION HEALTH       │  │   TOP PRODUCTS              │   │
│  │   (Metrics)                 │  │   (Table)                   │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    ALERTS & ACTION ITEMS                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Section 1: Overview Cards

**4 key metrics at a glance:**

| Metric | Calculation | Data Source |
|--------|-------------|-------------|
| **Total Revenue** | SUM(amount) WHERE status = SUCCEEDED, moneyDirection = IN | `PayTheoryTransaction` |
| **Total Orders** | COUNT(*) WHERE status NOT IN (FAILED, CANCELED) | `Order` |
| **Active Subscriptions** | COUNT(*) WHERE canceledAt IS NULL | `PayTheorySubscription` |
| **Awaiting Review** | COUNT(*) WHERE status = AWAITING_REVIEW | `Order` |

Each card shows:
- Current period value
- % change vs prior period (same length)

---

## Section 2: Revenue Over Time

**Line chart showing daily/weekly revenue**

| Metric | Calculation |
|--------|-------------|
| **Gross Revenue** | SUM(amount) WHERE moneyDirection = IN, status = SUCCEEDED |
| **Refunds** | SUM(amount) WHERE moneyDirection = OUT |
| **Net Revenue** | Gross - Refunds |

**Grouping:** By day (if < 30 days selected), by week (if > 30 days)

---

## Section 3: Orders by Status

**Breakdown of orders in each status**

| Status | What It Means |
|--------|---------------|
| AWAITING_REVIEW | Needs doctor approval |
| APPROVED | Doctor approved, awaiting payment/fulfillment |
| PAID | Payment received |
| SENT_TO_PHARMACY | Transmitted to pharmacy |
| ORDER_SHIPPED | ShipStation confirmed shipment |
| FULFILLED / COMPLETED | Done |
| DENIED | Doctor denied |
| CANCELED | Patient/admin canceled |

**Visualization:** Horizontal bar chart or pie chart

---

## Section 4: Subscription Health

| Metric | Calculation | Data Source |
|--------|-------------|-------------|
| **Active Subscriptions** | COUNT WHERE canceledAt IS NULL | `PayTheorySubscription` |
| **New Subscriptions** | COUNT WHERE createdAt IN period | `PayTheorySubscription` |
| **Canceled Subscriptions** | COUNT WHERE canceledAt IN period | `PayTheorySubscription` |
| **Churn Rate** | Canceled / (Active at period start) | Calculated |
| **MRR** | SUM(amount) of active subscriptions | `PayTheorySubscription` |

**Note:** We track THAT subscriptions were canceled, but NOT WHY (no reason field exists).

### Retention Tracking (Cohort-Based)

We CAN calculate retention by cohort:
- Group subscriptions by creation month
- Check how many are still active after 30/60/90 days
- This requires a scheduled job to snapshot cohort data

---

## Section 5: Top Products

**Table showing best-selling products**

| Column | Source |
|--------|--------|
| Product Name | `OrderLineItem.productName` |
| Units Sold | COUNT of line items |
| Revenue | SUM of line item prices |
| % of Total | Revenue / Total Revenue |

**Sorting:** By revenue, descending

---

## Section 6: Alerts & Action Items

**Only alerts we can actually detect:**

| Alert | Trigger | Data Source |
|-------|---------|-------------|
| **Patients Awaiting Review** | COUNT > 0 WHERE status = AWAITING_REVIEW | `Order` |
| **High Payment Failure Rate** | Failure rate > 10% today | `PayTheoryTransaction` |
| **Subscription Cancellations Spike** | > 2x normal daily cancellations | `PayTheorySubscription` |
| **Refund Spike** | > 2x normal daily refunds | `PayTheoryTransaction` |

**What we CANNOT alert on:**
- ❌ Patients waiting > 24 hours (no queue entry timestamp)
- ❌ Shipping delays (no delivery data)
- ❌ Low approval rate (no approval timestamp to calculate rate properly)

---

## What's NOT Included (and Why)

### Removed: Patient Acquisition Funnel
**Why:** We don't track visitors, cart starts, or checkout abandonment. We only see completed orders.

### Removed: Time-Based SLAs
**Why:** No timestamps for:
- When order entered AWAITING_REVIEW
- When doctor started/completed review
- When order was shipped (only status, not timestamp)

### Removed: Provider Performance Table
**Why:** We have `approvalDoctorId` but no:
- Review start/end timestamps
- Cannot calculate average review time
- Cannot measure individual provider efficiency

### Removed: Churn Reasons Breakdown
**Why:** `PayTheorySubscription` has `canceledAt` but no reason field. We'd need to:
1. Add a cancellation reason field
2. Build a cancellation flow to collect it
3. Then we could display it

### Removed: Delivery/Fulfillment Metrics
**Why:** ShipStation integration only updates status to ORDER_SHIPPED. We don't receive:
- Tracking numbers
- Delivery confirmation
- Delivery dates

---

## Implementation Steps

### Phase 1: Backend Analytics API

#### Step 1.1: Create Analytics Service

**File:** `src/apps/store-admin/modules/analytics/` (new module)

```typescript
@Injectable()
export class AnalyticsService {
  // Overview metrics
  async getOverviewMetrics(storeId: string, startDate: Date, endDate: Date) {
    const [revenue, orders, subscriptions, awaitingReview] = await Promise.all([
      this.getRevenue(storeId, startDate, endDate),
      this.getOrderCount(storeId, startDate, endDate),
      this.getActiveSubscriptionCount(storeId),
      this.getAwaitingReviewCount(storeId),
    ]);

    return { revenue, orders, subscriptions, awaitingReview };
  }

  // Revenue over time
  async getRevenueTimeSeries(storeId: string, startDate: Date, endDate: Date) {
    return this.prisma.payTheoryTransaction.groupBy({
      by: ['createdAt'], // Group by date
      where: {
        order: { storeId },
        createdAt: { gte: startDate, lte: endDate },
        status: 'SUCCEEDED',
      },
      _sum: { amount: true },
    });
  }

  // Orders by status
  async getOrdersByStatus(storeId: string, startDate: Date, endDate: Date) {
    return this.prisma.order.groupBy({
      by: ['status'],
      where: {
        storeId,
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: true,
    });
  }

  // Subscription metrics
  async getSubscriptionMetrics(storeId: string, startDate: Date, endDate: Date) {
    const [active, newSubs, canceled] = await Promise.all([
      this.prisma.payTheorySubscription.count({
        where: { order: { storeId }, canceledAt: null },
      }),
      this.prisma.payTheorySubscription.count({
        where: { order: { storeId }, createdAt: { gte: startDate, lte: endDate } },
      }),
      this.prisma.payTheorySubscription.count({
        where: { order: { storeId }, canceledAt: { gte: startDate, lte: endDate } },
      }),
    ]);

    return { active, new: newSubs, canceled, churnRate: canceled / (active + canceled) };
  }

  // Top products
  async getTopProducts(storeId: string, startDate: Date, endDate: Date, limit = 10) {
    return this.prisma.orderLineItem.groupBy({
      by: ['productName'],
      where: {
        order: { storeId, createdAt: { gte: startDate, lte: endDate } },
      },
      _count: true,
      _sum: { price: true },
      orderBy: { _sum: { price: 'desc' } },
      take: limit,
    });
  }

  // Alerts
  async getAlerts(storeId: string) {
    const alerts = [];

    const awaitingReview = await this.getAwaitingReviewCount(storeId);
    if (awaitingReview > 0) {
      alerts.push({
        type: 'AWAITING_REVIEW',
        severity: awaitingReview > 10 ? 'HIGH' : 'MEDIUM',
        message: `${awaitingReview} patients awaiting review`,
        action: 'Review patients',
      });
    }

    // Payment failure rate check
    const todayFailureRate = await this.getTodayPaymentFailureRate(storeId);
    if (todayFailureRate > 0.10) {
      alerts.push({
        type: 'PAYMENT_FAILURES',
        severity: 'HIGH',
        message: `Payment failure rate: ${(todayFailureRate * 100).toFixed(1)}%`,
        action: 'Check payment processor',
      });
    }

    return alerts;
  }
}
```

#### Step 1.2: Create Analytics Controller

**File:** `src/apps/store-admin/modules/analytics/analytics.controller.ts`

```typescript
@Controller('analytics')
export class AnalyticsController {
  @Get('overview')
  async getOverview(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getOverviewMetrics(storeId, new Date(startDate), new Date(endDate));
  }

  @Get('revenue')
  async getRevenue(...) { }

  @Get('orders')
  async getOrdersByStatus(...) { }

  @Get('subscriptions')
  async getSubscriptionMetrics(...) { }

  @Get('products')
  async getTopProducts(...) { }

  @Get('alerts')
  async getAlerts(...) { }
}
```

### Phase 2: Frontend Dashboard

#### Step 2.1: Dashboard Components

**Files:** `node-hedfirst-frontend/src/app/(internal)/panel/dashboard/`

```
dashboard/
├── page.tsx                    # Main dashboard
├── _components/
│   ├── overview-cards.tsx      # 4 KPI cards
│   ├── revenue-chart.tsx       # Line chart
│   ├── orders-by-status.tsx    # Bar/pie chart
│   ├── subscription-health.tsx # Metrics display
│   ├── top-products.tsx        # Table
│   ├── alerts-list.tsx         # Action items
│   └── date-range-picker.tsx   # Date selection
```

#### Step 2.2: RTK Query Endpoints

**File:** `src/providers/store/api/analytics/analytics.ts`

```typescript
const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  endpoints: (builder) => ({
    getOverviewMetrics: builder.query<OverviewMetrics, DateRangeParams>({
      query: ({ startDate, endDate }) => ({
        url: '/analytics/overview',
        params: { startDate, endDate },
      }),
    }),
    getRevenueTimeSeries: builder.query<RevenueData[], DateRangeParams>({...}),
    getOrdersByStatus: builder.query<OrderStatusData[], DateRangeParams>({...}),
    getSubscriptionMetrics: builder.query<SubscriptionMetrics, DateRangeParams>({...}),
    getTopProducts: builder.query<ProductData[], DateRangeParams>({...}),
    getAlerts: builder.query<Alert[], void>({...}),
  }),
});
```

---

## Future Enhancements (Requires Data Changes)

If we want to track more in the future, we'd need:

| Feature | Required Change |
|---------|-----------------|
| **Time to Approval** | Add `approvedAt` timestamp to Order |
| **Queue Duration** | Add `awaitingReviewAt` timestamp to Order |
| **Churn Reasons** | Add `cancelReason` field to PayTheorySubscription + cancellation UI |
| **Shipping Times** | Store ShipStation webhook payload with timestamps |
| **Provider Performance** | Add review timestamps to Order or separate ReviewLog table |
| **Patient Funnel** | Integrate analytics (Google Analytics, Mixpanel, etc.) |

---

## Files Summary

### Backend

| File | Purpose |
|------|---------|
| `src/apps/store-admin/modules/analytics/analytics.module.ts` | Module |
| `src/apps/store-admin/modules/analytics/analytics.controller.ts` | API endpoints |
| `src/apps/store-admin/modules/analytics/analytics.service.ts` | Calculations |

### Frontend

| File | Purpose |
|------|---------|
| `src/app/(internal)/panel/dashboard/page.tsx` | Main dashboard |
| `src/app/(internal)/panel/dashboard/_components/*.tsx` | UI components |
| `src/providers/store/api/analytics/analytics.ts` | RTK Query |

---

## Verification Checklist

- [ ] Revenue displays correctly (gross, net, refunds)
- [ ] Order counts by status accurate
- [ ] Active subscription count accurate
- [ ] Canceled subscription count accurate
- [ ] Top products list accurate
- [ ] Alerts trigger correctly
- [ ] Date range filtering works
- [ ] Comparison to prior period works
- [ ] Mobile-responsive layout

---

## Definition of Done

Dashboard is complete when:

- [ ] All 4 overview cards working
- [ ] Revenue chart displays correctly
- [ ] Orders by status chart working
- [ ] Subscription metrics accurate
- [ ] Top products table functional
- [ ] Alerts system operational
- [ ] Date range selection works
- [ ] Data matches actual database values
