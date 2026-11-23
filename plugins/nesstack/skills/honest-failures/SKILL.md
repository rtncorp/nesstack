---
name: honest-failures
description: Make failures visible and distinguishable instead of plausible - fail closed, never turn an error into an empty result, keep "could not check" apart from "nothing there", and make error messages say what the other side actually answered. Use when writing error handling, a catch block, a fallback, a default value, an integration with an external API, a health check, or a UI empty state.
---

# Honest failures

The most expensive failure a system can have is a wrong answer that looks
right: no exception, no log, and a perfectly believable empty list.

## "Could not check" is not "nothing there"

```js
// Wrong: an error becomes an answer.
const networks = await db.query(sql).catch(() => []);
// The screen says "no network is turned on" while the network is on.

// Right: the error stays an error all the way to the person.
let networks;
try {
  networks = await db.query(sql);
} catch (err) {
  log.error({ err, route: 'networks' }, 'networks query failed');
  networks = null;            // null = could not check
}
// UI: null → "Could not check right now"; [] → "No network is on"
```

- A function that can fail returns something the caller can tell apart from
  a real empty result: `null`, an error, a status.
- **A helper that swallows a parse error and returns an empty accumulator is
  worse than one that crashes**: nobody can tell "no data" from "I could not
  read it".
- A UI empty state is only shown when the data was read and was empty.
- A component that can refetch checks for cached data before rendering an
  error, so one failed refresh does not throw away a good page.

## Fail closed

- Secret missing → the route is off (404/503), not open.
- Allowlist empty → the feature does nothing, not everything.
- Database error while reading a feature flag → the flag is off.
- Missing tenant or user context → refuse. Never fall back to a default
  tenant written in the code.
- A collector whose source can be absent **reports** the absence ("absent",
  "installing", "no permissions", "active") on every heartbeat. An absent
  dependency is a state, not a silent `return`.

## Errors say what the other side said

When an external call fails, the error carries what came back:

```
vendor API: HTTP 403, content-type text/html,
body starts "<!DOCTYPE html><title>Just a moment...</title>",
trace id 7f3c...
```

Not `Unexpected token '<' in JSON`. Status, content type, the first bytes of
the body and the vendor's own trace id let anyone, including the vendor's
support, find the same request. Never log the credential or the full body.

## Do not invent

- **Never invent missing history.** Rows created while a bug was live keep
  their empty fields; filling "who confirmed" with a guess is worse than the
  gap.
- **Never invent a reason.** A constant's comment states a measurement (with
  its date) or a decision (with who made it), not a plausible story.
- **Do not double up "just in case".** Two cache-busting mechanisms set
  together once broke every call to a vendor. Use the one standard mechanism
  and know why.

## A logged error is not always a failed write

Before calling a log line a bug, read the caller: it may be the first step of
a designed fallback. Check what the data says, not only what the log says.
