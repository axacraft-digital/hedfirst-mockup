# Payment Processor Abstraction Workplan

**Created:** 2025-12-05
**Status:** Planning
**Priority:** Critical - B2B Launch Blocker
**Complexity:** High

---

## Executive Summary

Currently, Teligant uses **Pay Theory** as the sole payment processor with tight coupling throughout the codebase. Most B2B tenants prefer **Stripe** due to its ubiquity, developer experience, and ecosystem. This workplan defines how to abstract the payment layer to support both processors, allowing tenants to choose their preferred option.

---

## Current State Analysis

### Pay Theory Integration Points

| Component              | Location                                                              | Coupling Level |
| ---------------------- | --------------------------------------------------------------------- | -------------- |
| API Client             | `src/shared/providers/pay-theory/pay-theory-api.client.ts`            | High           |
| GraphQL Mutations      | `src/shared/providers/pay-theory/graphql/mutations.ts`                | High           |
| Webhook Handler        | `src/apps/patient/core/modules/webhook-scope/pay-theory-webhook/`     | High           |
| Subscription Service   | `src/shared/modules/purchase-scope/purchase-subscription/`            | High           |
| Payment Method Service | `src/apps/patient/core/modules/payment-scope/modules/payment-method/` | High           |
| Frontend SDK           | `node-hedfirst-patient/src/providers/paytheory/paytheory.ts`          | High           |
| Checkout Components    | `node-hedfirst-patient/src/app/.../checkout/_components/`             | High           |

### Database Models (Pay Theory Specific)

```prisma
model PayTheoryPaymentMethod {
  id              String    @id
  paymentMethodId String    @unique  // Pay Theory token
  payload         Json                // Pay Theory response structure
  userId          String
  // ...
}

model PayTheorySubscription {
  id                       String
  paymentSystemRecurringId String    // Pay Theory recurring_id
  status                   RecurringStatusesEnum
  // ...
}

model PayTheoryTransaction {
  id                         String
  paymentSystemTransactionId String?  // Pay Theory transaction_id
  status                     TransactionStatusesEnum
  failureReasons             String[]
  // ...
}
```

### Pay Theory-Specific Concepts

| Pay Theory                           | Stripe Equivalent                             | Notes                          |
| ------------------------------------ | --------------------------------------------- | ------------------------------ |
| `payment_method_id` (token)          | `pm_xxx` (PaymentMethod)                      | Different tokenization flow    |
| `recurring_id`                       | `sub_xxx` (Subscription)                      | Different subscription model   |
| `transaction_id`                     | `pi_xxx` (PaymentIntent) or `ch_xxx` (Charge) | Different payment flow         |
| `merchant_uid`                       | Not needed (account-level)                    | Stripe uses API key scoping    |
| GraphQL API                          | REST API                                      | Completely different protocols |
| `FeeMode` (SERVICE_FEE/MERCHANT_FEE) | Application fees (Connect)                    | Different fee handling         |
| `account_code`                       | `metadata`                                    | Tracking/reconciliation        |
| `RecurringInterval` enum             | `interval` + `interval_count`                 | Different interval format      |

### Current Payment Flows

**One-Time Payment (Pay Theory):**

```
1. Frontend tokenizes card via Pay Theory SDK
2. Token sent to backend
3. Backend calls GraphQL createTransaction mutation
4. Pay Theory processes payment
5. Webhook notifies success/failure
6. Order status updated
```

**Subscription (Pay Theory):**

```
1. Frontend tokenizes card
2. Backend calls GraphQL createRecurringPayment mutation
3. Pay Theory creates recurring schedule
4. Pay Theory auto-charges on interval
5. Each payment triggers webhook
6. Backend updates subscription status
```

---

## Proposed Architecture

### Strategy: Processor Adapter Pattern

Create an abstraction layer where each payment processor implements a common interface. The system routes to the correct adapter based on tenant configuration.

```
┌─────────────────────────────────────────────────────────┐
│                    Business Logic                        │
│  (OrderService, SubscriptionService, PaymentService)    │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Payment Processor Interface                 │
│  IPaymentProcessor (abstract contract)                  │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  PayTheory      │ │  Stripe         │ │  Future         │
│  Adapter        │ │  Adapter        │ │  Adapter        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Payment Processor Interface

```typescript
interface IPaymentProcessor {
  // Identity
  readonly processorType: PaymentProcessorType // 'PAY_THEORY' | 'STRIPE'

