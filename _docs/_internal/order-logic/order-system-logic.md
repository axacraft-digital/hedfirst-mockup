# Order System Logic - V1 Production

> **Purpose**: Documents how orders work in the Hedfirst/Teligant V1 production system.
> **Audience**: Any project needing awareness of current production order architecture.
> **Last Updated**: December 2024
> **See Also**: `purchase-scenarios-catalog.pdf`, `purchase-scenarios-schema.json` in this folder

---

## Overview

The order system uses a **parent-children hierarchy** where a single checkout session creates one parent order containing multiple sub-orders (children). Each child order has distinct characteristics for payment timing, recurrence, and payment processor handling.

---

## Parent Order (Container)

| Attribute     | Description                                             |
| ------------- | ------------------------------------------------------- |
| **ID Format** | `HF-XXXX` (e.g., HF-1127)                               |
| **Purpose**   | Groups all items purchased in a single checkout session |
| **Total**     | Sum of all children order amounts                       |
| **Created**   | At moment of checkout                                   |

The parent order is what the customer recognizes as "their order." It's the receipt-level view.

---

## Children Orders (Sub-orders)

Each item in a checkout becomes its own child order because different item types require different:

- Payment timing (immediate vs. deferred)
- Recurrence rules (one-time vs. subscription)
- Payment processor handling (separate subscriptions in PayTheory)

### Order Types

#### 1. Consultation Order

| Attribute     | Value                                           |
| ------------- | ----------------------------------------------- |
| **Charged**   | Immediately at checkout                         |
| **Recurring** | No - one-time purchase                          |
| **PayTheory** | Single charge                                   |
| **Example**   | $29 medical consultation fee                    |
| **Purpose**   | Fee for provider to review prescription request |

Many telehealth platforms charge a consultation fee separate from medication costs. This covers the provider's time to review the patient's questionnaire and make a prescribing decision.

**Consultation Status Flow:**

```
PENDING → IN_PROGRESS → PROCESSED
                      → REFUNDED (if denied/canceled)
                      → EXPIRED (if no response within SLA)
```

---

#### 2. Appointment Order

| Attribute     | Value                                   |
| ------------- | --------------------------------------- |
| **Charged**   | Immediately at checkout                 |
| **Recurring** | No - one-time purchase                  |
| **PayTheory** | Single charge                           |
| **Example**   | $0 (included) or $75 video consultation |
| **Purpose**   | Scheduled video visit with provider     |

The platform supports actual telehealth appointments (via Zoom integration), not just async prescription reviews. Appointments may be:

- $0 if included with a membership or treatment
- Priced separately for standalone consultations

---

#### 3. Lab Kit Order

| Attribute     | Value                                   |
| ------------- | --------------------------------------- |
| **Charged**   | Immediately at checkout                 |
| **Recurring** | No - one-time purchase                  |
| **PayTheory** | Single charge                           |
| **Example**   | $0 (with membership) or $149 standalone |
| **Purpose**   | At-home lab test kit shipped to patient |

Lab kits (via ChooseHealth integration) may be:

- Included free with certain memberships
- Purchased standalone
- Required before certain treatments (e.g., metabolic panel before GLP-1s)

---

#### 4. Membership Order

| Attribute          | Value                                   |
| ------------------ | --------------------------------------- |
| **Charged**        | Immediately at checkout                 |
| **Recurring**      | **Yes** - subscription                  |
| **PayTheory**      | Separate recurring subscription         |
| **Billing Cycles** | Monthly, Annual                         |
| **Example**        | $19/month care membership               |
| **Purpose**        | Ongoing care plan with bundled benefits |

Memberships are charged immediately but create a recurring subscription in PayTheory. They follow their own billing cycle independent of any medication subscriptions.

**Membership benefits may include:**

- Discounted medication pricing
- Free lab kits
- Included consultations
- Priority provider access

---

#### 5. Prescription/Medication Order

| Attribute          | Value                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Charged**        | **Deferred** - on provider approval                                                       |
| **Recurring**      | Depends on medication/supply                                                              |
| **PayTheory**      | Tokenize card at checkout; charge on approval; if recurring, create separate subscription |
| **Billing Cycles** | One-time, 30-day, 60-day, 90-day, 180-day                                                 |
| **Example**        | Semaglutide $299/month, Finasteride $45/quarter                                           |
| **Purpose**        | Prescription medications requiring provider approval                                      |

This is the most complex order type:

