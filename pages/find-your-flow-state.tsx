import ProjectShowcase from '../src/components/ProjectShowcase';

const FindYourFlowStatePage = () => (
  <ProjectShowcase
    title='Find Your Flow State'
    summary='A free AI-powered career personality assessment quiz.'
    heroImage={{ src: '/img/squares/fyfs-wave-square.webp', alt: 'Find Your Flow State logo' }}
    roleBullets={[
      'Product strategy',
      'Quiz questions',
      'UX design'
    ]}
    projectLink={{ href: 'https://findyourflowstate.zickonezero.com/', label: 'findyourflowstate.zickonezero.com' }}
    sections={[
      {
        title: 'Quiz journey that feels like coaching',
        body: (
          <>
            Crafted a calm, reassuring flow with microcopy that guides users through reflective prompts, while visual rhythm
            (waves, motion, and warm gradients) keeps the experience playful instead of clinical.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-home.webp', alt: 'Find Your Flow State homepage' }
      },
      {
        title: 'Insightful results that nudge action',
        body: (
          <>
            Archetype scoring rolls into personalized next steps—downloadable PDFs, suggested coaching tracks, and email nurture
            paths—so users leave with clarity instead of just a score.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-quiz-1.webp', alt: 'Quiz question interface' }
      },
      {
        title: 'Conversion-ready from day one',
        body: (
          <>
            Embedded event tracking for quiz completions, drop-offs, and CTA clicks, with server-side friendly linkouts so we can
            A/B copy, CTA placement, and follow-up offers without redeploys.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-quiz-2.webp', alt: 'Second quiz step experience' }
      },
      {
        title: 'Results that inspire next steps',
        body: (
          <>
            Clear archetype summaries paired with tailored recommendations (courses, coaching, resources) give users a confident
            path forward instead of a dead-end quiz result.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-results.webp', alt: 'Quiz results page with recommendations' }
      }
    ]}
  />
);

export default FindYourFlowStatePage;