  // One-time Payments
  createPayment(data: CreatePaymentData): Promise<PaymentResult>
  capturePayment(paymentId: string): Promise<PaymentResult>
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>

  // Subscriptions
  createSubscription(data: CreateSubscriptionData): Promise<SubscriptionResult>
  updateSubscription(
    subscriptionId: string,
    data: UpdateSubscriptionData
  ): Promise<SubscriptionResult>
  cancelSubscription(subscriptionId: string): Promise<void>
  pauseSubscription(subscriptionId: string): Promise<void>
  resumeSubscription(subscriptionId: string): Promise<void>

  // Payment Methods
  savePaymentMethod(tokenData: TokenData): Promise<PaymentMethodResult>
  getPaymentMethod(paymentMethodId: string): Promise<PaymentMethodResult>
  deletePaymentMethod(paymentMethodId: string): Promise<void>
  listPaymentMethods(customerId: string): Promise<PaymentMethodResult[]>

  // Webhooks
  verifyWebhookSignature(payload: string, signature: string): boolean
  parseWebhookEvent(payload: unknown): WebhookEvent

  // Customer Management (Stripe-specific but abstracted)
  createCustomer(data: CustomerData): Promise<CustomerResult>
  updateCustomer(
    customerId: string,
    data: CustomerData
  ): Promise<CustomerResult>
}
```

### Generic Data Types

```typescript
// Processor-agnostic payment data
interface CreatePaymentData {
  amount: number // In cents
  currency: string // 'usd'
  paymentMethodId: string // Generic token/ID
  customerId?: string // Customer reference
  description?: string
  metadata?: Record<string, string>
  captureMethod?: "automatic" | "manual"
}

interface PaymentResult {
  id: string // Processor-specific ID
  processorType: PaymentProcessorType
  status: PaymentStatus // 'succeeded' | 'failed' | 'pending' | 'requires_action'
  amount: number
  currency: string
  failureReason?: string
  metadata?: Record<string, string>
  raw?: unknown // Original processor response
}

interface CreateSubscriptionData {
  customerId: string
  paymentMethodId: string
  priceAmount: number // Amount per interval
  currency: string
  interval: SubscriptionInterval // 'day' | 'week' | 'month' | 'year'
  intervalCount: number // e.g., 1 for monthly, 3 for quarterly
  totalPayments?: number // null = infinite
  startDate?: Date // Defaults to now
  metadata?: Record<string, string>
}

interface SubscriptionResult {
  id: string
  processorType: PaymentProcessorType
  status: SubscriptionStatus // 'active' | 'paused' | 'canceled' | 'past_due'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  metadata?: Record<string, string>
  raw?: unknown
}

// Unified webhook event
interface WebhookEvent {
  id: string
  type: WebhookEventType // 'payment.succeeded' | 'subscription.updated' | etc.
  processorType: PaymentProcessorType
  data: {
    paymentId?: string
    subscriptionId?: string
    customerId?: string
    amount?: number
    status?: string
    failureReason?: string
  }
  raw: unknown
}
```

---

## Implementation Steps

### Phase 1: Create Abstraction Layer

#### Step 1.1: Define Core Interfaces

**File:** `src/shared/modules/payment-processor/interfaces/payment-processor.interface.ts` (new)

- [ ] Define `IPaymentProcessor` interface
- [ ] Define `PaymentProcessorType` enum (`PAY_THEORY`, `STRIPE`)
- [ ] Define generic data types (CreatePaymentData, PaymentResult, etc.)
- [ ] Define generic status enums (PaymentStatus, SubscriptionStatus)
- [ ] Define webhook event types

#### Step 1.2: Create Payment Processor Factory

**File:** `src/shared/modules/payment-processor/payment-processor.factory.ts` (new)

- [ ] Create factory that returns correct adapter based on store config
- [ ] Inject store configuration to determine processor type
- [ ] Cache adapter instances per store
- [ ] Handle missing/invalid processor configuration

```typescript
@Injectable()
export class PaymentProcessorFactory {
  constructor(
    private readonly payTheoryAdapter: PayTheoryAdapter,
    private readonly stripeAdapter: StripeAdapter,
  ) {}