1. **At checkout**: PayTheory tokenizes the credit card (no charge yet)
2. **Provider reviews**: Doctor evaluates questionnaire, may approve/deny
3. **On approval**: Card is charged, prescription sent to pharmacy
4. **If recurring**: PayTheory subscription created for future refills

**One-time vs. Subscription medications:**

- **One-time**: Sildenafil 10-pack (use as needed)
- **Subscription**: Semaglutide (weekly injection, monthly refill)

---

## First Refill Offset Rule

For subscription medications, the **first refill is shifted 7 days earlier** than the billing cycle would normally indicate. This ensures patients receive refills before running out of medication.

**Constant**: `SUBSCRIPTION_PAYMENT_SHIFT_DAYS = 7`

**Formula**:

```
first_refill_date = subscription_start_date + billing_cycle_days - 7
```

**Examples**:

| Billing Cycle | Days | First Refill After |
| ------------- | ---- | ------------------ |
| 30-day supply | 30   | 23 days            |
| 60-day supply | 60   | 53 days            |
| 90-day supply | 90   | 83 days            |

**Why this matters:**

- Medication shipping takes time
- Prevents patient gaps in treatment
- Accounts for pharmacy processing delays

**Important**: After the first refill, subsequent refills follow the normal billing cycle interval (30, 60, 90 days from previous charge).

---

## Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     CHECKOUT SESSION                            │
│                                                                 │
│  Customer adds to cart:                                         │
│  • Consultation ($29)                                           │
│  • Membership ($19/mo)                                          │
│  • Semaglutide prescription ($299/mo)                          │
│  • Lab kit ($0 - included with membership)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PARENT ORDER CREATED                         │
│                        HF-1127                                  │
│                    Total: $347/today                            │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────┬───────┴───────┬───────────┐
          ▼           ▼               ▼           ▼
    ┌──────────┐ ┌──────────┐  ┌──────────┐ ┌──────────┐
    │ CONSULT  │ │MEMBERSHIP│  │    RX    │ │ LAB KIT  │
    │   $29    │ │  $19/mo  │  │ $299/mo  │ │    $0    │
    │          │ │          │  │          │ │          │
    │ One-time │ │Recurring │  │ Deferred │ │ One-time │
    │ Charge   │ │   Sub    │  │ + Recur  │ │ Charge   │
    │   NOW    │ │   NOW    │  │          │ │   NOW    │
    └────┬─────┘ └────┬─────┘  └────┬─────┘ └────┬─────┘
         │            │             │            │
         ▼            ▼             ▼            ▼
    ┌──────────┐ ┌──────────┐  ┌──────────┐ ┌──────────┐
    │PayTheory │ │PayTheory │  │PayTheory │ │PayTheory │
    │ Charge   │ │ Recur #1 │  │ Tokenize │ │ Charge   │
    │  $29     │ │ $19/mo   │  │   only   │ │   $0     │
    └──────────┘ └──────────┘  └────┬─────┘ └──────────┘
                                    │
                                    ▼
                            ┌──────────────┐
                            │   PROVIDER   │
                            │   REVIEWS    │
                            │              │
                            │ ┌──────────┐ │
                            │ │ APPROVE  │ │
                            │ └────┬─────┘ │
                            └──────┼───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │  PayTheory   │
                            │  Charge $299 │
                            │      +       │
                            │  Create      │
                            │  Recur #2    │
                            │  $299/mo     │
                            └──────────────┘
