# Mock Data Architecture Plan

## Overview

This document outlines the centralized mock data architecture for the Teligant UI mockup project. The architecture supports three admin portals (Store Admin, Provider Portal, Patient Portal) sharing a common data layer.

Read this, then we will begin with Phase 1: types.ts

---

## Justification

### Why Centralize Mock Data?

The project evolved from simple mockups to a strategic tool for:
- Conveying future product direction
- Demonstrating feature enhancements
- Serving as a reference implementation

With three portals viewing the same underlying data (patients, orders, messages, etc.), inline mock data in each page component creates problems:
- Same data duplicated 3 times
- Changes need to be made in 3 places
- Data drifts out of sync between portals
- Harder to maintain consistency

### Why This Architecture?

| Principle | Rationale |
|-----------|-----------|
| **Discrete JSON files** | Each file is single-purpose, LLM-generatable, and under 500 lines |
| **Foreign key relationships** | Mimics real API/database design; `patientId` links everything |
| **Reference data separation** | Providers, products, disease states are shared lookups (no duplication) |
| **Types-first approach** | Catches design issues early, enables IDE autocomplete |
| **Helper functions** | Abstract joins, prevent each page from doing manual lookups |

### Current Project Structure

This is a **single Next.js app** with route groups (not a monorepo):

```
src/
├── app/
│   ├── patient-admin/      # Route: /patient-admin/*
│   ├── provider-admin/     # Route: /provider-admin/*
│   └── store-admin/        # Route: /store-admin/*
├── components/
├── lib/
└── data/                   # <-- Shared by all portals via @/data
```

All three portals import from `@/data/...` - no special configuration needed.

---

## Data Inventory

Complete list of data types built in the patient detail area:

| Category | Data Type | Description | JSON File |
|----------|-----------|-------------|-----------|
| **Core** | Patients | Demographics, status, contact info | `patients.json` |
| **Clinical** | Chart Notes | SOAP, quick, progress, telehealth notes | `clinical/chart-notes.json` |
| | Questionnaires | Intake responses, versions, uploads, Q&A | `clinical/questionnaires.json` |
| | Treatments | Subscriptions, one-time products, memberships | `clinical/treatments.json` |
| | Consultations | Provider visits, disease state, status | `clinical/consultations.json` |
| **Communication** | Messages | Threads + individual messages | `communication/messages.json` |
| | Appointments | Scheduled visits | `communication/appointments.json` |
| | Notes | Internal staff notes | `communication/notes.json` |
| **Financial** | Orders | Order history with line items | `financial/orders.json` |
| | Payment Methods | Cards on file | `financial/payment-methods.json` |
| | Payment History | Transaction ledger | `financial/payment-history.json` |
| **Documents** | Documents | ID, consent, uploaded files | `documents/documents.json` |
| **Audit** | Activity History | Event log / audit trail | `audit/activity-history.json` |
| **Reference** | Providers | Dr. Nicole Baldwin, etc. | `reference/providers.json` |
| | Products | Product catalog | `reference/products.json` |
| | Disease States | Peptide Therapy, Weight Management, etc. | `reference/disease-states.json` |

**Total: 16 discrete JSON files**

---

## Folder Structure

```
src/data/
├── types.ts                        # All TypeScript interfaces
├── index.ts                        # Helper functions + exports
│
└── mock/
    ├── patients.json               # Core patient records
    │
    ├── clinical/
    │   ├── chart-notes.json
    │   ├── questionnaires.json
    │   ├── treatments.json
    │   └── consultations.json
    │
    ├── communication/
    │   ├── messages.json
    │   ├── appointments.json
    │   └── notes.json
    │
    ├── financial/
    │   ├── orders.json
    │   ├── payment-methods.json
    │   └── payment-history.json
    │
    ├── documents/
    │   └── documents.json
    │
    ├── audit/
    │   └── activity-history.json
    │
    └── reference/
        ├── providers.json
        ├── products.json
        └── disease-states.json
```

---

## Dependency Graph

Reference data must exist before patients, and patients must exist before domain data:

```
disease-states.json  ──┐
providers.json       ──┼──► patients.json ──► orders.json
products.json        ──┘                  ──► chart-notes.json
                                          ──► questionnaires.json
                                          ──► treatments.json
                                          ──► consultations.json
                                          ──► messages.json
                                          ──► appointments.json
                                          ──► notes.json
                                          ──► payment-methods.json
                                          ──► payment-history.json
                                          ──► documents.json
                                          ──► activity-history.json
```

---

## Patient Record Design (Anchor File)

`patients.json` is the anchor. Every other file references it via `patientId`.

```json
{
  "id": "pat_001",
  "firstName": "Jacob",
  "lastName": "Henderson",
  "email": "jacob.henderson@example.com",
  "phone": "(555) 123-4567",
  "dateOfBirth": "1985-03-15",
  "status": "active",
  "primaryProviderId": "prov_001",
  "diseaseStateIds": ["ds_peptide", "ds_weight"],
  "createdAt": "2025-11-16T16:54:00Z",
  "updatedAt": "2025-11-16T17:00:00Z"
}
```

Domain data references back:

```json
// chart-notes.json
{ "id": "note_001", "patientId": "pat_001", "providerId": "prov_001", ... }

// orders.json
{ "id": "ord_001", "patientId": "pat_001", ... }

// messages.json
{ "id": "thread_001", "patientId": "pat_001", ... }
```

---

## Helper Functions

### Basic Helpers (Phase 3)

