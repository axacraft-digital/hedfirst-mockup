# SOC 2 Compliance Workplan - Must-Have Items

**Created:** 2025-12-05
**Status:** Planning
**Prerequisite:** HIPAA P0 items complete

---

## Executive Summary

This document outlines the **minimum required work** for SOC 2 Type II readiness beyond HIPAA compliance. Items marked with "HIPAA Overlap" are already covered by HIPAA remediation.

| Priority            | Items  | HIPAA Overlap   |
| ------------------- | ------ | --------------- |
| P0 - Critical       | 4      | ✅ Full overlap |
| P1 - High           | 6      | ❌ New work     |
| **Total Must-Have** | **10** | -               |

---

## P0 - CRITICAL (Covered by HIPAA)

These SOC 2 critical items are **fully addressed by HIPAA P0 work**:

| SOC 2 ID | Control                | HIPAA ID | Status     |
| -------- | ---------------------- | -------- | ---------- |
| S0-1     | CC6.1 Tenant Isolation | P0-1     | ✅ Covered |
| S0-2     | CC7.2 Audit Logging    | P0-2     | ✅ Covered |
| S0-3     | C1.2 PHI Encryption    | P0-4     | ✅ Covered |
| S0-4     | CC9.1 Vendor BAAs      | P0-3     | ✅ Covered |

**No additional work required for SOC 2 P0.**

---

## S1-1: Password Policy Enforcement

**SOC 2 Control:** CC6.2 - Access Credentials
**Current State:** No complexity enforcement, no expiration

### Step 1.1: Create Password Validator

**File:** `src/shared/validators/password.validator.ts` (new)

- [ ] Define password policy constants:
  - Minimum 12 characters
  - Require uppercase, lowercase, numbers, special characters
  - Block common passwords (top 10,000)
  - Prevent username/email in password
- [ ] Implement `validatePassword()` function
- [ ] Write unit tests for all rules

### Step 1.2: Create Password History Model

**File:** `prisma/schema.prisma`

- [ ] Add `PasswordHistory` model
- [ ] Fields: `userId`, `passwordHash`, `createdAt`
- [ ] Run migration

### Step 1.3: Implement Password History Check

**File:** `src/shared/services/password-policy.service.ts` (new)

- [ ] Query last 5 password hashes
- [ ] Compare new password against history
- [ ] Block reuse of recent passwords
- [ ] Write unit tests

### Step 1.4: Add Expiration Tracking

**File:** `prisma/schema.prisma` (modify User model)

- [ ] Add `passwordChangedAt` field to User
- [ ] Add `passwordExpiresAt` computed field
- [ ] Implement 90-day expiration
- [ ] Implement 14-day warning
- [ ] Add expiration check to auth flow

### Step 1.5: Integrate with Auth Endpoints

- [ ] Validate on registration (`/auth/sign-up`)
- [ ] Validate on password change (`/auth/change-password`)
- [ ] Validate on password reset (`/auth/reset-password`)
- [ ] Return clear error messages

---

## S1-2: User Access Termination API

**SOC 2 Control:** CC6.3 - Access Removal
**Current State:** Manual process, no immediate session invalidation

### Step 2.1: Create Token Blacklist Service

**File:** `src/shared/services/token-blacklist.service.ts` (new)

- [ ] Redis-based token blacklist
- [ ] Method: `blacklistToken(jti, expiresIn)`
- [ ] Method: `blacklistUser(userId)` - invalidates all tokens
- [ ] Method: `isBlacklisted(jti, userId, issuedAt)`
- [ ] Integrate with AuthGuard to check blacklist
- [ ] Write unit tests

### Step 2.2: Create Access Termination Service

**File:** `src/shared/services/access-termination.service.ts` (new)

- [ ] Method: `terminateUserAccess(userId, actorId, reason, options)`
- [ ] Revoke all organization memberships
- [ ] Invalidate all active sessions
- [ ] Blacklist all tokens via Redis
- [ ] Create audit log entry
- [ ] Optional: Send notification to user
- [ ] Write unit tests

### Step 2.3: Create Termination API Endpoint

**File:** `src/apps/super-admin/modules/users/user-termination.controller.ts` (new)

- [ ] Endpoint: `POST /users/:userId/terminate`
- [ ] Require admin permissions
- [ ] Accept reason and options in body
- [ ] Return termination result
- [ ] Write E2E tests

---

## S1-3: Quarterly Access Review System

**SOC 2 Control:** CC6.4 - Access Review
**Current State:** No periodic review process

### Step 3.1: Create Access Review Schema

**File:** `prisma/schema.prisma`

