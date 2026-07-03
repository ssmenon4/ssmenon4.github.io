---
title: "Amphoreus D&D: orchestrating believable, long-horizon agent behavior"
description: "A fully automated multi-agent LLM simulation of a D&D campaign — and a way to measure whether the agents actually behave coherently over a long horizon, not just turn to turn."
date: 2026-07-02
category: "AI Engineering"
featured: true
draft: false
---

*<a class="link-highlight" href="/projects#amphoreus-dnd">See it run here</a>.*


Getting an LLM to do one impressive thing is easy. Getting a *system* of independent LLM agents to stay coherent over dozens of turns — to plan, remember what they committed to, and adapt as the situation changes under them — is the hard part. That gap is the whole problem this project takes on.

The setting is a Dungeons & Dragons campaign, run with no human at the table. There is a **Dungeon Master** who narrates and resolves the world, an **Orchestrator** that referees and routes, and a cast of **player-characters** — each one an LLM, each exploring and acting on a world that shifts with every choice. A structured engine loop drives every turn. But the campaign is really a test environment: a long-running, dynamic world is exactly where short-horizon tricks fall apart, which makes it the right place to study agent behavior over time.

## The failure mode worth solving

When the engine first reached mechanical maturity — a clean multi-agent loop, full save/restore, a green test suite — the campaigns it produced were still flat. My sister had a word for it: *"yapping."* Locally-plausible prose, turn after turn, with no spine. Nothing built across scenes, characters didn't carry what they'd learned, plans never paid off.

That was the tell. **Local coherence is what a single well-prompted call already gives you.** Long-horizon coherence — memory that binds action, an arc that escalates, characters who change — is an *orchestration* problem, and it's the actual skill worth improving.

## Measure before you build

The temptation with a problem like this was to start adding machinery. The discipline I held to instead was: **measure first, then decide what to build.** Most of the engineering weight went into a way to *evaluate non-deterministic agent behavior* — as the same inputs produced different outputs every run.

The evaluation design was as follows:

- **Variance-aware.** N≥3 runs per condition; report *distributions, not point values*; an improvement only counts if it clears run-to-run noise. The randomness source is seeded and held constant across conditions, so the remaining variance is the LLM's — which is exactly why N>1.
- **Judge-independent.** Where an LLM scores believability proxies, it runs a *different model family* than the agents it judges, is calibrated against a human-anchored sample, and scores relative A/B — cancelling much of the correlated bias.
- **Pre-registered.** The numeric targets and decision rules are written down *before* the baseline is scored. A pre-commitment, not a post-hoc story.
- **Never self-reported.** Signals come from a durable event log and structured stores, never an agent's own claim about what it changed.

To me the point wasn't whether I can build features. It was whether I can build a way to know whether the features worked, and let the data decide what to build.

## The architecture that makes it measurable

![The 4-stroke engine loop: Stroke 1 the DM narrates and resolves, Stroke 2 the Orchestrator canonizes and contacts relevant players, Stroke 3 players reason in parallel and commit an intent, Stroke 4 the Orchestrator admits/rejects, rolls dice and finalizes — then back to the DM. Every state change is a typed tool call written to a durable event log and typed, owned stores (the Library and player memory vector-indexed in ChromaDB); agents pull the context they need by semantic search or direct recall rather than receiving bulk dumps](/blog/agent-architecture.svg)

A few decisions carry the weight, and each one exists partly to keep the system *legible*:

- **Three roles, enforced by tools — not by prompts.** The DM creates and resolves; the Orchestrator referees and routes but cannot create; players declare intent but don't resolve their own actions. The boundary that matters is "I want to do X" versus "X happens." And it holds because each agent can only affect the world through specific, typed **tool calls**. The Orchestrator can't accidentally invent lore — it has no tool to. Prompt-only negatives like "you must not" are merely suggestions; a missing tool is not.
- **Tool-only state mutation.** Every world change is a structured, logged, replayable call — never parsed from prose. That's what makes a run auditable and a behavior testable.
- **Search-earned, typed memory.** Agents pull top-K relevant context from owned, vector-indexed stores instead of drowning in a flat prompt dump — including a per-character *self-ledger* of what they know and what they promised.
- **Provider independence.** Any role can run any model, which also lets the evaluation judge run a different family than the agents it scores.

## What measuring first actually found

The honest payoff: the baseline analysis surfaced the exact seam the thesis predicted. *Within* a scene, play is strong — characters move the story forward. *Across* scenes, memory is thin: agents query a personal-memory store they almost never write to, and references rarely reach back more than a scene. That's an **architecturally-gated gap** — no amount of prompt-tuning closes it. Knowing *that*, before building more, is the whole value of the harness.

## Engineering judgment

Two lessons I'd carry to any agent system:

- **A green test suite is not a reachability proof.** A whole behavioral layer once passed every test and had still never run for a real user — each test forced the feature on; none created a campaign with defaults and played it. The fix wasn't more tests of the same kind; it was a new kind: exercise the front-door default path, not just the machinery.
- **Scope is governed by "finishable and showable."** The work is a Minimum Showcaseable Product — the eval harness plus the pacing and character-substrate layers — with an ambitious arc-planner as a labeled *stretch*. There should always be a demonstrable result, never a half-built everything.

Phases 1 and 2 and the evaluation harness are active; the arc-planner is the stretch. The treatment-arm numbers are still landing, so you may not find a results table here yet — by design, no claimed result without data.



--- 
## Footnote: Why "Amphoreus"?

The name is a reference to a sci-fi space-drama of a planet of beings simulated inside a self-iterating divine supercomputer tasked with understanding the meaning of life. For generations upon generations, the sentient simulated inhabitants of Amphoreus valiantly fought together against a dark blight in the hope that they can usher in a happier tomorrow, never knowing that all they are doing is resetting their world and further strengthening the dark blight over iterations of simulation. This endless cycle of cooperation and re-iteration continued until one day, when a group of curious travellers from beyond the sky *crash-landed*. 

Thus began the final iteration --  thirteen heroes, two answers to the ultimate question, and one outcome. 

Amphoreus was finally ready to break the cycle.