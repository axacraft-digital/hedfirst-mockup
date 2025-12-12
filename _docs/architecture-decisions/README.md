# Architecture Decisions

This folder contains Architecture Decision Records (ADRs) for significant decisions made during mockup development.

## Purpose

Track decisions that:

- Affect how components are structured
- Establish patterns to follow consistently
- Have implications for eventual production implementation
- Should carry forward across sessions

## How to Use

When a significant decision is made during a session:

1. Ask Claude to document it as an architecture decision
2. Save to this folder
3. Reference in future sessions when the pattern applies

## Naming Convention

```
YYYY-MM-DD-[decision-name].md
```

Examples:

- `2025-12-07-tenant-context-pattern.md`
- `2025-12-07-shared-data-layer-design.md`
- `2025-12-07-portal-routing-structure.md`

## ADR Template

````markdown
# [Decision Title]

**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded | Deprecated

## Context

What situation prompted this decision?

## Decision

What did we decide?

## Rationale

Why did we make this choice?

## Consequences

- What are the implications?
- What patterns must we follow now?

## Implementation

- Key files: `path/to/file.tsx`
- Usage example:

```typescript
// Code example
```
````

```

```
