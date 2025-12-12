# Session Notes

This folder contains summaries of significant work sessions for internal reference and session continuity.

## Purpose

- Enable context recovery when starting new sessions
- Track progress across the project
- Document what was built and why

## How to Use

At the end of a significant session:

1. Ask Claude: "Summarize this session for future reference"
2. Save to this folder
3. When starting a new session: "Read `_docs/session-notes/[latest]` to get up to speed"

## Naming Convention

```
YYYY-MM-DD-[focus-area].md
```

Examples:

- `2025-12-07-store-admin-patients-complete.md`
- `2025-12-08-provider-admin-started.md`
- `2025-12-10-tenant-context-implemented.md`

## Session Note Template

```markdown
# Session: [Focus Area]

**Date:** YYYY-MM-DD
**Duration:** ~X hours

## What We Built

- Feature/component 1
- Feature/component 2

## Key Files Changed

- `src/app/[path]/page.tsx` — Description
- `src/data/[file].ts` — Description

## Decisions Made

- Decision 1 (see `_docs/architecture-decisions/[file]` if significant)

## Left Off At

What's the next logical step?

## Open Questions

- Question 1?
- Question 2?
```
