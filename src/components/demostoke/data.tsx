import { type ReactNode } from 'react';
import { SidebarSectionConfig } from '../SidebarSectionTabs';

export const CASE_STUDY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'hero-spacer', label: 'Intro Spacer', hidden: true },
  { id: 'section-the-what', label: 'The What' },
  { id: 'section-the-how', label: 'The How' },
  { id: 'section-methodology', label: 'Methods' },
  { id: 'section-the-who', label: 'The Who' }
] as const;

export const CASE_STUDY_BOTTOM_SECTION_ID = CASE_STUDY_SECTIONS[CASE_STUDY_SECTIONS.length - 1]?.id;

export const STORY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'story-introduction', label: 'Intro', hidden: true },
  { id: 'story-independent-surfboard-shaper-title', label: 'Independent Shaper' },
  { id: 'story-weekend-warrior', label: 'Weekend Warrior' },
  { id: 'story-small-ski-shop', label: 'Small Ski/Bike Shop' }
] as const;

export const STORY_HERO_IMAGES = [
  {
    src: '/img/demostoke/pop-art-shaper.webp',
    alt: 'Independent surfboard shaper with demo boards'
  },
  {
    src: '/img/demostoke/pop-art-snowboarder.webp',
    alt: 'Snowboarder carrying her board'
  },
  {
    src: '/img/demostoke/pop-art-mtb-man-woman.webp',
    alt: 'Mountain bike rental counter'
  }
] as const;

export const TLDR_ITEMS: {
  title: string;
  description: ReactNode;
  image: { src: string; alt: string; };
}[] = [
  {
    title: 'What It Is',
    description: 'Riders and shops struggle with fragmented, offline demo and rental flows. I designed DemoStoke to be a unified marketplace to solve those issues. In validation sessions, 90% of shop owners said it would bring them more customers, and 100% of riders described it as "the thing that should already exist."',
    image: {
      src: '/img/demostoke/case-study/ds-explore-hybrid.webp',
      alt: 'DemoStoke global gear discovery collage'
    }
  },
  {
    title: 'The Problem',
    description: 'Riders want to try gear before committing, but most demos still depend on scattered shop events, word of mouth, or expensive short-term rentals. Shops and independent makers also lack a shared digital system for surfacing availability, building trust, and converting a successful demo into a sale.',
    image: {
      src: '/img/demostoke/demo-van.webp',
      alt: 'DemoStoke mobile demo van in the field'
    }
  },
  {
    title: 'The Solution',
    description: 'DemoStoke turns those fragmented offline workflows into a location-aware marketplace where riders can discover gear nearby, compare listings, and book demos or rentals with more confidence. The platform also gives shops, shapers, and individual lenders tools to showcase inventory, manage availability, and turn trial experiences into repeat business.',
    image: {
      src: '/img/demostoke/surf-shop.webp',
      alt: 'Surf shop displaying boards available for demo'
    }
  },
  {
    title: 'My Roles',
    description: 'I led DemoStoke end to end as founder, UX designer, and full-stack developer, shaping the product strategy, research, information architecture, user flows, and visual system. I also built the front end, auth and dashboard flows, database-backed features, and AI-assisted discovery tooling needed to turn the concept into a working web application.',
    image: {
      src: '/img/demostoke/ds-design-system.webp',
      alt: 'DemoStoke design system components'
    }
  }
] as const;

