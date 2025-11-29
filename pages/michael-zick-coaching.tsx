import ProjectShowcase from '../src/components/ProjectShowcase';

const MichaelZickCoachingPage = () => (
  <ProjectShowcase
    title='Michael Zick Coaching'
    summary='A coaching hub that pairs clarity of services with a confident, energetic visual system.'
    heroImage={{ src: '/img/squares/mz-ppc-logo.webp', alt: 'Michael Zick Coaching logo' }}
    roleBullets={[
      'Brand identity, tone, and visual system',
      'UX/UI for services, testimonials, and lead capture',
      'Site build with fast, mobile-first performance',
      'Scheduling + analytics instrumentation'
    ]}
    projectLink={{ href: 'https://www.michaelzick.com/', label: 'michaelzick.com' }}
    sections={[
      {
        title: 'Offer clarity that sparks action',
        body: (
          <>
            Reframed offerings around outcomes—career pivots, leadership coaching, and habit systems—supported by concise proof
            points and testimonial highlights.
          </>
        ),
        image: { src: '/img/demostoke/feat-events.webp', alt: 'Offer grid with emphasis on outcomes' }
      },
      {
        title: 'Booking that respects momentum',
        body: (
          <>
            Streamlined discovery and intro-call scheduling into a single flow, with contextual FAQs and assurances on prep,
            pricing, and what to expect.
          </>
        ),
        image: { src: '/img/demostoke/events-calendar.webp', alt: 'Scheduling interface aligned to coaching availability' }
      },
      {
        title: 'Always-on storytelling',
        body: (
          <>
            Built modular content blocks for articles, workshop promos, and client wins. Layered event tracking to see which
            stories convert readers into consults.
          </>
        ),
        image: { src: '/img/demostoke/blog-with-drafts.webp', alt: 'Content layout showcasing articles and promos' }
      }
    ]}
  />
);

export default MichaelZickCoachingPage;
