import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/riptyde/';
const TITLE = 'Riptyde';
const SUMMARY = 'A neon-brutalist iOS surf forecast app that turns complex conditions into one RAD-O-METER™ score.';
const HERO_IMAGE = { src: '/img/projects/riptyde/riptyde-hero.webp', alt: 'Riptyde home screen header for Malibu First Point' };

const RiptydePage = () => (
  <>
    <Seo
      title={TITLE}
      description={SUMMARY}
      path={PATH}
      type='article'
      ogImage={HERO_IMAGE.src}
      ogImageWidth={1284}
      ogImageHeight={722}
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
      imageOrientation='portrait'
      roleBullets={[
        'Product strategy',
        'UX design',
        'iOS development',
      ]}
      projectLink={{ href: 'https://apps.apple.com/us/app/riptyde/id6793336480', label: 'App Store' }}
      sections={[
        {
          title: 'One number, no excuses',
          body: (
            <>
              Surf forecasts bury the answer under swell charts and jargon, so I built Riptyde around a
              single RAD-O-METER™ score for every break. The ten-day outlook, wind, and next tide sit
              right underneath, and the go/no-go call takes seconds.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-home.webp', alt: 'Riptyde home screen with RAD-O-METER™ score and ten-day outlook' }
        },
        {
          title: 'Show the work behind the score',
          body: (
            <>
              A single number is only useful if people trust it, so I designed the RAD breakdown to show the
              math. Wave height, period, wind, and swell direction each get a rating, a plain-language note,
              and their share of the total. No black box, no guesswork.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-rad-page.webp', alt: 'RAD breakdown detail screen explaining each forecast factor' }
        },
        {
          title: 'Scope the lineup',
          body: (
            <>
              The Lineup ranks every spot by score. I added quick filters for favorites, custom spots, and
              break type, and gave each card a distance and a color-coded rating, so picking where to paddle
              out takes a glance.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-spots.webp', alt: 'The Lineup spot list sorted by RAD-O-METER™ score' }
        },
        {
          title: 'Beach cams, one tap away',
          body: (
            <>
              Forecasts are still forecasts, so I put public beach cams beside the score for a look at the
              real thing. Each cam refreshes on demand and links straight to the source feed.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-cams.webp', alt: 'Beach Cams screen with live stills and refresh controls' }
        },
        {
          title: 'Every break on the map',
          body: (
            <>
              I mapped every surf spot on the West Coast, from British Columbia down to San Diego, so surfers
              can see how nearby breaks sit relative to each other and jump straight to the closest one.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-map.webp', alt: 'Map of West Coast surf spots, zoomed to the pins along the Los Angeles coastline' }
        },
        {
          title: 'Rewind ten days',
          body: (
            <>
              I added Throwback mode to replay the last ten days of scores and conditions. Surfers can compare
              what they rode with what the forecast said and get a feel for how the score plays out in the
              water.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-throwback.webp', alt: 'Throwback mode showing a ten-day history of scores' }
        },
        {
          title: 'Charts, tide, and AI summaries',
          body: (
            <>
              For surfers who want the details, I tucked hourly surf-quality charts, wind and tide cards, a
              board recommendation, and an AI summary below the score, where they don’t crowd the first
              screen.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-home-bottom.webp', alt: 'Surf quality chart, wind, tide, board, and AI summary cards' }
        },
        {
          title: 'Sessions, streaks, and crew',
          body: (
            <>
              I built the Profile to track sessions, waves, hours, and best scores, and Crew so friends can
              share sessions and secret spots. Streaks keep the habit going.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-profile.webp', alt: 'Profile screen with session stats, streak, and crew' }
        }
      ]}
    />
  </>
);

export default RiptydePage;