- [ ] Add `AccessReview` model:
  - organizationId, storeId, reviewPeriod
  - totalUsers, activeUsers, staleUsers, privilegedUsers
  - status, reviewedBy, reviewedAt, notes
- [ ] Add `AccessReviewItem` model:
  - reviewId, userId
  - currentRole, lastLoginAt, isStale, isPrivileged
  - decision (keep/modify/revoke), newRole
  - decisionBy, decisionAt, executed
- [ ] Run migration

### Step 3.2: Create Access Review Service

**File:** `src/apps/super-admin/modules/access-review/access-review.service.ts` (new)

- [ ] Method: `generateReview(orgId, storeId, period)`
  - Query all active members
  - Calculate stale users (no login 90 days)
  - Identify privileged users (admin roles)
  - Create review with items
- [ ] Method: `updateItemDecision(itemId, decision, newRole)`
- [ ] Method: `executeReview(reviewId)`
  - Process revoke decisions (call termination service)
  - Process modify decisions (update roles)
  - Mark items as executed
- [ ] Write unit tests

### Step 3.3: Create Access Review Controller

**File:** `src/apps/super-admin/modules/access-review/access-review.controller.ts` (new)

- [ ] Endpoint: `POST /access-reviews/generate`
- [ ] Endpoint: `GET /access-reviews/:id`
- [ ] Endpoint: `PATCH /access-reviews/:id/items/:itemId`
- [ ] Endpoint: `POST /access-reviews/:id/execute`
- [ ] Endpoint: `GET /access-reviews/:id/export` (for auditors)
- [ ] Write E2E tests

### Step 3.4: Create Review Schedule Tracking

- [ ] Track last review date per org/store
- [ ] Calculate next review due date (quarterly)
- [ ] Add endpoint to list overdue reviews
- [ ] Optional: Email reminder for overdue reviews

---

## S1-4: Incident Response System

**SOC 2 Control:** CC7.3 - Incident Response
**Current State:** No incident tracking or procedures

### Step 4.1: Create Incident Schema

**File:** `prisma/schema.prisma`

- [ ] Add `SecurityIncident` model:
  - type, severity, status, title, description
  - affectedSystems, affectedDataTypes
  - Timeline: occurredAt, detectedAt, containedAt, resolvedAt, closedAt
  - reportedBy, assignedTo
  - containmentActions, rootCause, lessonsLearned
  - Notification flags: customersNotified, regulatorsNotified
- [ ] Add `IncidentTimelineEntry` model:
  - incidentId, action, description, performedBy, createdAt
- [ ] Run migration

### Step 4.2: Create Incident Service

**File:** `src/apps/super-admin/modules/incidents/incidents.service.ts` (new)

- [ ] Method: `createIncident(data, reporterId)`
- [ ] Method: `updateStatus(id, status, actions)`
  - Set appropriate timestamp (triagedAt, containedAt, etc.)
- [ ] Method: `addTimelineEntry(incidentId, action, description, actorId)`
- [ ] Method: `generateReport(id)` - for post-incident review
- [ ] Method: `getMetrics()` - time to detect, contain, resolve
- [ ] Write unit tests

### Step 4.3: Create Incident Controller

**File:** `src/apps/super-admin/modules/incidents/incidents.controller.ts` (new)

- [ ] Endpoint: `POST /incidents` - create incident
- [ ] Endpoint: `GET /incidents` - list incidents
- [ ] Endpoint: `GET /incidents/:id` - get incident details
- [ ] Endpoint: `PATCH /incidents/:id/status` - update status
- [ ] Endpoint: `POST /incidents/:id/timeline` - add timeline entry
- [ ] Endpoint: `GET /incidents/:id/report` - generate report
- [ ] Write E2E tests

### Step 4.4: Incident Notifications

- [ ] Auto-notify security team for high/critical severity
- [ ] Email notification service integration
- [ ] Optional: Slack webhook for critical incidents

---

## S1-5: Security Alerting System

**SOC 2 Control:** CC7.2 - Security Monitoring
**Current State:** No automated alerts

### Step 5.1: Create Alert Rules Engine

**File:** `src/shared/modules/alerting/alert-engine.service.ts` (new)

- [ ] Define `AlertRule` interface:
  - id, name, description, severity
  - condition (event type, threshold, time window, groupBy)
  - actions (log, email, slack, create_incident)
- [ ] Implement rule evaluation logic
- [ ] Integrate with audit log events
- [ ] Write unit tests

### Step 5.2: Define Security Alert Rules

**File:** `src/shared/modules/alerting/rules/security-rules.ts` (new)

