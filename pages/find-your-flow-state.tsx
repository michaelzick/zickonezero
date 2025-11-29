import ProjectShowcase from '../src/components/ProjectShowcase';

const FindYourFlowStatePage = () => (
  <ProjectShowcase
    title='Find Your Flow State'
    summary='A free AI-powered career personality assessment quiz.'
    heroImage={{ src: '/img/projects/fyfs/fyfs-wave.webp', alt: 'Find Your Flow State logo' }}
    subNavImage={{ src: '/img/squares/fyfs-wave-square.webp', alt: 'Find Your Flow State logo' }}
    roleBullets={[
      'Product strategy',
      'Quiz questions',
      'UX design'
    ]}
    projectLink={{ href: 'https://findyourflowstate.zickonezero.com/', label: 'findyourflowstate.zickonezero.com' }}
    sections={[
      {
        title: 'A quiz that feels like coaching',
        body: (
          <>
            I crafted a calm, simple flow with questions that guide users through reflective prompts, while visual rhythm
            (waves, motion, and warm colors) keeps the experience playful instead of clinical.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-home.webp', alt: 'Find Your Flow State homepage' }
      },
      {
        title: 'Intelligent questions based on research',
        body: (
          <>
            Using top-tier research on career personality types, individual history, and mental models, I developed questions that
            help users uncover their unique work preferences and optimal environments.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-quiz-1.webp', alt: 'Quiz question interface' }
      },
      {
        title: 'Start where you left off or start from scratch',
        body: (
          <>
            Users can upload previous answers as JSON from past attempts or start fresh with new responses.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-quiz-2.webp', alt: 'Second quiz step experience' }
      },
      {
        title: 'Results that inspire action',
        body: (
          <>
            Clear archetype summaries paired with tailored recommendations (jobs, relationships, and shadow work) give users a confident
            path forward in multiple areas of life.
          </>
        ),
        image: { src: '/img/projects/fyfs/fyfs-results.webp', alt: 'Quiz results page with recommendations' }
      }
    ]}
  />
);

export default FindYourFlowStatePage;
