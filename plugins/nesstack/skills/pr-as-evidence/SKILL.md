---
name: pr-as-evidence
description: Work in small phases, one PR each, where the PR itself is the proof - acceptance criteria shown with test output, logs or screenshots, what is not proven said plainly, the rollout and rollback decided before coding, and commits that state the bug as a fact. Use when planning a feature, opening or describing a pull request, writing a commit message, or deciding how a risky change reaches users.
---

# The PR is the evidence

AI assistants write code fast. What slows a project down is not knowing
whether that code works. So the unit of work is a small PR that **proves**
what it claims, and nothing moves on until it has.

## One phase, one PR

- Split the work into phases, each with acceptance criteria written before
  the code.
- A good order: the specification (a doc), then the engine, then read-only
  views, then writes. Each piece is tried in use before the next starts.
- One PR per phase. A PR that does two things gets reviewed as neither.
- **Only the owner merges**, after writing "merge" for that PR, with CI green
  and every review read (see `review-before-merge`). An assistant never
  merges on its own judgment.

## Decide the rollout before writing code

Ask three questions and state the answer in one line before starting:

1. Does it change a contract (an API shape, what a client sends, a schema)?
2. Can it break or corrupt data, or take down something that works today?
3. Does it noticeably change what a user does on a screen?

- 1 or 2 is yes → behind a flag, per customer, off by default.
- only 3 is yes → a canary route or page.
- all no → a normal PR.
- unsure → ask the owner.

"On for everyone" means a PR that **removes** the flag, never a script that
turns it on for every customer: a loop skips one, and customers created
tomorrow have no row.

## The PR body

```markdown
## Summary
What changes and why. Name the failure mode it fixes and how it was
reproduced.

## Scope
What is in. What is deliberately out.

## Acceptance evidence
- `pnpm test`: core 214 passed, runtime 98 passed, against a real Postgres.
- Removed the ownership check: 4 tests fail. Restored: green.
- Screenshot of the new page (fictitious data).

## Not proven
- Not run against the live payment provider yet.

## Rollout
none / flag `<name>` / canary route — because ...
Rollback: revert, or turn the flag off.

## Risks
...
```

**Say what is not proven.** "No real model has been through this version
yet" is worth more than a confident summary. A reader who trusts your PR
because it never overclaims will read it faster.

## Commits that tell the story

- The title states the behaviour or the bug as a fact, in the imperative or
  as a finding:
  `fix(runtime): a correction withdraws the proposal it corrects`
- The body says **why**, not what (the diff says what). For a bug: symptom,
  cause, why the tests were green, fix, how verified.
- Never put real customer names, addresses, device ids or personal data in a
  commit or PR body. History is forever, and it is the first thing that gets
  pasted somewhere public.

## Anti-patterns

- A PR with a "Test plan" checklist nobody ticked.
- "Works on my machine" with no output.
- One long-lived branch carrying many unrelated PRs.
- A diagnostic route marked "temporary" that is still there months later.
  Give it a removal date in the PR that adds it.
