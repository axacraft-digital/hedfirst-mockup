# Progressive Dosing & Treatment Protocol Workplan

**Created:** 2025-12-05
**Updated:** 2025-12-07
**Status:** Planning
**Priority:** High - Critical for GLP-1 and complex medication programs
**Complexity:** Medium-High

---

## Executive Summary

Teligant currently supports **static dosing only** - the dosage is fixed at the product variant level. For medications like GLP-1s (Semaglutide, Tirzepatide), patients require **progressive titration schedules** where dosage increases over time. This workplan defines how to implement treatment protocols with automated dose escalation.

---

## Current State Analysis

### What Exists Today

| Capability | Status | Notes |
|------------|--------|-------|
| Static dosage per variant | ✅ Yes | 0.25mg, 0.5mg, 1.0mg as separate SKUs |
| Multiple dosages per variant | ✅ Yes | Combo therapies (Semaglutide + B12) |
| Doctor prescription approval | ✅ Yes | Approve/deny workflow |
| Doctor can switch variants | ✅ Yes | Manual dose change post-approval |
| Automatic refill scheduling | ✅ Yes | -7 day offset for shipping |
| Progressive dose escalation | ❌ No | Not implemented |
| Treatment protocols | ❌ No | Not implemented |
| Dose adjustment during approval | ❌ No | Locked to variant |

### Current Workflow Limitations

```
Patient Orders → Doctor Approves (fixed dose) → Refills (same dose forever)
                        ↓
            To change dose, patient must:
            1. Cancel subscription
            2. Purchase new variant
            3. Doctor approves again
```

### Database Models (Current)

**OrderLineItem.dosages** (JSON array):
```json
[
  {"name": "Semaglutide", "dosage": 0.25, "unit": "mg"}
]
```

**StoreProductPhysicalVariant.dosages** - Same structure, defines available dosages per SKU.

---

## Clinical Requirements: GLP-1 Titration

### Standard Semaglutide Protocol (16-20 weeks)

| Week | Dose | Duration | Purpose |
|------|------|----------|---------|
| 1-4 | 0.25 mg | 4 weeks | Initial titration |
| 5-8 | 0.5 mg | 4 weeks | Dose escalation |
| 9-12 | 1.0 mg | 4 weeks | Therapeutic dose |
| 13-16 | 1.7 mg | 4 weeks | Higher therapeutic |
| 17+ | 2.4 mg | Maintenance | Target dose |

### Standard Tirzepatide Protocol (20+ weeks)

| Week | Dose | Duration | Purpose |
|------|------|----------|---------|
| 1-4 | 2.5 mg | 4 weeks | Initial titration |
| 5-8 | 5 mg | 4 weeks | Dose escalation |
| 9-12 | 7.5 mg | 4 weeks | Dose escalation |
| 13-16 | 10 mg | 4 weeks | Therapeutic dose |
| 17-20 | 12.5 mg | 4 weeks | Higher therapeutic |
| 21+ | 15 mg | Maintenance | Maximum dose |

### Key Clinical Principles

1. **Minimum 4 weeks per dose** - Body needs time to adjust
2. **Goal: Lowest effective dose** - Don't escalate if losing 1.5-2 lbs/week
3. **Side effect management** - May pause or reduce if GI issues
4. **Individual variation** - Some patients never need maximum dose
5. **Provider oversight** - Advisory check-ins, intervention when needed

---

## Industry Best Practices

### How Competitors Handle This

**Hims/Hers Approach:**
- Provider reviews at each dose level
- Compounded medications allow flexible dosing
- App-based check-ins between doses
- Anti-nausea medication offered proactively

**Ro Body Program:**
- Metabolic testing before prescription
- Clinical assistance through app
- Lifestyle tracking integration
- Provider adjusts dose based on progress

**Calibrate:**
- One-on-one coaching alongside medication
- Emphasizes medication as "tool, not entire treatment"
- Structured program with milestones

### Common Patterns

1. **Scheduled check-ins** before dose escalation (advisory)
2. **Weight/symptom tracking** between doses
3. **Automatic progression** unless provider intervenes
4. **Automatic reminders** for check-in completion
5. **Flexible protocols** - can pause, slow down, or skip levels

---

## Pay Theory Constraints & Solution

### The Problem

Pay Theory subscriptions have **fixed amounts** - we cannot modify the subscription price mid-cycle. The `updateRecurringPayment` mutation only allows updating `payment_method_id`, NOT amount.

### The Solution: Pre-Scheduled Subscriptions

Create ALL phase subscriptions upfront at enrollment time, each with a scheduled `firstPaymentDate`:

```
On initial purchase (January 1), create ALL subscriptions:

Sub 1: Phase 1 (0.25mg) | $199 | paymentCount: 1 | firstPaymentDate: Jan 1   ← Immediate
Sub 2: Phase 2 (0.5mg)  | $249 | paymentCount: 1 | firstPaymentDate: Jan 24  ← 30-7=23 days
Sub 3: Phase 3 (1.0mg)  | $299 | paymentCount: 1 | firstPaymentDate: Feb 23  ← +30 days
Sub 4: Phase 4 (1.7mg)  | $349 | paymentCount: 1 | firstPaymentDate: Mar 25  ← +30 days
Sub 5: Phase 5 (2.4mg)  | $399 | paymentCount: null | firstPaymentDate: Apr 24 ← Ongoing
```