```

---

## Why Separate PayTheory Subscriptions?

Each subscription-type item becomes its own PayTheory recurring subscription because:

1. **Different billing cycles**

   - Membership: Monthly or Annual
   - Medication: 30, 60, 90, or 180 days

2. **Different charge timing**

   - Membership: Immediate
   - Prescription: On provider approval

3. **Independent lifecycle**

   - Customer can cancel membership but keep prescription
   - Prescription can be paused without affecting membership
   - Each has its own renewal date

4. **Different failure handling**
   - Membership payment failure: Suspend benefits
   - Prescription payment failure: Cannot ship medication

---

## PayTheory Account Codes

PayTheory organizes transactions by account codes for categorization and reporting:

| Account Code           | Description                          |
| ---------------------- | ------------------------------------ |
| `Initial Consultation` | First-time consultation fees         |
| `Membership`           | Recurring membership charges         |
| `Subscription`         | Recurring medication/product charges |
| `Lab Test`             | Lab kit purchases                    |
| `Physical Product`     | One-time physical product purchases  |

---

## Payment Retry Policy

When a subscription payment fails, PayTheory follows this retry policy:

**Retry Schedule:**

- **Attempt 1**: Immediate (original billing date)
- **Attempt 2**: 3 days after first attempt
- **Attempt 3**: 4 days after second attempt (7 days total)

**After 3 failures:**

- Subscription is automatically **paused**
- Patient receives notification
- Manual intervention required to resume

---

## Order Statuses

### Parent Order Statuses

| Status                | Description                                   |
| --------------------- | --------------------------------------------- |
| `NEW`                 | Just created, processing children             |
| `PROCESSING`          | Children being processed                      |
| `AWAITING_REVIEW`     | Has prescription(s) needing provider approval |
| `APPROVED`            | All items approved                            |
| `COMPLETED`           | All items fulfilled                           |
| `PARTIALLY_COMPLETED` | Some items fulfilled, others pending          |

### Child Order Statuses

| Status             | Applicable To  | Description           |
| ------------------ | -------------- | --------------------- |
| `PAID`             | All types      | Payment successful    |
| `FAILED`           | All types      | Payment failed        |
| `AWAITING_REVIEW`  | Prescription   | Waiting for provider  |
| `APPROVED`         | Prescription   | Provider approved     |
| `DENIED`           | Prescription   | Provider denied       |
| `SENT_TO_PHARMACY` | Prescription   | Rx transmitted        |
| `ORDER_SHIPPED`    | Physical items | In transit            |
| `COMPLETED`        | All types      | Fulfilled             |
| `ACTIVE`           | Subscriptions  | Recurring and active  |
| `PAUSED`           | Subscriptions  | Temporarily suspended |
| `CANCELED`         | Subscriptions  | Terminated            |

---

## PayTheory Pause/Resume Workaround

**Critical Technical Detail**: PayTheory does **not** have a native pause API. The system implements pause/resume through a workaround:

**Pause Operation:**

1. Cancel the existing subscription in PayTheory
2. Store subscription metadata locally (amount, cycle, next billing date)
3. Mark local subscription status as `PAUSED`

**Resume Operation:**

1. Create a **new** subscription in PayTheory with stored parameters
2. Update local subscription ID reference
3. Mark local subscription status as `ACTIVE`

**Implications:**

- Each pause/resume creates a new PayTheory subscription ID
- PayTheory reporting shows this as cancel + new subscription
- Local system maintains continuity through metadata

⚠️ **Known Issue**: See ISSUE-001 in Known Issues section below.

---

## Subscription Billing Cycles

### Membership Cycles

| Cycle     | Description           |
| --------- | --------------------- |
| `MONTHLY` | Billed every 30 days  |
| `ANNUAL`  | Billed every 365 days |

### Medication Cycles

| Cycle              | Description                    | Common Use                   |
| ------------------ | ------------------------------ | ---------------------------- |
| `ONE_TIME_PAYMENT` | Single purchase, no recurrence | As-needed meds (Sildenafil)  |
| `EVERY_DAY_30`     | Billed every 30 days           | GLP-1 injections             |
| `EVERY_DAY_60`     | Billed every 60 days           | Some topicals                |
| `EVERY_DAY_90`     | Billed every 90 days           | Finasteride, Tadalafil daily |
| `EVERY_DAY_180`    | Billed every 180 days          | 6-month supplies             |

---

## Key Implications for UI/UX

1. **Orders List View**

   - Parent order is the primary display row
   - Expandable/accordion to show children
   - Each child may have different status

2. **Order Detail View**

   - Must show parent context
   - Must show each child with its type, status, and billing info
   - Subscription children need renewal date, pause/cancel actions

3. **Patient View**

   - Customer sees "their order" (parent)
   - Needs visibility into what's approved vs. pending

4. **Provider View**

   - Provider sees prescriptions needing approval
   - May not need to see consultation/membership children

5. **Admin View**
   - Needs full visibility into all children
   - Needs ability to manage subscriptions independently

---

## Database Relationships

```
Order (Parent)
├── id: "ord_parent_001"
├── publicOrderId: "HF-1127"
├── type: "MAIN"
├── amount: 34700  (sum of children)
├── userId: "usr_pat001"
└── children: [
    │
    ├── Order (Child - Consultation)
    │   ├── id: "ord_child_001"
    │   ├── parentOrderId: "ord_parent_001"
    │   ├── type: "SUBORDER"
    │   ├── productType: "SERVICE"
    │   ├── amount: 2900
    │   ├── billingCycle: "ONE_TIME_PAYMENT"
    │   └── status: "PAID"
    │
    ├── Order (Child - Membership)
    │   ├── id: "ord_child_002"
    │   ├── parentOrderId: "ord_parent_001"
    │   ├── type: "SUBORDER"
    │   ├── productType: "MEMBERSHIP"
    │   ├── amount: 1900
    │   ├── billingCycle: "MONTHLY"
    │   ├── status: "ACTIVE"
    │   └── subscriptionId: "sub_001"
    │
    ├── Order (Child - Prescription)
    │   ├── id: "ord_child_003"
    │   ├── parentOrderId: "ord_parent_001"
    │   ├── type: "SUBORDER"
    │   ├── productType: "PHYSICAL_PRODUCT"
    │   ├── amount: 29900
    │   ├── billingCycle: "EVERY_DAY_30"
    │   ├── status: "AWAITING_REVIEW"
    │   └── subscriptionId: null  (created on approval)
    │
    └── Order (Child - Lab Kit)
        ├── id: "ord_child_004"
        ├── parentOrderId: "ord_parent_001"
        ├── type: "SUBORDER"
        ├── productType: "LAB_TEST"
        ├── amount: 0
        ├── billingCycle: "ONE_TIME_PAYMENT"
        └── status: "ORDER_SHIPPED"
]
```

---

## Known Issues

These are documented issues in the current V1 production system:

### ISSUE-001: Pause/Resume Loses Refill Offset (HIGH)

**Problem**: When a subscription is paused and resumed, the -7 day first refill offset is lost. The new subscription treats the next billing date as a regular cycle date, not applying the patient-friendly early refill.

**Impact**: Patients may run out of medication waiting for a refill after resuming.

**Root Cause**: The pause/resume workaround (cancel + recreate) doesn't preserve the original offset calculation context.

---

### ISSUE-002: Potential Refill Duplication (MEDIUM)

**Problem**: Under certain race conditions, duplicate refill orders can be created when PayTheory webhook fires while manual processing is occurring.

**Impact**: Patient could be charged twice, pharmacy receives duplicate prescriptions.

**Mitigation**: Idempotency checks exist but edge cases remain.

---

### ISSUE-003: No Timezone Handling (LOW)

**Problem**: All subscription billing uses server timezone (UTC). Patients in different timezones may see charges at unexpected times (e.g., 3 AM local time).

**Impact**: Customer confusion on billing statements, increased support inquiries.

---

### ISSUE-004: Merchant-of-Record Architecture (CRITICAL - BUSINESS)

**Problem**: Current architecture operates as a single merchant-of-record. All payments flow through the platform's PayTheory account, then funds are disbursed to B2B clients.

**Impact for V1.5 B2B**:

- Platform bears all chargeback liability
- Complex revenue recognition
- Regulatory complexity for multi-state pharmacy operations
- Not scalable for enterprise B2B clients who want direct payment relationships

**Recommended Solution**: Each B2B client becomes their own merchant-of-record with direct PayTheory integration. Platform earns via SaaS fees, not payment pass-through.

---

## Related Documentation

- **Product Types**: See product schema for `StoreProductTypeEnum`
- **Subscription Logic**: See PayTheory integration docs
- **Provider Approval Flow**: See prescription workflow docs
- **Payment Processing**: See PayTheory integration docs
- **Purchase Scenarios**: See `purchase-scenarios-catalog.pdf` in this folder
- **Scenario Schema**: See `purchase-scenarios-schema.json` in this folder

---

## Glossary

| Term                        | Definition                                                          |
| --------------------------- | ------------------------------------------------------------------- |
| **Parent Order**            | Container grouping all items from single checkout                   |
| **Child Order / Sub-order** | Individual item within a parent order                               |
| **Tokenize**                | Store card details for future charge without charging now           |
| **Recurring Subscription**  | PayTheory subscription for automatic future charges                 |
| **Billing Cycle**           | Frequency of subscription charges                                   |
| **Deferred Charge**         | Payment captured later (on approval) vs. at checkout                |
| **First Refill Offset**     | -7 day adjustment ensuring patients get refills before running out  |
| **Merchant-of-Record**      | Entity legally responsible for payment transactions and chargebacks |
| **Account Code**            | PayTheory categorization for transaction types                      |