export const METHOD_SECTIONS = [
  {
    title: 'Primary and Secondary Research',
    bullets: [
      'Interviewed riders across surf, snow, and MTB to surface demo frustrations and trust gaps.',
      'Captured quotes about convenience, selection, and safety to anchor problem statements.',
      'Benchmarked competitors and availability patterns to spot underserved sports and locations.'
    ],
    image: { src: '/img/demostoke/zoom-call-good.webp', alt: 'Two people talking during a video call' }
  },
  {
    title: 'Empathize, Define, and Ideate With Users',
    bullets: [
      'Ran rider and shop employee interviews plus field observations to see friction in context.',
      'Framed trust-and-convenience problem statements with measurable goals for activation and conversion.',
      'Mapped discovery-to-feedback flows and prioritized must-have moments for riders and lenders.'
    ],
    image: { src: '/img/demostoke/skiiers-on-lift.webp', alt: 'Skiers riding a chairlift together' }
  },
  {
    title: 'Prototype, Test, and Refine the Product',
    bullets: [
      'Used Lovable AI to generate hi-fi pages quickly, then refined with prompt engineering.',
      'Layered custom frontend polish and Supabase to demo discovery, admin, and AI integrations.',
      'Ran moderated and unmoderated walkthroughs to validate discovery, booking, and trust cues.'
    ],
    image: { src: '/img/demostoke/surfer-and-guy-with-phone.webp', alt: 'Surfer carrying a board while walking beside a man on his phone' }
  }
] as const;

export const PERSONA_ITEMS = [
  {
    title: 'Weekend Warrior',
    bullets: [
      'Rachel (34, San Diego) is a marketing manager who rides 1-2x/month.',
      'She wants to try before buying expensive gear but is frustrated by limited demo options.',
      'She looks to Instagram and friends for recs, and wants DemoStoke to offer trusted peer reviews, easy filters, and clear pickup info.'
    ]
  },
  {
    title: 'Die-Hard',
    bullets: [
      'Chris (29, Truckee) is a remote project manager who snowboards 3-4x/week.',
      'He seeks variety in gear but shops don’t offer enough options.',
      'He’s active in forums and trades gear with friends.',
      'He wants DemoStoke to offer high-quality listings, flexible pickup, and rider reviews.'
    ]
  },
  {
    title: 'Nomadic Renter',
    bullets: [
      'Maya (31, Santa Cruz) is a van-lifer and remote UX designer who rides 1-3x/week.',
      'She doesn’t want to own a ton of gear and struggles to find quality rentals in new locations.',
      'She wants DemoStoke to offer verified local lenders, easy-to-find gear specs, and fair prices.'
    ]
  },
  {
    title: 'Local Shop Owner',
    bullets: [
      'Tony (45, South Lake Tahoe) co-owns a board shop and wants to run demos without building his own tech.',
      'He’s frustrated that most platforms don’t support niche gear.',
      'He wants DemoStoke to help list demo boards, drive traffic, and convert demos into sales.'
    ]
  },
  {
    title: 'Local Shaper',
    bullets: [
      'Dustin (38, Ventura) is a known surfboard shaper trying to grow his reputation.',
      'He wants to organize demos and track who rides his boards but lacks the tools.',
      'He wants DemoStoke to offer a shaper-specific feature, demo tracking, and review visibility.'
    ]
  },
  {
    title: 'Quiver Lender',
    bullets: [
      'Jessie (27, Encinitas) is a yoga instructor with extra boards.',
      'She wants to earn passive income but doesn’t trust Craigslist.',
      'She wants DemoStoke to provide a smooth listing flow, damage protection, reviews, verified users, and an earnings dashboard.'
    ]
  }
] as const;

export const HOW_IMAGES = [
  { src: '/img/demostoke/case-study/ds-blog.webp', alt: 'Blog home with drafts and published posts' },
  { src: '/img/demostoke/case-study/ds-blog-post.webp', alt: 'Blog drafts management view' },
  { src: '/img/demostoke/case-study/ds-shop-page.webp', alt: 'Admin dashboard' },
  { src: '/img/demostoke/case-study/ds-gear-page.webp', alt: 'Featured posts section' },
  { src: '/img/demostoke/case-study/ds-calendar-cal.webp', alt: 'Events calendar' },
  { src: '/img/demostoke/case-study/ds-calendar-list.webp', alt: 'Blog post editor' },
  { src: '/img/demostoke/case-study/ds-gear-quiz.webp', alt: 'Gear quiz' },
  { src: '/img/demostoke/case-study/ds-explore-list.webp', alt: 'Featured events section' }
] as const;
