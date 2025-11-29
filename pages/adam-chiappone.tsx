import ProjectShowcase from '../src/components/ProjectShowcase';

const AdamChiapponePage = () => (
  <ProjectShowcase
    title='Adam Chiappone'
    summary='A welcoming therapy site that translates Adam’s in-person warmth into a digital experience.'
    heroImage={{ src: '/img/squares/adam-chiappone-square.webp', alt: 'Adam Chiappone brand mark' }}
    roleBullets={[
      'Brand voice, IA, and content architecture',
      'UX/UI design with accessibility baked in',
      'Headless CMS setup for effortless updates',
      'Technical SEO and schema for local discovery'
    ]}
    projectLink={{ href: 'https://www.adamchiappone.com/', label: 'adamchiappone.com' }}
    sections={[
      {
        title: 'Warm, low-friction intake',
        body: (
          <>
            Crafted a lightweight inquiry flow that reassures visitors with clear expectations, transparent pricing cues,
            and friendly microcopy that mirrors Adam’s tone.
          </>
        ),
        image: { src: '/img/demostoke/blog-with-drafts.webp', alt: 'Intake flow with welcoming copy' }
      },
      {
        title: 'Service clarity without jargon',
        body: (
          <>
            Organized specialties, modalities, and FAQs into skimmable sections with anchor links and pull quotes, so visitors
            can quickly validate fit and reach out confidently.
          </>
        ),
        image: { src: '/img/demostoke/blog-drafts.webp', alt: 'Content blocks arranged for readability' }
      },
      {
        title: 'Maintainable by design',
        body: (
          <>
            Set up a headless CMS with reusable page sections and color tokens, ensuring future edits stay on-brand without
            touching code. Added structured data to lift local search visibility.
          </>
        ),
        image: { src: '/img/demostoke/feat-posts.webp', alt: 'CMS-driven components with consistent styling' }
      }
    ]}
  />
);

export default AdamChiapponePage;
