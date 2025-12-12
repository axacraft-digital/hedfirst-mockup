# Provider Dashboard Workplan

**Created:** 2025-12-07
**Status:** Planning
**Priority:** Medium
**Complexity:** Low

---

## Executive Summary

Providers (doctors) need a simple dashboard focused on their clinical workflow - reviewing patients and managing their caseload. This is NOT a business analytics dashboard; it's a work queue.

---

## Provider's Primary Tasks

1. Review and approve/deny patient prescriptions
2. See their patient queue at a glance
3. Track their daily activity

---

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROVIDER DASHBOARD                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    TODAY'S SUMMARY                            │   │
│  │  Awaiting Review: 12  |  Reviewed Today: 8  |  My Patients: 156│   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  PATIENTS AWAITING REVIEW                              [View All]│   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │ John D. | Weight Loss | Semaglutide | 2 hours ago     │  │   │
│  │  │ Sarah M. | Hair Growth | Finasteride | 3 hours ago    │  │   │
│  │  │ Mike R. | Weight Loss | Tirzepatide | 5 hours ago     │  │   │
│  │  │ Lisa K. | Skin Care | Tretinoin | 6 hours ago         │  │   │
│  │  │ Tom B. | Weight Loss | Semaglutide | 8 hours ago      │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  MY RECENT ACTIVITY                                           │   │
│  │  • Approved John S. for Semaglutide - 1 hour ago             │   │
│  │  • Denied Mary K. (contraindication) - 2 hours ago           │   │
│  │  • Approved Alex T. for Finasteride - 3 hours ago            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Section 1: Today's Summary

**3 cards showing key numbers:**

| Metric              | Calculation                                                                              | Data Source |
| ------------------- | ---------------------------------------------------------------------------------------- | ----------- |
| **Awaiting Review** | COUNT WHERE status = AWAITING_REVIEW                                                     | `Order`     |
| **Reviewed Today**  | COUNT WHERE approvalDoctorId = me AND status IN (APPROVED, DENIED) AND updatedAt = today | `Order`     |
| **My Patients**     | COUNT DISTINCT patientId WHERE approvalDoctorId = me                                     | `Order`     |

---

## Section 2: Patients Awaiting Review

**Queue of patients needing review (5 most recent):**

| Column        | Source                            | Notes                          |
| ------------- | --------------------------------- | ------------------------------ |
| Patient Name  | `User.firstName`, `User.lastName` | Masked for privacy if needed   |
| Disease State | `OrderLineItem` → disease state   | Weight Loss, Hair Growth, etc. |
| Product       | `OrderLineItem.productName`       | Semaglutide, Finasteride, etc. |
| Waiting Since | `Order.createdAt`                 | Relative time (2 hours ago)    |

**Interaction:**

- Click row → Navigate to patient review page
- "View All" → Navigate to full awaiting review list

**Sorting:** Oldest first (FIFO - first in, first out)

---

## Section 3: My Recent Activity

**Simple feed of provider's recent actions (last 5):**

| Activity                                 | Source                                                 |
| ---------------------------------------- | ------------------------------------------------------ |
| Approved [Patient] for [Product]         | `Order` WHERE status = APPROVED, approvalDoctorId = me |
| Denied [Patient] - [reason if available] | `Order` WHERE status = DENIED, approvalDoctorId = me   |

**Sorting:** Most recent first

---

## What's NOT Included

| Excluded                      | Reason                               |
| ----------------------------- | ------------------------------------ |
| Revenue metrics               | Not provider's concern               |
| Subscription data             | Admin metric                         |
| Product performance           | Admin metric                         |
| Other providers' stats        | Not relevant, could feel competitive |
| Complex patient health trends | Available in patient detail view     |
| Performance metrics           | Could feel like surveillance         |

---

## Data Availability

| Metric                | Available? | Source                                       |
| --------------------- | ---------- | -------------------------------------------- |
| Awaiting review count | ✅ Yes     | `Order.status = AWAITING_REVIEW`             |
| Reviewed today count  | ✅ Yes     | `Order.approvalDoctorId` + `Order.updatedAt` |
| My patients count     | ✅ Yes     | `Order.approvalDoctorId` DISTINCT patientId  |
| Queue list            | ✅ Yes     | `Order` + `User` + `OrderLineItem`           |
| Time waiting          | ✅ Yes     | `Order.createdAt`                            |
| Recent approvals      | ✅ Yes     | `Order` WHERE approvalDoctorId = me          |
| Recent denials        | ✅ Yes     | `Order` WHERE approvalDoctorId = me          |

---

## Implementation

### Backend

**File:** `src/apps/store-doctor/modules/dashboard/` (new or update existing)