  getProcessor(storeId: string): IPaymentProcessor {
    const config = await this.getStorePaymentConfig(storeId);

    switch (config.processorType) {
      case 'PAY_THEORY':
        return this.payTheoryAdapter.withConfig(config.payTheory);
      case 'STRIPE':
        return this.stripeAdapter.withConfig(config.stripe);
      default:
        throw new Error(`Unknown payment processor: ${config.processorType}`);
    }
  }
}
```

#### Step 1.3: Create Pay Theory Adapter

**File:** `src/shared/modules/payment-processor/adapters/pay-theory.adapter.ts` (new)

- [ ] Implement `IPaymentProcessor` interface
- [ ] Wrap existing `PayTheoryApiClient` methods
- [ ] Map Pay Theory responses to generic types
- [ ] Map generic requests to Pay Theory format
- [ ] Handle Pay Theory-specific error codes

#### Step 1.4: Create Stripe Adapter

**File:** `src/shared/modules/payment-processor/adapters/stripe.adapter.ts` (new)

- [ ] Implement `IPaymentProcessor` interface
- [ ] Use Stripe Node.js SDK
- [ ] Implement all interface methods
- [ ] Map Stripe responses to generic types
- [ ] Handle Stripe-specific features (SetupIntents, etc.)

### Phase 2: Database Changes

#### Step 2.1: Add Processor Type to Store Configuration

**File:** `prisma/schema.prisma`

```prisma
model StorePaymentConfig {
  id              String                @id @default(uuid())
  storeId         String                @unique
  processorType   PaymentProcessorEnum  // PAY_THEORY, STRIPE

  // Pay Theory config (nullable)
  payTheorySecretKey    String?
  payTheoryMerchantUid  String?

  // Stripe config (nullable)
  stripeSecretKey       String?
  stripePublishableKey  String?
  stripeWebhookSecret   String?

  createdAt       DateTime              @default(now())
  updatedAt       DateTime              @updatedAt

  store Store @relation(fields: [storeId], references: [id])
}

enum PaymentProcessorEnum {
  PAY_THEORY
  STRIPE
}
```

- [ ] Create `StorePaymentConfig` model
- [ ] Add `PaymentProcessorEnum`
- [ ] Run migration
- [ ] Add encryption for secret keys (reuse PHI encryption from HIPAA workplan)

#### Step 2.2: Generalize Payment Tables

**Rename and generalize existing tables:**

```prisma
// Rename PayTheoryPaymentMethod → PaymentMethod
model PaymentMethod {
  id                    String                @id @default(uuid())
  processorType         PaymentProcessorEnum
  processorPaymentMethodId String             // pm_xxx or Pay Theory token
  payload               Json                  // Processor-specific data

  userId                String
  storeId               String                // Add tenant scoping
  isDefault             Boolean               @default(false)

  createdAt             DateTime              @default(now())
  updatedAt             DateTime              @updatedAt
  deletedAt             DateTime?

  user  User  @relation(fields: [userId], references: [id])
  store Store @relation(fields: [storeId], references: [id])

  @@unique([processorType, processorPaymentMethodId])
  @@index([userId, storeId])
}

// Rename PayTheorySubscription → Subscription
model Subscription {
  id                      String                @id @default(uuid())
  processorType           PaymentProcessorEnum
  processorSubscriptionId String                // sub_xxx or recurring_id

  amount                  Int
  currency                String                @default("usd")
  interval                SubscriptionInterval
  intervalCount           Int                   @default(1)
  status                  SubscriptionStatus

  currentPeriodStart      DateTime?
  currentPeriodEnd        DateTime?
  cancelAtPeriodEnd       Boolean               @default(false)

  orderId                 String
  storeId                 String

  createdAt               DateTime              @default(now())
  updatedAt               DateTime              @updatedAt
  canceledAt              DateTime?

  @@unique([processorType, processorSubscriptionId])
  @@index([orderId])
  @@index([storeId, status])
}

