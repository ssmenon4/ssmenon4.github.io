---
title: "RAG, Revisited"
description: "Five field notes from building retrieval systems in 2023–24, each held against the 2026 canon — what I got right, what I got wrong, and what the field had already quietly published. Start here."
date: 2026-06-30
category: "Retrieval"
image: "/blog/hero-revisited.png"
featured: true
series: "rag-revisited"
order: 0
---

Between 2023 and 2024 I built retrieval systems at a startup, mostly over a corpus of financial research — dense, structured, unforgiving text. I kept a running set of notes the whole time: ideas, bugs, half-proofs, things that worked and things I never got to ship. Recently I sat down and re-read them, expecting to wince.

I mostly didn't. The ideas held up. What I found instead was stranger and more useful: again and again I'd reasoned my way to something real — and the field had already published it, sometimes years earlier, sometimes only weeks. The instinct was sound; the credit was taken; and, usually, the version that got written down properly was better than mine.

This series is that re-reading, one idea at a time. Each post takes a single instinct from those notes, holds it against the 2026 canon, and states plainly how it aged. Less advice than record — notes to myself about a stretch of work, written down before I forgot what I'd actually thought at the time. Two things sharpened the second look. First, a few years spent on a very different discipline of analysis — the habit of stepping back to see a subject whole and map its gaps from every angle. Second, the simple fact that the field moved, and formalized much of what I'd only been reaching for.

## The path

![The RAG pipeline — raw text to a ranked answer — with the four stages where each of the first four posts stops, and the evaluation lens the fifth applies to all of them](/blog/rag-pipeline-map.svg)

The first four posts follow a document through the pipeline — from raw text to a ranked answer — and each stops at the place that stage tends to break:

1. **[Atomicity Is the Target, Not the Algorithm](/blog/atomicity-is-the-target-not-the-algorithm)** — *chunking.* Where you put the knife, and why "cut on information atomicity" is a definition wearing the costume of a method.
2. **[You Can't Retrieve What You Didn't Index](/blog/coverage-bounded-recall)** — *representation.* Recall is capped by how completely you represent each chunk — a ceiling that sits upstream of every knob you're tuning downstream.
3. **[When Your Embedder Thinks Everything Is a Finance Question](/blog/domain-collapse-in-embedders)** — *scoring.* Inside a single domain, generalist embedders lose contrast — everything clusters at 0.8 — and the fix is more mechanical than you'd hope.
4. **[Routing RAG by Question Complexity](/blog/routing-rag-by-question-complexity)** — *the query.* Single-shot and decompose-first RAG fail on opposite kinds of questions, and the boundary maps cleanly onto Bloom's taxonomy.

Then the fifth steps off the pipeline and asks the question that decides whether any of the first four were ever real:

5. **[Good Idea, Good Result: The RAG Evaluation Gap](/blog/the-rag-evaluation-gap)** — *how you'd actually know.* Read this one last. It's the conclusion the other four earn.

## How to read it

Start at the top and walk the pipeline — that's the intended path, and each post assumes only what came before it. Save the fifth for the end; it's the one that reframes everything ahead of it.

None of these is a victory lap. Every post is roughly the same shape — here's what I thought, here's where it was wrong or simply not novel, here's what survives anyway. If there's a single throughline, it's that in retrieval the *idea* is rarely the hard part. Which part is — that's the fifth post, and I'd rather you get there yourself.
