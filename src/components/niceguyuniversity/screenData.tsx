import { type ReactNode } from 'react';

import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const SCREEN_SECTIONS: SidebarSectionConfig[] = [
  { id: 'screens-introduction', label: 'Intro', hidden: true },
  { id: 'screens-platform-overview', label: 'Overview' },
  { id: 'screens-course-discovery', label: 'Course Discovery' },
  { id: 'screens-course-details', label: 'Course Details' },
  { id: 'screens-support-ecosystem', label: 'Support' },
  { id: 'screens-admin', label: 'Admin' }
] as const;

export const SCREEN_BOTTOM_SECTION_ID = SCREEN_SECTIONS[SCREEN_SECTIONS.length - 1]?.id;

// Hero image for the Product Screens intro; prepended to the lightbox sources
// ahead of the block images.
export const SCREEN_HERO_IMAGE = {
  src: '/img/nice-guy-university/ngu-home.webp',
  alt: 'Nice Guy University homepage overview'
} as const;

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
        The homepage makes the promise in five words — stop being nice, start being you — and backs it with the framework
        every course teaches toward. The how-it-works page lays out the actual process: browse coaches, pick a course, do
        the work.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-home-framework.webp', alt: 'Nice Guy University homepage framework section with three recovery steps' },
      { src: '/img/nice-guy-university/ngu-how-it-works.webp', alt: 'Nice Guy University how it works overview' }
    ]
  },
  {
    id: 'screens-course-discovery',
    title: 'Course Discovery',
    copy: (
      <>
        Search, category, level, and price filters keep the catalog scannable, and featured courses on the homepage surface
        the most common starting points. Every card answers the first three questions up front: how long, how many lessons,
        how much.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-courses.webp', alt: 'Nice Guy University course catalog screen' },
      { src: '/img/nice-guy-university/ngu-home-featured-courses.webp', alt: 'Nice Guy University featured course cards with pricing' }
    ]
  },
  {
    id: 'screens-course-details',
    title: 'Course Details',
    copy: (
      <>
        One page answers everything a buyer needs: what the course covers, the full lesson list with durations, level, time
        commitment, and price — plus a plain-language note that these courses are not a substitute for therapy.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-course-detail.webp', alt: 'Nice Guy University course detail screen' },
      { src: '/img/nice-guy-university/ngu-course-curriculum.webp', alt: 'Nice Guy University course curriculum with lesson list' }
    ]
  },
  {
    id: 'screens-support-ecosystem',
    title: 'Support Ecosystem',
    copy: (
      <>
        Coach pages put a real person behind the courses — bio, approach, and a direct way to book. The structure already
        supports more coaches as the roster grows.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-coach-profile.webp', alt: 'Nice Guy University Michael Zick coach profile screen' }
    ]
  },
  {
    id: 'screens-admin',
    title: 'Admin and Analytics',
    copy: (
      <>
        The back office I built to run the platform: completion and engagement analytics, enrollment trends, and day-to-day
        tools for courses, orders, coupons, reviews, and email marketing.
      </>
    ),
    images: [
      { src: '/img/nice-guy-university/ngu-admin-analytics.webp', alt: 'Nice Guy University admin analytics dashboard with course completion chart' }
    ]
  }
] as const;
