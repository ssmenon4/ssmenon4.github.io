/**
 * Your projects. The first three are featured on the homepage;
 * all of them appear on /projects.
 * `image` can be any URL or a path under /public.
 */
export type Project = {
  title: string;
  tag: string;
  year?: string;
  description: string;
  image?: string;
  href?: string;
  featured?: boolean;
  /** Anchor id for the inline demo-video section on /projects (e.g. "my-demo"). */
  slug?: string;
  /** Unlisted YouTube video id (the part after watch?v=). Renders a click-to-play demo. */
  videoId?: string;
  /** Internal link to a full writeup (e.g. "/blog/amphoreus-dnd"). Shows a "Read in detail" CTA. */
  blogHref?: string;
  /** Technical highlights shown as a feature strip beneath a demo video. */
  highlights?: { title: string; detail: string }[];
  /** Whether the project is still actively being worked on, or a finished/published piece. */
  status?: "ongoing" | "published";
  /** Mono-caps tech stack line shown in the /projects dossier, e.g. "PYTHON / CHROMADB / MULTI-PROVIDER LLM". */
  stack?: string;
};

export const projects: Project[] = [
  {
    title: "Amphoreus D&D — Multi-Agent LLM Simulation",
    tag: "AI Engineering",
    year: "2026",
    description:
    "A fully automated multi-agent simulation of a D&D campaign: a Dungeon Master, an Orchestrator/referee, and player-characters, each backed by an LLM, coordinated by a structured engine loop. World state changes only through typed tool calls — never parsed from prose — so every change is logged, replayable, and testable. The engineering focus is on reliable ways to promote and evaluate long-horizon planning in agent behavior, and also observe inter-agent coordination. Ongoing project.",
    slug: "amphoreus-dnd",
    videoId: "kjCKjF4DJ-c",
    href: "/projects#amphoreus-dnd",
    blogHref: "/blog/amphoreus-dnd",
    featured: true,
    status: "ongoing",
    stack: "PYTHON / CHROMADB / MULTI-PROVIDER LLM",
    highlights: [
      {
        title: "Multi-agent orchestration",
        detail:
          "Three distinct cognitive roles coordinated by a 4-stroke turn loop; world state mutates only through typed, logged tool calls, never parsed prose.",
      },
      {
        title: "Search-earned, typed memory",
        detail:
          "Agents pull top-K relevant context from owned, vector-indexed stores (ChromaDB); provider-independent, so any role can run a different model.",
      },
      {
        title: "Evaluation of non-deterministic agents",
        detail:
          "A variance-aware harness (N≥3 per condition, distributions not point values, an independent LLM-judge, pre-registered thresholds) to help decide what to build by measuring first.",
      },
    ],
  },
  {
    title: "Accessible Wheelchair Routing",
    tag: "ML Research",
    year: "2024",
    description:
      "Built two datasets of vibration data from manual and powered wheelchairs across fifteen surface types. Trained a surface-classification model using adaptive activation functions and extended it to powered wheelchairs via transfer learning, reaching 98.8% accuracy — outperforming SOTA by 3% with 40% less train time.",
    image: "/projects/AdaGen.jpg",
    href: "https://doi.org/10.1007/s42979-024-03181-w",
    featured: true,
    status: "published",
    stack: "PYTORCH / TRANSFER LEARNING / SENSOR DATA",
  },
  {
    title: "Foreground Emissions Modeling for Astronomy",
    tag: "Astronomy / ML",
    year: "2023",
    description:
      "Parsed and analyzed deep-sky observation data from the GALEX satellite's spacecraft state files. Derived an empirical model of UV foreground emissions using robust regression, and generalized it to deep and medium-sky observations.",
    image: "/projects/Galex.jpg",
    href: "https://doi.org/10.1016/j.asr.2022.07.086",
    featured: true,
    status: "published",
    stack: "ROBUST REGRESSION / GALEX TELEMETRY",
  },
];
