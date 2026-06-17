/**
 * Your projects. The first three are featured on the homepage;
 * all of them appear on /projects.
 * `image` can be any URL or a path under /public. If you omit `image`,
 * the card falls back to the Material Symbol named in `icon`.
 */
export type Project = {
  title: string;
  tag: string;
  year?: string;
  description: string;
  image?: string;
  /** Material Symbol name used when there's no image (e.g. "route"). */
  icon?: string;
  href?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Accessible Wheelchair Routing",
    tag: "ML Research",
    year: "2024",
    description:
      "Built two datasets of vibration data from manual and powered wheelchairs across fifteen surface types. Trained a surface-classification model using adaptive activation functions and extended it to powered wheelchairs via transfer learning, reaching 98.8% accuracy — outperforming SOTA by 3% with 40% less train time.",
    image: "/projects/AdaGen.jpg",
    href: "https://doi.org/10.1007/s42979-024-03181-w",
    featured: true,
  },
  {
    title: "Foreground Emissions Modeling for Astronomy",
    tag: "Astronomy / ML",
    year: "2023",
    description:
      "Parsed and analyzed deep-sky observation data from the GALEX satellite's spacecraft state files. Derived an empirical model of UV foreground emissions using robust regression, and generalized it to deep and medium-sky observations.",
    image: "/projects/Galex.jpg",
    href: "https://www.sciencedirect.com/science/article/pii/S0273117722007542",
    featured: true,
  },
];
