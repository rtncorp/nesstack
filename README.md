# nesstack

**How RTN builds software with AI assistants.** Twelve skills for Claude Code
(and any assistant that reads `SKILL.md` files) that teach a way of working,
not a framework: remember the rules, prove what you claim, read every review,
keep secrets out, and let AI agents act only inside limits the server holds.

[Español](README.es.md)

It comes from four production apps built at RTN with AI assistants: a
multi-tenant observability platform, a CRM with AI agents, a multi-tenant
Wi-Fi portal, and an agents-as-a-service platform. Nothing from their code,
data or infrastructure is in this repository. What is here is the method, and
the mistakes that shaped it.

## The idea in one line

> A comment in the memory file is not a guard. A check that fails the build is.

Good instincts first show up as habits. Then something breaks. Only when the
habit becomes a written rule, with its reason, **and** a check that fails
without it, does it become reliable. Every skill here is one of those cycles.

## The skills

Learn them roughly in this order.

| # | Skill | What it teaches |
|---|---|---|
| 1 | [`project-memory`](plugins/nesstack/skills/project-memory/SKILL.md) | The memory file (CLAUDE.md): short rules with their reason, dated decisions, what never goes in it |
| 2 | [`pr-as-evidence`](plugins/nesstack/skills/pr-as-evidence/SKILL.md) | One phase, one PR; the PR proves what it claims; rollout decided before code |
| 3 | [`review-before-merge`](plugins/nesstack/skills/review-before-merge/SKILL.md) | Read comments, reviews and threads right before merging; answer each finding on its merits |
| 4 | [`prove-it-fails`](plugins/nesstack/skills/prove-it-fails/SKILL.md) | Remove the protection, watch the test fail; test against the real thing |
| 5 | [`green-means-ran`](plugins/nesstack/skills/green-means-ran/SKILL.md) | Every suite in CI, skips fail in CI, "why was the suite green?" |
| 6 | [`mistake-to-guard`](plugins/nesstack/skills/mistake-to-guard/SKILL.md) | Every bug leaves a rule and a check that would have caught it |
| 7 | [`secrets-and-fake-data`](plugins/nesstack/skills/secrets-and-fake-data/SKILL.md) | Secret manager only, what scanners miss, fictitious data, the risk tracker |
| 8 | [`honest-failures`](plugins/nesstack/skills/honest-failures/SKILL.md) | Fail closed; "could not check" is not "nothing there" |
| 9 | [`measure-first`](plugins/nesstack/skills/measure-first/SKILL.md) | Probe the real system; instruments that lie; numbers with dates |
| 10 | [`narrow-agents`](plugins/nesstack/skills/narrow-agents/SKILL.md) | AI agents with one job, a goal instead of steps, limits on the server |
| 11 | [`eval-ai-features`](plugins/nesstack/skills/eval-ai-features/SKILL.md) | Evals graded on actions, repeated runs, models enter by review |
| 12 | [`legacy-ratchet`](plugins/nesstack/skills/legacy-ratchet/SKILL.md) | Strict new code, debt that never grows, pinned dependencies |

Each skill also has a Spanish version for reading in
[`docs/es/skills/`](docs/es/skills/). The assistant uses the English
`SKILL.md` and answers in whatever language you write to it.

## Install

In Claude Code:

```bash
/plugin marketplace add rtncorp/nesstack
```

```bash
/plugin install nesstack@nesstack
```

The skills load on their own when a task needs them (opening a PR, fixing a
bug, adding a test, building an agent). You can also ask for one by name:
"use the review-before-merge skill on this PR".

Without the plugin system, copy any `plugins/nesstack/skills/<name>/` folder
into your project's `.claude/skills/`.

## Skills and your CLAUDE.md work together

- **Your project's memory file** holds the facts of that project: its
  invariants, its decisions, its map, its traps. It loads on every turn.
- **These skills** hold the method, the same for every project. They load
  only when the task needs them.

Keep the rules that must apply on every turn (who merges, no secrets, only
fictitious data) as one line each in your memory file, even though a skill
explains them in depth: a skill loads when the model judges it relevant, and
a safety rule cannot depend on that.

## Who this is for

People starting to build real software with an AI assistant, "vibe coding"
included, who want the speed without shipping what nobody checked. None of
this needs a big team: it needs a habit of asking for proof.

## Contributing

One change, one PR, with the reason. A new rule says which mistake it comes
from. Examples use fictitious names and the documentation ranges for
addresses (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`,
`00:00:5E:00:53:xx`). CI refuses anything else (`scripts/check-no-leaks.mjs`).

## License

MIT. See [LICENSE](LICENSE).
