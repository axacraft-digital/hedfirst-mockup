# HIPAA Compliance Workplan - Must-Have Items

**Created:** 2025-12-05
**Status:** Planning
**Prerequisite:** All work targets the node-hedfirst backend

---

## Executive Summary

This document outlines the **minimum required work** to achieve HIPAA compliance for B2B launch. These are launch blockers - no B2B client can be onboarded until all P0 items are complete.

| Priority                        | Gap Count |
| ------------------------------- | --------- |
| P0 - Critical (Launch Blockers) | 4         |

---

## P0-1: Tenant Isolation Guard

**HIPAA Reference:** § 164.312(d), § 164.308(a)(3)
**Current State:** 185 of 246 endpoints (75%) lack tenant validation
**Risk:** Cross-tenant PHI access possible via URL manipulation

### Step 1.1: Create TenantMembershipGuard

**File:** `src/shared/guards/tenant-membership.guard.ts` (new)

- [ ] Create guard class implementing `CanActivate`
- [ ] Query `OrganizationMember` table to validate user belongs to requested org/store
- [ ] Check `userId`, `organizationId`, `storeId`, `status: ACTIVE`, `revokedAt: null`
- [ ] Attach `validatedTenant` object to request on success
- [ ] Return 401 Unauthorized if user is not a member
- [ ] Write unit tests (100% coverage)

### Step 1.2: Create @SkipTenantCheck Decorator

**File:** `src/shared/decorators/skip-tenant-check.decorator.ts` (new)

- [ ] Create decorator using `SetMetadata`
- [ ] Update guard to check for decorator via Reflector
- [ ] Skip validation if decorator present

### Step 1.3: Register Guard Globally

**Files:**

- `src/apps/store-admin/app.module.ts`
- `src/apps/store-doctor/app.module.ts`
- `src/apps/super-admin/app.module.ts`
- `src/apps/patient/app.module.ts`

- [ ] Add `TenantMembershipGuard` as `APP_GUARD` in all 4 apps
- [ ] Ensure guard order: `AuthGuard` → `TenantMembershipGuard` → `ThrottlerGuard`
- [ ] Verify no breaking changes to existing functionality

### Step 1.4: Mark Public Endpoints with @SkipTenantCheck

- [ ] Add `@SkipTenantCheck()` to all ~58 endpoints with `@SkipAuth()`
  - Auth endpoints (`/auth/sign-in`, `/auth/sign-up`, etc.)
  - Webhooks (`/webhooks/*`)
  - Health checks (`/health`)
  - Public catalog (`/catalog/*`)
- [ ] Test all public endpoints still work

### Step 1.5: Update Controllers to Use Validated Tenant

**Pattern Change:**

```typescript
// BEFORE (vulnerable)
@Get()
async getPatients(@Param('storeId') storeId: string) {
  return this.service.list(storeId);
}

// AFTER (secure)
@Get()
async getPatients(@Req() request: Request) {
  const { storeId } = request.validatedTenant;
  return this.service.list(storeId);
}
```

**Affected Modules (~185 endpoints):**

- [ ] `src/apps/store-admin/core/modules/patient-scope/` (~50 endpoints)
- [ ] `src/apps/store-admin/core/modules/order-scope/` (~30 endpoints)
- [ ] `src/apps/store-admin/core/modules/chat-scope/` (~15 endpoints)
- [ ] `src/apps/store-doctor/core/modules/` (~60 endpoints)
- [ ] `src/apps/super-admin/core/modules/` (~30 endpoints)

### Step 1.6: Write E2E Tenant Isolation Tests

**File:** `test/e2e/tenant-isolation.e2e-spec.ts` (new)

- [ ] Test: User A cannot access Store B's patients
- [ ] Test: User A cannot access Store B's orders
- [ ] Test: User A cannot access Store B's chats
- [ ] Test: User A cannot access Store B's prescriptions
- [ ] Test: Super admin CAN access any store (bypass)
- [ ] Test: Deactivated member cannot access former store
- [ ] Verify: 100% cross-tenant access blocked
- [ ] Verify: 0% false positives (legitimate access works)
- [ ] Verify: <10ms guard overhead per request

---

## P0-2: Audit Log Actor Tracking

**HIPAA Reference:** § 164.312(b)
**Current State:** Logs patient ID only, NOT who performed the action
**Risk:** Cannot determine who accessed/modified PHI

### Step 2.1: Enhance UserActionLog Schema

**File:** `prisma/schema.prisma`

Add fields to `UserActionLog` model:

