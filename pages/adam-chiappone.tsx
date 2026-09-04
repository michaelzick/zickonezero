import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/adam-chiappone/';
const TITLE = 'Adam Chiappone';
const SUMMARY = 'A welcoming therapy site that translates Adam’s in-person warmth into a digital experience.';
const HERO_IMAGE = { src: '/img/projects/adam-chiappone/ac-home-cropped.webp', alt: 'Adam Chiappone homepage hero' };

const AdamChiapponePage = () => (
  <>
    <Seo
      title={TITLE}
      description={SUMMARY}
      path={PATH}
      type='article'
      ogImage={HERO_IMAGE.src}
      ogImageAlt={HERO_IMAGE.alt}
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
      'Branding, imagery, and copywriting',
      'UX, layout, and technical direction',
      'SEO and analytics',
    ]}
    projectLink={{ href: 'https://www.adamchiappone.com/', label: 'www.adamchiappone.com' }}
    sections={[
      {
        title: 'Safety and warmth from the first scroll',
        body: (
          <>
            A calm hero, welcoming headshot, and immediate “Request appointment” CTA reduce anxiety for first-time visitors.
            Clear hours, insurance, and contact cues build trust and make reaching out feel low-pressure.
          </>
        ),
        image: { src: '/img/projects/adam-chiappone/ac-home.webp', alt: 'Homepage hero and contact details' }
      },
      {
        title: 'Approach that demystifies therapy',
        body: (
          <>
            The About section outlines Adam’s philosophy in plain language and invites visitors to start with a simple inquiry.
            Friendly copy and a single CTA keep the path to booking clear and reassuring.
          </>
        ),
        image: { src: '/img/projects/adam-chiappone/ac-about.webp', alt: 'About section with philosophy and CTA' }
      },
      {
        title: 'Grounded visuals and tone',
        body: (
          <>
            Soft textures and nature imagery set a supportive tone for visitors who may be anxious. The layout stays minimal so
            the focus remains on contact details and what to expect in a first session.
          </>
        ),
        image: { src: '/img/projects/adam-chiappone/ac-forest.webp', alt: 'Nature-inspired visual used in the layout' }
      },
      {
        title: 'Easy next steps and scheduling',
        body: (
          <>
            An Events page and calendar reinforce that Adam is active in the community and offers workshops. A concise footer
            repeats contact and booking paths.
          </>
        ),
        image: { src: '/img/projects/adam-chiappone/ac-event.webp', alt: 'Events and engagement section near footer' }
      }
    ]}
    />
  </>
);

export default AdamChiapponePage;
