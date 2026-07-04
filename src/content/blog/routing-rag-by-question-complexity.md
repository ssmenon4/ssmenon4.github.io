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

> *About this series: a retrospective on ideas I developed building retrieval systems at a startup in 2023–24, re-examined with the benefit of distance. Two things shaped the re-reading. First, a few years spent on a very different discipline of analysis — stepping back to see a subject whole, mapping its gaps and constraints from every angle, and reasoning toward a way forward. Second, the field moved; much of what I was reaching for has since been formalized and stress-tested. So each post takes one old idea, holds it against the 2026 canon, and states plainly how it aged. This is less of a guide and more a record, notes toward understanding my own work rather than advice for anyone else's.*

In early 2024 I was building retrieval over a corpus of financial research, and I kept running into a frustrating split. Some questions like *"What was ABSL's assets-under-management in Q3?"* wanted a single fact, and plain single-shot RAG nailed them. Other questions like *"How did the fund's sector tilt change across the year, and did it help?"* wanted synthesis. The single-shot retrieval choked on these questions, and understandably so: no single chunk contained the answer after all.

The obvious fix was query decomposition: to break the hard question into sub-questions, retrieve for each, then compose. It worked as expected on the hard questions. When I ran it across the whole test set however, the aggregate barely moved. Decomposition *won* vs. the synthesis questions and *lost* to the lookup questions by almost the same margin.

That symmetry turned out to be the interesting part.

## Two strategies, neither dominates

When I looked at *which* questions each strategy got right, the two sets were strikingly non-overlapping. Single-shot RAG and decompose-first RAG weren't better-and-worse versions of the same thing, they were **good at different questions.** Take the union of what either got right and the ceiling jumped — in my internal tests, to somewhere around 94%.

![Single-shot and decompose-first RAG solve different questions; their union reaches ~94%, but only an oracle router hits that ceiling](/blog/complementarity-sets.svg)

I want to flag that number honestly, because it's the kind of number that's easy to over-sell: **94% was an oracle ceiling and not a shipped result.** It assumes a perfect router that always picks the winning strategy per input query. It's the size of the prize if you route perfectly, and not a system you can deploy, but more on that below.

## Why they miss different questions

Here's the part I still find genuinely useful: the failure modes line up with **Bloom's taxonomy**; the old, well-known theoretical ladder of cognitive demand from *Remember* and *Understand* at the bottom up through *Analyze*, *Evaluate*, and *Create* at the top.

Decomposition fails at the **bottom** of the ladder. Ask a *Remember*-tier question like *"What is ABSL's AUM?"* and a decomposer, dutifully trying to break it down, ends up emitting garbage sub-questions — *"What is ABSL?"*, *"What is AUM?"* — that dilute the retrieval with noise and drag the answer off-target. There was nothing to decompose. The extra machinery only adds ways to be wrong.

Single-shot instead fails at the **top** of the ladder. Answering *Analyze*-tier question requires gathering evidence scattered across many chunks and synthesising everything into one big picture. A single retrieval pass, no matter how good the embedder, returns the *k* most similar chunks to the question as phrased — which for a synthesis question is often none of the chunks you actually need.

So the complementarity is not a chance occurrence. **The two strategies are matched to opposite ends of a cognitive-demand axis**, and a mixed question set contains both ends. Averaging over the set hides this; splitting by tier reveals it.

| Bloom tier | Example | Single-shot RAG | Decompose-first |
|---|---|:--:|:--:|
| Remember / Understand | "What was ABSL's AUM in Q3?" | ✅ clean | ❌ spurious sub-questions |
| Apply | "Which funds beat their benchmark?" | ⚠️ depends | ⚠️ depends |
| Analyze / Evaluate | "How did the sector tilt shift, and did it help?" | ❌ misses the chain | ✅ retrieves the pieces |

![Bloom's taxonomy as a ladder: single-shot RAG wins the low tiers (Remember, Understand) while decompose-first wins the high tiers (Analyze, Evaluate, Create); a router classifies each question and sends it to the end that wins](/blog/bloom-router.svg)

## Building a router — and those who already did

If each strategy caters to a region of the hypothetical question space, the move would be to classify the question and route it. A structure like a cheap classifier up front plus the right strategy behind it, would capture most of that oracle ceiling without paying the additional cost of the decomposition process on questions that don't need it.

Regrettably, **I cannot claim to have invented this.** The mechanism is now known as [Adaptive-RAG](https://arxiv.org/abs/2403.14403) (Jeong et al., [NAACL 2024](https://aclanthology.org/2024.naacl-long.389/)), which trains a T5 classifier to route each query to *no retrieval*, *single-step*, or *multi-step* retrieval based on predicted complexity — almost exactly the design I'd sketched. My notes on the complementarity and the router are dated early February 2024, and Adaptive-RAG hit arXiv about seven weeks later. This was a valuable but painful lesson to me: the field converges on a good idea within weeks, and being first in a private vault counts for nothing. They ran the ablations and published; I didn't. The decomposition half has an even longer lineage: [self-ask](https://arxiv.org/abs/2210.03350) (2022), least-to-most, [IRCoT](https://arxiv.org/abs/2212.10509), and [RAG-Fusion](https://adrianraudaschl.com/blog/forget-rag-the-future-is-rag-fusion/) all predate me.

What I'll still defend as mine though is the **explanatory framing**: the observation that the complementarity is *Bloom-tier structured*, and that low-tier questions actively *break* decomposition rather than merely not needing it. Adaptive-RAG instead routes on a learned notion of complexity; the Bloom lens says *what that complexity is made of* and *why* the cheap path fails at the bottom. That's a teaching frame, one I believe still holds value and novelty.

## The honest ceiling

There are two caveats that separate the demo from the deployment that need to be pointed out:

- **Oracle vs. realized.** The 94% assumes perfect routing. A real classifier misroutes, and every misroute costs the *worse* of the two strategies. The realized number is ultimately whatever the router's accuracy leaves on the table.
- **Latency and cost.** Decomposition is not a 'free lunch': multiple retrievals plus a compose step ran 1.5–5× the latency of single-shot in my setup. Routing is partly a *cost-control* mechanism; you should decompose only when the question truly needs it.

## Where this lands in 2026

The idea aged well, just largely not as *my* idea. The 2025–26 turn toward **agentic RAG** after the recurring "naive RAG is dead" think-pieces is basically this notion generalized: retrieval as a conditional policy keyed on the query, instead of a fixed pipeline. Route, decompose, re-retrieve, or abstain, decided per question.

The twist is that today's reasoning models increasingly decompose *internally*: Hand a strong model a synthesis question and it will often plan the sub-steps itself, which weakens the case for an explicit external decomposer. What survives however is the **economic** argument: you'd ideally not want to pay a reasoning model's full decomposition budget on *"What is ABSL's AUM?"*. So I'd say the router lives on, but less as an accuracy trick and more as the thing that keeps you from spending analysis-tier compute on lookup-tier questions.

If I had to frame a key takeaway from all this: **complexity routing is a cost lever with an accuracy side-effect, and Bloom's taxonomy is a surprisingly good map of where the boundary sits**...

...and also to **put out arXiv pre-prints of your ideas with sufficient benchmarking.** 

Better luck next time I guess :p