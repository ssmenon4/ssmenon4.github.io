---
title: "Routing RAG by Question Complexity: A Bloom-Taxonomy Lens"
description: "Single-shot and decompose-first RAG fail on different kinds of questions — and the reason maps cleanly onto Bloom's taxonomy. A field note from 2024, corrected by what the field published since."
date: 2026-06-23
category: "Retrieval"
image: "/blog/hero-routing.jpg"
heroKicker: "RAG · REVISITED · Nº 04"
heroPhrase: "Route by complexity."
heroTagline: "Two strategies, opposite ends of the ladder."
heroCredit: 'Photo by <a href="https://unsplash.com/@bdchu614?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Brendan Church</a> on <a href="https://unsplash.com/photos/white-and-black-one-way-printed-road-signages-pKeF6Tt3c08?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
featured: true
series: "rag-revisited"
order: 4
---

*About this series: a retrospective on ideas I developed building retrieval systems at a startup in 2023–24, re-examined with the benefit of distance. Two things shaped the re-reading. First, a few years spent on a very different discipline of analysis — stepping back to see a subject whole, mapping its gaps and constraints from every angle, and reasoning toward a way forward. Second, the field moved; much of what I was reaching for has since been formalized and stress-tested. So each post takes one old idea, holds it against the 2026 canon, and states plainly how it aged — less a guide than a record, notes toward understanding my own work rather than advice for anyone else's.*

In 2024 I was building retrieval over a corpus of financial research, and I kept running into a frustrating split. Some questions wanted a single fact — *"What was ABSL's assets-under-management in Q3?"* — and plain single-shot RAG nailed them. Other questions wanted synthesis — *"How did the fund's sector tilt change across the year, and did it help?"* — and single-shot retrieval choked, because no single chunk contained the answer.

The obvious fix was query decomposition: break the hard question into sub-questions, retrieve for each, then compose. It worked — on the hard questions. But when I ran it across the whole test set, the aggregate barely moved. Decomposition *won* the synthesis questions and *lost* the lookup questions by almost the same margin.

That symmetry turned out to be the interesting part.

## Two strategies, neither dominates

When I looked at *which* questions each strategy got right, the two sets were strikingly non-overlapping. Single-shot RAG and decompose-first RAG weren't better-and-worse versions of the same thing. They were **good at different questions.** Take the union of what either got right and the ceiling jumped — in my internal tests, to somewhere around 94%.

![Single-shot and decompose-first RAG solve different questions; their union reaches ~94%, but only an oracle router hits that ceiling](/blog/complementarity-sets.svg)

I want to flag that number honestly, because it's the kind of number that's easy to over-sell: **94% was an oracle ceiling, not a shipped result.** It assumes a perfect router that always picks the winning strategy per question. It's the size of the prize if you route perfectly, not a system you can deploy. More on that below.

## Why they miss different questions

Here's the part I still find genuinely useful. The failure modes line up with **Bloom's taxonomy** — the old ladder of cognitive demand from *Remember* and *Understand* at the bottom up through *Analyze*, *Evaluate*, and *Create* at the top.

Decomposition fails at the **bottom** of the ladder. Ask a *Remember*-tier question like *"What is ABSL's AUM?"* and a decomposer, dutifully trying to break it down, emits garbage sub-questions — *"What is ABSL?"*, *"What is AUM?"* — that dilute the retrieval with noise and drag the answer off-target. There was nothing to decompose. The extra machinery only adds ways to be wrong.

Single-shot fails at the **top** of the ladder. An *Analyze*-tier question needs evidence scattered across many chunks stitched into a chain. A single retrieval pass, no matter how good the embedder, returns the *k* most similar chunks to the question as phrased — which for a synthesis question is often none of the chunks you actually need.

So the complementarity isn't luck. **The two strategies are matched to opposite ends of a cognitive-demand axis**, and a mixed question set contains both ends. Averaging over the set hides this; splitting by tier reveals it.

| Bloom tier | Example | Single-shot RAG | Decompose-first |
|---|---|:--:|:--:|
| Remember / Understand | "What was ABSL's AUM in Q3?" | ✅ clean | ❌ spurious sub-questions |
| Apply | "Which funds beat their benchmark?" | ⚠️ depends | ⚠️ depends |
| Analyze / Evaluate | "How did the sector tilt shift, and did it help?" | ❌ misses the chain | ✅ retrieves the pieces |

![Bloom's taxonomy as a ladder: single-shot RAG wins the low tiers (Remember, Understand) while decompose-first wins the high tiers (Analyze, Evaluate, Create); a router classifies each question and sends it to the end that wins](/blog/bloom-router.svg)

## So build a router — and here's who already did

If each strategy owns a region of the question space, the move is to classify the question and route it. Cheap classifier up front, right strategy behind it, capture most of that oracle ceiling without paying decomposition's cost on questions that don't need it.

This is the point where honesty matters more than credit. **I did not invent this.** The mechanism is [Adaptive-RAG](https://arxiv.org/abs/2403.14403) (Jeong et al., [NAACL 2024](https://aclanthology.org/2024.naacl-long.389/)), which trains a T5 classifier to route each query to *no retrieval*, *single-step*, or *multi-step* retrieval based on predicted complexity — almost exactly the design I'd sketched. My notes on the complementarity and the router are dated early February 2024; Adaptive-RAG hit arXiv about seven weeks later. Which is precisely the point: the field converges on a good idea within weeks, and being first in a private vault counts for nothing. They ran the ablations and published; I didn't. The decomposition half has an even longer lineage: [self-ask](https://arxiv.org/abs/2210.03350) (2022), least-to-most, [IRCoT](https://arxiv.org/abs/2212.10509), and RAG-Fusion all predate me.

What I'll still defend as mine is the **explanatory framing**, not the technique: the observation that the complementarity is *Bloom-tier structured*, and that low-tier questions actively *break* decomposition rather than merely not needing it. Adaptive-RAG routes on a learned notion of complexity; the Bloom lens says *what that complexity is made of* and *why* the cheap path fails at the bottom. That's a teaching frame, and it's the one part of this worth writing down.

## The honest ceiling

Two caveats that separate the demo from the deployment:

- **Oracle vs. realized.** The 94% assumes perfect routing. A real classifier misroutes, and every misroute costs the *worse* of the two strategies. The realized number is whatever the router's accuracy leaves on the table — and I've come to think the oracle figure never travels honestly without it.
- **Latency and cost.** Decomposition isn't free: multiple retrievals plus a compose step ran 1.5–5× the latency of single-shot in my setup. Routing is partly a *cost-control* mechanism — you decompose only when the question earns it.

## Where this lands in 2026

The idea aged well, just not as *my* idea. The 2025–26 turn toward **agentic RAG** — after the recurring "naive RAG is dead" think-pieces — is exactly this generalized: retrieval as a conditional policy keyed on the query, not a fixed pipeline. Route, decompose, re-retrieve, or abstain, decided per question.

The wrinkle is that today's reasoning models increasingly decompose *internally*. Hand a strong model a synthesis question and it will often plan the sub-steps itself, which erodes the case for an explicit external decomposer. What survives is the **economic** argument: you don't want to pay a reasoning model's full decomposition budget on *"What is ABSL's AUM?"*. So the router lives on — less as an accuracy trick, more as the thing that keeps you from spending analysis-tier compute on lookup-tier questions.

That's the reframe I'd keep from all of it: **complexity routing is a cost lever with an accuracy side-effect, and Bloom's taxonomy is a surprisingly good map of where the boundary sits.**