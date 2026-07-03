/**
 * Central site configuration.
 * Edit everything about "you" here — it flows into every page, the nav,
 * the footer, and SEO/OpenGraph metadata.
 */
export const site = {
  /** Shown in the nav + footer wordmark. */
  brand: "Shivashankar Menon",
  /** Your full name (used in SEO + structured data). */
  author: "Shivashankar S Menon",
  /** Short role / tagline. */
  role: "AI & Machine Learning Engineer",
  /** Default meta description for SEO. */
  description:
    "Founding AI engineer and published ML researcher. I build LLM-powered retrieval and multi-agent systems alongside high-performance machine learning pipelines, backed by peer-reviewed research spanning astronomy and accessible robotics.",
  /** Contact email (used by the Contact button + footer). */
  email: "ssmenon761@gmail.com",
  /** Footer line. */
  footerNote: "Built with curiosity.",
};

/** Primary navigation. `href` values map to real routes. */
export const nav = [
  { label: "WORK", href: "/projects" },
  { label: "WRITING", href: "/blog" },
  { label: "PAPERS", href: "/publications" },
  { label: "RESUME", href: "/resume" },
  { label: "ABOUT", href: "/about" },
];

/** Social links shown in the footer. Remove any you don't use. */
export const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/ssmenon3181" },
  { label: "GitHub", href: "https://github.com/ssmenon4" },
  { label: "Email", href: "mailto:ssmenon761@gmail.com" },
];
