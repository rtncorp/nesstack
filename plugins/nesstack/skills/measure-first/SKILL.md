---
name: measure-first
description: Measure before believing - probe the real system before building on a spec, state what result would disprove a hypothesis and check the instrument can show it, use a control group, date every number, and check which system and which version of the code actually answered. Use when debugging, diagnosing a slow or broken feature, integrating a third-party API or hardware, reading metrics, or about to say "it does not support X" or "it is fixed".
---

# Measure first

Most wrong answers in debugging are not bad reasoning. They are a confident
conclusion read from an instrument that could not have shown the thing being
asked about.

## Before a probe

1. **State the hypothesis.**
2. **State what result would disprove it.**
3. **Check the instrument can produce that result.** A query capped at 5,000
   rows cannot show a rare event; a count of distinct names cannot count
   interfaces when 73 devices all call theirs `eth0`.
4. **Add a control**: something you know is there, in the same query. If the
   control comes back empty too, the instrument is blind, not the system.

## Instruments that lie

- A **sample** read as a total (the first page, a capped facet, a 5-minute
  window over a rare event).
- A **denominator taken from the result**: if both sides of a ratio come from
  the filtered output, the ratio is an identity and proves nothing.
- A **window that does not match the data's span** (dividing 130 seconds of
  data by 5 minutes).
- A **truthiness check** on a value that can be the string `"Unknown"`.
  Grade the value, not whether it is truthy.
- An **exit status** that cannot tell "did nothing" from "succeeded".
- **The wrong machine**: a lost shell variable that ran the command locally.
  When a reading is physically implausible, ask which system answered.

## Probe the real thing before building on the spec

- Before writing an integration, run **read-only probe scripts** against the
  real API or hardware and answer named questions. Record what you measured,
  with the date and the version, in a notes file per vendor.
- **A measurement outranks a spec.** Specs omit routes that work and list
  fields that are configuration, not telemetry. Grade from payloads, never
  from field names, and remember the field's name is not the English word for
  it.
- **A negative needs more evidence than a positive.** "The API does not
  have X" from one surface, one idle device or one empty `200` is a claim
  about that surface, that device and that moment. An empty `200` proves the
  route is reachable and nothing else.
- An undocumented endpoint ships behind a failure path that degrades only
  itself, and is measured on more than one customer before it is trusted.

## Numbers carry their date

- **A number in a comment is a measurement with a date.** "8 GB comfortably
  covers the sort" was true when written, never re-measured, and became the
  cause of the next outage as data grew. Write the date and what it was
  sized against, so the next reader knows when it expired.
- **A measurement carries the state of the system it was taken on.** Before
  quoting a production number, ask what else was true that day (an
  incident, a migration, a full disk).

## Check what you read is current

- `git log -1` on the file you just read, and `git fetch` before trusting a
  clone. A checkout eighteen days old once "proved" a feature did not exist.
- A note saying "verified still open on <date>" is only as good as its date.
  Re-check the code before acting on it.

## When a panel is empty next to a full one

Compare what the two **read** (table, permissions, query) before theorising
about the producer. The answer is often in the same screenshot.
