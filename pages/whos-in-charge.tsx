import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/whos-in-charge/';
const TITLE = 'Who’s In Charge?';
const SUMMARY = 'An Internal Family Systems journaling app with tarot-style imagery.';
const HERO_IMAGE = { src: '/img/squares/king-512.webp', alt: 'Who’s In Charge? crown logo' };

const WhosInChargePage = () => (
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
      'UX architecture',
      'Visual design',
      'Images and text',
    ]}
    projectLink={{ href: 'https://whosincharge.michaelzick.com/', label: 'whosincharge.michaelzick.com' }}
    sections={[
      {
        title: 'Visually rich and provocative',
        body: (
          <>
            Using a tarot card motif, I designed a bold, engaging visual system that invites users to explore their inner parts
            while journaling. The homepage clearly communicates the app’s purpose with IFS information and instructions.
          </>
        ),
        image: { src: '/img/projects/wic/wic-home.webp', alt: 'Homepage with primary CTA to start journaling' }
      },
      {
        title: 'Guided prompts without overwhelm',
        body: (
          <>
            The entry flow uses simple prompts and quick-tagging to help users capture their internal experience
            without getting bogged down by the UI.
          </>
        ),
        image: { src: '/img/projects/wic/wic-entry.webp', alt: 'Entry flow with prompts and quick tagging' }
      },
      {
        title: 'Rich IFS overviews',
        body: (
          <>
            Part details allow users to gain insights into their roles, relationships, and emotions,
            while offering larger images to deepen the connection.
          </>
        ),
        image: { src: '/img/projects/wic/wic-parts.webp', alt: 'Parts overview showing current cast' }
      },
      {
        title: 'Privacy-first journaling',
        body: (
          <>
            Given the sensitive nature of journaling, I built in privacy features like local storage and export options
            so users can keep their data secure and in their control. No logins or accounts are required.
          </>
        ),
        image: { src: '/img/projects/wic/wic-export.webp', alt: 'Export modal with sharing options' }
      }
    ]}
    />
  </>
);

export default WhosInChargePage;
