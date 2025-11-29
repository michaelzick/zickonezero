import ProjectShowcase from '../src/components/ProjectShowcase';

const FindYourFlowStatePage = () => (
  <ProjectShowcase
    title='Find Your Flow State'
    summary='A free career personality assessment that turns curiosity into tailored coaching offers.'
    heroImage={{ src: '/img/squares/fyfs-wave-square.webp', alt: 'Find Your Flow State logo' }}
    roleBullets={[
      'Product strategy, quiz logic, and archetype mapping',
      'UX/UI design system tailored to the brand’s wave motif',
      'Front-end build with rapid experimentation hooks',
      'Analytics + conversion tracking for funnel drop-off'
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
        image: { src: '/img/demostoke/gear-quiz.webp', alt: 'Quiz UI showcasing interactive questions' }
      },
      {
        title: 'Insightful results that nudge action',
        body: (
          <>
            Archetype scoring rolls into personalized next steps—downloadable PDFs, suggested coaching tracks, and email nurture
            paths—so users leave with clarity instead of just a score.
          </>
        ),
        image: { src: '/img/demostoke/feat-posts.webp', alt: 'Results feed with highlighted recommendations' }
      },
      {
        title: 'Conversion-ready from day one',
        body: (
          <>
            Embedded event tracking for quiz completions, drop-offs, and CTA clicks, with server-side friendly linkouts so we can
            A/B copy, CTA placement, and follow-up offers without redeploys.
          </>
        ),
        image: { src: '/img/demostoke/events-calendar.webp', alt: 'Calendar and events view used for conversion experiments' }
      }
    ]}
  />
);

export default FindYourFlowStatePage;
