import { type ReactNode } from 'react';

import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const SCREEN_SECTIONS: SidebarSectionConfig[] = [
  { id: 'screens-introduction', label: 'Intro', hidden: true },
  { id: 'screens-explore', label: 'Explore' },
  { id: 'screens-gear-and-shops', label: 'Gear and Shops' },
  { id: 'screens-gear-quiz', label: 'Gear Quiz' },
  { id: 'screens-demo-calendar', label: 'Demo Calendar' },
  { id: 'screens-list-your-gear', label: 'List Your Gear' }
] as const;

export const SCREEN_BOTTOM_SECTION_ID = SCREEN_SECTIONS[SCREEN_SECTIONS.length - 1]?.id;

// Hero image for the Product Screens intro; prepended to the lightbox sources
// ahead of the block images.
export const SCREEN_HERO_IMAGE = {
  src: '/img/demostoke/screens/ds-screen-home.webp',
  alt: 'DemoStoke homepage with a gear search box and category shortcuts'
} as const;

export type ScreenBlock = {
  id: string;
  title: string;
  copy: ReactNode;
  images: { src: string; alt: string; }[];
};

// Captured from the live site at demostoke.com.
export const SCREEN_BLOCKS: ScreenBlock[] = [
  {
    id: 'screens-explore',
    title: 'Explore and Search',
    copy: (
      <>
        Explore shows gear on a map, in a list, or both side by side, and the list keeps to whatever stretch of coast or
        mountain is on the map. Search takes plain language, like &quot;beginner surfboard for small waves,&quot; and turns
        it into filtered results.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-screen-explore.webp', alt: 'DemoStoke explore page with gear cards beside a map of Los Angeles' },
      { src: '/img/demostoke/screens/ds-screen-search.webp', alt: 'DemoStoke search results for a plain-language surfboard query' }
    ]
  },
  {
    id: 'screens-gear-and-shops',
    title: 'Gear and Shops',
    copy: (
      <>
        Every listing has its own page with the daily price, specs, the shop or owner behind it, and similar gear nearby.
        Book Now puts the rider in touch with the shop to arrange the rental. Shop pages carry the shop&apos;s story,
        contact details, and full inventory.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-screen-gear.webp', alt: 'DemoStoke gear page for a longboard with its daily price and a Book Now button' },
      { src: '/img/demostoke/screens/ds-screen-shop.webp', alt: 'DemoStoke shop page for Pacific Beach Surf Shop with its available equipment' }
    ]
  },
  {
    id: 'screens-gear-quiz',
    title: 'Gear Quiz',
    copy: (
      <>
        Six short steps, starting with the sport, end in AI recommendations matched to how the rider actually rides.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-screen-quiz.webp', alt: 'DemoStoke gear quiz first step with surfboard, snowboard, ski, and mountain bike choices' }
    ]
  },
  {
    id: 'screens-demo-calendar',
    title: 'Demo Calendar',
    copy: (
      <>
        Demo days from shops and brands, filtered by distance and sport. A weekly job searches the web for new events,
        pulls out the details, and publishes them, so the calendar stays current without anyone typing it in. Each event
        gets a page with the host, time, location, and a link to the event&apos;s own site.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-screen-calendar.webp', alt: 'DemoStoke demo calendar month view with distance and category filters' },
      { src: '/img/demostoke/screens/ds-screen-event.webp', alt: 'DemoStoke event page for a surfboard demo day with its host, date, and location' }
    ]
  },
  {
    id: 'screens-list-your-gear',
    title: 'List Your Gear',
    copy: (
      <>
        The way in for lenders. Owners add boards and bikes through a short form, and shops get a path to bring in
        inventory from their point-of-sale system.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-screen-list.webp', alt: 'DemoStoke List Your Gear page with manual entry and point-of-sale options' }
    ]
  }
] as const;