- [ ] `actorId` (String?) - WHO performed the action
- [ ] `actorRole` (String?) - Role of actor
- [ ] `resourceType` (String?) - 'Patient', 'Order', 'Prescription', etc.
- [ ] `resourceId` (String?) - ID of affected resource
- [ ] `ipAddress` (String?) - Request IP
- [ ] `userAgent` (String?) - Browser/client info
- [ ] `sessionId` (String?) - Session identifier
- [ ] `organizationId` (String?) - Tenant context
- [ ] `storeId` (String?) - Tenant context
- [ ] Add indexes: `[actorId, createdAt]`, `[storeId, createdAt]`, `[resourceType, resourceId]`
- [ ] Run migration

### Step 2.2: Update UserActionLogsService Interface

**File:** `src/shared/modules/user-action-logs/user-action-logs.service.ts`

- [ ] Update `EmitLogActionParams` interface to require new fields
- [ ] Make `actorId` required (not optional)
- [ ] Add validation for required fields
- [ ] Update service methods to accept new parameters

### Step 2.3: Update All Emit Calls (~40 locations)

**Pattern Change:**

```typescript
// BEFORE
this.userActionLogService.emitLogAction({
  userId: patientId,
  actionType: UserLogActionsEnum.PATIENT_ACCEPTED_BY_DOCTOR,
})

// AFTER
this.userActionLogService.emitLogAction({
  userId: patientId,
  actorId: request.user.id,
  actorRole: request.user.roles[0],
  actionType: UserLogActionsEnum.PATIENT_ACCEPTED_BY_DOCTOR,
  resourceType: "Patient",
  resourceId: patientId,
  storeId: request.validatedTenant.storeId,
  organizationId: request.validatedTenant.organizationId,
  ipAddress: request.ip,
})
```

**Files to Update:**

- [ ] `src/apps/store-doctor/core/modules/patient-scope/modules/accept-patient-scope/`
- [ ] `src/apps/store-admin/core/modules/patient-scope/`
- [ ] `src/apps/store-admin/core/modules/order-scope/`
- [ ] All payment-related services
- [ ] All subscription-related services
- [ ] All prescription-related services
- [ ] All SOAP note services

### Step 2.4: Implement TODO Action Types

- [ ] Identify ~7 action types marked TODO in `UserLogActionsEnum`
- [ ] Implement logging for each missing action type
- [ ] Add logging for PHI READ operations (currently not logged)

---

## P0-3: ActiveCampaign BAA Resolution

**HIPAA Reference:** § 164.308(b)(1)
**Current State:** PHI sent to vendor without BAA
**Risk:** HIPAA violation - unauthorized PHI disclosure

### Step 3.1: Make Business Decision

Choose ONE option:

- [ ] **Option A:** Obtain BAA from ActiveCampaign (contact enterprise sales)
- [ ] **Option B:** Stop sending PHI (remove health data from sync, keep only email/name)
- [ ] **Option C:** Disable integration until BAA obtained

### Step 3.2: Implement Technical Solution

**File:** `src/shared/providers/active-campaign/`

**If Option B (Stop PHI):**

- [ ] Audit what data is currently sent to ActiveCampaign
- [ ] Remove patient health data from sync payload
- [ ] Keep only non-PHI: email, name, consent status
- [ ] Test integration still works for marketing purposes

**If Option C (Kill Switch):**

- [ ] Add environment variable `ACTIVECAMPAIGN_BAA_VERIFIED`
- [ ] Add check at integration entry point:
  ```typescript
  if (!process.env.ACTIVECAMPAIGN_BAA_VERIFIED) {
    logger.warn('ActiveCampaign disabled - no BAA');
    return;
  }
  ```
- [ ] Log when integration is disabled
- [ ] Document in deployment guide

### Step 3.3: Document Decision

- [ ] Record decision and rationale
- [ ] Update BAA tracking documentation
- [ ] Add to compliance audit trail

---

## P0-4: PHI Encryption at Rest

**HIPAA Reference:** § 164.312(a)(2)(iv)
**Current State:** Medical data stored plaintext in PostgreSQL
**Risk:** PHI exposure if database compromised

### Step 4.1: Create Encryption Service

**File:** `src/shared/providers/encryption/encryption.service.ts` (new)

- [ ] Implement AES-256-GCM encryption
- [ ] Use environment variable `ENCRYPTION_KEY` (32 bytes hex)
- [ ] Implement `encrypt(plaintext: string): string` method
- [ ] Implement `decrypt(ciphertext: string): string` method
- [ ] Format: `{iv}:{authTag}:{ciphertext}` (all hex encoded)
- [ ] Write unit tests for encryption/decryption roundtrip
- [ ] Handle edge cases (null, empty string, unicode)

