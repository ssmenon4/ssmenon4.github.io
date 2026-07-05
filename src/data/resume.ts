/** Data behind the /resume page (experience, education, skills). */

export type Entry = {
  role: string;
  org: string;
  period: string;
  summary: string;
  highlights?: string[];
  tag?: string; // small badge label, e.g. "Independent Pursuit"
};

export const experience: Entry[] = [
  {
    role: "Independent Pursuit — Civil Services (UPSC) Preparation",
    org: "Self-Directed",
    period: "2024 – 2026",
    tag: "Independent Pursuit",
    summary:
      "A focused, self-directed chapter spent preparing for India's Civil Services (UPSC) examination. I built a holistic understanding of current and historical socio-economic issues, the digital divide, and the scope for AI across Indian industries. Extensive research into public policy and governance sharpened how I analyse complex, real-world problems.",
    highlights: [
      "Research & Analysis — synthesised large volumes of information across Economics, Public Administration, and International Relations into structured understanding.",
      "Policy & Writing — broke down complex real-world issues and drafted analytical essays and reports under time constraints.",
      "Discipline & Rigor — sustained daily study routines that reinforced focus, self-management, goal-oriented behavior, and high-pressure endurance.",
    ],
  },
  {
    role: "Founding Engineer — AI",
    org: "OnFinance AI",
    period: "Sep 2023 - Mar 2024",
    summary:
      "Built the retrieval/RAG side end-to-end — ingestion, indexing, retrieval, reranking, generation — and drove the applied research on retrieval quality.",
    highlights: [
      "Shipped RAG document-QA pipelines for 10+ financial-sector clients (Kotak, ICICI, IBSFintech, Nuvama/Edelweiss, Oister, NSE); LetsVenture converted to a contracted production deployment.",
      "Lifted top-1 retrieval recall 25% → 90% on an internal FAQ set via question-embedding indexing; cut query latency up to 75% with chunk-budget tuning and a cost-aware GPT-4-Turbo/3.5 switch.",
      "Two-stage retrieval — broad first pass, then a more accurate re-rank; GPT-4V + Azure Document Intelligence to read tables and charts OCR missed; chat memory for follow-up context.",
      "Led retrieval-quality research — entity-attribute question generation, atomicity-based chunking, Bloom-tier answer routing — later distilled into a public writeup series.",
    ],
  },
  {
    role: "ML Engineer Intern",
    org: "American Express",
    period: "Jul 2022 - Dec 2022",
    summary:
      "Member of the R&D team in-charge of developing Distributed GPU Learning modes for AmEx proprietary XGBoost algorithms.",
    highlights: [
      "Tested the new modes throughout the development cycle on internal datasets and analyzed them on GINI, AUC, train/turnaround times, Capture Rate at 20 percentile etc",
      "New modes trained models 20x faster and readied them 5x faster than the then-most widely-used mode.",
      "Shipped as an official feature update (v3.0, Nov 2022) in the company's algorithm.",
    ],
  },
  {
    role: "R&D Intern",
    org: "IIRS Dehradun",
    period: "Jun 2021 - Jul 2021",
    summary:
      "Implemented a satellite image segmentation model based on the U-Net architecture using Keras. Analyzed the Michigan Microwave Canopy Scattering ML models for simulating microwave back-scattering across forest canopies.",
  },
];

export const education: Entry[] = [
  {
    role: "B.E. Computer Science (Data Science Minor)",
    org: "BITS Pilani, Goa Campus",
    period: "2019 - 2023",
    summary:
      "CGPA 9.15/10. Earlier: Class 12 CBSE (92.8%), Class 10 CBSE (CGPA 10/10).",
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI / LLMs",
    items: ["RAG", "LLM Orchestration", "Agentic Workflows", "Conversational AI", "Gen AI"],
  },
  {
    group: "ML / DL",
    items: ["NumPy", "Pandas", "Scikit-Learn", "TensorFlow", "PyTorch"],
  },
  {
    group: "Programming",
    items: ["OOP", "DBMS", "DSA"],
  },
  {
    group: "Languages",
    items: ["Python", "LaTeX"],
  },
  {
    group: "Policy & Analysis",
    items: [
      "Public Policy",
      "Economics",
      "Public Administration",
      "International Relations",
      "Research & Synthesis",
      "Analytical Writing",
    ],
  },
];

export const approach =
  "I work at the intersection of research and production — turning LLMs, multi-agent systems, and retrieval into reliable software. I like to explore ambitiously but verify before I trust, building things that fit the problem and keeping them as simple as it allows.";

/** Optional: drop a PDF in /public and point here, or leave null to hide the button. */
export const resumePdf: string | null = "/SSM_Resume.pdf";
