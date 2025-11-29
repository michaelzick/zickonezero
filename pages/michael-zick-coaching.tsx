import ProjectShowcase from '../src/components/ProjectShowcase';

const MichaelZickCoachingPage = () => (
  <ProjectShowcase
    title='Michael Zick Coaching'
    summary='A coaching hub that pairs clarity of services with a confident, energetic visual system.'
    heroImage={{ src: '/img/squares/mz-ppc-logo.webp', alt: 'Michael Zick Coaching logo' }}
    roleBullets={[
      'Brand identity',
      'Visual design',
      'Scheduling instrumentation'
    ]}
    projectLink={{ href: 'https://www.michaelzick.com/', label: 'michaelzick.com' }}
    sections={[
      {
        title: 'Offer clarity that sparks action',
        body: (
          <>
            The homepage stacks a focused headline, outcomes-oriented bullets, and a bold “Book Now” CTA so visitors immediately
            see who it’s for and how to start. Services and pricing cues are above the fold to remove hesitation.
          </>
        ),
        image: { src: '/img/projects/michael-zick-coaching/mzc-home.webp', alt: 'Coaching homepage with clear offers and CTA' }
      },
      {
        title: 'Booking that respects momentum',
        body: (
          <>
            Program cards pair outcomes with a simple “Book Now” rail, reinforcing value and making the next step frictionless.
            Supporting copy answers objections up front, so the calendar click feels like a natural follow-through.
          </>
        ),
        image: { src: '/img/projects/michael-zick-coaching/mzc-program.webp', alt: 'Program overview and booking call-to-action' }
      },
      {
        title: 'Always-on storytelling',
        body: (
          <>
            Testimonials and proof points are woven into the page, highlighting past client wins and credibility signals to build
            trust before the booking step. Social proof stays close to CTAs to lift conversion.
          </>
        ),
        image: { src: '/img/projects/michael-zick-coaching/mzc-testimonial.webp', alt: 'Testimonials and social proof layout' }
      },
      {
        title: 'Measure and iterate',
        body: (
          <>
            The mobile flow mirrors the desktop journey—hero, value props, and testimonials—so visitors can scan and book from
            their phone without losing context. Analytics track tap-to-book and scroll depth to refine the funnel.
          </>
        ),
        image: {
          src: '/img/projects/michael-zick-coaching/mzc-mobile.webp',
          alt: 'Mobile experience for booking and offers',
          position: 'top'
        }
      }
    ]}
  />
);

export default MichaelZickCoachingPage;
