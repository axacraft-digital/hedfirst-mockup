# Tenant Questionnaire Configuration Workplan

**Created:** 2025-12-05
**Status:** Planning
**Priority:** High - Core B2B differentiation feature

---

## Executive Summary

Tenants need the ability to configure their own medical questionnaires for each disease state/product category. Currently, questionnaires are:
- **Hardcoded via database migrations** - No UI for management
- **Store-scoped** - Architecture already supports multi-tenant, but no admin interface
- **Developer-managed** - Any change requires code deployment

---

## Current Implementation Analysis

### Architecture (Already Multi-Tenant Ready)

The questionnaire system uses a **three-layer model**:

| Layer | Model | Purpose |
|-------|-------|---------|
| Template | `QuizData` | Question definitions (JSON), store-scoped |
| Instance | `MedicalQuestionnaire` | Patient's questionnaire session |
| Answers | `MedicalQuestionnaireAnswer` | Individual question responses |

**Key Schema:**
```prisma
model QuizData {
  id           String                       @id
  type         QuizDataTypeEnum             // MEDICAL_QUESTIONNAIRE
  data         Json                         // Question structure
  version      String
  diseaseState StoreProductDiseaseStateEnum
  productType  StoreProductTypeEnum?
  gender       String?                      // MALE, FEMALE, null (both)
  storeId      String                       // ✅ Already tenant-scoped!

  @@unique([type, version, diseaseState, storeId, productType, gender])
}
```

### Question Types Supported

| Type | Description | Example |
|------|-------------|---------|
| `OPTIONS` | Single/multi-select | "Have you been diagnosed with..." |
| `INPUTS` | Numeric/text fields | "What is your height?" |
| `DIRECT_ANSWER` | Free text | "Anything else to share?" |
| `FILES` | File upload | "Upload prescription label" |
| `CONSENT` | Checkbox consents | "I agree to..." |
| `WIDGET` | Custom component | BMI calculator |

### How Questionnaires Are Created Today

**Method:** SQL migrations with hardcoded JSON

**File Example:** `prisma/migrations/20250424103946_insert_quiz_data_medical_questionnaire_weight_loss_001/migration.sql`

```sql
INSERT INTO "QuizData" ("id", "type", "diseaseState", "data", "version", "storeId", "createdAt")
VALUES (
  'b2d68196-696a-43ac-b936-99579af763b6',
  'MEDICAL_QUESTIONNAIRE',
  'WEIGHT_LOSS',
  '{"questionnaireVersion":"0.0.1","title":"Weight Loss Medical Questionnaire",...}'::jsonb,
  '0.0.1',
  '26be00e8-308a-4d98-982b-64087d58a6a7',  -- Hardcoded store ID
  CURRENT_TIMESTAMP
);
```

**Problems:**
1. No UI - requires developer intervention
2. Hardcoded to single store ID
3. No version management UI
4. No preview/test capability
5. No duplication between tenants

### Store Admin Current Capabilities

**Questionnaire viewing:** YES (patient questionnaires)
- View patient answers
- See completion status
- No edit/create capabilities

**Questionnaire configuration:** NO
- No questionnaire builder
- No question editor
- No disease state mapping

---

## What Tenants Need

### Minimum Viable Configuration

1. **View existing questionnaires** per disease state
2. **Clone from template** to customize
3. **Edit questions** (label, options, descriptions)
4. **Reorder questions** within questionnaire
5. **Add/remove questions** from questionnaire
6. **Preview questionnaire** before publishing
7. **Manage versions** (draft → published)

### Question-Level Editing

For each question type, tenants should be able to:

| Field | Editable |
|-------|----------|
| Question label/text | ✅ Yes |
| Description/hint | ✅ Yes |
| Options (add/edit/remove) | ✅ Yes |
| Required/optional | ✅ Yes |
| Order in questionnaire | ✅ Yes |
| Conditional logic | 🟡 Phase 2 |
| Question type | ❌ No (complex) |
| Widget type | ❌ No (requires dev) |

---

## Proposed Solution

### Strategy: Template-Based Configuration

Instead of building a full questionnaire designer, provide:
1. **System templates** - Default questionnaires per disease state
2. **Tenant customization** - Clone and modify templates
3. **Version control** - Draft/published workflow
4. **Preview mode** - Test before activation

