# AI Coding Workflow Cheatsheet

Inspired by: "How I Code With AI Right Now"

## Core Workflow

1. Start with planning before writing any code.
2. Refine the plan collaboratively with the AI.
3. Implement in small steps instead of generating full files.
4. Review and iterate frequently rather than deferring cleanup.

## Planning First

* Always request a plan before code generation.
* Confirm architecture, data flow, interfaces, and constraints.
* Ask the model to summarize what it understands before proceeding.
* Adjust the plan before implementation begins.

### Example prompts

* Plan the approach before writing code.
* Summarize what you understand about the task.
* Identify missing context, unknowns, or risks.

## Diffs Over Rewrites

* Prefer patches instead of full-file regeneration.
* Keep changes minimal to maintain clarity.
* Review diffs manually before applying.

### Example prompts

* Modify only the parts affected by the change.
* Show the diff only, do not rewrite the entire file.
* Provide before/after sections for clarity.

## Branching and Exploration

* Use branches or worktrees to test different approaches.
* Maintain a clean main or trunk branch.
* Compare alternate implementations and choose the best path.

### Example prompts

* Propose two alternative implementations and compare them.
* Create a simplified version first, then extend it.

## Model Selection

Use different models for different phases.

| Workflow Step             | Model Type        | Purpose                                |
| ------------------------- | ----------------- | -------------------------------------- |
| Architecture and planning | Reasoning-focused | Better structural thinking             |
| Iteration and debugging   | Fast model        | Higher speed during development cycles |
| Final review and refactor | Accurate model    | Catches edge cases and quality issues  |

## Testing and Validation

* Generate tests after changes are applied.
* Use tests to detect hallucination and incorrect implementations.
* Validate expected behavior at every iteration.

### Example prompts

* Write unit tests for the new function.
* Validate correctness and identify failure cases.
* Suggest edge cases the current code may not handle.

## Code Review with AI

* Ask the AI to critique the code independently of generation.
* Request improvement suggestions and tradeoffs.
* Use structured feedback: clarity, complexity, performance, maintainability.

### Example prompts

* Review this code like a senior engineer.
* List concerns as bullet points.
* Recommend improvements and justify them.

## End-of-Session Habit

* Capture newly discovered decisions or patterns.
* Update the plan or documentation before stopping work.

### Example prompt

* Is there anything that needs to be added back into the plan?

---

Use this sheet as a reference when coding with AI-based development tools such as Claude Code, Cursor, or other LLM-driven IDEs.
