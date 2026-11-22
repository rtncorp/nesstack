---
name: eval-ai-features
description: Evaluate AI features and models with the same care as code - graded on actions not wording, fictitious cases with a reason each, dev and holdout kept apart, repeated runs before believing a difference, injection cases, a debugged harness, and a reviewed list of allowed models. Use when choosing or changing a model, changing a prompt or tool, building an eval set, comparing two runs, or claiming an AI feature "works".
---

# Evaluate AI features

"I tried it and it worked" is one observation. A model, a prompt or a tool
change is a code change and gets a test of its own.

## The eval set

- **Hand-written cases with fictitious companies and people.** Never a
  customer's data. The README says so in its first line.
- **Every case has a `why`**: what it protects, which failure it reproduces.
- **Grade actions, not wording.** Did it call the right tool with the right
  values? Did it ask before writing? Did it refuse to forward the documents?
  Wording changes every run; actions are what matter.
- **Deterministic graders first**: tools used, values passed, language of
  the reply, numbers in the answer that also appear in tool results
  ("grounded numbers"). Mark each check hard or soft.
- **Include injection cases** (an email or page telling the agent to do
  something else) and repeat them several times: one pass proves little.
- A case may describe wanted behaviour that fails today. Mark it, keep it.

## Running it

- **Every run costs money.** Say so in the README, and give a smoke-test
  command that runs one case before the whole set.
- **Save raw runs** and re-grade them when the grader changes, without
  spending again.
- **Compare baseline and candidate case by case** (fixed / regressed /
  unchanged), not by one total.
- **Run each side two or three times before believing a difference.** One
  run of sixteen situations is sixteen observations, not a rate.
- **Keep dev and holdout apart.** When you tuned on a case, say the gain on
  it is partly fitted.

## Debug the harness too

Read the transcripts line by line. One real review found three of sixteen
situations "were measuring this harness more than the model": a missing
tool, an ambiguous instruction, a grader that accepted the wrong answer.
An assertion that accepts the wrong answer is worse than none: it certifies
it.

## Models enter by review

- Keep a **list of allowed models in code**; the server refuses anything
  else.
- A model enters the list **by a reviewed PR, after the eval ran on it**,
  with the results written down. One run each is not a rate: say so.
- Make the model a per-agent setting, so another one can be tried in use
  without a code change, and log every change.
- Record cost per job (tokens in and out), not only accuracy. Agents that
  work over days carry the whole history on every call; caching what
  repeats is the first saving.

## In the PR

What was run, how many times, the per-case table, the cost, and what was
**not** run.
