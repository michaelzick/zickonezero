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
    title: 'What It Is',
    description: 'I helped reimagine Antisyphon Training from a static marketing site and fragmented LMS touchpoints into a cohesive marketplace for live, on-demand, and pay-what-you-can security education. The redesign improved enrollment, reduced support load, and gave learners, instructors, and operations teams a more coherent end-to-end experience.',
    image: { src: '/img/antisyphon/home.webp', alt: 'Antisyphon Training homepage hero' }
  },
  {
    title: 'The Challenge',
    description: 'Replace a static marketing site and scattered LMS touchpoints with a cohesive shopping and learning experience.',
    image: { src: '/img/antisyphon/course-catalog.webp', alt: 'Course catalog cards showing filtering and categories' }
  },
  {
    title: 'The Solution',
    description: 'A WooCommerce-powered marketplace with filters, event calendars, pay-what-you-can pricing, and dashboards for learners and corporate buyers.',
    image: { src: '/img/antisyphon/cart.webp', alt: 'Shopping cart showing multiple courses and donations' }
  },
  {
    title: 'My Roles',
    description: 'Product strategy, UX design, and WordPress/WooCommerce engineering plus LMS/admin integrations.',
    image: { src: '/img/antisyphon/admin-course-edit.webp', alt: 'Admin course creation form inside WordPress' }
  }
] as const;

type MethodSection = {
  title: string;
  bullets: string[];
  images: { src: string; alt: string; }[];
};

export const METHOD_SECTIONS: MethodSection[] = [
  {
    title: 'Discovery and Alignment',
    bullets: [
      'Partnered with BHIS creative directors, instructors, and ops leaders to define goals for the new marketplace.',
      'Mapped pain points across third-party sales, LMS enrollment, and communications.',
      'Captured requirements for live events, on-demand courses, coupons, and corporate purchasing.'
    ],
    images: [{ src: '/img/antisyphon/wireframe-home.webp', alt: 'Early Antisyphon homepage wireframe' }]
  },
  {
    title: 'Design and Validate the Experience',
    bullets: [
      'Produced 50+ Figma wireframes covering catalog, pay-what-you-can, checkout, and account management.',
      'Iterated on achievement-style course badges to keep the tone fun but credible.',
      'Validated flows with stakeholders and instructors before handing hi-fis to Fried Design for visual polish.'
    ],
    images: [{ src: '/img/antisyphon/wireframe-live-courses.webp', alt: 'Course catalog layout with badge styling' }]
  },
  {
    title: 'Corporate Teams and Admin Dashboards',
    bullets: [
      'Wireframed a full corporate administration dashboard for team-based cybersecurity training with explicit roles and guardrails.',
      'Mapped hierarchies for organizations, teams, team leads, and learners to ensure correct access to enrollments, receipts, and certificates.',
      'Designed roster and reporting flows so team leads can manage seats, compliance statuses, and constraints without breaking LMS sync.'
    ],
    images: [{ src: '/img/antisyphon/wireframe-corporate-dashboard.webp', alt: 'Corporate dashboard with course progress' }]
  },
  {
    title: 'Build the Customer and Admin Interfaces',
    bullets: [
      'Customized WooCommerce and WordPress templates for live/on-demand courses and subscriptions.',
      'Integrated with the LMS plus PHP/MySQL services for progress tracking, certificates, and reporting.',
      'Streamlined admin forms and ACF-driven inputs, cutting course setup time by roughly 85%.'
    ],
    images: [{ src: '/img/antisyphon/admin-event-tickets.webp', alt: 'Admin order edit view with custom fields' }]
  }
];

export const PERSONA_ITEMS = [
  {
    title: 'Cybersecurity Students',
    bullets: [
      'Need transparent pricing for live and on-demand courses with quick checkout.',
      'Expect dashboards that track progress, certificates, and replays.',
      'Look for an approachable voice and clear prerequisites.'
    ]
  },
  {
    title: 'Instructors & Content Ops',
    bullets: [
      'Publish new courses quickly and update dates without waiting on engineers.',
      'Track rosters, certificates, and communications in one place.',
      'Use badges and visuals to keep courses recognizable across the catalog.'
    ]
  },
  {
    title: 'Corporate & Team Buyers',
    bullets: [
      'Purchase seats for teammates with receipts that work for POs and compliance.',
      'Need dashboards that show attendance and course statuses.',
      'Rely on consistent tax and licensing details.'
    ]
  },
  {
    title: 'Support & Admin',
    bullets: [
      'Edit orders, honor coupons, and resolve customer issues quickly.',
      'Manage events, tickets, and email templates without breaking LMS sync.',
      'Monitor API responses so rosters and certificates stay accurate.'
    ]
  }
] as const;

export const HOW_IMAGES = [
  { src: '/img/antisyphon/calendar.webp', alt: 'Course catalog with category filters' },
  { src: '/img/antisyphon/pwyc-open.webp', alt: 'Pay-what-you-can options in the cart' },
  { src: '/img/antisyphon/checkout-1.webp', alt: 'Checkout form with billing details' },
  { src: '/img/antisyphon/dashboard-my-live-courses-prod.webp', alt: 'Learner dashboard showing live courses' },
  { src: '/img/antisyphon/cis-course.webp', alt: 'Course detail page with syllabus and schedule' },
  { src: '/img/antisyphon/community.webp', alt: 'Community page with social links' },
  { src: '/img/antisyphon/admin-course-edit.webp', alt: 'Admin course edit screen with custom fields' },
  { src: '/img/antisyphon/admin-order-edit.webp', alt: 'Admin order edit screen with custom fields' },
] as const;
