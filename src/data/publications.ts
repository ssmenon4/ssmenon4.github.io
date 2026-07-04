/** Data behind the /publications page. */
export type Publication = {
  title: string;
  date: string;
  venue: string;
  description: string;
  href?: string;
  cta?: string;
  year: string;
  kind: string;
  bibtex: string;
};

export const publications: Publication[] = [
  {
    title:
      "AdaGen: Adaptive Generalized Knowledge Transfer Framework for Sensor-Based Surface Classification for Wheelchair Routing",
    date: "Aug 2024",
    venue: "SN Computer Science",
    description:
      "V. Misra, S.S. Menon, et al. — An adaptive, generalized knowledge-transfer framework for sensor-based surface classification, applied to accessible wheelchair routing. SN Computer Science 5.7, p. 820.",
    cta: "View Paper",
    href: "https://doi.org/10.1007/s42979-024-03181-w",
    year: "2024",
    kind: "journal article",
    bibtex: `@article{misra2024adagen,
  title={AdaGen: Adaptive Generalized Knowledge Transfer Framework for Sensor-Based Surface Classification for Wheelchair Routing},
  author={Misra, Vanshika and Menon, Shivashankar S and others},
  journal={SN Computer Science}, volume={5}, number={7}, pages={820}, year={2024},
  doi={10.1007/s42979-024-03181-w}
}`,
  },
  {
    title: "Validation of Foreground Emission Model using GALEX Medium Observations",
    date: "May 2023",
    venue: "Research in Astronomy and Astrophysics",
    description:
      "N. Narayanan, S.S. Menon, et al. — Validation of a UV foreground-emission model using GALEX medium-depth observations. Research in Astronomy and Astrophysics 23.6, p. 065021.",
    cta: "View Paper",
    href: "https://doi.org/10.1088/1674-4527/acd09f",
    year: "2023",
    kind: "journal article",
    bibtex: `@article{narayanan2023validation,
  title={Validation of Foreground Emission Model using GALEX Medium Observations},
  author={Narayanan, Nirmalya and Menon, Shivashankar S and others},
  journal={Research in Astronomy and Astrophysics}, volume={23}, number={6}, pages={065021}, year={2023},
  doi={10.1088/1674-4527/acd09f}
}`,
  },
  {
    title: "A model of foreground emission in UV using GALEX deep observations",
    date: "Jan 2023",
    venue: "Advances in Space Research",
    description:
      "N. Narayanan, S.S. Menon, et al. — An empirical model of UV foreground emission derived from GALEX deep observations, using robust regression. Advances in Space Research 71.1, pp. 1059–1073.",
    cta: "View Paper",
    href: "https://doi.org/10.1016/j.asr.2022.07.086",
    year: "2023",
    kind: "journal article",
    bibtex: `@article{narayanan2023model,
  title={A model of foreground emission in UV using GALEX deep observations},
  author={Narayanan, Nirmalya and Menon, Shivashankar S and others},
  journal={Advances in Space Research}, volume={71}, number={1}, pages={1059--1073}, year={2023},
  doi={10.1016/j.asr.2022.07.086}
}`,
  },
];