### Step 4.2: Define PHI Fields to Encrypt

Document and configure fields requiring encryption:

| Model                      | Fields                                          |
| -------------------------- | ----------------------------------------------- |
| User                       | `dateOfBirth`, `phone`                          |
| Patient                    | `ssn`, `insuranceNumber`                        |
| MedicalQuestionnaireAnswer | `selectedOptions`, `userInputs`                 |
| SoapNote                   | `subjective`, `objective`, `assessment`, `plan` |
| Prescription               | `dosage`, `instructions`                        |
| LabTestResult              | `results`, `notes`                              |
| ChatMessage                | `content` (if contains PHI)                     |

- [ ] Create configuration file listing all PHI fields
- [ ] Review with compliance team
- [ ] Document encryption scope

### Step 4.3: Create Prisma Middleware for Auto-Encryption

**File:** `src/shared/providers/prisma/middlewares/encrypt-phi.middleware.ts` (new)

- [ ] Create middleware that intercepts Prisma operations
- [ ] On `create`/`update`: encrypt PHI fields before write
- [ ] On `findUnique`/`findFirst`/`findMany`: decrypt PHI fields after read
- [ ] Handle nested relations
- [ ] Handle batch operations
- [ ] Add error handling for decryption failures
- [ ] Write integration tests

### Step 4.4: Data Migration Script

**File:** `prisma/migrations/encrypt-existing-phi.ts` (new)

- [ ] Create migration script to encrypt existing data
- [ ] Process in batches (1000 records at a time)
- [ ] Add progress logging
- [ ] Create backup of original data before migration
- [ ] Add verification step (decrypt and compare)
- [ ] Create rollback procedure
- [ ] Test on staging with production-like data volume

### Step 4.5: Key Management

- [ ] Generate production encryption key (32 bytes)
- [ ] Store key securely (AWS Secrets Manager or similar)
- [ ] Document key rotation procedure
- [ ] Set up key backup
- [ ] Add key to deployment configuration
- [ ] Test key retrieval in all environments

### Step 4.6: Testing

- [ ] Test encryption on create
- [ ] Test decryption on read
- [ ] Test update preserves encryption
- [ ] Test search/filter still works (if applicable)
- [ ] Performance testing (measure overhead)
- [ ] Test migration script on staging
- [ ] Verify backup/restore works with encrypted data

---

## Verification Checklist

### Before B2B Launch

- [ ] **P0-1:** TenantMembershipGuard deployed and validated
- [ ] **P0-1:** All 185 vulnerable endpoints protected
- [ ] **P0-1:** E2E tests passing with 0 cross-tenant access
- [ ] **P0-2:** All audit logs include actorId
- [ ] **P0-2:** PHI access logging operational
- [ ] **P0-3:** ActiveCampaign BAA resolved (obtained or PHI stopped)
- [ ] **P0-4:** All PHI fields encrypted at rest
- [ ] **P0-4:** Existing data migrated and verified
- [ ] Security review completed by qualified reviewer
- [ ] Penetration testing passed (no cross-tenant access)
- [ ] Documentation updated

### Compliance Sign-Off

| Requirement                  | HIPAA Section   | Status     |
| ---------------------------- | --------------- | ---------- |
| Access Control               | § 164.312(a)(1) | ⬜ Pending |
| Audit Controls               | § 164.312(b)    | ⬜ Pending |
| Person Authentication        | § 164.312(d)    | ⬜ Pending |
| Transmission Security        | § 164.312(e)(1) | ⬜ Pending |
| Business Associate Contracts | § 164.308(b)(1) | ⬜ Pending |

---

## Dependencies

```
P0-1 (Tenant Isolation) - No dependencies, start immediately
    │
    └── P0-2 (Audit Logging) - Depends on validatedTenant from P0-1
            │
            └── P0-4 (Encryption) - Can run in parallel after P0-1

P0-3 (ActiveCampaign) - No dependencies, can run in parallel
```

---

## Risk Mitigation

| Risk                                | Mitigation                                   |
| ----------------------------------- | -------------------------------------------- |
| Guard breaks existing functionality | Comprehensive E2E tests before deployment    |
| Encryption migration corrupts data  | Backup before migration, verify after        |
| Performance degradation             | Load testing, caching for membership checks  |
| Key loss                            | Secure backup, documented recovery procedure |

---

## Definition of Done

Each P0 item is complete when:

- [ ] Code implemented and reviewed
- [ ] Unit tests passing (>80% coverage)
- [ ] E2E tests passing
- [ ] Security review approved
- [ ] Deployed to staging
- [ ] QA sign-off
- [ ] Documentation updated
- [ ] Deployed to production
