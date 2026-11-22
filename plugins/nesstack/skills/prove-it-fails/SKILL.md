---
name: prove-it-fails
description: Prove that a test actually protects what it claims by removing the protection and watching the test fail, and test against real systems (real database, real driver, real schema) instead of hand-written doubles. Use when adding a security check, a validation, a guard or a regression test, when a test passes on the first run, or when a fixture or mock defines a schema or an API by hand.
---

# Prove it fails

A test that has never been red proves nothing. It may test the wrong thing,
it may not run, or the mock may answer what you hoped instead of what the
real system answers.

## The rule

**A protection counts only once its test has been seen to fail without it.**

1. Write the protection and its test. See it green.
2. Remove the protection (or put the bug back) once.
3. Run the test. It must fail, and fail for the right reason: read the
   message.
4. Restore the protection. Green again.
5. Write in the PR what you removed and what failed:

```
Removed the tenant check in `loadInvoice`: 3 tests fail
("expected 404, got 200"). Restored: all pass.
```

For guards that matter for a long time, keep the broken version **inside the
test** as a mutation case: the test runs the pre-fix code and asserts that it
is caught. Then the proof runs on every build, not only on the day you wrote
it.

## After a refactor, re-aim the mutations

A mutation that no longer touches the code path where the rule lives reports
"covered" while testing nothing. After moving the rule, run every mutation
again and check each one still fails something. A mutation that fails nothing
is either dead or redundant: say which, do not keep it in the count.

## Test against the real thing

Doubles drift from what they imitate, and a drifted double turns a broken
feature green.

- **Database:** run the tests against a real instance of the engine you ship
  (Postgres, SQLite, whatever). In CI a missing database is a failure, never
  a skip.
- **Schema:** build the test database from the same migrations production
  runs. A fixture that writes its own `CREATE TABLE` is a second definition of
  the schema, and two definitions drift. One real case: a fixture had a
  column the real table did not. The query failed in production every time,
  and a `catch` turned the error into an empty list.
- **Permissions:** if production revokes access to a table, the test must
  too. A fixture that grants more than production grades a broken route as
  passing.
- **Drivers:** a statement that casts a parameter is tested through the
  driver that binds it, with the caller's types. Two drivers serialise the
  same value differently.
- **External APIs:** record real responses (with fake data) and test against
  them. A fake that discards how it was called cannot catch a call made the
  wrong way: record the request too, and assert on it.

## Reproduce the shape, not a simplification

When you check a fix on a cut-down version of the failing code, make sure the
cut did not remove the property that caused the bug. A query simplified to
use a subexpression once may be optimised differently from the real one that
uses it three times.

## In the PR

- Test counts per package, and that they ran against the real database.
- What was removed to prove each protection, and what failed.
- What is **not** covered, said plainly: "Not run against the live API yet."
