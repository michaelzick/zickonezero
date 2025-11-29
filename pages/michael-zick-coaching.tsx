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
    projectLink={{ href: 'https://www.michaelzick.com/', label: 'www.michaelzick.com' }}
    sections={[
      {
        title: 'Clarity, flow, and conversion',
        body: (
          <>
            Using water as inspiration, I designed a vibrant, approachable brand identity that reflects my coaching style.
            The site layout guides visitors through clear offers and benefits, while keeping the scheduling button in easy reach.
          </>
        ),
        image: { src: '/img/projects/michael-zick-coaching/mzc-home.webp', alt: 'Coaching homepage with clear offers and CTA' }
      },
      {
        title: 'Booking that respects momentum',
        body: (
          <>
            The Program card pairs outcomes with a simple “Book a Free Session” CTA, reinforcing value and making the next step frictionless.
            Meanwhile, gracefully-animated tabs let visitors explore offerings without losing context.
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
        title: 'Responsiveness without compromise',
        body: (
          <>
            The mobile flow mirrors the desktop journey, value props, and testimonials, so visitors can scan and book from
            their phone with ease. Analytics track visitors, page views, and device types.
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
