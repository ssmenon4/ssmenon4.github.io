---
title: "Atomicity Is the Target, Not the Algorithm: Chunking in 2026"
description: "'Chunk on information atomicity' is the right objective and a useless instruction — it's a definition, not a procedure. Here's the gap I fell into in 2023, and the algorithms the field built to actually hit the target."
date: 2026-06-11
category: "Retrieval"
image: "/blog/hero-atomicity.jpg"
heroKicker: "RAG · REVISITED · Nº 01"
heroPhrase: "Where you put the knife."
heroTagline: "Atomicity is a target, not an algorithm."
heroCredit: 'Photo by <a href="https://unsplash.com/@vanburn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vanburn Gonsalves</a> on <a href="https://unsplash.com/photos/a-rusty-utility-knife-on-an-open-book-9tHdJFVccbY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
series: "rag-revisited"
order: 1
---

*About this series: a retrospective on ideas I developed building retrieval systems at a startup in 2023–24, re-examined with the benefit of distance. Two things shaped the re-reading. First, a few years spent on a very different discipline of analysis — stepping back to see a subject whole, mapping its gaps and constraints from every angle, and reasoning toward a way forward. Second, the field moved; much of what I was reaching for has since been formalized and stress-tested. So each post takes one old idea, holds it against the 2026 canon, and states plainly how it aged — less a guide than a record, notes toward understanding my own work rather than advice for anyone else's.*

In late 2023 I wrote down what I thought was a principle for chunking: **cut on information atomicity.** A good chunk is one coherent idea; you shouldn't be able to drop a sentence without losing something, and you shouldn't be able to split it without stranding information at the boundary. Slides, I noted approvingly, are naturally atomic — each one is built to stand alone.

It felt like insight. It wasn't, quite. Read it back and the definition eats its own tail:

> A chunk is atomic when no significant information sits at its boundaries. If significant information *does* sit at a boundary, then it wasn't atomic.

That's a *test you can apply after the fact*, not a *procedure for cutting*. It tells you how to recognize a good chunk once you have one. It says nothing about where to put the knife. I had mistaken a definition of the goal for a method of reaching it — which is a specific, seductive kind of non-insight, because it *sounds* operational right up until you try to code it.

## Why the boundary problem is real anyway

The underlying worry was legitimate. Naive fixed-size chunking cuts mid-thought, so the sentence that resolves a claim lands in a different chunk than the claim, and neither chunk retrieves well on its own. Add [Lost in the Middle](https://arxiv.org/abs/2307.03172) — models under-use evidence buried in the middle of a long context — and sloppy chunking hurts twice: once at retrieval, once at generation.

![A fixed-size cut slices mid-thought and strands one idea across two chunks; an atomic cut falls on the boundary between ideas so each chunk stays self-contained](/blog/chunking-knife.svg)

So the target was right. *Atomicity* — self-contained units that don't strand information — is a genuinely good objective. My mistake was stopping at the objective and calling it a strategy. The interesting question, the one the field actually answered, is: **which algorithms approximate atomicity, and what does each one really optimize?**

## The operationalizations I didn't have

By 2026 there's a whole spectrum, and it helps to line them up by what they're actually doing:

| Strategy | How it cuts | What it optimizes |
|---|---|---|
| Fixed / recursive | Character or token count, on separators | Nothing semantic — just uniform size |
| Semantic chunking | Split where adjacent-sentence embedding distance spikes | Topical coherence within a chunk |
| Propositions | Decompose text into atomic factual statements | Maximal atomicity of the unit itself |
| Late chunking | Embed the whole doc, *then* split the token stream | Boundary context — chunks "remember" the doc |
| Contextual retrieval | Prepend an LLM-written blurb before embedding | Boundary context — chunks explain themselves |
| Parent-document | Retrieve small, return the enclosing parent | Precision at match time, context at read time |

A few of these are worth calling out because they hit *exactly* the worry I'd articulated but couldn't solve:

- **[Dense-X propositions](https://arxiv.org/abs/2312.06648)** (2023) is my "atomic unit" taken literally — index decomposed factual statements. It's the closest thing to my definition, made executable.
- **[Late chunking](https://arxiv.org/abs/2409.04701)** (Jina, 2024) is a lovely inversion: encode the entire document *first* so every token carries full context, then slice the token embeddings into chunks. The chunks inherit context instead of losing it at the cut.
- **[Anthropic's Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval)** (2024) fixes boundary-context-loss the direct way: have a model write a short chunk-specific blurb situating each chunk in its document, and prepend it before embedding. Anthropic reports it cuts failed retrievals by 35% with contextual embeddings alone, 49% adding contextual BM25, and 67% adding reranking on top. That's the boundary problem I was hand-wringing about, solved with one extra generation step.
- **Parent-document / auto-merging retrieval** is the parent–child scheme a colleague of mine was already building by hand: match on a tight chunk for precision, then return its neighborhood for context. It was productized in the major frameworks while we were reinventing it.

## When the right move is to stop chunking text

The sharpest correction is that for a lot of my corpus — slide decks, tables, infographics — the 2026 answer is to **not chunk the text at all.** [ColPali](https://arxiv.org/abs/2407.01449) retrieves over *images of document pages* using late interaction over visual patches, skipping OCR and text splitting entirely. For visually structured documents that beats any text chunking strategy, because the layout *is* information and chopping it into text spans destroys exactly what makes a slide atomic. My instinct that "slides are naturally atomic units" was right; the conclusion should have been "so keep them as units — visually," not "so split their text carefully."

And the meta-point has itself become a research line: [**Adaptive Chunking**](https://arxiv.org/abs/2603.25333) (LREC 2026) is, more or less, my throwaway note that "different document types want different chunking strategies" turned into a proper method — learn or select the chunker per document rather than committing to one globally.

## Where I'd land now, by document type

If I compress everything above back down to the corpus I actually had:

- **Prose (reports, articles):** semantic chunking as a baseline, with contextual retrieval or late chunking layered on where boundary-context loss was showing up.
- **Dense factual text (specs, filings):** propositions or small chunks with parent-document retrieval — match precisely, read with context.
- **Visual docs (slides, tables, infographics):** don't text-chunk at all — a visual retriever like ColPali, or a parse to some faithful structured form first.
- **The through-line:** measure boundary loss directly. A chunk that *should* answer a question but comes back incomplete is a chunking problem, not a [coverage](/blog/coverage-bounded-recall) or [contrast](/blog/domain-collapse-in-embedders) one.

Atomicity was the right target the whole time. What I lacked back then wasn't the goal — it was the honesty to notice that naming a goal isn't the same as having an algorithm, plus the tools the field has since built to actually cut toward it.