// Rename PayTheoryTransaction → Transaction
model Transaction {
  id                      String                @id @default(uuid())
  processorType           PaymentProcessorEnum
  processorTransactionId  String?               // pi_xxx or transaction_id

  amount                  Int
  currency                String                @default("usd")
  status                  TransactionStatus
  type                    TransactionType       // CHARGE, REFUND

  failureReason           String?
  metadata                Json?

  orderId                 String
  subscriptionId          String?
  storeId                 String

  createdAt               DateTime              @default(now())
  updatedAt               DateTime              @updatedAt

  @@index([processorType, processorTransactionId])
  @@index([orderId])
  @@index([storeId, createdAt])
}
```

- [ ] Create migration to rename tables
- [ ] Add `processorType` column to all payment tables
- [ ] Add `storeId` for tenant scoping
- [ ] Update indexes
- [ ] Create data migration for existing records (set processorType = 'PAY_THEORY')

### Phase 3: Stripe Integration

#### Step 3.1: Install Stripe SDK

```bash
npm install stripe
npm install @types/stripe --save-dev
```

- [ ] Add stripe package
- [ ] Add type definitions

#### Step 3.2: Create Stripe Configuration

**File:** `src/shared/config/stripe.config.ts` (new)

- [ ] Define Stripe config variables
- [ ] Validation for required fields
- [ ] Support for test vs live mode

#### Step 3.3: Implement Stripe Adapter Methods

**File:** `src/shared/modules/payment-processor/adapters/stripe.adapter.ts`

**Payments:**

- [ ] `createPayment()` → Stripe PaymentIntent
- [ ] `capturePayment()` → Stripe capture
- [ ] `refundPayment()` → Stripe Refund

**Subscriptions:**

- [ ] `createSubscription()` → Stripe Subscription
- [ ] `updateSubscription()` → Stripe subscription update
- [ ] `cancelSubscription()` → Stripe cancel
- [ ] `pauseSubscription()` → Stripe pause_collection
- [ ] `resumeSubscription()` → Stripe resume

**Payment Methods:**

- [ ] `savePaymentMethod()` → Stripe SetupIntent + attach
- [ ] `getPaymentMethod()` → Stripe retrieve
- [ ] `deletePaymentMethod()` → Stripe detach
- [ ] `listPaymentMethods()` → Stripe list

**Customers:**

- [ ] `createCustomer()` → Stripe Customer create
- [ ] `updateCustomer()` → Stripe Customer update

#### Step 3.4: Implement Stripe Webhook Handler

**File:** `src/apps/patient/core/modules/webhook-scope/stripe-webhook/` (new module)

- [ ] Create Stripe webhook controller
- [ ] Verify webhook signatures
- [ ] Handle `payment_intent.succeeded`
- [ ] Handle `payment_intent.payment_failed`
- [ ] Handle `invoice.paid` (subscription payments)
- [ ] Handle `invoice.payment_failed`
- [ ] Handle `customer.subscription.updated`
- [ ] Handle `customer.subscription.deleted`
- [ ] Map to generic webhook events
- [ ] Route to shared webhook processor

### Phase 4: Refactor Business Logic

#### Step 4.1: Update Order Service

**File:** `src/apps/patient/core/modules/order-scope/order/layers/order-bl/`

- [ ] Replace direct `PayTheoryApiClient` usage with `PaymentProcessorFactory`
- [ ] Use generic payment interfaces
- [ ] Update transaction creation flow
- [ ] Update payment capture flow

#### Step 4.2: Update Subscription Service

**File:** `src/shared/modules/purchase-scope/purchase-subscription/`

- [ ] Replace Pay Theory-specific calls with processor interface
- [ ] Update subscription creation
- [ ] Update subscription cancellation
- [ ] Update subscription pause/resume
- [ ] Handle interval conversion between formats

#### Step 4.3: Update Payment Method Service

**File:** `src/apps/patient/core/modules/payment-scope/modules/payment-method/`

- [ ] Use processor interface for save/delete
- [ ] Handle different tokenization flows
- [ ] Update validation logic

#### Step 4.4: Create Unified Webhook Processor

**File:** `src/shared/modules/payment-processor/webhook-processor.service.ts` (new)

- [ ] Process generic webhook events
- [ ] Route to appropriate handlers
- [ ] Update order/subscription status
- [ ] Trigger notifications
- [ ] Log for audit

### Phase 5: Frontend Changes

#### Step 5.1: Create Stripe Payment Form

**File:** `node-hedfirst-patient/src/providers/stripe/` (new)

- [ ] Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
- [ ] Create Stripe Elements wrapper
- [ ] Create card input component
- [ ] Handle SetupIntent for saving cards
- [ ] Handle PaymentIntent for payments

#### Step 5.2: Create Payment Form Abstraction

**File:** `node-hedfirst-patient/src/components/payment/` (new)

- [ ] Create `PaymentForm` component that renders based on processor
- [ ] Abstract tokenization result
- [ ] Handle processor-specific UI requirements

```typescript
// Usage
<PaymentForm
  processorType={store.paymentProcessor}
  onTokenized={(token) => handlePayment(token)}
  amount={totalAmount}
