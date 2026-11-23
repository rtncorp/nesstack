---
name: review-before-merge
description: Before merging any PR, read every place a review can land (PR comments, reviews and inline review threads), answer each finding on its merits, use more than one reviewer, and stop if anything is unanswered. Also how to ask an AI assistant to fix review findings safely. Use before merging, when a review bot or a person posts findings, when two reviewers disagree, or when writing a fix request on a PR.
---

# Review before merge

The single most repeated mistake across our projects: **merging with green
CI while review findings were still open.** One PR merged one minute after a
reviewer posted two findings. Another was merged three minutes before the
reviewer's high-severity finding arrived. Another went in with four findings
unread, one of them giving any branch the deploy credentials. Each needed a
follow-up PR, and one bug reached users first.

## Read all three surfaces, right before the merge

Reviews land in three different places, and each tool shows only some:

1. **PR comments** (top-level). Some review bots post their whole review
   here, under the owner's own login.
2. **Reviews** (the review summaries and states).
3. **Review threads** (inline comments on lines).

Read all three **immediately before merging**, even with CI green and the
owner's "merge" in chat. Automated reviewers often arrive minutes after the
PR opens or after a push. If anything is unanswered, or disagrees with what
was said in chat, **stop and ask**.

## Use more than one reviewer

- The tool that writes the code is not the tool that reviews it.
- Run at least one code reviewer and one security reviewer. A good security
  review gives findings ranked by severity, with file and line, why it
  matters, and a suggested fix.

## Answer every finding on its merits

Neither a bot nor a majority is authoritative. For each finding:

| The finding is | Do |
|---|---|
| Correct | Fix it in the same PR, with a test built from the reviewer's exact input. Reply with the commit. |
| Wrong (missed context, misread design) | Reply with the reasoning. Do not fix, and do not merge silently. |
| Ambiguous | Ask the owner. |
| Already handled | Say where. |
| Two reviewers disagree | Verify against the code, run it if you can, and record who was right and why. Never decide by majority. |

Reply per finding: **Fixed** (commit), **Partly** (what is left), **Not
done** (why). When fixing, grep for every other place with the same bug: the
reviewer names one instance, the class is usually bigger.

## When the decision is not the assistant's

Some findings close only with the owner's decision (accepting a risk,
changing a rule). The assistant writes "Not mine to close: I asked the owner"
and leaves it open, recorded in the risk tracker (see `secrets-and-fake-data`
for the tracker).

## Asking an assistant to fix findings

Post one numbered comment with hard limits:

```markdown
@assistant please fix the findings below on this PR.

Rules:
- Do NOT merge and do NOT deploy.
- Normal commits only: no force-push, no rebase.
- Add a test for each fix and show it failing without the fix.
- Leave item 4 open: closing it is the owner's decision.
- Reply per item: Fixed / Partly / Not done, with the reason.

1. (High) ...
2. (Medium) ...
```

## Review budget

Declare how many review rounds a PR gets. A finding after the budget closes
still gets fixed; further rounds go to a follow-up PR, so one PR does not
grow forever.
