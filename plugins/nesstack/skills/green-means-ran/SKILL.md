---
name: green-means-ran
description: Make sure a green CI means the tests actually ran - every test suite wired into CI, skips that fail loudly, one named step per invariant, and a "why was the suite green?" analysis after every bug that reached production. Use when setting up or changing CI, when adding a test script, when a bug shipped despite passing tests, or when a CI run is suspiciously fast or quiet.
---

# Green means it ran

The most expensive green is the one where nothing was checked. It happens
three ways: a suite exists and CI never calls it; a suite skips because a
dependency is missing; or a summary hides which check failed.

## Every suite is in CI

- Every test script in the project (`test:*`, every `*_test.go`, every
  folder of tests) is called by CI. Add a CI check that lists the scripts and
  fails if one is not wired in. Real cases: a critical service had no CI at
  all ("they only ran if someone remembered"), and later two more suites were
  found in `package.json` that nobody ran.
- Test that check too: give it a fixture of a script that is not wired and
  watch it fail.

## A skip is a failure in CI

- If the test database, a credential or a service is missing, the test
  **fails** in CI. Locally a skip is fine; in CI it is a lie that reads as
  success.

```js
if (!process.env.TEST_DATABASE_URL) {
  if (process.env.CI) throw new Error('TEST_DATABASE_URL missing in CI');
  test.skip('no database locally');
}
```

## One step per invariant, named in words

Run each suite as its own CI step, named after what it protects:

```yaml
- name: A pass is delivered by email, never on the screen
  run: node scripts/test-pass-delivery.mjs
- name: A tenant never reads another tenant's rows
  run: npm run test:isolation
```

With `a && b && c` the summary says only "failed". With named steps the red
line tells you which rule broke, before you open a log.

## CI checks itself

- Parse every workflow file in CI. A job defined twice, or a typo in a
  trigger, can stop deploys silently: one real case had nothing deploying for
  days because a workflow file was broken and nothing read it.
- A container smoke test: the service refuses to start with no config,
  answers its health check, and rejects an unsigned request.
- A build step that compiles everything (`--dry-run` deploy, full typecheck)
  catches the broken import no unit test imports.

## "Why was the suite green?"

Every bug that reached production answers this in its PR, and the answer
changes a test, not only the code:

- the test used a double that did not behave like the real thing;
- the test existed and CI never ran it;
- the assertion checked the presence of a value, not the value;
- the fixture had a different schema from production;
- nothing tested that path at all.

## Anti-patterns

- Merging without looking at a failing run on the branch.
- "Flaky, re-run it" without finding out why.
- Disabling, skipping or quarantining a test to get green. Never.
