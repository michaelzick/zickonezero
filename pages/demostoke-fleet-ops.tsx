import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/demostoke-fleet-ops/';
const TITLE = 'DemoStoke Fleet Ops';
const SUMMARY = 'A gear shop dashboard and embeddable booking widget with DemoStoke integration.';
const HERO_IMAGE = { src: '/img/fleet-ops/ds-fleet-ops-gear-edit.webp', alt: 'DemoStoke Fleet Ops dashboard' };

const DemoStokeFleetOpsPage = () => (
  <>
    <Seo
      title={TITLE}
      description={SUMMARY}
      path={PATH}
      type='article'
      ogImage={HERO_IMAGE.src}
      jsonLd={[
        creativeWorkJsonLd({ name: TITLE, description: SUMMARY, path: PATH, image: HERO_IMAGE.src }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: TITLE, path: PATH },
        ]),
      ]}
    />
    <ProjectShowcase
      title={TITLE}
      summary={SUMMARY}
      heroImage={HERO_IMAGE}
      roleBullets={[
      'Product strategy',
      'UX design',
      'Full-stack development'
    ]}
    projectLink={{ href: 'https://fleet.demostoke.com/', label: 'fleet.demostoke.com' }}
    sections={[
      {
        title: 'Fleet command center',
        body: (
          <>
            Real-time KPI cards surface total equipment, active bookings, revenue, and pending actions at a glance.
            Shop operators get an instant read on fleet health without digging through data.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-dashboard.webp', alt: 'DemoStoke Fleet Ops dashboard overview' }
      },
      {
        title: 'SKU-level gear visibility',
        body: (
          <>
            Every piece of kit in one view. Search, filter by category or brand, toggle live/hidden visibility per item,
            and see per-day pricing. Operators have full control over what customers can discover and book.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-equipment.webp', alt: 'DemoStoke Fleet Ops equipment inventory list' }
      },
      {
        title: 'Live gear editor with widget preview',
        body: (
          <>
            Edit gear details, upload photos, set pricing, and watch an inline widget preview update in real time.
            Operators know exactly how each item will appear to customers before going live.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-gear-edit.webp', alt: 'DemoStoke Fleet Ops gear edit form with widget preview' }
      },
      {
        title: 'Booking pipeline at a glance',
        body: (
          <>
            Full reservation management with status lifecycle (pending, confirmed, completed), search by customer name,
            email, or equipment, and inline refund processing for confirmed payments.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-bookings.webp', alt: 'DemoStoke Fleet Ops bookings management' }
      },
      {
        title: 'Revenue and utilization insights',
        body: (
          <>
            Multi-chart dashboard covering revenue by date and category, bookings by status, top-performing gear,
            and predictive revenue forecasts. All filterable by date range.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-analytics.webp', alt: 'DemoStoke Fleet Ops analytics dashboard' }
      },
      {
        title: 'Drop-in booking widget for any site',
        body: (
          <>
            A single script tag embeds a fully branded, Stripe-powered booking flow directly into any shop&apos;s existing
            website. Choose from multiple themes in the widget preview and save the selection instantly.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-widget-hi.webp', alt: 'DemoStoke Fleet Ops embeddable booking widget' }
      },
      {
        title: 'Compact gear discovery embed',
        body: (
          <>
            A lightweight widget variant that fits tight sidebar and landing-page placements, surfacing gear cards
            and availability without the full checkout flow taking over the host page.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-widget-low.webp', alt: 'DemoStoke Fleet Ops compact gear widget' }
      },
      {
        title: 'Your shop, everywhere gear is searched',
        body: (
          <>
            When a shop embeds the DemoStoke Fleet Ops widget, their inventory becomes discoverable across search engines
            and AI platforms. Structured gear data surfaces in rich results, putting each rental item in front of riders
            wherever they&apos;re already looking.
          </>
        ),
        image: { src: '/img/fleet-ops/ds-fleet-ops-big-mountain.webp', alt: 'DemoStoke Fleet Ops gear shop with embedded widget' }
      }
    ]}
    />
  </>
);

export default DemoStokeFleetOpsPage;
