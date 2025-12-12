# From Mockup to Production

This isn't really a "mockup" in the Figma sense. It's closer to a functional prototype — the UI layer is legitimate React/Next.js code. Many teams build exactly this
way: UI-first with mock data, then backfill with APIs.

Already production-quality:

- TypeScript interfaces that mirror real data structures
- Component architecture (clean separation, composable)
- Shadcn/ui primitives (battle-tested, accessible)
- Responsive patterns, dark mode support
- State management patterns (useState, useMemo)
- The visual design language and UX decisions

What would need to change for real production:

1.  Data fetching — Replace static imports with API calls (React Query, SWR, or Next.js server components)
2.  URL state management — Filters should reflect in URL params (/orders?tab=needs-review&contains=prescription) for shareability and browser back/forward
3.  Pagination — Client-side filtering works for 50 orders, not 50,000. You'd need server-side filtering and cursor-based pagination
4.  Loading & error states — Skeleton loaders, error boundaries, retry logic
5.  Real-time updates — WebSocket or polling for order status changes

If you wanted to productionize this, you'd keep 90% of the component code. The refactor would be in the data layer, not the presentation layer.