### New Database Models

```prisma
// Master templates (system-provided)
model QuestionnaireTemplate {
  id           String                       @id @default(uuid())
  name         String                       // "Weight Loss Standard v1"
  diseaseState StoreProductDiseaseStateEnum
  productType  StoreProductTypeEnum?
  gender       String?
  data         Json                         // Question structure
  version      String
  isDefault    Boolean                      @default(false)
  createdAt    DateTime                     @default(now())
  updatedAt    DateTime                     @updatedAt

  // No storeId - these are system-wide templates
}

// Existing QuizData becomes tenant's customized version
// Already has storeId - just needs management UI
```

### Version Workflow

```
[System Template]
      ↓ clone
[Tenant Draft] ← edit, preview
      ↓ publish
[Tenant Published v1] → patients use this
      ↓ new version
[Tenant Draft v2] ← edit, preview
      ↓ publish
[Tenant Published v2] → new patients use this
                       (existing patients keep v1)
```

---

## Implementation Steps

### Step 1: Backend - Template Management

**File:** `src/apps/store-admin/modules/questionnaire-config/` (new module)

#### 1.1 Create DTOs

**File:** `dto/questionnaire-config.dto.ts`

- [ ] `QuestionnaireTemplateDto` - template list item
- [ ] `QuestionnaireDetailDto` - full template with questions
- [ ] `CreateQuestionnaireDto` - clone from template
- [ ] `UpdateQuestionnaireDto` - modify questions
- [ ] `QuestionDto` - individual question structure
- [ ] `OptionDto` - option within question
- [ ] `InputDto` - input field definition

#### 1.2 Create Service

**File:** `services/questionnaire-config.service.ts`

- [ ] `getSystemTemplates()` - list available templates
- [ ] `getStoreQuestionnaires(storeId)` - list tenant's questionnaires
- [ ] `getQuestionnaireDetail(id)` - get full questionnaire
- [ ] `cloneFromTemplate(templateId, storeId)` - create tenant copy
- [ ] `updateQuestionnaire(id, data)` - modify questionnaire
- [ ] `addQuestion(questionnaireId, question)` - add new question
- [ ] `updateQuestion(questionnaireId, questionId, data)` - edit question
- [ ] `removeQuestion(questionnaireId, questionId)` - delete question
- [ ] `reorderQuestions(questionnaireId, order[])` - change order
- [ ] `publishQuestionnaire(id)` - make version live
- [ ] `createNewVersion(id)` - create draft from published
- [ ] Write unit tests

#### 1.3 Create Controller

**File:** `controllers/questionnaire-config.controller.ts`

- [ ] `GET /questionnaire-config/templates` - list system templates
- [ ] `GET /questionnaire-config` - list store questionnaires
- [ ] `GET /questionnaire-config/:id` - get questionnaire detail
- [ ] `POST /questionnaire-config/clone` - clone from template
- [ ] `PATCH /questionnaire-config/:id` - update questionnaire
- [ ] `POST /questionnaire-config/:id/questions` - add question
- [ ] `PATCH /questionnaire-config/:id/questions/:questionId` - update question
- [ ] `DELETE /questionnaire-config/:id/questions/:questionId` - remove question
- [ ] `PUT /questionnaire-config/:id/questions/order` - reorder questions
- [ ] `POST /questionnaire-config/:id/publish` - publish version
- [ ] `POST /questionnaire-config/:id/new-version` - create draft
- [ ] Write E2E tests

### Step 2: Backend - Migrate Existing Questionnaires

**File:** `prisma/migrations/xxx_create_questionnaire_templates/migration.sql`

- [ ] Create `QuestionnaireTemplate` table
- [ ] Extract unique questionnaires from `QuizData` as templates
- [ ] Mark one template as default per disease state
- [ ] Migrate existing store questionnaires (keep as-is)

### Step 3: Frontend - Store Admin Questionnaire Section

#### 3.1 Create Navigation & Routes

**Files to modify:**
- `src/dictionaries/nav-Item-config.ts` - Add "Questionnaires" nav item
- `src/app/(internal)/panel/questionnaires/` - New route folder

