import { type ReactNode } from 'react';

import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const SCREEN_SECTIONS: SidebarSectionConfig[] = [
  { id: 'screens-introduction', label: 'Intro', hidden: true },
  { id: 'screens-explore', label: 'Find Gear' },
  { id: 'screens-demo-calendar', label: 'Events' },
  { id: 'screens-fleet-ops', label: 'Fleet Ops' },
  { id: 'screens-inventory', label: 'Gear Admin' },
  { id: 'screens-booking-widget', label: 'Widget' }
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

// Rider screens come from the live site at demostoke.com. Fleet Ops screens come from
// fleet.demostoke.com, signed in to MZ Rentals, Michael's test shop, and its widget
// embedded on the demoshop.demostoke.com sample site.
export const SCREEN_BLOCKS: ScreenBlock[] = [
  {
    id: 'screens-explore',
    title: 'Find Gear and Listings',
    copy: (
      <>
        Explore shows gear on a map, in a list, or both, and the list follows the map. Search takes plain language, like
        “beginner surfboard for small waves,” and the gear quiz gives riders who don’t know what they want AI
        recommendations in six short steps. Every listing has a page with the daily price, specs, the shop or owner, and
        similar gear nearby, and Book Now puts the rider in touch with the shop. Shop pages carry the shop’s story, contact
        details, and full inventory, and owners list their own boards and bikes through a short form.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-screen-explore.webp', alt: 'DemoStoke explore page with gear cards beside a map of Los Angeles' },
      { src: '/img/demostoke/screens/ds-screen-search.webp', alt: 'DemoStoke search results for a plain-language surfboard query' },
      { src: '/img/demostoke/screens/ds-screen-quiz.webp', alt: 'DemoStoke gear quiz first step with surfboard, snowboard, ski, and mountain bike choices' },
      { src: '/img/demostoke/screens/ds-screen-gear.webp', alt: 'DemoStoke gear page for a longboard with its daily price and a Book Now button' },
      { src: '/img/demostoke/screens/ds-screen-shop.webp', alt: 'DemoStoke shop page for Pacific Beach Surf Shop with its available equipment' },
      { src: '/img/demostoke/screens/ds-screen-list.webp', alt: 'DemoStoke List Your Gear page with manual entry and point-of-sale options' }
    ]
  },
  {
    id: 'screens-demo-calendar',
    title: 'Demo Calendar',
    copy: (
      <>
        Demo days from shops and brands, filtered by distance and sport. A weekly job searches the web for new events,
        pulls out the details, and publishes them, so the calendar stays current without anyone typing it in. Each event
        gets a page with the host, time, location, and a link to the event’s own site.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-screen-calendar.webp', alt: 'DemoStoke demo calendar month view with distance and category filters' },
      { src: '/img/demostoke/screens/ds-screen-event.webp', alt: 'DemoStoke event page for a surfboard demo day with its host, date, and location' }
    ]
  },
  {
    id: 'screens-fleet-ops',
    title: 'Fleet Ops Dashboard',
    copy: (
      <>
        Fleet Ops is the shop side of DemoStoke. Its dashboard opens on equipment, bookings, revenue, and anything waiting
        on the shop. The bookings list follows each reservation from pending to completed, with Stripe refunds a click
        away, and analytics chart revenue, bookings, and utilization for any date range, with an AI panel that suggests
        what to change. These screens come from MZ Rentals, my test shop, since no shop runs on Fleet Ops yet.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-fleet-dashboard.webp', alt: 'DemoStoke Fleet Ops dashboard with equipment, booking, and revenue totals beside recent bookings and popular gear' },
      { src: '/img/demostoke/screens/ds-fleet-bookings.webp', alt: 'DemoStoke Fleet Ops bookings list with rental dates, totals, statuses, and refund actions' },
      { src: '/img/demostoke/screens/ds-fleet-analytics.webp', alt: 'DemoStoke Fleet Ops analytics with revenue and bookings charts for a 90-day range' }
    ]
  },
  {
    id: 'screens-inventory',
    title: 'Inventory',
    copy: (
      <>
        Shops manage the whole fleet from one list, with search, category and brand filters, and a switch that hides an
        item from riders. The gear editor previews the rider-facing card as the shop types, in any of five storefront
        themes.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-fleet-inventory.webp', alt: 'DemoStoke Fleet Ops equipment list with category, status, widget visibility, and daily price' },
      { src: '/img/demostoke/screens/ds-fleet-gear-editor.webp', alt: 'DemoStoke Fleet Ops gear editor with card themes and a live preview of the gear card' }
    ]
  },
  {
    id: 'screens-booking-widget',
    title: 'Booking Widget',
    copy: (
      <>
        One script tag puts a shop’s inventory on its own website. The shop picks a theme in Fleet Ops, and the widget
        carries it from browsing to dates, pricing, and checkout. Here it is embedded on a sample shop site. Checkout opens
        to riders when the first shop goes live.
      </>
    ),
    images: [
      { src: '/img/demostoke/screens/ds-fleet-widget-themes.webp', alt: 'DemoStoke Fleet Ops widget settings with the embed code and the storefront theme menu open' },
      { src: '/img/demostoke/screens/ds-fleet-widget-embed.webp', alt: 'DemoStoke booking widget embedded on a sample ski shop rentals page' },
      { src: '/img/demostoke/screens/ds-fleet-widget-dates.webp', alt: 'DemoStoke booking widget with rental dates picked and a price summary' }
    ]
  }
] as const;
