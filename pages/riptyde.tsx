import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/riptyde/';
const TITLE = 'Riptyde';
const SUMMARY = 'A neo-brutalist iOS surf forecast app that boils West Coast conditions down to one RAD-O-METER score.';
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
        'UX/UI design',
        'iOS development',
      ]}
      projectLink={{ href: 'https://apps.apple.com/us/app/riptyde/id6793336480', label: 'App Store' }}
      sections={[
        {
          title: 'One number. No excuses.',
          body: (
            <>
              Surf forecasts bury the answer under swell charts and jargon. Riptyde opens on a single
              RAD-O-METER™ score for your home break, with the ten-day outlook, wind, and next tide right
              underneath so the go/no-go call takes seconds.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-home.webp', alt: 'Riptyde home screen with RAD-O-METER score and ten-day outlook' }
        },
        {
          title: 'Show the work behind the score',
          body: (
            <>
              Tapping the score opens the RAD Breakdown: wave height, period, wind, and swell direction each
              get a rating, a plain-language note, and their contribution to the total. Surfers can trust the
              number because they can see how it was built.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-rad-page.webp', alt: 'RAD Breakdown detail screen explaining each forecast factor' }
        },
        {
          title: 'Scope the lineup',
          body: (
            <>
              The Lineup ranks every spot by score with quick filters for favorites, custom spots, and break
              type. Distance from the map and a color-coded rating make it easy to pick where to paddle out.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-spots.webp', alt: 'The Lineup spot list sorted by RAD-O-METER score' }
        },
        {
          title: 'Beach cams, one tap away',
          body: (
            <>
              Live stills from public beach cams sit beside the forecast so a surfer can confirm conditions
              with their own eyes. Each cam refreshes on demand and links straight to the source feed.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-cams.webp', alt: 'Beach Cams screen with live stills and refresh controls' }
        },
        {
          title: 'Cams on the map',
          body: (
            <>
              A West Coast cam map puts every feed in geographic context, so users can scan the coastline
              from Santa Monica to Palos Verdes and jump to the nearest camera.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-map.webp', alt: 'West Coast cam map with camera pins along the Los Angeles coastline' }
        },
        {
          title: 'Rewind ten days',
          body: (
            <>
              Throwback mode replays the last ten days of scores and conditions. Surfers can compare what
              they rode to what the forecast said, which builds intuition about their home break.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-throwback.webp', alt: 'Throwback mode showing a ten-day history of scores' }
        },
        {
          title: 'Charts, tide, and AI summaries',
          body: (
            <>
              Below the score, hourly surf-quality charts, wind and tide cards, a board recommendation, and an
              AI-generated summary give the detail-oriented surfer everything without cluttering the top of
              the screen.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-home-bottom.webp', alt: 'Surf quality chart, wind, tide, board, and AI summary cards' }
        },
        {
          title: 'Sessions, streaks, and crew',
          body: (
            <>
              Profile tracks logged sessions, waves, hours, and best scores, and a Crew feature lets friends
              share sessions and secret spots. Streaks keep the habit going between swells.
            </>
          ),
          image: { src: '/img/projects/riptyde/riptyde-profile.webp', alt: 'Profile screen with session stats, streak, and crew' }
        }
      ]}
    />
  </>
);

export default RiptydePage;
