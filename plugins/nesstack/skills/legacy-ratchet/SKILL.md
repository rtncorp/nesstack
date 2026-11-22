---
name: legacy-ratchet
description: Improve an existing codebase without stopping it - a ratchet where new code is strict and old debt never grows, warnings where an AI could edit the wrong one of two lookalike files, migrations instead of runtime schema changes, pinned dependencies and a written argument for every ignored CVE. Use when working in a large or old codebase, a file with thousands of lines, a project with type errors or no tests, when adding dependencies, or when a vulnerability scanner fails the build.
---

# The legacy ratchet

You will rarely start clean. The rule for existing code: **every PR leaves
it no worse, and the new code is strict.**

## Islands of strictness

- If the whole project cannot pass a typecheck today, give each new module
  its own strict config (`tsconfig.<module>.json`, its own `check:<module>`
  script) that must stay at zero errors.
- For the rest, a ratchet: "11 errors before, 11 after, identical output".
  The PR does not fix old debt and does not add new debt.
- The same for lint warnings, test coverage and file size: record the
  number, fail CI if it goes up.

## Two lookalike places

When there are two files an AI could confuse (an old entry point that is no
longer deployed, a copy of a module), put the warning **where the assistant
will read it**: at the top of the dead file and in the memory file. Then
delete the dead path as soon as you can. One real case: a new route went
into the old, undeployed file and a sync silently shipped nothing for a
month.

In a shared hot file (one that many PRs touch), rebase on main right before
every push, and keep a registry of critical symbols that CI checks still
exist after the change.

## The schema lives in migrations

- Every schema change is a numbered migration, with a rollback. Applied
  migrations are never edited: add a new one.
- Not `CREATE TABLE IF NOT EXISTS` sprinkled through the runtime "as a safety
  net". That hides drift until a column is missing in one environment and a
  job re-notifies every five minutes.
- "Recorded as applied" is a claim about the migration ledger, not about the
  database. A migration that skips on a fresh database is not the same as one
  that was unnecessary: test migrations on a fresh database too.
- Keep migrations expand-only where you can, so old and new code both run
  during a deploy.

## Dependencies

- **Pin everything**: CI actions by commit SHA, images by digest, clones by
  tag or commit. Never pull the head of a moving branch into a build.
- A vulnerability scanner fails the build on critical findings.
- If a fix exists upstream, upgrade. If none exists, an ignore entry needs:
  the package, the upstream status, a reasoned argument that your code does
  not reach it, a compensating control, a tracker reference and a review
  date. Each one in its own PR.
- Wait before adopting a brand-new version (for example a minimum age of 14
  days), so a compromised release has time to be caught by others.

## Big files

A file of 15,000 or 30,000 lines is where AI edits go wrong: context is lost,
conflicts are resolved by keeping a stale copy, a symbol disappears. Do not
rewrite it in one go. Extract one module per PR, with its tests, and move the
callers over.
