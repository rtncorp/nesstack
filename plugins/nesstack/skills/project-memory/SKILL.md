---
name: project-memory
description: Write and maintain the project's memory file for an AI coding assistant (CLAUDE.md or AGENTS.md) - short rules with their reason, product invariants, dated decisions, and what must never go in it. Use when starting a project with an AI assistant, when the user says "remember this" or "save this to memory", when a decision is made in chat, or when the memory file is growing too long.
---

# Project memory

An AI assistant forgets everything between sessions. The memory file is the
only thing it reads every time, so it is where the way you work lives: the
rules, the decisions and the traps. Treat it as code: reviewed, versioned and
kept short.

## What goes in it

1. **Rules that always apply.** Numbered, imperative, one or two lines each.
   Who approves merges, which language the repository is written in, where
   secrets live, how to run the build and the tests.
2. **Invariants of the product.** What must hold whatever the feature is
   ("every table carries the tenant id", "an agent never sends without a
   check on the server"). These are the lines no PR may cross.
3. **Short how-tos for risky areas.** "Before touching the database", "before
   adding a route", "before changing what the AI may do". A checklist, not an
   essay.
4. **Decisions on record**, dated, with who decided and why (see below).
5. **A map of the code**: which folder holds what, and which doc explains it.

## Every rule carries its reason

A rule without a reason gets broken the first time it is inconvenient, by a
person or by the assistant. Write the incident that produced it:

```markdown
- Rebase on main immediately before every push to the shared routing file.
  A PR cut from an old base overwrote it and silently reverted three merged
  fixes (PR #NNN). Enforced by `lint/no-clobbered-symbols`.
```

The shape is **rule → why (incident, PR, numbers) → what enforces it**. If
nothing enforces it yet, say so; that is the next guard to build (see
`mistake-to-guard`).

## Decisions on record

```markdown
## Decisions on record (2026-03-14, retention)

- Audit log kept 90 days (owner). Five years was too long for what it is
  used for.
- Open: whether a corrected job counts once or twice. Proposed, not answered.
```

- Date and topic in the heading, the decider in parentheses, their own words
  when they matter.
- **Open questions are written as open.** "Proposed, not answered" stops the
  assistant from treating a guess as a decision.
- When a decision changes, keep the old line and point forward:
  "(replaced on 2026-03-20, see that day)". The history of why is worth more
  than a tidy file.

## What never goes in it

- **No credentials, ever.** Not "just for the lab". Secret scanners catch
  `key=value` shapes and miss a bare password in a sentence, so this rule is
  met when the line is written or not at all.
- **No personal data** about real people.
- **Remember the file is sent to the AI vendor** on every run. Anything in it
  leaves your network. Customer names, internal hosts and addresses belong in
  your secret store or your private runbooks, not here.

## Keep it short

A memory file that grows into an incident journal stops being read, by
people and by the model. When a section passes a screen:

- keep the rule and one line of why in the memory file;
- move the full story to a runbook or an ADR and link it.

## How to work with it

- When the user says "remember this", write it in the file in the same turn,
  in the right section, with the date, and show the diff.
- When a decision is taken in chat, propose the entry; do not wait to be
  asked.
- Before acting on an old line ("verified still open on <date>"), check the
  code. A note is only as good as its date.
- The memory file changes in the same PR as the code it describes.

## Starter template

```markdown
# Project memory

<One paragraph: what this is, who owns it, who approves changes.>

## Rules that always apply
1. One phase, one PR. Nothing merges without the owner's explicit "merge",
   and only with CI green.
2. Never a secret in code, chat, logs, PRs or this file.
3. Only fictitious data in tests, demos and screenshots.
4. A protection is proven by a test that fails without it.
5. Build before typecheck before test: `<command>`.

## Invariants
- ...

## Before touching <risky area>
- ...

## Decisions on record (YYYY-MM-DD)
- ...

## Layout
- `apps/` ...
```
