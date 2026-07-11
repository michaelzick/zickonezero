import { type ReactNode } from 'react';

import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const CASE_STUDY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'hero-spacer', label: 'Intro Spacer', hidden: true },
  { id: 'section-the-what', label: 'The What' },
  { id: 'section-the-how', label: 'The How' },
  { id: 'section-the-who', label: 'The Who' },
  { id: 'section-methodology', label: 'Methods' }
] as const;

export const CASE_STUDY_BOTTOM_SECTION_ID = CASE_STUDY_SECTIONS[CASE_STUDY_SECTIONS.length - 1]?.id;

export const TLDR_ITEMS: {
  title: string;
  description: ReactNode;
  image: { src: string; alt: string; };
}[] = [
  {
    title: 'Product Summary',
    description: 'Nice Guy University is a course and coaching platform for men working through approval addiction, weak boundaries, toxic shame, and people-pleasing patterns. The experience turns direct coaching frameworks into a self-paced learning path with enough structure to move users from insight into practice.',
    image: { src: '/img/nice-guy-university/ngu-home.webp', alt: 'Nice Guy University homepage hero' }
  },
  {
    title: 'The Challenge',
    description: 'Package sensitive personal-development work into a product experience that feels direct, credible, and action-oriented without becoming cold, clinical, or fluffy.',
    image: { src: '/img/nice-guy-university/ngu-courses.webp', alt: 'Nice Guy University course catalog' }
  },
  {
    title: 'The Solution',
    description: 'A public course marketplace with clear navigation, practical course detail pages, coach context, and supporting resources that keep the next step obvious.',
    image: { src: '/img/nice-guy-university/ngu-course-detail.webp', alt: 'Nice Guy University course detail page' }
  },
  {
    title: 'My Roles',
    description: 'Product strategy, UX/UI design, front-end engineering, content architecture, and analytics/integration planning.',
    image: { src: '/img/nice-guy-university/ngu-how-it-works.webp', alt: 'Nice Guy University how it works page' }
  }
] as const;

type MethodSection = {
  title: string;
  bullets: string[];
  images: { src: string; alt: string; }[];
};

export const METHOD_SECTIONS: MethodSection[] = [
  {
    title: 'Discovery and Positioning',
    bullets: [
      'Clarified the promise around behavioral recovery rather than passive self-help content.',
      'Mapped the public journey from pain point to course selection, coach trust, and enrollment.',
      'Defined a tone that could be blunt and masculine without losing care or precision.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-home.webp', alt: 'Nice Guy University homepage positioning' }]
  },
  {
    title: 'Information Architecture and Content Model',
    bullets: [
      'Organized the site around courses, coaches, how-it-works education, and recovery resources.',
      'Designed course metadata for level, category, pricing, lessons, topics, instructor context, and outcomes.',
      'Kept the public IA extensible for future coaches, resources, and authenticated learning flows.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-courses.webp', alt: 'Nice Guy University course catalog filters' }]
  },
  {
    title: 'UI System and Product Implementation',
    bullets: [
      'Built a high-contrast interface with bold type, direct calls to action, and scannable course cards.',
      'Implemented course detail, coach profile, resource, cart, and auth-ready product surfaces.',
      'Used responsive layouts so the experience still feels direct and readable on mobile.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-course-detail.webp', alt: 'Nice Guy University course detail implementation' }]
  },
  {
    title: 'Analytics and Operations Planning',
    bullets: [
      'Planned funnel events around route views, course browsing, cart actions, sign-in, sign-up, and enrollment.',
      'Structured the platform for Supabase-backed course, coach, review, and admin operations.',
      'Kept public content useful on its own while preparing the authenticated learning experience behind it.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-coach-profile.webp', alt: 'Nice Guy University coach profile page' }]
  }
];

export const PERSONA_ITEMS = [
  {
    title: 'Students Starting Recovery',
    bullets: [
      'Need plain-language entry points for approval addiction, shame, boundaries, dating, and covert contracts.',
      'Want to understand which course fits the pattern costing them the most right now.',
      'Need the tone to feel direct enough to trust and safe enough to keep going.'
    ]
  },
  {
    title: 'Coaches and Instructors',
    bullets: [
      'Need a platform that can present distinct teaching voices without fragmenting the product promise.',
      'Rely on profile pages, course cards, and resource content to build trust before enrollment.',
      'Need course structures that support repeatable lessons, topics, reviews, and future cohorts.'
    ]
  },
  {
    title: 'Returning Learners',
    bullets: [
      'Look for a clear path from one course into the next practical piece of work.',
      'Need familiar navigation and account-ready surfaces that make progress easy to resume.',
      'Benefit from resources that reinforce the same language used inside the courses.'
    ]
  },
  {
    title: 'Admin and Content Ops',
    bullets: [
      'Need durable course, coach, coupon, order, review, and analytics structures.',
      'Need public pages that can grow without redesigning the whole experience.',
      'Need content workflows that keep course launches, pricing, and resource publishing manageable.'
    ]
  }
] as const;

export const HOW_IMAGES = [
  { src: '/img/nice-guy-university/ngu-home.webp', alt: 'Nice Guy University homepage with hero and primary calls to action' },
  { src: '/img/nice-guy-university/ngu-courses.webp', alt: 'Nice Guy University course catalog with filters and course cards' },
  { src: '/img/nice-guy-university/ngu-course-detail.webp', alt: 'Nice Guy University course detail page with curriculum and checkout call to action' },
  { src: '/img/nice-guy-university/ngu-how-it-works.webp', alt: 'Nice Guy University how it works page explaining the recovery platform' },
  { src: '/img/nice-guy-university/ngu-coach-profile.webp', alt: 'Nice Guy University coach profile for Michael Zick' },
] as const;
