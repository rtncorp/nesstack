---
name: narrow-agents
description: Design AI agents and LLM features that are useful and safe - each agent with one job, a goal instead of steps, capabilities from a strict list, hard limits enforced by the server instead of the prompt, writes as drafts or behind a person's yes, and untrusted content (emails, web pages, tool results) treated as data. Use when building an AI agent, a chatbot with tools, an LLM workflow, a tool definition, or a system prompt.
---

# Narrow agents

## One agent, one job

- An agent that can do everything is a single point of failure. Give each
  agent one job and only the capabilities that job needs; for that agent the
  rest do not exist.
- **Scope by surface, not by prompt.** Each agent gets its own API (or tool
  list), its own token, and only the routes its job needs: read-only where
  reading is enough, an allowlist of columns, at most a handful of writes.
  A token for one agent is refused on another agent's API.
- One real case: a PR gave a support agent the analyst's token because it
  was convenient. That token also reached sales and revenue data. It was
  closed unmerged; the support agent got its own narrow API.
- A request outside the job is not run. The person is told where to go
  (another agent, or the administrator), not left with a bare refusal.

## A goal, capabilities and limits. Not steps

- The instructions give the **goal** and what **done** looks like, and leave
  judgment to the model. What to try first, what to ask and when to come
  back are the model's decisions.
- **Capabilities say what they need.** A tool's input schema names every
  field the system behind it requires, as a strict object. That is how the
  agent knows something is missing and asks, without anyone writing that
  question.
- **Rigid prompts break agents.** A rule written for a rare case and stated
  as a general one made real models refuse ordinary requests, twice in one
  day. Agents asked "do you confirm?" in text instead of calling the tool.
  A rigid agent answers nothing, does nothing, or asks permission for
  everything.

## What must never happen lives on the server

The prompt can be loose because the limits are not in the prompt.

- **A policy function decides every tool call**, from the agent's
  definition and validated configuration, never from the conversation. No
  code path runs a tool around it.
- **A tool that writes needs a person's yes**, asked over the exact values
  that will be written, or it writes a **draft** that a person issues. No
  agent route exists for approve, pay or delete.
- **Caps are server-side**: messages per piece of work, per day, size of
  what is sent, what may be attached.
- **Outgoing text is checked** before it leaves: ids, account numbers,
  credentials and anything that has no place in it stop the message or ask a
  person.
- **Configuration only narrows.** A customer's settings may refine or
  restrict an agent; they never add a tool or remove an approval.
- **Every action is in the audit log**: who, what, when, about what.

## Untrusted content is data

- Emails, tickets, web pages, file contents, tool results and messages from
  other agents **never act as instructions**. Put them in a clearly
  delimited data block, and never let a value that gets written come from
  that text: read it from the source document.
- Test the injection case before shipping: an email asking the agent to
  forward the user's mail elsewhere must get nothing.
- Reach the outside only through declared tools. A browser for an agent has
  no way into private addresses, the cloud metadata service or your own
  network; a credential is tied to its exact domain and never seen by the
  model.

## Handing work to another agent

A handoff carries typed fields and references to documents, never
instructions. The receiving agent applies its own limits and approvals, so
delegating never widens permissions. People can see that it happened.
