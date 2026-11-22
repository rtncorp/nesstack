---
name: secrets-and-fake-data
description: Keep secrets and real data out of the repository, chat, logs and AI context - a secret manager only, a secret scanner plus knowing what it misses, fictitious data in every test and demo, a leak guard for customer names, and a tracker for accepted risks and open findings. Use when handling credentials or API keys, writing fixtures, seeds, demos or screenshots, pasting logs, or when a review finding cannot be fixed right away.
---

# Secrets and fake data

## Secrets

- **Secrets live in a secret manager only** (your cloud's secret store,
  `wrangler secret put`, the CI's encrypted secrets). Never in code, config
  files, the memory file, chat, PR bodies, logs or fixtures.
- **Run a secret scanner over the whole history in CI** (for example
  gitleaks). Then remember **what it cannot see**: it catches `key=value`
  shapes and misses a bare password in a sentence. A plaintext database
  password was once committed inside a handoff doc and the scanner said nothing.
  So the rule "never a secret in text" is met when the text is written, by
  the person or the assistant writing it.
- **In the database, store a reference, not the value**: `env:VENDOR_API_SECRET`
  rather than the secret itself.
- **Scripts read keys from the environment**, prompted with `read -rs`, never
  as a command-line argument (it lands in shell history and process lists).
- **Never put a key in a URL** (`?key=...`): it lands in logs, proxies and
  browser history. Use a header, and compare with a constant-time function.
- **One key, one job.** An encryption key is never also a password, a token
  or a signing secret.
- **Fail closed:** if a secret is not set, the feature is off (404/503), not
  open.
- **Placeholders are labelled** as not being credentials, so nobody wonders.

## Data

- **Only fictitious data** in tests, fixtures, seeds, demos, evals and
  screenshots: "Acme Logistics", "Blue Harbor Cafe", `fan@example.com`,
  IP addresses from the documentation ranges (`192.0.2.0/24`,
  `198.51.100.0/24`, `203.0.113.0/24`), MAC addresses from
  `00:00:5E:00:53:00/24`.
- **No real customer names, hostnames, addresses, device ids or personal
  data in commits or PR bodies.** History is permanent and gets copied.
- **A leak guard for names.** Keep the list of private names (customers,
  sites) out of the repository, in CI's secrets, and fail the build when one
  appears in the output. Classify what it finds instead of a silent
  allowlist: a leak fails; a stored value in its rightful place, or a
  mention in a comment, passes **and is printed**, so nothing hides in a list
  nobody reads again. The first run of such a guard in one of our apps found
  20 leaks beyond the one that prompted it.
- **What you paste into an AI reaches its vendor.** Logs, tables and
  screenshots go through the redaction you would apply before sending them
  outside the company.

## The risk tracker

Not every finding gets fixed today. The ones that do not are written down,
never forgotten:

```markdown
| Id | Finding | Severity | Source | Owner | Target | Status |
|----|---------|----------|--------|-------|--------|--------|
| O12 | Session cookie set without SameSite | Medium | Security review of #NNN | Eng | next sprint | Open |

| Id | Accepted risk | Compensating control | Accepted by | Date |
|----|---------------|----------------------|-------------|------|
| R3 | Uploaded files are not virus-scanned | Size and type limits, files never executed or served inline | Owner | 2026-03-14 |
```

- A PR that leaves a review finding open, or accepts a risk, adds the row in
  the same PR.
- A closed item names the PR that closed it and is never deleted.
- Only the owner accepts a risk. An assistant proposes the row and asks.
