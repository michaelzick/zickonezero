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
              Surf forecasts bury the answer under swell charts and jargon. Riptyde opens on a single
              RAD-O-METER™ score for your home break, with the ten-day outlook, wind, and next tide right
              underneath so the go/no-go call takes seconds.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-home.webp', alt: 'Riptyde home screen with RAD-O-METER™ score and ten-day outlook' }
        },
        {
          title: 'Show the work behind the score',
          body: (
            <>
              Tapping the score opens the RAD breakdown: wave height, period, wind, and swell direction each
              get a rating, a plain-language note, and their share of the total. No black box, no guesswork.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-rad-page.webp', alt: 'RAD breakdown detail screen explaining each forecast factor' }
        },
        {
          title: 'Scope the lineup',
          body: (
            <>
              The Lineup ranks every spot by score, with quick filters for favorites, custom spots, and break
              type. Each card shows distance and a color-coded rating, so picking where to paddle out takes a
              glance.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-spots.webp', alt: 'The Lineup spot list sorted by RAD-O-METER™ score' }
        },
        {
          title: 'Beach cams, one tap away',
          body: (
            <>
              Public beach cams sit beside the forecast so surfers can check conditions with their own
              eyes. Each cam refreshes on demand and links straight to the source feed.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-cams.webp', alt: 'Beach Cams screen with live stills and refresh controls' }
        },
        {
          title: 'Every break on the map',
          body: (
            <>
              The map pins every surf spot on the West Coast, from British Columbia down to San Diego.
              Surfers can see how nearby breaks sit relative to each other and jump straight to the closest
              one.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-map.webp', alt: 'Map of West Coast surf spots, zoomed to the pins along the Los Angeles coastline' }
        },
        {
          title: 'Rewind ten days',
          body: (
            <>
              Throwback mode replays the last ten days of scores and conditions. Surfers can compare what
              they rode with what the forecast said and get a feel for how the score plays out in the water.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-throwback.webp', alt: 'Throwback mode showing a ten-day history of scores' }
        },
        {
          title: 'Charts, tide, and AI summaries',
          body: (
            <>
              Below the score, hourly surf-quality charts, wind and tide cards, a board recommendation, and an
              AI summary are there for surfers who want the details, without crowding the top of the screen.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-home-bottom.webp', alt: 'Surf quality chart, wind, tide, board, and AI summary cards' }
        },
        {
          title: 'Sessions, streaks, and crew',
          body: (
            <>
              Profile tracks sessions, waves, hours, and best scores. Crew lets friends share sessions and
              secret spots, and streaks keep the habit going.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-profile.webp', alt: 'Profile screen with session stats, streak, and crew' }
        }
      ]}
    />
  </>
);

export default RiptydePage;
