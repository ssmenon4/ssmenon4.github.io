---
title: "You Can't Retrieve What You Didn't Index: Coverage-Bounded Recall"
description: "In a query-indexed store, retrieval recall is capped by how completely you represent each chunk — no reranker downstream can recover what the representation left out. A 2023 instinct, and the 2026 correction."
date: 2026-06-15
category: "Retrieval"
image: "/blog/hero-coverage.png"
series: "rag-revisited"
order: 2
---

*About this series: a retrospective on ideas I developed building retrieval systems at a startup in 2023–24, re-examined with the benefit of distance. Two things shaped the re-reading. First, a few years spent on a very different discipline of analysis — stepping back to see a subject whole, mapping its gaps and constraints from every angle, and reasoning toward a way forward. Second, the field moved; much of what I was reaching for has since been formalized and stress-tested. So each post takes one old idea, holds it against the 2026 canon, and states plainly how it aged — less a guide than a record, notes toward understanding my own work rather than advice for anyone else's.*

Here's a bug that cost me a week in late 2023. A user would ask a question whose answer was *verbatim in the corpus*, sitting in a chunk we had definitely indexed — and retrieval would miss it. Not rank it low. Miss it entirely, out of the top fifty. The chunk was there. The words were there. The retriever simply never surfaced it.

The reflex is to blame the reranker, or the top-*k*, or the embedding model. But the reranker can only reorder what retrieval hands it, and retrieval can only find a chunk through **the representation you indexed it by.** If that representation doesn't encode the fact the user is asking about, the chunk is unreachable, and nothing later in the pipeline can save it.

That's the whole idea, and it's worth stating as a bound:

> In a query-indexed store, recall is upper-bounded by how completely a chunk's representation covers the information inside it. An information quantum that no representation touches is not "hard to retrieve" — it's *invisible.*

## The failure is upstream of everything I was tuning

Most of my debugging happened at the wrong layer. I tuned *k*, swapped rerankers, tweaked prompts — all downstream of retrieval. But if the ceiling is set by representation coverage, those knobs only rearrange results *under* a cap they can't lift.

The mental model I settled on: think of each chunk as carrying a set of answerable facts, and each indexed representation as covering some subset of them. Recall for a question is the chance its target fact falls inside the covered subset. Widen the coverage and you raise the ceiling; leave a fact uncovered and it doesn't matter how good the rest of your stack is.

![A chunk is a set of answerable facts; the indexed representation covers only a subset. A fact outside that subset is invisible — no reranker downstream can recover it, so recall is bounded by coverage](/blog/coverage-set.svg)

## What I reached for — and what those things are actually called

I had two moves, and both have older, more famous names.

**Move one: generate index questions.** For each chunk, enumerate the (entity, attribute) pairs it contains and generate questions covering them, then index those. The goal was coverage — make sure every fact had at least one query that would find it. This is [Doc2Query / docTTTTTquery](https://arxiv.org/abs/1904.08375) (Nogueira et al., **2019**): expand a passage with predicted queries before indexing. Four years before my "discovery." The atomic-unit version of the same instinct is [Dense-X propositions](https://arxiv.org/abs/2312.06648) (2023), which indexes decomposed factual statements.

**Move two: index chunks by their questions, then search question-to-question.** The theory was that comparing a user's question to *generated questions* is more robust than comparing a question to a *passage* — a symmetric match instead of an asymmetric one. For a FAQ store indexed by its own questions, recall was near-perfect. This is essentially the inverse of [HyDE](https://arxiv.org/abs/2212.10496) (Gao et al., 2022), which generates a hypothetical *answer* to match against passages; both are ways to close the question–passage gap, and the productized form shows up as "multi-representation indexing."

## The part I got wrong

I had a tidy theory for *why* move two worked: symmetric question-to-question comparison is "same-shape" — similar length, similar granularity — so it's inherently stronger than asymmetric question-to-passage search. I concluded that **asymmetric retrieval is fundamentally weak.**

That explanation is wrong, and the way it's wrong matters. Asymmetric retrieval underperformed because of a **query–document distribution mismatch** in the *generalist embedders* I was using, not because of asymmetry itself. And that mismatch is exactly what modern embedders are trained to fix. Instruction-tuned and in-context models — the `query:` / `passage:` prefix families, and the current [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) regulars like Qwen3-Embedding, NV-Embed, and the ICL embedders — are built for instruction-conditioned asymmetric retrieval. Feed them the asymmetric case they were trained for and the "symmetric is inherently better" advantage largely evaporates.

So the *tactic* aged out. By 2026, a strong instruction-tuned embedder does much of what my question-indexing hack was compensating for, without the extra generation step, the extra storage, and the extra failure surface.

## What survived: the lens, not the trick

The bound outlived both moves. **Recall ≤ representation coverage** is still the sharpest way I know to reason about a query-indexed retriever, and it earned its keep in two ways:

- **As a debugging lens.** When a chunk I *knew* existed wouldn't surface, the useful move wasn't to start at the reranker. It was to ask what the chunk was indexed *by*, and whether that representation encoded the fact being asked for. Nine times out of ten it didn't — and that pointed straight at where the problem actually was.
- **As a way to think about augmentation.** Query-side augmentation — generated questions, propositions, contextual expansion — isn't free, and better embedders shrink the gap it fills. But in **high-precision, structured, or FAQ domains**, where a chunk holds many distinct facts and users ask for specific ones, deliberately widening representation coverage still earned its cost. Elsewhere, a better embedder was the higher-leverage place to spend.

The honest summary: I re-derived Doc2Query and HyDE from a real bug, gave the *why* a wrong mechanism, and the field's better embedders quietly dissolved the premise. But the ceiling itself — *you can't retrieve what you didn't represent* — is the one thing from that week I'd still put on a whiteboard today.