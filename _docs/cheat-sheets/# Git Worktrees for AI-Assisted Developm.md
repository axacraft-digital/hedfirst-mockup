# Git Worktrees for AI-Assisted Development

## What Worktrees Are

A Git worktree is an additional working directory linked to the same repository history.
Each worktree can track a different branch and can be opened at the same time as others.

You can think of worktrees as parallel sandboxes.

* One repo
* Multiple active checkouts
* Fully isolated working folders
* No need for stashing or constant switching

---

## Why Worktrees Matter in AI Coding

AI-assisted development introduces rapid iteration and high-velocity experimentation.
Worktrees let you explore bold changes without impacting your stable branch.

### Key Benefits

* Safe experimentation without touching main
* Multiple feature directions can exist in parallel
* Easier comparison of AI-generated implementations
* Disposable branches that don't pollute history
* No overwriting or stashing required
* Ideal for analyzing, benchmarking, and selecting best output

### Perfect Fit When Using AI

* Large refactors with uncertain outcomes
* "Try version A vs version B" workflows
* Allow AI agents to operate freely and aggressively
* Long-running improvements without risk
* Compare architecture styles before committing

---

## How to Use Worktrees

### Create a new worktree from `main`

```bash
git worktree add ../exp-refactor -b exp/refactor
```

This produces:

```
repo/main            ← production baseline
repo/../exp-refactor ← isolated experiment environment
```

You may now run AI refactors, rewrite modules, restructure architecture, etc.
Your main branch remains untouched.

---

### Multiple Alternative Experiments

```bash
git worktree add ../exp-A -b exp/A
git worktree add ../exp-B -b exp/B
```

Then prompt AI differently in each directory:

```
# Worktree exp/A
Refactor auth flow for maintainability and readability.

# Worktree exp/B
Rewrite auth service with a plugin model for multi-tenant scaling.
```

When done, compare implementation styles:

```bash
git diff main..exp/A
git diff main..exp/B
```

Decide which direction to merge — or merge neither.

---

### Cleaning Up Worktrees

Remove the working directory and branch together:

```bash
git worktree remove ../exp-refactor
git branch -D exp/refactor
```

---

## When to Use Worktrees in AI

| Situation                             | Why Worktrees Help                       |
| ------------------------------------- | ---------------------------------------- |
| Architectural redesign                | Explore fearlessly without breaking main |
| Learning or prototyping               | Only merge if results prove valuable     |
| Multi-model or multi-agent comparison | Run separate designs side-by-side        |
| Refactoring large files or systems    | AI can rewrite freely with no risk       |
| Benchmarking changes                  | Measure performance across branches      |

If you're using Claude Code, Cursor, or a local LLM to rewrite, test, or re-architect large modules — worktrees are one of the highest-ROI patterns available.

---

## Worktree Workflow Prompt Template

Use this at the start of AI coding sessions inside a worktree:

```
You are working inside a Git worktree branch. The main branch is isolated and should remain untouched.
You are free to propose and implement bold architectural changes.

Your responsibilities:
- Generate and refine a clear plan before coding.
- Implement changes in stages rather than full rewrites.
- After completion, summarize the work and produce tests.
- Provide a comparison summary for merging back into main.
- Highlight risks or design trade-offs.

At the end, tell me whether this worktree branch is worth merging and why.
```

Optional extension for multi-branch experiments:

```
I will create another worktree with a different direction.
You will critique and compare both approaches, then recommend the best one.
```

---

### Example AI Workflow Using Worktrees

```
# Create worktree for refactor attempt A
git worktree add ../api-cleanup -b exp/api-cleanup

# Open in editor, start Claude session
[Paste the workflow prompt]

# Request plan from AI
"Generate a 3-stage plan for improving type-safety and modularity."

# Implement step-by-step
"Perform stage 1 only. Show diffs only."

# Run tests, evaluate output
"Generate missing tests. Identify performance bottlenecks."

# Compare later against alternative worktree
git diff main..exp/api-cleanup
```

Repeat for multiple variations, then merge only the winner.

---

## Final Recommendation

If you are working with AI refactoring or exploration frequently, make worktrees a standard part of your workflow. They provide safety, creativity, and reversibility — all essentials when collaborating with generative tools.

End every worktree session by asking:

```
Is this worktree branch worth merging back into main? Why or why not?
```