/>
```

#### Step 5.3: Update Checkout Flow

**Files:** `node-hedfirst-patient/src/app/.../checkout/`

- [ ] Detect store's payment processor
- [ ] Render appropriate payment form
- [ ] Handle different confirmation flows
- [ ] Update payment processing modal

#### Step 5.4: Update Payment Methods Page

**Files:** `node-hedfirst-patient/src/app/.../account/payment/`

- [ ] Render correct add payment form based on processor
- [ ] Display payment methods in unified format
- [ ] Handle processor-specific card icons/display

### Phase 6: Store Admin Configuration

#### Step 6.1: Create Payment Settings Page

**File:** `node-hedfirst-frontend/src/app/(internal)/panel/settings/payments/` (new)

- [ ] Payment processor selection (Pay Theory / Stripe)
- [ ] Conditional fields based on selection
- [ ] API key input with visibility toggle
- [ ] Test connection button
- [ ] Webhook URL display (auto-generated)
- [ ] Save configuration

#### Step 6.2: Backend Configuration Endpoints

**File:** `src/apps/store-admin/modules/payment-config/` (new module)

- [ ] `GET /payment-config` - Get current config
- [ ] `PUT /payment-config` - Update config
- [ ] `POST /payment-config/test` - Test connection
- [ ] Encrypt API keys before storage
- [ ] Validate API keys work before saving

---

## Stripe vs Pay Theory: Key Differences

### Subscription Model

| Aspect        | Pay Theory                                        | Stripe                              |
| ------------- | ------------------------------------------------- | ----------------------------------- |
| Creation      | GraphQL mutation                                  | REST API                            |
| Billing       | `payment_count` (finite) or infinite              | Always infinite (cancel to end)     |
| Interval      | Enum: DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUALLY | interval + interval_count           |
| First Payment | `first_payment_date` param                        | Immediate or `billing_cycle_anchor` |
| Prorations    | Manual handling                                   | Automatic with proration_behavior   |

### Payment Flow

| Aspect         | Pay Theory         | Stripe                            |
| -------------- | ------------------ | --------------------------------- |
| Tokenization   | Client SDK → token | Stripe.js → PaymentMethod         |
| Auth + Capture | Single mutation    | PaymentIntent (can separate)      |
| 3D Secure      | Handled in SDK     | Requires client-side confirmation |
| Saved Cards    | Token storage      | Attach to Customer                |

### Webhooks

| Aspect       | Pay Theory          | Stripe                     |
| ------------ | ------------------- | -------------------------- |
| Protocol     | POST with JSON      | POST with JSON + signature |
| Verification | None visible        | Webhook secret required    |
| Event Types  | Custom enum         | Standard Stripe events     |
| Retry        | Pull-based recovery | Automatic retries          |

---

## Migration Path for Existing Data

### For Existing Tenants (Hedfirst on Pay Theory)

1. Keep existing Pay Theory configuration
2. Add `processorType: 'PAY_THEORY'` to existing records
3. No payment method migration needed
4. Subscriptions continue on Pay Theory

### For New Tenants Choosing Stripe

1. Configure Stripe in store admin
2. All new payment methods go to Stripe
3. All new subscriptions created in Stripe
4. No legacy Pay Theory data

### For Tenant Migration (Pay Theory → Stripe)

**Not recommended for active subscriptions.** If needed:

1. Cancel Pay Theory subscriptions
2. Collect new payment methods via Stripe
3. Create new Stripe subscriptions
4. Historical transaction data preserved

---

## Environment Variables

### Pay Theory (Existing)

```env
PAY_THEORY_API_URL=https://api.start.paytheory.com/graphql
PAY_THEORY_SECRET_KEY=pt_live_xxx
PAY_THEORY_MERCHANT_UID=xxx
PAY_THEORY_WEBHOOK_URL=https://api.example.com/webhooks/paytheory
```

### Stripe (New)

```env
# Global Stripe config (for platform)
STRIPE_SECRET_KEY=sk_live_xxx           # Platform secret key
STRIPE_PUBLISHABLE_KEY=pk_live_xxx      # Platform publishable key
STRIPE_WEBHOOK_SECRET=whsec_xxx         # Webhook signing secret
```

**Note:** For multi-tenant with Stripe Connect, each tenant would have their own connected account. For simple multi-tenant (non-Connect), each tenant enters their own Stripe keys in store admin.

---

## Testing Strategy

### Unit Tests

- [ ] Payment processor interface compliance
- [ ] Pay Theory adapter mapping
- [ ] Stripe adapter mapping
- [ ] Webhook event parsing
- [ ] Error handling

### Integration Tests

- [ ] Pay Theory payment flow (existing)
- [ ] Stripe payment flow (new)
- [ ] Subscription creation both processors
- [ ] Webhook handling both processors
- [ ] Payment method management

### E2E Tests

- [ ] Complete checkout with Pay Theory
- [ ] Complete checkout with Stripe
- [ ] Subscription lifecycle (create, charge, cancel)
- [ ] Payment method add/remove
- [ ] Refund processing

---

## Files Summary

### New Backend Files

| File                                                                  | Purpose                     |
| --------------------------------------------------------------------- | --------------------------- |
| `src/shared/modules/payment-processor/interfaces/*.ts`                | Interface definitions       |
| `src/shared/modules/payment-processor/payment-processor.factory.ts`   | Adapter factory             |
| `src/shared/modules/payment-processor/adapters/pay-theory.adapter.ts` | Pay Theory implementation   |
| `src/shared/modules/payment-processor/adapters/stripe.adapter.ts`     | Stripe implementation       |
| `src/shared/modules/payment-processor/webhook-processor.service.ts`   | Unified webhook handler     |
| `src/shared/config/stripe.config.ts`                                  | Stripe configuration        |
| `src/apps/patient/core/modules/webhook-scope/stripe-webhook/`         | Stripe webhook controller   |
| `src/apps/store-admin/modules/payment-config/`                        | Store payment config module |

### Modified Backend Files

| File                                                       | Changes                                       |
| ---------------------------------------------------------- | --------------------------------------------- |
| `prisma/schema.prisma`                                     | New models, rename tables, add processor type |
| `src/shared/modules/purchase-scope/purchase-subscription/` | Use processor interface                       |
| `src/apps/patient/core/modules/order-scope/order/`         | Use processor interface                       |
| `src/apps/patient/core/modules/payment-scope/`             | Use processor interface                       |

### New Frontend Files

| File                                                    | Purpose                 |
| ------------------------------------------------------- | ----------------------- |
| `node-hedfirst-patient/src/providers/stripe/`           | Stripe SDK integration  |
| `node-hedfirst-patient/src/components/payment/`         | Abstracted payment form |
| `node-hedfirst-frontend/src/app/.../settings/payments/` | Payment config UI       |

### Modified Frontend Files

| File                                                 | Changes                     |
| ---------------------------------------------------- | --------------------------- |
| `node-hedfirst-patient/src/app/.../checkout/`        | Use abstracted payment form |
| `node-hedfirst-patient/src/app/.../account/payment/` | Support both processors     |

---

## Risks & Mitigations

| Risk                                     | Mitigation                                  |
| ---------------------------------------- | ------------------------------------------- |
| Breaking existing Pay Theory integration | Thorough testing, gradual rollout           |
| Data migration issues                    | Keep Pay Theory tables, add new columns     |
| Stripe API rate limits                   | Implement proper error handling and retries |
| PCI compliance differences               | Document requirements per processor         |
| Subscription behavior differences        | Clear documentation for tenants             |

---

## Verification Checklist

- [ ] Pay Theory continues to work for existing tenants
- [ ] New tenant can configure Stripe
- [ ] Stripe one-time payment works
- [ ] Stripe subscription creation works
- [ ] Stripe subscription charging works
- [ ] Stripe subscription cancellation works
- [ ] Stripe webhooks processed correctly
- [ ] Payment methods saved/deleted for both processors
- [ ] Store admin can switch processors (new tenants only)
- [ ] Frontend renders correct payment form
- [ ] Refunds work for both processors
- [ ] Audit logs capture processor type

---

## Definition of Done

Payment processor abstraction is complete when:

- [ ] Abstraction layer implemented and tested
- [ ] Pay Theory adapter working (existing functionality preserved)
- [ ] Stripe adapter fully implemented
- [ ] Database schema generalized
- [ ] Store admin can configure payment processor
- [ ] Frontend supports both processors
- [ ] Webhooks handled for both processors
- [ ] Documentation for tenant onboarding
- [ ] All tests passing
- [ ] Security review completed