- [ ] Add "Questionnaires" to Store Admin navigation
- [ ] Create `/panel/questionnaires` route
- [ ] Create `/panel/questionnaires/[id]` route for editing
- [ ] Create `/panel/questionnaires/[id]/preview` route

#### 3.2 Create Questionnaire List Page

**File:** `src/app/(internal)/panel/questionnaires/page.tsx`

- [ ] List all questionnaires for store
- [ ] Show disease state, version, status (draft/published)
- [ ] "Clone from Template" button
- [ ] "Edit" action for each questionnaire
- [ ] "Preview" action for each questionnaire
- [ ] Filter by disease state
- [ ] Show patient count using each version

#### 3.3 Create RTK Query Endpoints

**File:** `src/providers/store/api/questionnaire-config/questionnaire-config.ts` (new)

- [ ] `useGetQuestionnaireTemplatesQuery()` - system templates
- [ ] `useGetStoreQuestionnairesQuery()` - tenant's questionnaires
- [ ] `useGetQuestionnaireDetailQuery(id)` - single questionnaire
- [ ] `useCloneQuestionnaireMutation()` - clone template
- [ ] `useUpdateQuestionnaireMutation()` - update questionnaire
- [ ] `useAddQuestionMutation()` - add question
- [ ] `useUpdateQuestionMutation()` - update question
- [ ] `useRemoveQuestionMutation()` - delete question
- [ ] `useReorderQuestionsMutation()` - change order
- [ ] `usePublishQuestionnaireMutation()` - publish
- [ ] `useCreateNewVersionMutation()` - new draft

#### 3.4 Create Questionnaire Editor Page

**File:** `src/app/(internal)/panel/questionnaires/[id]/page.tsx`

Layout:
```
┌─────────────────────────────────────────────────┐
│ [← Back] Weight Loss Questionnaire        [Publish] │
│ Status: Draft v2 | Published: v1                   │
├─────────────────────────────────────────────────┤
│ Questions                                          │
│ ┌─────────────────────────────────────────────┐   │
│ │ ≡ 1. What is your height?          [Edit][×] │   │
│ │   Type: INPUTS | Required                     │   │
│ └─────────────────────────────────────────────┘   │
│ ┌─────────────────────────────────────────────┐   │
│ │ ≡ 2. What's your current weight?   [Edit][×] │   │
│ │   Type: INPUTS | Required                     │   │
│ └─────────────────────────────────────────────┘   │
│                    ...                              │
│              [+ Add Question]                       │
└─────────────────────────────────────────────────┘
```

- [ ] Display all questions in draggable list
- [ ] Drag-and-drop reordering
- [ ] Expand/collapse question details
- [ ] Inline edit mode for questions
- [ ] Delete question with confirmation
- [ ] Add new question button
- [ ] Show question type badge
- [ ] Save/discard changes

#### 3.5 Create Question Editor Components

**Files:** `src/app/(internal)/panel/questionnaires/_components/`

**Common Fields:**
- [ ] `question-label-editor.tsx` - Edit question text
- [ ] `question-description-editor.tsx` - Edit hint/description
- [ ] `question-required-toggle.tsx` - Required checkbox

**Type-Specific Editors:**
- [ ] `options-editor.tsx` - Add/edit/remove options
- [ ] `inputs-editor.tsx` - Configure input fields
- [ ] `consent-editor.tsx` - Edit consent statements
- [ ] `direct-answer-editor.tsx` - Configure placeholder
- [ ] `files-editor.tsx` - Configure upload settings

**Add Question Modal:**
- [ ] `add-question-modal.tsx` - Select type, enter details
- [ ] Template questions to choose from
- [ ] Custom question creation

#### 3.6 Create Preview Page

**File:** `src/app/(internal)/panel/questionnaires/[id]/preview/page.tsx`

- [ ] Render questionnaire as patient would see it
- [ ] Step through questions
- [ ] Show all question types
- [ ] "Back to Editor" button
- [ ] No data submission (view only)

### Step 4: Create System Templates

**File:** `prisma/seeds/questionnaire-templates.seed.ts` (new)

Create base templates for each disease state:

- [ ] Weight Management template
- [ ] Hair Growth (Male) template
- [ ] Hair Growth (Female) template
- [ ] Skin Care (Male) template
- [ ] Skin Care (Female) template
- [ ] Migraine template
- [ ] General Health template
- [ ] Sexual Wellness template
- [ ] Other disease state templates as needed