### Why This Works

| Benefit | Explanation |
|---------|-------------|
| Pay Theory handles timing | Uses `firstPaymentDate` parameter (already supported) |
| No internal scheduler needed | Pay Theory charges on scheduled dates automatically |
| Predictable billing | Patient knows exactly when each charge happens |
| Payment method locked in | Same `paymentMethodId` for all subscriptions |
| Variable pricing per phase | Each subscription has its own amount |
| Clean audit trail | Each phase = distinct subscription record |

### Timing Logic

Following existing convention (`SUBSCRIPTION_PAYMENT_SHIFT_DAYS = 7`):

```
Phase 1: firstPaymentDate = enrollment date (immediate)
Phase 2: firstPaymentDate = Phase 1 date + 30 days - 7 days = +23 days
Phase 3: firstPaymentDate = Phase 2 date + 30 days - 7 days = +23 days
...and so on
```

The -7 day offset ensures medication ships before current supply runs out.

---

## Proposed Solution

### Strategy: Treatment Protocol with Pre-Scheduled Subscriptions

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Treatment Protocol                               │
│  "GLP-1 Weight Loss - Semaglutide Standard"                         │
├─────────────────────────────────────────────────────────────────────┤
│  Phase 1: 0.25mg | $199 | Sub 1 → firstPaymentDate: Jan 1           │
│  Phase 2: 0.5mg  | $249 | Sub 2 → firstPaymentDate: Jan 24          │
│  Phase 3: 1.0mg  | $299 | Sub 3 → firstPaymentDate: Feb 23          │
│  Phase 4: 1.7mg  | $349 | Sub 4 → firstPaymentDate: Mar 25          │
│  Phase 5: 2.4mg  | $399 | Sub 5 → firstPaymentDate: Apr 24 (ongoing)│
└─────────────────────────────────────────────────────────────────────┘
```

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Protocol Template** | Reusable titration schedule (admin-configured) |
| **Protocol Phase** | Single dose level with duration, variant, and pricing |
| **Patient Enrollment** | Patient's active instance of a protocol |
| **Phase Subscription** | Pay Theory subscription for each phase |
| **Check-in** | Advisory patient self-report (does not block progression) |
| **Admin Override** | Provider/admin can modify protocol at any time |

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Check-ins are advisory** | Most patients don't follow up; plan proceeds unless provider intervenes |
| **All subscriptions created upfront** | Reduces operational complexity, Pay Theory handles timing |
| **Provider can override anytime** | Clinical flexibility for tolerance issues |
| **5 subscriptions per enrollment** | Necessary given Pay Theory constraints |

---

## Implementation Steps

### Phase 1: Database Schema

#### Step 1.1: Create Protocol Template Models

**File:** `prisma/schema.prisma`

```prisma
model TreatmentProtocol {
  id              String   @id @default(uuid())
  name            String   // "Semaglutide Standard Titration"
  description     String?
  diseaseState    StoreProductDiseaseStateEnum
  isActive        Boolean  @default(true)

  storeId         String
  store           Store    @relation(fields: [storeId], references: [id])

  phases          TreatmentProtocolPhase[]
  enrollments     PatientProtocolEnrollment[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([storeId, diseaseState])
}

model TreatmentProtocolPhase {
  id              String   @id @default(uuid())
  protocolId      String
  protocol        TreatmentProtocol @relation(fields: [protocolId], references: [id])

  order           Int      // 1, 2, 3, 4, 5...
  name            String   // "Week 1-4: Initial Dose"
  description     String?

  // Dosing - links to product variant
  variantId       String
  variant         StoreProductPhysicalVariant @relation(fields: [variantId], references: [id])

  // Pricing (denormalized for display, actual price from variant)
  price           Int      // In cents

  // Timing
  durationDays    Int      @default(30)  // 30 days per phase
  offsetDays      Int      @default(7)   // Ship 7 days early

  // Phase type
  isMaintenance   Boolean  @default(false)  // Last phase = ongoing subscription

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  phaseSubscriptions ProtocolPhaseSubscription[]

  @@unique([protocolId, order])
  @@index([protocolId])
}

model PatientProtocolEnrollment {
  id                  String   @id @default(uuid())

  patientId           String
  patient             User     @relation(fields: [patientId], references: [id])

  protocolId          String
  protocol            TreatmentProtocol @relation(fields: [protocolId], references: [id])

  // Status
  status              EnrollmentStatus  // ACTIVE, PAUSED, COMPLETED, DISCONTINUED, PAYMENT_FAILED

  // Starting point (allows starting at Phase 3 if already titrated elsewhere)
  startingPhaseOrder  Int      @default(1)

  // Timestamps
  enrolledAt          DateTime @default(now())
  pausedAt            DateTime?
  resumedAt           DateTime?
  completedAt         DateTime?
  discontinuedAt      DateTime?

  // Provider tracking
  enrolledById        String
  enrolledBy          User     @relation("EnrolledBy", fields: [enrolledById], references: [id])

  // Related records
  phaseSubscriptions  ProtocolPhaseSubscription[]
  checkIns            PatientProtocolCheckIn[]
  overrides           ProtocolOverride[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([patientId])
  @@index([status])
}

model ProtocolPhaseSubscription {
  id                      String   @id @default(uuid())

  enrollmentId            String
  enrollment              PatientProtocolEnrollment @relation(fields: [enrollmentId], references: [id])

  phaseId                 String
  phase                   TreatmentProtocolPhase @relation(fields: [phaseId], references: [id])

  // Pay Theory subscription
  payTheoryRecurringId    String?  @unique
  paymentMethodId         String   // Payment method used

  // Scheduling
  scheduledChargeDate     DateTime
  amount                  Int      // In cents

  // Status
  status                  PhaseSubscriptionStatus

  // Outcomes
  chargedAt               DateTime?
  failedAt                DateTime?
  cancelledAt             DateTime?
  cancelReason            CancelReason?

  // Audit
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  @@index([enrollmentId])
  @@index([status, scheduledChargeDate])
}

model PatientProtocolCheckIn {
  id              String   @id @default(uuid())

  enrollmentId    String
  enrollment      PatientProtocolEnrollment @relation(fields: [enrollmentId], references: [id])

  phaseOrder      Int      // Which phase this check-in is for

  // Check-in data
  weight          Float?
  weightUnit      String?  @default("lbs")
  sideEffects     Json?    // Array of side effect codes
  sideEffectScore Int?     // 0-10 severity
  adherence       Int?     // 0-100% medication adherence
  notes           String?

  // Timestamps
  dueDate         DateTime
  completedAt     DateTime?

  createdAt       DateTime @default(now())

  @@index([enrollmentId, dueDate])
}

model ProtocolOverride {
  id              String   @id @default(uuid())

  enrollmentId    String
  enrollment      PatientProtocolEnrollment @relation(fields: [enrollmentId], references: [id])

  // What was changed
  overrideType    OverrideType

  // Details
  fromPhaseOrder  Int?
  toPhaseOrder    Int?
  reason          String
  notes           String?

  // Who made the change
  performedById   String
  performedBy     User     @relation(fields: [performedById], references: [id])

  // Financial impact
  refundAmount    Int?     // If partial refund issued
  creditAmount    Int?     // If credit applied

  createdAt       DateTime @default(now())

  @@index([enrollmentId])
}

enum EnrollmentStatus {
  ACTIVE
  PAUSED
  COMPLETED
  DISCONTINUED
  PAYMENT_FAILED
}

enum PhaseSubscriptionStatus {
  SCHEDULED       // Created in Pay Theory, waiting for firstPaymentDate
  COMPLETED       // Successfully charged
  FAILED          // Payment failed
  CANCELLED       // Manually cancelled
}

enum CancelReason {
  PAUSED              // Protocol paused
  DISCONTINUED        // Protocol discontinued
  PAYMENT_FAILED      // Payment issues
  PROVIDER_OVERRIDE   // Doctor/admin changed plan
  PATIENT_REQUEST     // Patient requested cancellation
}

enum OverrideType {
  PAUSE               // Pause protocol
  RESUME              // Resume from pause
  EXTEND_PHASE        // Stay on current dose longer
  SKIP_PHASE          // Skip to higher dose
  REDUCE_DOSE         // Go back to lower dose
  DISCONTINUE         // Stop treatment
  ADJUST_DATES        // Shift future subscription dates
  CHANGE_PAYMENT_METHOD // Update payment method for all subscriptions
}
```

- [ ] Add all new models to schema
- [ ] Create migration
- [ ] Add indexes for query performance

### Phase 2: Backend - Protocol Management

#### Step 2.1: Create Protocol Admin Module

**File:** `src/apps/store-admin/modules/treatment-protocols/` (new)

- [ ] `treatment-protocols.controller.ts` - CRUD for protocols
- [ ] `treatment-protocols.service.ts` - Business logic
- [ ] `protocol-phases.service.ts` - Phase management
- [ ] DTOs for create/update operations

**Endpoints:**
```
GET    /treatment-protocols              - List protocols
POST   /treatment-protocols              - Create protocol
GET    /treatment-protocols/:id          - Get protocol detail
PUT    /treatment-protocols/:id          - Update protocol
DELETE /treatment-protocols/:id          - Delete protocol (soft delete)
POST   /treatment-protocols/:id/phases   - Add phase
PUT    /treatment-protocols/:id/phases/:phaseId - Update phase
DELETE /treatment-protocols/:id/phases/:phaseId - Remove phase
```

#### Step 2.2: Create Enrollment Service

**File:** `src/apps/store-doctor/modules/protocol-enrollment/` (new)

- [ ] `enrollment.service.ts` - Enroll patient, create all subscriptions
- [ ] `subscription-creation.service.ts` - Create Pay Theory subscriptions with scheduled dates
- [ ] `check-in.service.ts` - Process patient check-ins (advisory)

**Key Methods:**
```typescript
// Enroll patient in protocol - creates ALL phase subscriptions upfront
async enrollPatient(
  patientId: string,
  protocolId: string,
  startingPhase: number,
  doctorId: string
): Promise<Enrollment>

// Calculate subscription dates
calculatePhaseDates(
  enrollmentDate: Date,
  phases: TreatmentProtocolPhase[]
): PhaseSchedule[]

// Create all Pay Theory subscriptions
async createAllPhaseSubscriptions(
  enrollment: Enrollment,
  paymentMethodId: string
): Promise<ProtocolPhaseSubscription[]>
```

#### Step 2.3: Create Override Service (Admin/Provider Control)

**File:** `src/apps/store-doctor/modules/protocol-override/` (new)

- [ ] `override.service.ts` - Handle all override scenarios

**Endpoints:**
```
POST /enrollments/:id/pause           - Pause protocol
POST /enrollments/:id/resume          - Resume protocol
POST /enrollments/:id/extend-phase    - Extend current phase
POST /enrollments/:id/skip-phase      - Skip to higher dose
POST /enrollments/:id/reduce-dose     - Go back to lower dose
POST /enrollments/:id/discontinue     - Stop treatment
POST /enrollments/:id/adjust-dates    - Shift future dates
PUT  /enrollments/:id/payment-method  - Update payment method for all
POST /enrollments/:id/refund          - Issue partial refund
POST /enrollments/:id/credit          - Apply account credit
```

#### Step 2.4: Create Patient Check-in Endpoints

**File:** `src/apps/patient/modules/protocol-check-in/` (new)

**Endpoints:**
```
GET  /my-protocols                       - List my active protocols
GET  /my-protocols/:enrollmentId         - Get protocol detail with timeline
GET  /my-protocols/:enrollmentId/check-ins - Get pending/completed check-ins
POST /my-protocols/:enrollmentId/check-ins - Submit check-in (advisory)
```

### Phase 3: Payment Method Handling

#### Step 3.1: Update Payment Method Change Flow

**File:** `src/apps/patient/core/modules/payment-scope/modules/payment-method/`

When patient updates default payment method:

```typescript
async updateDefaultPaymentMethod(patientId: string, newPaymentMethodId: string) {
  // 1. Update default payment method (existing flow)
  await this.paymentMethodService.setDefault(patientId, newPaymentMethodId);

  // 2. Find all SCHEDULED phase subscriptions for this patient
  const scheduledSubscriptions = await this.protocolPhaseSubscriptionRepo.findMany({
    where: {
      enrollment: { patientId },
      status: PhaseSubscriptionStatus.SCHEDULED
    }
  });

  // 3. Update each subscription in Pay Theory
  for (const sub of scheduledSubscriptions) {
    await this.payTheoryClient.updateRecurringPayment({
      recurringId: sub.payTheoryRecurringId,
      paymentMethodId: newPaymentMethodId,
    });

    // 4. Update our record
    await this.protocolPhaseSubscriptionRepo.update({
      where: { id: sub.id },
      data: { paymentMethodId: newPaymentMethodId }
    });
  }

  // 5. Log the change
  await this.createOverrideRecord(enrollment.id, OverrideType.CHANGE_PAYMENT_METHOD);
}
```

#### Step 3.2: Handle Payment Failures

**File:** `src/shared/modules/protocol/payment-failure.service.ts` (new)

```typescript
async handlePaymentFailure(subscriptionId: string) {
  const phaseSub = await this.findByPayTheoryId(subscriptionId);

  // Mark as failed
  await this.updateStatus(phaseSub.id, PhaseSubscriptionStatus.FAILED);

  // Notify patient
  await this.notificationService.send(phaseSub.enrollment.patientId, {
    type: 'PAYMENT_FAILED',
    message: 'Please update your payment method to continue treatment'
  });

  // Schedule follow-up check (7 days)
  await this.schedulePaymentFollowUp(phaseSub.enrollmentId, 7);
}

async handlePaymentFailureExpired(enrollmentId: string) {
  // After 7 days with no payment method update

  // 1. Cancel all future subscriptions
  const futureSubscriptions = await this.findScheduledSubscriptions(enrollmentId);
  for (const sub of futureSubscriptions) {
    await this.cancelSubscription(sub, CancelReason.PAYMENT_FAILED);
  }

  // 2. Update enrollment status
  await this.updateEnrollmentStatus(enrollmentId, EnrollmentStatus.PAYMENT_FAILED);

  // 3. Notify patient and provider
  await this.notifyPaymentFailureDiscontinuation(enrollmentId);
}
```

### Phase 4: Override Scenarios Implementation

#### Step 4.1: Pause Protocol

```typescript
async pauseProtocol(enrollmentId: string, performedById: string, reason: string) {
  // 1. Cancel all SCHEDULED subscriptions
  const scheduled = await this.findScheduledSubscriptions(enrollmentId);
  for (const sub of scheduled) {
    await this.payTheoryClient.cancelSubscription({ recurringId: sub.payTheoryRecurringId });
    await this.updateSubscriptionStatus(sub.id, PhaseSubscriptionStatus.CANCELLED, CancelReason.PAUSED);
  }

  // 2. Update enrollment status
  await this.updateEnrollment(enrollmentId, {
    status: EnrollmentStatus.PAUSED,
    pausedAt: new Date()
  });

  // 3. Log override
  await this.createOverride(enrollmentId, OverrideType.PAUSE, performedById, reason);
}
```

#### Step 4.2: Resume Protocol

```typescript
async resumeProtocol(enrollmentId: string, performedById: string) {
  const enrollment = await this.findEnrollment(enrollmentId);

  // 1. Determine which phases remain
  const completedPhases = await this.getCompletedPhaseOrders(enrollmentId);
  const remainingPhases = await this.getRemainingPhases(enrollment.protocolId, completedPhases);

  // 2. Calculate new dates from today
  const newSchedule = this.calculatePhaseDates(new Date(), remainingPhases);

  // 3. Create new subscriptions for remaining phases
  for (const schedule of newSchedule) {
    await this.createPhaseSubscription(enrollmentId, schedule);
  }

  // 4. Update enrollment
  await this.updateEnrollment(enrollmentId, {
    status: EnrollmentStatus.ACTIVE,
    resumedAt: new Date()
  });

  // 5. Log override
  await this.createOverride(enrollmentId, OverrideType.RESUME, performedById);
}
```

#### Step 4.3: Extend Current Phase (Patient Tolerating Well, No Need to Escalate)

```typescript
async extendPhase(enrollmentId: string, additionalDays: number, performedById: string, reason: string) {
  // 1. Cancel all future SCHEDULED subscriptions
  const futureSubscriptions = await this.findScheduledSubscriptions(enrollmentId);
  for (const sub of futureSubscriptions) {
    await this.cancelSubscription(sub, CancelReason.PROVIDER_OVERRIDE);
  }

  // 2. Get current phase
  const currentPhase = await this.getCurrentPhase(enrollmentId);

  // 3. Create extension subscription (same phase, same price)
  const extensionDate = this.calculateNextDate(new Date(), additionalDays);
  await this.createPhaseSubscription(enrollmentId, {
    phaseId: currentPhase.id,
    scheduledChargeDate: extensionDate,
    amount: currentPhase.price
  });

  // 4. Recalculate and create remaining phase subscriptions
  const remainingPhases = await this.getPhasesAfter(currentPhase.order);
  const newSchedule = this.calculatePhaseDates(extensionDate, remainingPhases);
  for (const schedule of newSchedule) {
    await this.createPhaseSubscription(enrollmentId, schedule);
  }

  // 5. Log override
  await this.createOverride(enrollmentId, OverrideType.EXTEND_PHASE, performedById, reason, {
    fromPhaseOrder: currentPhase.order,
    toPhaseOrder: currentPhase.order  // Same phase
  });
}
```

#### Step 4.4: Reduce Dose (Patient Tolerating Poorly)

```typescript
async reduceDose(enrollmentId: string, targetPhaseOrder: number, performedById: string, reason: string) {
  // 1. Cancel all future SCHEDULED subscriptions
  const futureSubscriptions = await this.findScheduledSubscriptions(enrollmentId);
  for (const sub of futureSubscriptions) {
    await this.cancelSubscription(sub, CancelReason.PROVIDER_OVERRIDE);
  }

  // 2. Get target phase (lower dose)
  const targetPhase = await this.getPhaseByOrder(enrollmentId, targetPhaseOrder);

  // 3. Create subscription for reduced dose phase
  const nextDate = this.calculateNextDate(new Date());
  await this.createPhaseSubscription(enrollmentId, {
    phaseId: targetPhase.id,
    scheduledChargeDate: nextDate,
    amount: targetPhase.price
  });

  // 4. Recalculate and create remaining phase subscriptions (from reduced dose forward)
  const remainingPhases = await this.getPhasesFrom(targetPhaseOrder);
  const newSchedule = this.calculatePhaseDates(nextDate, remainingPhases);
  for (const schedule of newSchedule) {
    await this.createPhaseSubscription(enrollmentId, schedule);
  }

  // 5. Log override with potential refund/credit
  await this.createOverride(enrollmentId, OverrideType.REDUCE_DOSE, performedById, reason, {
    fromPhaseOrder: currentPhase.order,
    toPhaseOrder: targetPhaseOrder
  });
}
```

#### Step 4.5: Skip Phase (Fast Escalation)

```typescript
async skipToPhase(enrollmentId: string, targetPhaseOrder: number, performedById: string, reason: string) {
  // 1. Cancel all future SCHEDULED subscriptions
  const futureSubscriptions = await this.findScheduledSubscriptions(enrollmentId);
  for (const sub of futureSubscriptions) {
    await this.cancelSubscription(sub, CancelReason.PROVIDER_OVERRIDE);
  }

  // 2. Get target phase (higher dose)
  const targetPhase = await this.getPhaseByOrder(enrollmentId, targetPhaseOrder);

  // 3. Create subscription for target phase (immediate or next cycle)
  const nextDate = this.calculateNextDate(new Date());
  await this.createPhaseSubscription(enrollmentId, {
    phaseId: targetPhase.id,
    scheduledChargeDate: nextDate,
    amount: targetPhase.price
  });

  // 4. Create remaining phase subscriptions
  const remainingPhases = await this.getPhasesFrom(targetPhaseOrder + 1);
  const newSchedule = this.calculatePhaseDates(nextDate, remainingPhases);
  for (const schedule of newSchedule) {
    await this.createPhaseSubscription(enrollmentId, schedule);
  }

  // 5. Log override
  await this.createOverride(enrollmentId, OverrideType.SKIP_PHASE, performedById, reason, {
    fromPhaseOrder: currentPhase.order,
    toPhaseOrder: targetPhaseOrder
  });
}
```

### Phase 5: Refunds and Credits

#### Step 5.1: Partial Refund Service

**File:** `src/shared/modules/protocol/refund.service.ts` (new)

```typescript
async issuePartialRefund(
  enrollmentId: string,
  phaseSubscriptionId: string,
  refundAmount: number,
  reason: string,
  performedById: string
) {
  const phaseSub = await this.findPhaseSubscription(phaseSubscriptionId);

  // 1. Verify subscription was charged
  if (phaseSub.status !== PhaseSubscriptionStatus.COMPLETED) {
    throw new Error('Can only refund completed subscriptions');
  }

  // 2. Issue refund via Pay Theory
  // Note: Need to verify Pay Theory refund API
  await this.payTheoryClient.refundTransaction({
    transactionId: phaseSub.transactionId,
    amount: refundAmount
  });

  // 3. Log override with refund
  await this.createOverride(enrollmentId, OverrideType.REDUCE_DOSE, performedById, reason, {
    refundAmount
  });

  // 4. Notify patient
  await this.notificationService.send(enrollment.patientId, {
    type: 'REFUND_ISSUED',
    amount: refundAmount
  });
}
```

#### Step 5.2: Account Credit Service

**File:** `src/shared/modules/protocol/credit.service.ts` (new)

```typescript
async applyCredit(
  enrollmentId: string,
  creditAmount: number,
  reason: string,
  performedById: string
) {
  const enrollment = await this.findEnrollment(enrollmentId);

  // 1. Create credit record in patient account
  await this.accountCreditService.addCredit({
    patientId: enrollment.patientId,
    amount: creditAmount,
    reason,
    sourceType: 'PROTOCOL_ADJUSTMENT',
    sourceId: enrollmentId
  });

  // 2. Log override with credit
  await this.createOverride(enrollmentId, OverrideType.REDUCE_DOSE, performedById, reason, {
    creditAmount
  });

  // 3. Notify patient
  await this.notificationService.send(enrollment.patientId, {
    type: 'CREDIT_APPLIED',
    amount: creditAmount
  });
}

// Apply credit to next charge
async applyCreditsToSubscription(subscriptionId: string) {
  const phaseSub = await this.findPhaseSubscription(subscriptionId);
  const availableCredit = await this.accountCreditService.getBalance(enrollment.patientId);

  if (availableCredit > 0) {
    const amountToApply = Math.min(availableCredit, phaseSub.amount);
    // Adjust subscription amount or handle in webhook
    // This may require Pay Theory-specific implementation
  }
}
```

### Phase 6: Doctor Portal UI

#### Step 6.1: Protocol Enrollment UI

**Files:** `node-hedfirst-doctor/src/app/(internal)/panel/patients/[patientId]/protocols/` (new)

- [ ] View patient's current protocol enrollment
- [ ] Enroll patient in new protocol (select starting phase)
- [ ] Visual timeline showing all phases with dates
- [ ] View check-in history (advisory data)

#### Step 6.2: Override Actions UI

**Files:** `node-hedfirst-doctor/src/app/(internal)/panel/patients/[patientId]/protocols/actions/`

- [ ] Pause/Resume buttons
- [ ] "Extend Phase" modal (select additional weeks)
- [ ] "Adjust Dose" modal (select target phase - up or down)
- [ ] "Discontinue" button with confirmation
- [ ] "Issue Refund" modal
- [ ] "Apply Credit" modal
- [ ] Override history log

#### Step 6.3: Protocol Dashboard

**File:** `node-hedfirst-doctor/src/app/(internal)/panel/protocol-dashboard/` (new)

- [ ] All patients on protocols
- [ ] Filter by protocol type, phase, status
- [ ] Patients with failed payments
- [ ] Patients with high side effect scores (from check-ins)
- [ ] Quick actions from dashboard

### Phase 7: Patient Portal UI

#### Step 7.1: Protocol Progress View

**Files:** `node-hedfirst-patient/src/app/(internal)/my-treatment/` (new)

- [ ] Show current protocol enrollment
- [ ] Visual timeline of phases (past, current, future)
- [ ] Current phase details and pricing
- [ ] Next charge date and amount
- [ ] Days until next phase

#### Step 7.2: Check-in Flow (Advisory)

**Files:** `node-hedfirst-patient/src/app/(internal)/my-treatment/check-in/`

- [ ] Guided check-in form
- [ ] Weight entry
- [ ] Side effect questionnaire
- [ ] Adherence questions
- [ ] Optional notes
- [ ] Clear messaging: "This helps your provider monitor your progress"

#### Step 7.3: Notifications

- [ ] Email reminder for check-in (advisory)
- [ ] Notification when payment processed
- [ ] Notification when phase advances
- [ ] Notification if payment fails (with update payment CTA)

### Phase 8: Store Admin Protocol Configuration

#### Step 8.1: Protocol Builder UI

**Files:** `node-hedfirst-frontend/src/app/(internal)/panel/treatment-protocols/` (new)

- [ ] List all protocols for store
- [ ] Create new protocol wizard
- [ ] Protocol editor with phase management
- [ ] Link phases to product variants (with price display)
- [ ] Configure timing (duration, offset days)
- [ ] Mark maintenance phase

#### Step 8.2: Pre-built Templates

- [ ] Semaglutide Standard (5 phases)
- [ ] Semaglutide Slow Titration (7 phases)
- [ ] Tirzepatide Standard (6 phases)
- [ ] Custom template creation

---

## Complete Edge Case Handling

### 1. Patient Wants to PAUSE Treatment

| Trigger | System Response |
|---------|-----------------|
| Provider clicks "Pause" | Cancel all SCHEDULED subscriptions |
| | Mark enrollment PAUSED |
| | Log override with reason |
| Provider clicks "Resume" | Calculate new dates from resume date |
| | Create new subscriptions for remaining phases |
| | Mark enrollment ACTIVE |

### 2. Patient Wants to DISCONTINUE

| Trigger | System Response |
|---------|-----------------|
| Provider clicks "Discontinue" | Cancel all SCHEDULED subscriptions |
| | Mark enrollment DISCONTINUED |
| | No restart (would need new enrollment) |

### 3. Patient TOLERATING WELL (Extend Phase)

| Trigger | System Response |
|---------|-----------------|
| Provider clicks "Extend Phase" | Cancel future subscriptions |
| | Create new subscription for same phase |
| | Shift all future phase dates |
| | Log override |

### 4. Patient TOLERATING POORLY (Reduce Dose)

| Trigger | System Response |
|---------|-----------------|
| Provider selects lower phase | Cancel future subscriptions |
| | Create subscription for lower dose phase |
| | Recalculate remaining phases from there |
| | Optionally issue refund/credit |
| | Log override |

### 5. Patient READY FOR FASTER ESCALATION (Skip Phase)

| Trigger | System Response |
|---------|-----------------|
| Provider selects higher phase | Cancel future subscriptions |
| | Create subscription for higher dose phase |
| | Continue with remaining phases |
| | Log override |

### 6. Payment Method CHANGES

| Trigger | System Response |
|---------|-----------------|
| Patient updates default card | Find all SCHEDULED subscriptions |
| | Update each in Pay Theory |
| | Update our records |
| | Log the change |

### 7. Payment FAILS

| Trigger | System Response |
|---------|-----------------|
| Charge fails | Mark phase subscription FAILED |
| | Notify patient (update payment) |
| | Pay Theory retries automatically |
| After 7 days, still failed | Cancel all future subscriptions |
| | Mark enrollment PAYMENT_FAILED |
| | Notify patient and provider |
| If patient updates card within 7 days | Update all subscriptions |
| | Retry charge |

### 8. PARTIAL REFUND Needed

| Trigger | System Response |
|---------|-----------------|
| Provider issues refund | Verify subscription was charged |
| | Process refund via Pay Theory |
| | Log override with amount |
| | Notify patient |

### 9. ACCOUNT CREDIT Needed

| Trigger | System Response |
|---------|-----------------|
| Provider applies credit | Add to patient account balance |
| | Log override with amount |
| | Apply to next charge (if applicable) |
| | Notify patient |

### 10. Patient RESTARTS After Discontinuation

| Trigger | System Response |
|---------|-----------------|
| Provider enrolls again | Create NEW enrollment |
| | Provider selects starting phase |
| | Create fresh set of subscriptions |
| | Old enrollment stays DISCONTINUED |

---

## Webhook Handling Updates

### Pay Theory Webhooks to Handle

```typescript
// Subscription payment succeeded
async handleSubscriptionPaymentSuccess(webhookData: PayTheoryWebhook) {
  const phaseSub = await this.findByPayTheoryRecurringId(webhookData.recurring_id);

  await this.updatePhaseSubscription(phaseSub.id, {
    status: PhaseSubscriptionStatus.COMPLETED,
    chargedAt: new Date()
  });

  // If not maintenance, this subscription is now complete (paymentCount: 1)
  // No further action needed - next phase subscription will charge on its scheduled date
}

// Subscription payment failed
async handleSubscriptionPaymentFailed(webhookData: PayTheoryWebhook) {
  const phaseSub = await this.findByPayTheoryRecurringId(webhookData.recurring_id);

  await this.updatePhaseSubscription(phaseSub.id, {
    status: PhaseSubscriptionStatus.FAILED,
    failedAt: new Date()
  });

  await this.handlePaymentFailure(phaseSub.id);
}

// Subscription cancelled (we initiated)
async handleSubscriptionCancelled(webhookData: PayTheoryWebhook) {
  // Usually we initiated this - just log for audit
  const phaseSub = await this.findByPayTheoryRecurringId(webhookData.recurring_id);
  // Status should already be CANCELLED from our action
}
```

---

## Files Summary

### Backend (New)

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | New models for protocols |
| `src/apps/store-admin/modules/treatment-protocols/` | Admin CRUD |
| `src/apps/store-doctor/modules/protocol-enrollment/` | Enrollment, subscriptions |
| `src/apps/store-doctor/modules/protocol-override/` | Override actions |
| `src/apps/patient/modules/protocol-check-in/` | Patient check-ins |
| `src/shared/modules/protocol/payment-failure.service.ts` | Handle failed payments |
| `src/shared/modules/protocol/refund.service.ts` | Refund processing |
| `src/shared/modules/protocol/credit.service.ts` | Credit management |

### Frontend (New)

| File | Purpose |
|------|---------|
| `node-hedfirst-doctor/.../protocols/` | Doctor protocol management |
| `node-hedfirst-doctor/.../protocols/actions/` | Override actions UI |
| `node-hedfirst-doctor/.../protocol-dashboard/` | Protocol overview |
| `node-hedfirst-patient/.../my-treatment/` | Patient protocol view |
| `node-hedfirst-patient/.../my-treatment/check-in/` | Advisory check-in flow |
| `node-hedfirst-frontend/.../treatment-protocols/` | Admin protocol builder |

---

## Verification Checklist

### Core Functionality
- [ ] Admin can create treatment protocols with phases
- [ ] Each phase links to product variant with price
- [ ] Doctor can enroll patient in protocol
- [ ] System creates ALL phase subscriptions upfront with scheduled dates
- [ ] Pay Theory charges on scheduled dates automatically
- [ ] Patient sees protocol progress and upcoming charges

### Payment Handling
- [ ] Payment method change updates all SCHEDULED subscriptions
- [ ] Failed payment triggers patient notification
- [ ] 7-day grace period before cancellation
- [ ] Payment method update within grace period continues protocol

### Override Actions
- [ ] Pause cancels future subscriptions, marks PAUSED
- [ ] Resume creates new subscriptions with fresh dates
- [ ] Extend phase shifts all future dates
- [ ] Reduce dose goes back to lower phase
- [ ] Skip phase advances to higher phase
- [ ] Discontinue ends protocol permanently

### Financial
- [ ] Partial refunds can be issued
- [ ] Account credits can be applied
- [ ] Override history tracks all financial adjustments

### Advisory Check-ins
- [ ] Check-in reminders sent (but don't block progression)
- [ ] Check-in data visible to providers
- [ ] High side effect scores flagged for provider attention

---

## Definition of Done

Progressive dosing system is complete when:

- [ ] Protocol data models implemented
- [ ] Admin can configure protocols per disease state
- [ ] Doctor enrollment creates all phase subscriptions
- [ ] Pay Theory handles scheduled charging
- [ ] All override scenarios functional
- [ ] Payment method continuity working
- [ ] Payment failure handling complete
- [ ] Refund and credit flows working
- [ ] Patient portal shows protocol progress
- [ ] Doctor dashboard for protocol management
- [ ] Pre-built GLP-1 templates created
- [ ] Documentation complete

---

## Sources

- [Tirzepatide and Semaglutide Dosing Guide](https://www.goodheartshealth.com/2025/03/02/tirzepatide-and-semaglutide-dosing-made-easy/)
- [Tirzepatide Dosing Chart](https://trytrimi.com/blog/tirzepatide-dosing-chart)
- [GLP-1 Analog Dosing Chart](https://www.straighthealthcare.com/glp-1-analog-dosing.html)
- [How Digital Health Companies Capitalize on GLP-1s](https://www.cnbc.com/2024/05/25/digital-health-companies-are-launching-programs-around-glp-1s-.html)
- [Hims Weight Loss Program](https://www.hims.com/weight-loss)
- [Clinical Protocol Management Software](https://www.medrxiv.org/content/10.1101/2021.03.10.21253055v1.full)