- [ ] Cross-tenant access attempt (immediate, high)
- [ ] Brute force login (5 failures in 5 min, high)
- [ ] Privilege escalation (immediate, medium)
- [ ] Bulk data export (100+ records/hour, medium)
- [ ] After-hours PHI access (outside 9-6, low)

### Step 5.3: Implement Alert Actions

- [ ] Log action: write to alert log table
- [ ] Email action: send to security team
- [ ] Create incident action: auto-create incident for high/critical
- [ ] Optional: Slack webhook action

---

## S1-6: Vendor Assessment Completion

**SOC 2 Control:** CC9.1 - Vendor Risk Management
**Current State:** BAA status unknown for several vendors

### Step 6.1: Create Vendor Schema

**File:** `prisma/schema.prisma`

- [ ] Add `Vendor` model:
  - name, website, category
  - dataAccess (PHI, PII, financial, none)
  - BAA status, dates, document path
  - SOC 2 / HIPAA certification
  - riskLevel, assessment dates
  - Integration references, kill switch flag
- [ ] Add `VendorAssessment` model:
  - vendorId, assessedBy, responses
  - riskScore, findings, recommendations
  - approved, approvedBy
- [ ] Run migration

### Step 6.2: Populate Vendor Inventory

- [ ] Create records for all current vendors:
  - ChooseHealth (lab orders)
  - Pharmacy Partners (prescriptions)
  - PayTheory (payments)
  - Anthropic (AI chat)
  - ShipStation (shipping)
  - SmartyStreets (address validation)
  - Crisp (support chat)
- [ ] Document data access for each
- [ ] Set initial risk levels

### Step 6.3: Verify BAA Status

- [ ] Contact each vendor with unknown BAA status
- [ ] Document BAA status and dates
- [ ] Upload BAA documents to S3
- [ ] Set review reminders for expiring BAAs

### Step 6.4: Create Vendor Management Controller

**File:** `src/apps/super-admin/modules/vendors/vendors.controller.ts` (new)

- [ ] Endpoint: `GET /vendors` - list all vendors
- [ ] Endpoint: `GET /vendors/:id` - vendor details
- [ ] Endpoint: `PATCH /vendors/:id` - update vendor
- [ ] Endpoint: `POST /vendors/:id/assessments` - add assessment
- [ ] Endpoint: `PATCH /vendors/:id/disable` - kill switch
- [ ] Write E2E tests

---

## Verification Checklist

### Before B2B Launch (HIPAA P0 + SOC 2 P1)

**HIPAA P0 (Covered):**

- [ ] Tenant isolation guard deployed
- [ ] Audit logging includes actor ID
- [ ] PHI encrypted at rest
- [ ] ActiveCampaign BAA resolved

**SOC 2 P1 (New Work):**

- [ ] S1-1: Password policy enforced
- [ ] S1-2: User termination API operational
- [ ] S1-3: Access review system ready
- [ ] S1-4: Incident response system operational
- [ ] S1-5: Security alerting active
- [ ] S1-6: Vendor inventory complete with BAAs

### Before SOC 2 Audit (6-12 months)

- [ ] 6 months of audit logs collected
- [ ] 2 quarterly access reviews completed
- [ ] DR test completed and documented
- [ ] All policies documented
- [ ] Security training completed
- [ ] Vulnerability scans current

---

## Dependencies

```
HIPAA P0 Complete
    │
    ├── S1-1 (Password Policy) - Independent
    │
    ├── S1-2 (Access Termination) - Uses audit logging from P0-2
    │   └── S1-3 (Access Review) - Uses termination service
    │
    ├── S1-4 (Incident Response) - Independent
    │   └── S1-5 (Alerting) - Can create incidents
    │
    └── S1-6 (Vendor Assessment) - Continues P0-3 BAA work
```

---

## Evidence Requirements for SOC 2 Audit

Each control requires evidence of operation over 6+ months:

| Control            | Evidence Required                                       |
| ------------------ | ------------------------------------------------------- |
| Password Policy    | Failed password change logs, policy document            |
| Access Termination | Termination records, session invalidation logs          |
| Access Review      | Quarterly review records, remediation actions           |
| Incident Response  | Incident records (or statement of none), procedure docs |
| Security Alerting  | Alert logs, alert response records                      |
| Vendor Management  | Vendor inventory, BAA copies, assessment records        |

---

## Definition of Done

Each item is complete when:

- [ ] Code implemented and reviewed
- [ ] Unit tests passing (>80% coverage)
- [ ] E2E tests passing
- [ ] Security review approved
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA sign-off
- [ ] Evidence collection started