```typescript
// Core lookups
getPatientById(id: string): Patient | undefined
getPatientsByStatus(status: PatientStatus): Patient[]
getProviderById(id: string): Provider | undefined
getProductById(id: string): Product | undefined
getDiseaseStateById(id: string): DiseaseState | undefined

// Domain lookups by patient
getChartNotesByPatientId(patientId: string): ChartNote[]
getQuestionnairesByPatientId(patientId: string): Questionnaire[]
getTreatmentsByPatientId(patientId: string): Treatment[]
getConsultationsByPatientId(patientId: string): Consultation[]
getMessagesByPatientId(patientId: string): MessageThread[]
getAppointmentsByPatientId(patientId: string): Appointment[]
getNotesByPatientId(patientId: string): Note[]
getOrdersByPatientId(patientId: string): Order[]
getPaymentMethodsByPatientId(patientId: string): PaymentMethod[]
getPaymentHistoryByPatientId(patientId: string): PaymentTransaction[]
getDocumentsByPatientId(patientId: string): Document[]
getActivityHistoryByPatientId(patientId: string): ActivityEvent[]
```

### Composite Helpers (Phase 5)

```typescript
// Patient detail page (all admins need this)
getPatientWithDetails(patientId: string): {
  patient: Patient
  provider: Provider
  diseaseStates: DiseaseState[]
  recentOrders: Order[]
  activeConsultation: Consultation | null
}

// Provider dashboard
getProviderDashboard(providerId: string): {
  provider: Provider
  patients: Patient[]
  pendingConsultations: Consultation[]
  todayAppointments: Appointment[]
}

// Patient portal home
getPatientPortalData(patientId: string): {
  patient: Patient
  activeTreatments: Treatment[]
  upcomingAppointments: Appointment[]
  unreadMessages: number
  recentOrders: Order[]
}
```

---

## Implementation Order

### Phase 1: Foundation
1. **`types.ts`** - All interfaces first (80% complete, refine as needed)
2. **Folder structure** - Create directories with empty JSON files
3. **`index.ts`** - Basic structure and exports

### Phase 2: Reference Data
4. **`reference/providers.json`**
5. **`reference/products.json`**
6. **`reference/disease-states.json`**

### Phase 3: Core + Basic Helpers
7. **`patients.json`** - Start with 3 fully-populated patients
8. **Basic helpers** - `getPatientById`, `getProviderById`, etc.

### Phase 4: Domain Data (iterative)
For each domain:
- Create JSON with mock data
- Add helper function
- Update page component to import from `@/data`
- Verify functionality
- Repeat

Order of domains:
1. `financial/orders.json`
2. `financial/payment-methods.json`
3. `financial/payment-history.json`
4. `clinical/chart-notes.json`
5. `clinical/questionnaires.json`
6. `clinical/treatments.json`
7. `clinical/consultations.json`
8. `communication/messages.json`
9. `communication/appointments.json`
10. `communication/notes.json`
11. `documents/documents.json`
12. `audit/activity-history.json`

### Phase 5: Composite Helpers
- `getPatientWithDetails()`
- `getProviderDashboard()`
- Portal-specific composites as needed

---

## Key Design Decisions

### Types-First Approach
- Data inventory is already defined (no unknown unknowns)
- IDE autocomplete while building JSON files prevents typos
- Catches relational design issues before writing 14 JSON files

### Types Will Evolve
Don't perfect `types.ts` on first pass. Build in the expectation that types will evolve through Phase 4 as you discover:
- "Orders need a status field I forgot"
- "Consultations should reference disease state, not just patient"

### ID Conventions
```
Patients:       pat_001, pat_002, ...
Providers:      prov_001, prov_002, ...
Products:       prod_001, prod_002, ...
Disease States: ds_peptide, ds_weight, ds_hair, ...
Orders:         ord_001, ord_002, ...
Chart Notes:    note_001, note_002, ...
Messages:       thread_001, msg_001, ...
```

### Target: 20 Patients
Start with 3 fully-populated patients, expand to 20 for comprehensive demos. Each patient should have realistic data across all domains.

---

## Migration Strategy

When migrating existing page components:

1. **Don't break working pages** - Keep inline data as fallback initially
2. **One page at a time** - Migrate, test, commit
3. **Delete inline data last** - Only after centralized data is verified

Example migration for Orders page:
```typescript
// Before
const mockOrders = [...] // inline data

// After
import { getOrdersByPatientId } from '@/data'
const orders = getOrdersByPatientId(patientId)
```

---

## Files to Create

### Immediate (Phase 1)
- [ ] `src/data/types.ts`
- [ ] `src/data/index.ts`
- [ ] `src/data/mock/` folder structure

### Phase 2
- [ ] `src/data/mock/reference/providers.json`
- [ ] `src/data/mock/reference/products.json`
- [ ] `src/data/mock/reference/disease-states.json`

### Phase 3
- [ ] `src/data/mock/patients.json`

### Phase 4 (14 files)
- [ ] All domain JSON files

---

## Success Criteria

1. Any patient clicked in any portal shows fully-populated data
2. Data is consistent across Store Admin, Provider Portal, Patient Portal
3. Adding a new patient means updating JSON files, not page components
4. Types provide autocomplete and catch errors at compile time
5. Helper functions abstract all data access

---

## Notes

- This architecture was designed during the Store Admin patient detail area build
- All pages in that area currently have inline mock data that will be migrated
- The architecture supports LLM-assisted generation of additional patient data
- Reference files (providers, products, disease states) should be kept small and stable

---

*Document created: Session building patient detail area for Store Admin portal*
*Next step: Execute Phase 1 - Create `types.ts`*