```typescript
@Injectable()
export class ProviderDashboardService {
  async getDashboard(providerId: string, storeId: string) {
    const today = startOfDay(new Date());

    const [awaitingReview, reviewedToday, myPatientsCount, queue, recentActivity] =
      await Promise.all([
        this.getAwaitingReviewCount(storeId),
        this.getReviewedTodayCount(providerId, today),
        this.getMyPatientsCount(providerId),
        this.getAwaitingReviewQueue(storeId, 5),
        this.getRecentActivity(providerId, 5),
      ]);

    return {
      summary: {
        awaitingReview,
        reviewedToday,
        myPatientsCount,
      },
      queue,
      recentActivity,
    };
  }

  private async getAwaitingReviewCount(storeId: string): Promise<number> {
    return this.prisma.order.count({
      where: {
        storeId,
        status: OrderStatusEnum.AWAITING_REVIEW,
      },
    });
  }

  private async getReviewedTodayCount(providerId: string, today: Date): Promise<number> {
    return this.prisma.order.count({
      where: {
        approvalDoctorId: providerId,
        status: { in: [OrderStatusEnum.APPROVED, OrderStatusEnum.DENIED] },
        updatedAt: { gte: today },
      },
    });
  }

  private async getMyPatientsCount(providerId: string): Promise<number> {
    const result = await this.prisma.order.findMany({
      where: { approvalDoctorId: providerId },
      select: { userId: true },
      distinct: ['userId'],
    });
    return result.length;
  }

  private async getAwaitingReviewQueue(storeId: string, limit: number) {
    return this.prisma.order.findMany({
      where: {
        storeId,
        status: OrderStatusEnum.AWAITING_REVIEW,
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        lineItems: { select: { productName: true, diseaseState: true }, take: 1 },
      },
      orderBy: { createdAt: 'asc' }, // Oldest first
      take: limit,
    });
  }

  private async getRecentActivity(providerId: string, limit: number) {
    return this.prisma.order.findMany({
      where: {
        approvalDoctorId: providerId,
        status: { in: [OrderStatusEnum.APPROVED, OrderStatusEnum.DENIED] },
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        lineItems: { select: { productName: true }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }
}
```

**Controller:**

```typescript
@Controller('dashboard')
export class ProviderDashboardController {
  @Get()
  async getDashboard(@CurrentUser() user: User) {
    return this.dashboardService.getDashboard(user.id, user.storeId);
  }
}
```

### Frontend

**File:** `node-hedfirst-doctor/src/app/(internal)/panel/dashboard/` (update existing or create)

```
dashboard/
├── page.tsx                    # Main dashboard page
├── _components/
│   ├── summary-cards.tsx       # 3 KPI cards
│   ├── review-queue.tsx        # Patients awaiting review list
│   └── recent-activity.tsx     # Activity feed
```

**RTK Query:**

```typescript
const providerDashboardApi = createApi({
  endpoints: (builder) => ({
    getProviderDashboard: builder.query<ProviderDashboard, void>({
      query: () => "/dashboard",
    }),
  }),
})
```

---

## Files Summary

### Backend

| File                                                              | Purpose  |
| ----------------------------------------------------------------- | -------- |
| `src/apps/store-doctor/modules/dashboard/dashboard.module.ts`     | Module   |
| `src/apps/store-doctor/modules/dashboard/dashboard.controller.ts` | Endpoint |
| `src/apps/store-doctor/modules/dashboard/dashboard.service.ts`    | Logic    |

### Frontend

| File                                                                 | Purpose        |
| -------------------------------------------------------------------- | -------------- |
| `src/app/(internal)/panel/dashboard/page.tsx`                        | Dashboard page |
| `src/app/(internal)/panel/dashboard/_components/summary-cards.tsx`   | 3 cards        |
| `src/app/(internal)/panel/dashboard/_components/review-queue.tsx`    | Queue list     |
| `src/app/(internal)/panel/dashboard/_components/recent-activity.tsx` | Activity feed  |

---

## Verification Checklist

- [ ] Awaiting review count displays correctly
- [ ] Reviewed today count accurate
- [ ] My patients count accurate
- [ ] Queue shows correct patients in FIFO order
- [ ] Click on queue item navigates to review page
- [ ] Recent activity shows provider's approvals/denials
- [ ] Dashboard loads quickly (< 1 second)

---

## Definition of Done

Provider dashboard is complete when:

- [ ] All 3 summary cards working
- [ ] Review queue displays correctly
- [ ] Queue items are clickable and navigate to patient
- [ ] Recent activity feed working
- [ ] Data matches actual database values
- [ ] Mobile-responsive layout
