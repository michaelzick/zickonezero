import { type ReactNode } from 'react';

import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const SCREEN_SECTIONS: SidebarSectionConfig[] = [
  { id: 'screens-introduction', label: 'Intro', hidden: true },
  { id: 'screens-platform-overview', label: 'Overview' },
  { id: 'screens-course-discovery', label: 'Course Discovery' },
  { id: 'screens-course-details', label: 'Course Details' },
  { id: 'screens-support-ecosystem', label: 'Support' }
] as const;

export const SCREEN_BOTTOM_SECTION_ID = SCREEN_SECTIONS[SCREEN_SECTIONS.length - 1]?.id;

export type ScreenBlock = {
  id: string;
  title: string;
  copy: ReactNode;
  images: { src: string; alt: string; }[];
};

export const SCREEN_BLOCKS: ScreenBlock[] = [
  {
    id: 'screens-platform-overview',
    title: 'Platform Overview',
    copy: (
      <>
        The homepage and how-it-works page establish the promise quickly: stop performing, pick the course or coach that fits,
        and start practicing a more honest way of living.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-home.webp', alt: 'Nice Guy University homepage overview' },
      { src: '/img/nice-guy-university/ngu-how-it-works.webp', alt: 'Nice Guy University how it works overview' }
    ]
  },
  {
    id: 'screens-course-discovery',
    title: 'Course Discovery',
    copy: (
      <>
        The course catalog gives users practical comparison tools without burying them in abstract self-help language.
        Search, categories, levels, and pricing help users find the next piece of work.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-courses.webp', alt: 'Nice Guy University course catalog screen' }
    ]
  },
  {
    id: 'screens-course-details',
    title: 'Course Details',
    copy: (
      <>
        Course detail pages combine outcomes, instructor context, curriculum, pricing, and checkout entry points so users can
        decide without bouncing between disconnected pages.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-course-detail.webp', alt: 'Nice Guy University course detail screen' }
    ]
  },
  {
    id: 'screens-support-ecosystem',
    title: 'Support Ecosystem',
    copy: (
      <>
        Resource and coach pages keep the product from feeling like a one-off course shelf. They show the broader support
        system around the recovery work and leave room for more instructors over time.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-coach-profile.webp', alt: 'Nice Guy University Michael Zick coach profile screen' }
    ]
  }
] as const;
