---
title: "Good Idea, Good Result: The RAG Evaluation Gap"
description: "After re-reading six months of my own RAG notes, the pattern was clear: the ideas were fine, the evaluation wasn't. Here's the gap between a promising RAG idea and a credible one — and the cheap checklist that closes it."
date: 2026-06-27
category: "ML Engineering"
image: "/blog/hero-evalgap.png"
series: "rag-revisited"
order: 5
---

*About this series: a retrospective on ideas I developed building retrieval systems at a startup in 2023–24, re-examined with the benefit of distance. Two things shaped the re-reading. First, a few years spent on a very different discipline of analysis — stepping back to see a subject whole, mapping its gaps and constraints from every angle, and reasoning toward a way forward. Second, the field moved; much of what I was reaching for has since been formalized and stress-tested. So each post takes one old idea, holds it against the 2026 canon, and states plainly how it aged — less a guide than a record, notes toward understanding my own work rather than advice for anyone else's.*

I recently re-read the research notes from a stint building retrieval systems in 2023–24, expecting to find a few bad ideas. I didn't. The ideas held up surprisingly well — I'd independently re-derived things the field was publishing at the same time. What *didn't* hold up was the evidence. Every promising claim rested on an evaluation too thin to trust, including my own.

That turns out to be the general lesson, and it's the most useful thing in this whole series: **the distance between a promising RAG idea and a credible one is almost never the idea. It's the evaluation.** Ideas in retrieval have commoditized — the good ones get published within months by several groups at once. What separates work that gets cited from work that gets ignored is whether the result is *believable.* That's the actual moat now, and it's cheap to build.

Here's the gap, one recurring mistake at a time, each with the fix I wish I'd applied.

## The six gaps

**1. One small proprietary benchmark.** Everything I measured ran on a single internal test set. Nothing was reproducible, and nothing was comparable to anyone else's numbers — which means it couldn't travel past the room it was made in. *Fix:* evaluate on at least one **public benchmark** — [BEIR](https://arxiv.org/abs/2104.08663) for general retrieval, [ViDoRe](https://huggingface.co/vidore) for visual documents, [FinanceBench](https://arxiv.org/abs/2311.11944) for finance QA. Keep your internal set too, but never *only* your internal set.

**2. "Versus vanilla" is not a baseline.** My comparisons were almost always against a naive strawman, which flatters everything. A win over "no effort" tells you nothing about a win over *reasonable* effort. *Fix:* name **real baselines** and beat those — BM25, a strong dense embedder, Doc2Query, an off-the-shelf reranker. If your method can't beat a good reranker, that's the thing to know before you publish, not after.

**3. No ablations, no significance.** Single runs, small *n*, no sense of whether a 2-point gain was signal or noise. A pipeline change touches five things at once; without ablation you can't say which one mattered. *Fix:* run **one ablation** that isolates the variable your thesis is about, and report **n and variance**. Even "three seeds, here's the spread" moves you from anecdote to evidence.

**4. Oracle ceilings reported as results.** My favorite finding — that two retrieval strategies are complementary — came with a headline number of ~94%. That number assumed a *perfect router*. It was the size of the prize, not a system anyone could ship. Reported alone, it's misleading. *Fix:* when you quote an upper bound, **quote the realized number next to it.** The oracle names the prize; the realized number says how much you've captured and how far there's left to go. "94%" alone names a ceiling without saying where you stand under it.

**5. Unvalidated LLM-as-judge.** A GPT-4 autograder scored every experiment, and beyond some informal eyeballing I never systematically validated it against human labels — yet it drove every conclusion I drew. If the judge is biased, so is everything downstream of it. *Fix:* **spot-check the judge.** Hand-label 50–100 examples, measure agreement with the autograder, and report it. If they disagree a third of the time, you don't have results, you have the judge's opinions.

**6. The core quantity goes unmeasured.** My coverage work argued that recall is bounded by representation *coverage* — and I never actually measured coverage. I measured downstream answer accuracy and called it a coverage result. The one number the whole thesis depended on was missing. *Fix:* **measure the thing your thesis is about.** If the claim is about coverage, define a coverage metric and report it. If it's about latency, report latency. Don't let a proxy stand in for the quantity you're making claims about.

## The checklist

The fixes fit on an index card — the one I wish had been taped inside my 2024 notebook. Before trusting a RAG result, mine or anyone else's:

| Gap | The one-line fix |
|---|---|
| Proprietary-only benchmark | Add a public one (BEIR / ViDoRe / FinanceBench) |
| Strawman baseline | Beat BM25, a dense embedder, Doc2Query, a reranker |
| No ablations | Isolate the one variable; report n + variance |
| Oracle number | Report the realized number beside it |
| Trusted LLM judge | Spot-check vs. human labels, report agreement |
| Unmeasured thesis | Measure the exact quantity you're claiming |

![An index card listing the six evaluation gaps and their one-line fixes: add a public benchmark, beat real baselines, run an ablation with n and variance, report the realized number beside the oracle, spot-check the LLM judge, and measure the exact quantity you're claiming](/blog/eval-index-card.svg)

None of this is exotic, and none of it is expensive. That's the point. A weekend's work — a public dataset, named baselines, one ablation, a judge spot-check — is the entire difference between "I have a promising idea" and "I have a result you can trust."

## Why this is the whole series in one post

The other four essays in this series each describe a good instinct that turned out to be non-novel: [complexity routing](/blog/routing-rag-by-question-complexity), [coverage-bounded recall](/blog/coverage-bounded-recall), [domain collapse](/blog/domain-collapse-in-embedders), and [atomicity in chunking](/blog/atomicity-is-the-target-not-the-algorithm). In every case, the idea was fine and the field had already published it. What would have made *my* version worth citing wasn't a better idea — it was one of the six fixes above.

So this is the note I'd hand my 2024 self, stapled to the front of the lab notebook: the ideas are the easy part. Everyone has ideas; several of them will have yours. **The rigor is the moat.** Pick a public benchmark, name your baselines, measure the thing you're actually claiming, and publish. That's it. That's the gap.