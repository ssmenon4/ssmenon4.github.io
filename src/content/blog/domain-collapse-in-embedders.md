---
title: "When Your Embedder Thinks Everything Is a Finance Question"
description: "Inside a single domain, generalist embedders lose contrast — everything scores 0.8 and top-k goes nearly random. Here's why that happens, why a reranker fixes it, and what I'd do differently in 2026."
date: 2026-06-19
category: "Retrieval"
image: "/blog/hero-domaincollapse.jpg"
heroKicker: "RAG · REVISITED · Nº 03"
heroPhrase: "Everything scores 0.8."
heroTagline: "In one domain, an embedder loses contrast."
heroCredit: 'Photo by <a href="https://unsplash.com/@samuelgirven?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Samuel Girven</a> on <a href="https://unsplash.com/photos/a-pile-of-golf-balls-in-a-bin-wmYTYa4mlDA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
series: "rag-revisited"
order: 3
---

*About this series: a retrospective on ideas I developed building retrieval systems at a startup in 2023–24, re-examined with the benefit of distance. Two things shaped the re-reading. First, a few years spent on a very different discipline of analysis — stepping back to see a subject whole, mapping its gaps and constraints from every angle, and reasoning toward a way forward. Second, the field moved; much of what I was reaching for has since been formalized and stress-tested. So each post takes one old idea, holds it against the 2026 canon, and states plainly how it aged — less a guide than a record, notes toward understanding my own work rather than advice for anyone else's.*

The first time I plotted the retrieval scores from our finance corpus, I thought the code was broken. Every candidate for every query came back at roughly the same cosine similarity — a tight little clump around 0.8. The relevant chunk and a dozen irrelevant ones were separated by hundredths. Top-*k* wasn't ranking; it was practically drawing lots among things that all "looked" equally relevant.

The embedder wasn't broken. It had just decided that, in a corpus where every document is about finance, **everything is a finance question** — and it had lost the ability to tell them apart.

## The symptom: contrast collapse

The tell is the *shape* of the score distribution, not any single score. In a healthy setup, similarities spread out: the good match sits well above the noise. In a collapsed one, the whole distribution bunches high and narrow — high mean, tiny variance. Everything is "relevant," so nothing is *retrievable*, in the sense that matters: you can't separate signal from plausible-looking noise.

![Two similarity histograms: a healthy one where the relevant chunk sits well above spread-out noise, and a collapsed one where every candidate bunches around 0.8 and the relevant chunk is barely ahead](/blog/score-histogram.svg)

This is easy to miss because the numbers look *good*. 0.8 similarity feels like a strong match. It isn't — it's a strong match *relative to random internet text*, and your corpus contains no random internet text. Relative to its actual neighbors, the target is barely ahead.

## The cause: anisotropy, made worse by domain

Generalist embedding spaces are [**anisotropic**](https://arxiv.org/abs/1909.00512): learned embeddings don't fill the sphere evenly, they concentrate in a narrow cone. Cosine similarities are therefore compressed upward by default — even unrelated texts sit at moderately high similarity.

![Anisotropy: embeddings crowd into a narrow cone rather than filling the sphere, so even unrelated texts sit at small angles and high cosine similarity](/blog/anisotropy-cone.svg)

Restrict the inputs to a single domain and you push further into an already narrow region. Finance chunks are near each other in *topic*, so they're near each other in *embedding space*, so the model's remaining discriminative budget — the fine distinctions between one fund's Q3 and another's — gets squeezed into the last decimal places. The general-purpose model was trained to tell finance from cooking from law. It was never optimized to tell finance from finance.

## The fix that just works: rerank

A cross-encoder reranker fixes this almost embarrassingly well. Where the bi-encoder embeds query and document *separately* and compares vectors, a cross-encoder reads the pair **jointly** and scores their relevance directly. That joint pass restores exactly the contrast the embedder collapsed: it can see that *this* chunk answers the question and *that* near-identical-looking one doesn't, because it's attending to both at once rather than comparing two frozen summaries.

So the canonical cascade — cheap bi-encoder to fetch a few hundred candidates, cross-encoder to re-rank the top of that pile — isn't a generic "add a reranker for +2%" tip. It's the specific antidote to contrast collapse. The bi-encoder recovers *recall* from a huge corpus; the reranker recovers *contrast* the bi-encoder threw away.

## What I did in 2024 vs. what I'd do in 2026

In 2024 my rerank stage was an off-the-shelf MS-MARCO MiniLM cross-encoder, backstopped by a GPT-4 yes/no filter that judged each surviving chunk's relevance — an expensive crutch I didn't trust the raw scores enough to drop. The plan in my notes was to fine-tune a cross-encoder on in-domain pairs so a plain score threshold could replace that LLM call. I never got to it; the startup moved on first. In 2026 I'm glad I never got to it. Rerankers are a commodity now, and the off-the-shelf ones are better than what a small team could have trained in a sprint — [bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3), Cohere Rerank, Voyage, Jina's listwise rerankers, Qwen3-Reranker. The instinct — *two-stage, rerank to restore contrast, threshold to drop the LLM-as-reranker crutch* — was exactly right. The fine-tune I never shipped is now a product anyone can call.

Reranking wasn't the only lever, just the cheapest. The upstream fixes, at the first stage, were:

- **Instruction-tuned / in-domain embedders.** The top of the [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) is instruction-conditioned models that hold contrast far better in-domain than the generalist encoders I started with — often the single highest-leverage swap.
- **In-domain contrastive fine-tuning.** Given query–passage pairs, a light contrastive tune re-spreads the space for the distribution you actually have.
- **Hybrid with BM25.** Lexical retrieval doesn't suffer embedding anisotropy at all; blending in a sparse signal reintroduces contrast on exact-term matches — a fund ticker, a date — that dense similarity smears together.

## The part worth keeping: the diagnostic

Techniques churn; the diagnostic doesn't. Before reaching for any of the fixes, the move that kept paying off was to **look at the score distribution.** Similarities bunched high with low variance mean contrast collapse, and the menu follows from there: rerank first (cheapest), then consider a better embedder or a hybrid signal. If the scores are already well-spread and retrieval still misses, the problem is somewhere else — probably [representation coverage](/blog/coverage-bounded-recall), not contrast.

That five-minute histogram has saved me more debugging time than any single model swap. The lesson from 2024 wasn't *"train a cross-encoder."* It was *"when your embedder thinks everything is a finance question, measure how confused it is before you decide how to fix it."*