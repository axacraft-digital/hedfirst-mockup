# Session Handoff — Teligant Mockup Project

> **Last Updated:** 2025-12-11
> **Purpose:** Quick context recovery when starting a new Claude Code session

---

## Project Summary

This is a **mockup generation project** for teligant.com marketing materials. We build real, type-safe UI code (not Figma) that can eventually become production code with API integration.

**What exists:**
- 53 screens across 3 portal architectures
- 69 custom components
- ~3,000 lines of realistic mock data
- ~800 lines of TypeScript type definitions
- Full store-admin portal with 15+ sections

**Tech stack:** Next.js 16, React 19, TypeScript (strict), Tailwind v4, Shadcn/ui

---

## Current State

### Store Admin Portal (Feature Complete)
All major sections built:
- Dashboard, Patients (with 11 sub-modules), Providers, Users
- Pharmacies, Products, Orders, Messages
- Integrations (with AI config), Billing, Profile

### Patient & Provider Portals
Placeholder dashboards only — not yet built out.

---

## Recent Work (December 2025)

| Date | Focus |
|------|-------|
| Dec 7-10 | Built out store-admin sections, integrations hub, patient detail modules |
| Dec 11 | LinkedIn post content, project reflection, session documentation |

See `_docs/session-notes/` for detailed session summaries.

---

## Key File Locations

```
src/
├── app/store-admin/          # All store admin pages
│   ├── patients/[id]/        # 11 patient sub-modules
│   ├── integrations/         # Integration hub + AI config
│   └── ...
├── data/
│   ├── types.ts              # All TypeScript interfaces (~800 lines)
│   ├── mock/                 # JSON mock data (~3,000 lines)
│   └── *.ts                  # Data access helpers
└── components/               # 69 custom components
```

---

## How to Resume Work

**Starting a new session:**
```
Read _docs/SESSION-HANDOFF.md and _docs/session-notes/[latest date].md
```

**After significant work:**
```
Update this file's "Recent Work" section
Create a new session note in _docs/session-notes/
```

---

## Open Threads

1. **Production codebase** — Separate from this mockup. Developer working on Pay Theory / ShipStation integrations with webhooks.

2. **Patient/Provider portals** — Only placeholder dashboards exist. Could be built out if needed for marketing.

3. **Teligant.com launch** — These mockups feed into marketing site screenshots.

---

## User Context

- Building Teligant as enterprise telehealth SaaS
- Strong believer in code-first UI design (vs. Figma for admin UIs)
- Runs Hedfirst.com (consumer prescription medication site) on related codebase
- Values speed, type safety, and pragmatic architecture

---

## Commands Reference

```bash
# Run dev server
pnpm dev

# Type check
pnpm tsc --noEmit

# Build
pnpm build
```

---

*Update this document at the end of each significant session.*
