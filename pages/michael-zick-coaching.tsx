import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/michael-zick-coaching/';
const TITLE = 'Michael Zick Coaching';
const SUMMARY = 'A coaching hub that pairs clarity of services with a confident, energetic visual system.';
const HERO_IMAGE = { src: '/img/squares/mz-rac-logo.webp', alt: 'Michael Zick Coaching logo' };

const MichaelZickCoachingPage = () => (
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
      'Branding, text, and design',
      'UX and product strategy',
      'Technical implementation',
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
        image: { src: '/img/projects/michael-zick-coaching/mz-home-rac.webp', alt: 'Coaching homepage with clear offers and CTA' }
      },
      {
        title: 'Presenting benefits and building momentum',
        body: (
          <>
            Prospects see the features and benefits of the coaching program up front, presenting a high-level view of what to expect.
            Tabs on the right keep them oriented while the prominent CTA turns momentum into bookings.
          </>
        ),
        image: { src: '/img/projects/michael-zick-coaching/mz-program-rac.webp', alt: 'Process overview with navigation and booking CTA' }
      },
      {
        title: 'Past wins build trust',
        body: (
          <>
            Testimonials and proof points are woven into the page, highlighting past client wins and credibility signals to build
            trust before the booking step. Social proof lifts conversion with strong images and engaging stories.
          </>
        ),
        image: { src: '/img/projects/michael-zick-coaching/mzc-testimonial.webp', alt: 'Testimonials and social proof layout' }
      },
      {
        title: 'Responsiveness without compromise',
        body: (
          <>
            The mobile flow mirrors the desktop journey, value props, and testimonials, so visitors can scan and book from
            their phone with ease. Analytics track visitors, page views, and devices.
          </>
        ),
        image: {
          src: '/img/projects/michael-zick-coaching/mz-mobile-rac.webp',
          alt: 'Mobile experience for booking and offers',
          position: 'top'
        }
      }
    ]}
    />
  </>
);

export default MichaelZickCoachingPage;
