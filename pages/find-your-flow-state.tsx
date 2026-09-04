import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/find-your-flow-state/';
const TITLE = 'Find Your Flow State';
const SUMMARY = 'A free AI-powered career personality assessment quiz.';
const HERO_IMAGE = { src: '/img/projects/fyfs/fyfs-wave.webp', alt: 'Find Your Flow State logo' };

const FindYourFlowStatePage = () => (
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
      'Product strategy',
      'Quiz questions',
      'UX design'
    ]}
    projectLink={{ href: 'https://findyourflowstate.michaelzick.com/', label: 'findyourflowstate.michaelzick.com' }}
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
  </>
);

export default FindYourFlowStatePage;
