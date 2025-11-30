import ProjectShowcase from '../src/components/ProjectShowcase';

const AdamChiapponePage = () => (
  <ProjectShowcase
    title='Adam Chiappone'
    summary='A welcoming therapy site that translates Adam’s in-person warmth into a digital experience.'
    heroImage={{ src: '/img/projects/adam-chiappone/ac-home-cropped.webp', alt: 'Adam Chiappone homepage hero' }}
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
);

export default AdamChiapponePage;
