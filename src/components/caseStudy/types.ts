import { type ReactNode } from 'react';

/** A screenshot. Portrait images are phone screens (1284:2778) shown in a phone bezel. */
export type CaseStudyImage = {
  src: string;
  alt: string;
  portrait?: boolean;
};

export type CaseStudyLink = {
  label: string;
  href: string;
};

export type CaseStudyScreenBlock = {
  id: string;
  title: string;
  /** Shorter label for the section nav; defaults to the title. */
  navLabel?: string;
  copy: ReactNode;
  images: CaseStudyImage[];
};

/**
 * Everything a flagship product's two-tab page (Product Story and Product
 * Screens) shows. CaseStudyPage renders it with the same markup and styles as
 * Nice Guy University's page.
 */
export type CaseStudyData = {
  /** Kebab-case id for DOM ids, e.g. 'riptyde'. */
  id: string;
  /** Snake-case prefix for analytics locations, e.g. 'riptyde'. */
  analyticsId: string;
  name: string;
  intro: {
    /** The live-status line under the product's name, e.g. "Live on the App Store and the web". */
    status: string;
    summary: string;
    roles: readonly string[];
    /** When it was built and by whom, e.g. "May 2026 to now, solo". */
    timeline: string;
    /** The opening hero; needs an entry in HERO_IMAGE_WIDTHS when wider than 640px. */
    image: CaseStudyImage;
    imageBackground: string;
    links: CaseStudyLink[];
  };
  what: {
    title: string;
    description: ReactNode;
    image: CaseStudyImage;
  }[];
  how: {
    heading: string;
    columns: { title: string; copy: ReactNode; }[];
    image: CaseStudyImage;
    gallery: CaseStudyImage[];
  };
  personas: {
    title: string;
    bullets: string[];
  }[];
  methods: {
    title: string;
    bullets: string[];
    images: CaseStudyImage[];
  }[];
  outcome: ReactNode[];
  screens: {
    logo: { src: string; alt: string; };
    link: CaseStudyLink;
    hero: CaseStudyImage;
    blocks: CaseStudyScreenBlock[];
  };
};
