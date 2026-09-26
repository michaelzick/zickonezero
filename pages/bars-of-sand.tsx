import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/bars-of-sand/';
const TITLE = 'Bars of Sand';
const SUMMARY = 'An interactive browser surf lab that shows how sandbars shape breaking waves, and how waves reshape the sand.';
const HERO_IMAGE = { src: '/img/projects/bars-of-sand/bars-of-sand-hero.webp', alt: 'Bars of Sand 3D terrain model of El Porto beach with a crescent sandbar, labeled with the bar crest depth and the first break' };

const BarsOfSandPage = () => (
  <>
    <Seo
      title={TITLE}
      description={SUMMARY}
      path={PATH}
      type='article'
      ogImage={HERO_IMAGE.src}
      ogImageAlt={HERO_IMAGE.alt}
      ogImageWidth={3456}
      ogImageHeight={2168}
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
      roleBullets={['Product strategy', 'product engineering', 'UX design']}
      projectLink={{ href: 'https://bars-of-sand.zickonezero.workers.dev/' }}
      sections={[
        {
          title: 'See what’s under the surf',
          body: (
            <>
              Sandbars decide where waves break, but they stay hidden underwater. I built a rotatable
              3D terrain model with elevation colors and contour lines that reveals the bar beneath the
              waves. Labels mark the bar crest and the first break, so the link between the seabed and
              the surf is easy to see.
            </>
          ),
          image: { src: '/img/projects/bars-of-sand/bars-of-sand-lab.webp', alt: 'Bars of Sand lab with bed form, swell, and wave size presets beside a 3D terrain model of a crescent sandbar labeled with the bar crest and first break' },
        },
        {
          title: 'Watch it from the lineup',
          body: (
            <>
              Presets for bar shape, swell direction, wave size, and tide are one click away, and the
              waves respond right away. The Surf view shows the result from the water, the way a surfer
              sees it. Wave height is exaggerated and labeled, while depth and distances stay true to
              scale.
            </>
          ),
          image: { src: '/img/projects/bars-of-sand/bars-of-sand-surf-view.webp', alt: 'Surf view of waves breaking over a crescent sandbar near the beach, beside the presets panel' },
        },
        {
          title: 'Fine-tune the bar',
          body: (
            <>
              Presets get people started, and the Fine-tune panel lets them go deeper. Bar height,
              position, width, and curvature each pair a slider with a numeric field and a short
              explanation. The Cross-section view slices through the water, so users can click any point
              and measure the bed below.
            </>
          ),
          image: { src: '/img/projects/bars-of-sand/bars-of-sand-cross-section.webp', alt: 'Cross-section view slicing through the water to the seabed with a selected measuring point, beside sliders for bar height, position, width, and curvature' },
        },
        {
          title: 'Keep the experiment',
          body: (
            <>
              A good run is worth coming back to. Users can name and save an experiment with its
              settings, terrain, and evolved seabed right in the browser. JSON export and import make
              runs easy to back up or share, no account needed.
            </>
          ),
          image: { src: '/img/projects/bars-of-sand/bars-of-sand-save.webp', alt: 'Save your waves dialog with an experiment name field and options to save, export JSON, and import JSON' },
        },
        {
          title: 'Explain the physics plainly',
          body: (
            <>
              A simulation only helps if people understand it. The How it works guide pairs simple
              diagrams with plain-language notes on how wind, tide, and swell change the waves. It also
              spells out the model’s assumptions and limits, so nobody mistakes the lab for a surf
              forecast.
            </>
          ),
          image: { src: '/img/projects/bars-of-sand/bars-of-sand-how-it-works.webp', alt: 'How it works page explaining how wind changes wave texture and tide changes depth, with a diagram of wind sea over a sloping beach' },
        },
      ]}
    />
  </>
);

export default BarsOfSandPage;
