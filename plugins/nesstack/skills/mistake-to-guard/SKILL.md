---
name: mistake-to-guard
description: Turn every bug, incident or review finding into a written rule and an automated check that would have caught it. Use after fixing a bug that reached production, after a postmortem, when the same kind of mistake happens twice, or when someone proposes a rule that nothing enforces ("we should always...").
---

# From mistake to guard

> A comment in the memory file is not a guard. A check that fails the build is.

Every mistake is paid for once. If it only produces a fix, you pay for it
again the next time someone, or some model, makes it. The cycle is:

1. **Fix the instance.**
2. **Find the class.** Grep for every sibling of the bug, not only the line the
   reviewer named. "Correct about the instance and wrong about the class" is
   the most common way a fix fails.
3. **Write the rule** in the memory file with its reason (see
   `project-memory`).
4. **Build the guard**: a test, a lint or a CI step that fails on the old
   code.
5. **Prove the guard**: put the bug back and watch it fail (see
   `prove-it-fails`).

## Choosing the guard

| The mistake | A guard that works |
|---|---|
| A value forgotten on one of N sites | A test that enumerates the sites and checks each |
| A file overwritten from a stale branch | A registry of critical symbols that must still exist after the change |
| A version not bumped with a change | A CI check: changed under `agent/` → `VERSION` greater than main's |
| A dependency pulled unpinned | A lint that refuses a clone or image without a tag or digest |
| A query missing the tenant filter | A lint over every query, with an allowlist keyed by the query's content hash |
| A customer name leaked into the UI | A build check over the output against a list of private names |
| A workflow file broken and nobody noticed | A CI step that parses every workflow file |

Key an allowlist **by content, not by line number**. Line numbers shift on
every edit; a content hash expires exactly when the exempted code changes,
which is when it needs review again.

## The guard must be honest about what it proves

- A static check proves the text agrees, never what the code does at run
  time. Say which one your guard is.
- A guard that greps for a word tests the word. A check that searches for a
  pattern can be fooled by a comment, by backticks, by a line break. Run it
  against the broken code and see it fail before trusting its "OK".
- "The lint is clean" is a weaker claim than "no code has this bug". Do not
  report one as the other.

## Write the incident down where it will be read

The commit and PR that fix a production bug say, in this order:

1. the symptom, as the user saw it;
2. the cause;
3. **why the tests were green anyway**;
4. the fix and the guard;
5. how it was verified.

Title the commit with the bug stated as a fact, not "fix X":

```
The reconnect waited a sixth of what registration waits
```

The history then works as a searchable log of everything that ever broke.

## Anti-patterns

- A rule in the memory file and no check behind it, for a mistake that
  already happened twice.
- A fix with no test, followed by a second fix for the same thing.
- A chain of one-line "fix" commits guessing at an external API. Stop, write
  a test against a recorded real response, then fix once.
- Deleting a rule because it was inconvenient once. Change the rule if it is
  wrong; record why.
