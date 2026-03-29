import { type ReactNode } from 'react';

import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const FLOW_SECTIONS: SidebarSectionConfig[] = [
  { id: 'screens-introduction', label: 'Intro', hidden: true },
  { id: 'screens-catalog', label: 'Course Catalog' },
  { id: 'screens-checkout', label: 'Cart & Checkout' },
  { id: 'screens-accounts', label: 'User Accounts' },
  { id: 'screens-admin', label: 'Admin Dashboard' }
] as const;

export const FLOW_BOTTOM_SECTION_ID = FLOW_SECTIONS[FLOW_SECTIONS.length - 1]?.id;

export type FlowBlock = {
  id: string;
  title: string;
  copy: ReactNode;
  images: { src: string; alt: string; }[];
  reverse?: boolean;
};

export const FLOW_BLOCKS: FlowBlock[] = [
  {
    id: 'screens-catalog',
    title: 'Course Catalog',
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
    title: 'Cart & Checkout',
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
    title: 'User Accounts',
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
    title: 'Admin Dashboard',
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
