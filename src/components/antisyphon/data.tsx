import { type ReactNode } from 'react';
import { WhiteTransitionAnchor } from '../../../styles';
import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const CASE_STUDY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'hero-spacer', label: 'Intro Spacer', hidden: true },
  { id: 'introduction', label: 'Intro' },
  { id: 'section-outcome', label: 'Outcome' },
  { id: 'section-the-who', label: 'The Who' },
  { id: 'section-the-how', label: 'Experience' },
  { id: 'section-methodology', label: 'Methods' }
] as const;

export const CASE_STUDY_BOTTOM_SECTION_ID = CASE_STUDY_SECTIONS[CASE_STUDY_SECTIONS.length - 1]?.id;

export const FLOW_SECTIONS: SidebarSectionConfig[] = [
  { id: 'screens-introduction', label: 'Intro', hidden: true },
  { id: 'screens-catalog', label: 'Catalog' },
  { id: 'screens-checkout', label: 'Checkout' },
  { id: 'screens-accounts', label: 'Accounts' },
  { id: 'screens-admin', label: 'Admin' }
] as const;

export const FLOW_BOTTOM_SECTION_ID = FLOW_SECTIONS[FLOW_SECTIONS.length - 1]?.id;

export const TLDR_ITEMS: {
  title: string;
  description: ReactNode;
  image: { src: string; alt: string; };
}[] = [
  {
    title: 'What It Is',
    description: (
      <>
        <WhiteTransitionAnchor href="https://www.antisyphontraining.com/" target='_blank' rel='noopener noreferrer'>
          Antisyphon Training
        </WhiteTransitionAnchor>{' '}
        is Black Hills Information Security&rsquo;s learning platform for live, on-demand, and pay-what-you-can security courses.
      </>
    ),
    image: {
      src: '/img/antisyphon/home.webp',
      alt: 'Antisyphon Training homepage hero'
    }
  },
  {
    title: 'The Challenge',
    description: 'Replace a static marketing site and scattered LMS touchpoints with a cohesive shopping and learning experience.',
    image: {
      src: '/img/antisyphon/course-catalog.webp',
      alt: 'Course catalog cards showing filtering and categories'
    }
  },
  {
    title: 'The Solution',
    description: 'A WooCommerce-powered marketplace with filters, event calendars, pay-what-you-can pricing, and dashboards for learners and corporate buyers.',
    image: {
      src: '/img/antisyphon/cart.webp',
      alt: 'Shopping cart showing multiple courses and donations'
    }
  },
  {
    title: 'My Roles',
    description: 'Product strategy, UX design, and WordPress/WooCommerce engineering plus LMS/admin integrations.',
    image: {
      src: '/img/antisyphon/admin-course-edit.webp',
      alt: 'Admin course creation form inside WordPress'
    }
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
    images: [{ src: '/img/antisyphon/course-catalog-full.webp', alt: 'Course catalog layout with badge styling' }]
  },
  {
    title: 'Build and Operate the Platform',
    bullets: [
      'Customized WooCommerce and WordPress templates for live/on-demand products, bundles, and donations.',
      'Integrated with the LMS plus PHP/MySQL services for progress tracking, certificates, and reporting.',
      'Streamlined admin forms and ACF-driven inputs, cutting course setup time by roughly 85%.'
    ],
    images: [
      { src: '/img/antisyphon/admin-order-edit.webp', alt: 'Admin order edit view with custom fields' }
    ]
  },
  {
    title: 'Corporate Teams and Admin Dashboards',
    bullets: [
      'Wireframed a full corporate administration dashboard for team-based cybersecurity training with explicit roles and guardrails.',
      'Mapped hierarchies for organizations, teams, team leads, and learners to ensure correct access to enrollments, receipts, and certificates.',
      'Designed roster and reporting flows so team leads can manage seats, compliance statuses, and constraints without breaking LMS sync.'
    ],
    images: [
      { src: '/img/antisyphon/wireframe-corporate-dashboard.webp', alt: 'Corporate dashboard with course progress' }
    ]
  }
] ;

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
  { src: '/img/antisyphon/course-catalog.webp', alt: 'Course catalog with category filters' },
  { src: '/img/antisyphon/pwyc-open.webp', alt: 'Pay-what-you-can options in the cart' },
  { src: '/img/antisyphon/checkout-1.webp', alt: 'Checkout form with billing details' },
  { src: '/img/antisyphon/dashboard-my-live-courses-prod.webp', alt: 'Learner dashboard showing live courses' },
  { src: '/img/antisyphon/cis-course.webp', alt: 'Course detail page with syllabus and schedule' },
  { src: '/img/antisyphon/admin-course-edit.webp', alt: 'Admin course edit screen with custom fields' },
] as const;

type FlowBlock = {
  id: string;
  title: string;
  copy: ReactNode;
  images: { src: string; alt: string; }[];
  reverse?: boolean;
};

export const FLOW_BLOCKS: FlowBlock[] = [
  {
    id: 'screens-catalog',
    title: 'Catalog and Discovery',
    copy: (
      <>
        Responsive cards, filters, and search make it easy to compare live versus on-demand courses. Category callouts and
        badge styling reinforce tone while keeping the catalog scannable.
      </>
    ),
    images: [
      { src: '/img/antisyphon/course-catalog.webp', alt: 'Full course catalog with category filters and badges' },
      { src: '/img/antisyphon/live-od-boxes.webp', alt: 'Live and on-demand callout boxes on the homepage' },
      { src: '/img/antisyphon/course-catalog-list.webp', alt: 'Catalog cards for live and on-demand courses' },
      { src: '/img/antisyphon/search-open.webp', alt: 'Search bar expanded over the course list' }
    ]
  },
  {
    id: 'screens-checkout',
    title: 'Cart and Checkout',
    copy: (
      <>
        WooCommerce flows were customized for multi-course carts, pay-what-you-can pricing, and streamlined tax handling.
        Users see clear totals before entering billing details.
      </>
    ),
    images: [
      { src: '/img/antisyphon/cart.webp', alt: 'Cart showing courses and donations' },
      { src: '/img/antisyphon/checkout-1.webp', alt: 'Cart with pay-what-you-can controls' }
    ],
    reverse: true
  },
  {
    id: 'screens-accounts',
    title: 'Learner Accounts',
    copy: (
      <>
        Logged-in dashboards separate live and on-demand enrollments, store saved payment methods, and surface certificates.
        Progress and access details come directly from LMS and billing APIs.
      </>
    ),
    images: [
      { src: '/img/antisyphon/dashboard-my-live-courses-prod.webp', alt: 'Dashboard showing upcoming live courses' },
      { src: '/img/antisyphon/dashboard-saved-cc.webp', alt: 'Saved cards and billing preferences' }
    ]
  },
  {
    id: 'screens-admin',
    title: 'Admin and Operations',
    copy: (
      <>
        Admin tools built on Advanced Custom Fields, Events Tickets Plus, and custom PHP endpoints let ops teams edit orders,
        manage course dates, and monitor syncing.
      </>
    ),
    images: [
      { src: '/img/antisyphon/admin-course-edit.webp', alt: 'Course edit form with advanced custom fields' },
      { src: '/img/antisyphon/admin-event-tickets.webp', alt: 'Event ticket settings for a live course' }
    ],
    reverse: true
  }
] as const;