### Step 5: Tenant Onboarding Flow

When a new tenant is created:

- [ ] Auto-clone default templates for common disease states
- [ ] OR let tenant choose which templates to clone
- [ ] Show questionnaire setup in store admin onboarding

---

## Edge Cases

### 1. Patient Has In-Progress Questionnaire

**Scenario:** Tenant publishes new version while patient is mid-questionnaire

**Solution:**
- Patient completes on their original version
- New questionnaire applies only to new sessions
- Track `quizDataVersion` on `MedicalQuestionnaire` (already exists)

### 2. Questionnaire Deleted

**Scenario:** Tenant wants to remove a disease state questionnaire

**Solution:**
- Soft delete (mark inactive)
- Historical patient data preserved
- New patients cannot start that questionnaire
- Products in that disease state show warning

### 3. Question Removed After Answers Exist

**Scenario:** Tenant removes a question, but patients already answered it

**Solution:**
- Existing answers preserved (denormalized in answer record)
- Doctor view still shows historical answers
- New patients don't see removed question

### 4. Invalid Question Configuration

**Scenario:** Tenant creates question with no options

**Solution:**
- Frontend validation before save
- Backend validation on publish
- Cannot publish invalid questionnaire
- Clear error messages

---

## Files Summary

### Backend Changes

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Add QuestionnaireTemplate model |
| `src/apps/store-admin/modules/questionnaire-config/` | New module |
| `questionnaire-config.controller.ts` | CRUD endpoints |
| `questionnaire-config.service.ts` | Business logic |
| `dto/*.dto.ts` | DTOs for questionnaire operations |
| `prisma/seeds/questionnaire-templates.seed.ts` | System templates |

### Frontend Changes

| File | Action |
|------|--------|
| `src/dictionaries/nav-Item-config.ts` | Add Questionnaires nav |
| `src/app/(internal)/panel/questionnaires/page.tsx` | List page |
| `src/app/(internal)/panel/questionnaires/[id]/page.tsx` | Editor page |
| `src/app/(internal)/panel/questionnaires/[id]/preview/page.tsx` | Preview |
| `src/app/(internal)/panel/questionnaires/_components/` | Editor components |
| `src/providers/store/api/questionnaire-config/` | RTK Query endpoints |

---

## Alternative Approaches Considered

### Option A: Full Questionnaire Builder (NOT Recommended)

Build a complete drag-and-drop form builder like Typeform.

**Pros:**
- Maximum flexibility
- No templates needed

**Cons:**
- Significant development effort
- Easy to create poor questionnaires
- Medical questionnaires need structure
- Higher support burden

### Option B: Template-Only (Too Restrictive)

Only allow tenants to choose from fixed templates, no editing.

**Pros:**
- Simplest implementation
- Consistent quality

**Cons:**
- No differentiation for tenants
- Can't add business-specific questions
- Poor B2B value proposition

### Option C: Template + Customization (RECOMMENDED)

Clone templates and allow editing within guardrails.

**Pros:**
- Fast time to value (templates work immediately)
- Tenants can customize for their practice
- Guardrails prevent invalid configurations
- Reasonable development effort

---

## Verification Checklist

- [ ] Tenant can view list of their questionnaires
- [ ] Tenant can clone system template
- [ ] Tenant can edit question text
- [ ] Tenant can add/remove options
- [ ] Tenant can reorder questions
- [ ] Tenant can add new questions
- [ ] Tenant can remove questions
- [ ] Tenant can preview questionnaire
- [ ] Tenant can publish new version
- [ ] Patient sees tenant's customized questionnaire
- [ ] Existing patient answers preserved on version change
- [ ] Doctor view shows all answer history
- [ ] Invalid configurations blocked

---

## Definition of Done

Tenant questionnaire configuration is complete when:

- [ ] Backend CRUD endpoints implemented and tested
- [ ] Store Admin UI for questionnaire management
- [ ] System templates created for all disease states
- [ ] Preview functionality working
- [ ] Version management (draft/publish) working
- [ ] Patient portal uses tenant's configured questionnaires
- [ ] Documentation for store admins
- [ ] QA sign-off
