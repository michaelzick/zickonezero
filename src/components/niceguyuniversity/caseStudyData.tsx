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
    description: 'Nice Guy University is the product version of my coaching practice. Men who struggle with people-pleasing, weak boundaries, and approval addiction work through self-paced courses built from video lessons, audio, journal prompts, and assignments. They start without waiting for a session with me. I designed it, wrote it, and built it.',
    image: { src: '/img/nice-guy-university/ngu-home-featured-courses.webp', alt: 'Nice Guy University featured courses on the homepage with pricing and enroll buttons' }
  },
  {
    title: 'The Challenge',
    description: 'Men in this space have already read the books and watched the videos, and nothing changed. The product had to feel different from generic self-help: blunt where the industry is soft, structured where it is vague, and careful with material that is genuinely heavy.',
    image: { src: '/img/nice-guy-university/ngu-courses.webp', alt: 'Nice Guy University course catalog with search and filters' }
  },
  {
    title: 'The Solution',
    description: 'A course marketplace that keeps the next step obvious. Browse by the pattern that is costing you the most, see the full curriculum and time commitment before paying, and start with a free intro course if you are skeptical. Coach pages put a real person behind every course.',
    image: { src: '/img/nice-guy-university/ngu-course-detail.webp', alt: 'Nice Guy University course detail page with enrollment sidebar' }
  },
  {
    title: 'My Roles',
    description: 'All of it. Positioning and copy, UX/UI design, the React front end, the Supabase backend, checkout and coupons, and the admin dashboard I use to run the business every day.',
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
      'Wrote the positioning from years of coaching calls, in the words men actually use, like shame, resentment, and "why do I keep doing this," rather than therapy-speak.',
      'Boiled the curriculum down to a three-step framework every course teaches toward: confront shame, drop the victim story, build boundaries.',
      'Set a voice that could be blunt on the homepage and careful inside the lessons, because the work needs both.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-home-framework.webp', alt: 'Nice Guy University homepage framework section with three steps to rock-solid authenticity' }]
  },
  {
    title: 'Information Architecture and Content Model',
    bullets: [
      'Structured the site around the four questions every visitor shows up with: what is this, which course fits me, who is teaching, and what do I get.',
      'Modeled courses with categories, levels, pricing, lesson counts, and topics so the catalog can grow without a redesign.',
      'Left room for more coaches from day one; the IA treats me as the first instructor, not the only one.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-how-it-works-steps.webp', alt: 'Nice Guy University how it works process steps: browse coaches, pick a course, do the work' }]
  },
  {
    title: 'UI System and Product Implementation',
    bullets: [
      'Built a high-contrast interface with oversized type and direct calls to action. It is the visual version of the coaching voice.',
      'Shipped the catalog, course detail, curriculum, cart, checkout, and auth flows in React on Supabase.',
      'Kept the honest details in: every course page carries a plain-language "not a substitute for therapy" disclosure.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-course-overview.webp', alt: 'Nice Guy University course overview with learning outcomes and therapy disclaimer' }]
  },
  {
    title: 'Analytics and Operations',
    bullets: [
      'Built an admin dashboard with real reporting: course completion, chapter progress, video and audio engagement, and enrollment trends.',
      'Run the whole business from the same place, from orders and coupons to reviews and email marketing, without touching code.',
      'Instrumented the funnel from first visit through enrollment so I can see where men hesitate and fix it.'
    ],
    images: [{ src: '/img/nice-guy-university/ngu-admin-analytics.webp', alt: 'Nice Guy University admin analytics dashboard showing course completion by status' }]
  }
];

export const PERSONA_ITEMS = [
  {
    title: 'Students Starting Recovery',
    bullets: [
      'Usually lands here after a breaking point, like a relationship ending or one resentment too many, not from casual browsing.',
      'Skeptical of self-help and allergic to anything that sounds like a pep talk.',
      'Needs to know which course matches the pattern that is actually costing him, and what it will ask of him.'
    ]
  },
  {
    title: 'Coaches and Instructors',
    bullets: [
      'Today that is me; the platform is built to carry more voices without rebuilding anything.',
      'Need profile pages strong enough to earn a purchase from a stranger on the internet.',
      'Need a repeatable structure of chapters, lessons, topics, and reviews instead of hand-built pages.'
    ]
  },
  {
    title: 'Returning Learners',
    bullets: [
      'Finished one course and want the next piece of work, not another sales funnel.',
      'Expect progress to be saved and the path back in to be one click.',
      'Trust the platform because the language inside the courses matches what got them to sign up.'
    ]
  },
  {
    title: 'Admin and Content Ops',
    bullets: [
      'One person runs courses, orders, coupons, reviews, and email from a single dashboard, and that person is me.',
      'Launching a course has to be a content task, not an engineering project.',
      'Reporting has to answer operator questions: what do students finish, where do they stall, what converts.'
    ]
  }
] as const;

export const HOW_IMAGES = [
  { src: '/img/nice-guy-university/ngu-home.webp', alt: 'Nice Guy University homepage with hero and primary calls to action' },
  { src: '/img/nice-guy-university/ngu-courses.webp', alt: 'Nice Guy University course catalog with filters and course cards' },
  { src: '/img/nice-guy-university/ngu-course-detail.webp', alt: 'Nice Guy University course detail page with curriculum and checkout call to action' },
  { src: '/img/nice-guy-university/ngu-course-curriculum.webp', alt: 'Nice Guy University course curriculum with lesson list and durations' },
  { src: '/img/nice-guy-university/ngu-how-it-works.webp', alt: 'Nice Guy University how it works page explaining the recovery platform' },
  { src: '/img/nice-guy-university/ngu-how-it-works-steps.webp', alt: 'Nice Guy University three-step process for starting recovery work' },
  { src: '/img/nice-guy-university/ngu-coach-profile.webp', alt: 'Nice Guy University coach profile for Michael Zick' },
  { src: '/img/nice-guy-university/ngu-admin-analytics.webp', alt: 'Nice Guy University admin analytics dashboard' },
] as const;

// The case-study hero opens the lightbox at ngu-home, which sits at the head
// of HOW_IMAGES, directly after the TLDR images.
export const HERO_LIGHTBOX_INDEX = TLDR_ITEMS.length;
