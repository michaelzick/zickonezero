import { type CaseStudyData, type CaseStudyImage } from '../caseStudy/types';

const DIR = '/img/projects/riptyde';

const phone = (file: string, alt: string): CaseStudyImage => ({ src: `${DIR}/${file}`, alt, portrait: true });
const screen = (file: string, alt: string): CaseStudyImage => ({ src: `${DIR}/${file}`, alt });

// The hero's three screens (The Lineup, Malibu First, and its score) appear
// nowhere else on the UX Case Study tab; see scripts/render-riptyde-hero.js.
const HERO = screen(
  'riptyde-case-study-hero.webp',
  'Three Riptyde iPhone screens: The Lineup ranked by score, the Malibu First Point forecast, and its RAD-O-METER™ score of 7.5'
);

export const RIPTYDE_CASE_STUDY: CaseStudyData = {
  id: 'riptyde',
  analyticsId: 'riptyde',
  name: 'Riptyde',
  intro: {
    summary: 'Riptyde is a West Coast surf forecast that gives every break one score out of 10, then shows you exactly how it got there.',
    roles: ['Product strategy', 'product engineering', 'UX design', 'iOS development'],
    image: HERO,
    imageBackground: '#0B2A4A',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/riptyde/id6793336480' },
      { label: 'Web App', href: 'https://riptyde.app' }
    ]
  },
  what: [
    {
      title: 'Product Summary',
      description: 'Riptyde is the surf forecast I wanted on my own phone. Pick a break and the RAD-O-METER™ scores it out of 10, with the best window of the day and a ten-day outlook right underneath. It covers a curated list of breaks from San Diego to Northern California, with beach cams up through Oregon, Washington, and British Columbia.',
      image: phone('riptyde-spot-outlook.webp', 'Riptyde forecast for Steamer Lane in Santa Cruz with a ten-day outlook and a RAD-O-METER™ score of 7.0')
    },
    {
      title: 'The Challenge',
      description: 'Most surf reports hand you swell stacks, tide curves, wind arrows, and buoy readings, then leave the math to you. Regulars learn to read them. Everyone else guesses, drives to the beach, and finds it flat. Even the people who can read every chart want the answer first and the details second.',
      image: phone('riptyde-swell-tide.webp', 'Riptyde swell stack with primary and secondary swells, swell direction, and the day’s tide curve')
    },
    {
      title: 'The Solution',
      description: 'Lead with the call, then show the work. Each break gets one score and a plain read like GOOD or FIRING. Scroll down and the reasons are all there: the day’s surf-quality chart, wind, tide, water temperature, a board pick, and an AI summary if you want one.',
      image: phone('riptyde-home-bottom.webp', 'Riptyde surf-quality chart with wind, tide, water temperature, board pick, and AI summary cards')
    },
    {
      title: 'My Roles',
      description: 'I built everything from the first prototype to the App Store listing: product and visual design, the SwiftUI app, the scoring model and data pipeline, the Supabase backend, and riptyde.app, the Next.js web version on the same backend.',
      image: screen('riptyde-web-rad.webp', 'riptyde.app on desktop showing the RAD-O-METER™ page for Malibu First Point with its breakdown, swell stack, and surf-quality chart')
    }
  ],
  how: {
    heading: 'Forecast Experience',
    columns: [
      {
        title: 'Reading the Water',
        copy: 'The screen reads in the order surfers decide: the score, the best window, then the conditions behind it. The RAD breakdown rates each factor on its own, from wave height and period to wind and tide, so a 7.5 never feels like a black box. Throwback rewinds a break through the last ten days, so you can check the score against what you actually rode.'
      },
      {
        title: 'Earning Trust',
        copy: 'A score is only worth checking if it holds up. Until live data lands, Riptyde shows placeholders instead of sample numbers. A day’s score depends on that day’s forecast, not the time you open the app, so it doesn’t drift between dawn and lunch. A cam Riptyde isn’t licensed to stream shows a still that opens the provider’s page.'
      }
    ],
    image: screen('riptyde-web-home.webp', 'riptyde.app on desktop showing the Malibu First Point forecast with wind, tide, water temperature, and the RAD-O-METER™ score'),
    gallery: [
      phone('riptyde-throwback.webp', 'Riptyde Throwback mode rewinding Malibu First Point to Monday, October 19'),
      phone('riptyde-cam-live.webp', 'Riptyde Beach Cams playing the live Huntington Pier cam'),
      phone('riptyde-cams.webp', 'Riptyde Beach Cams with tap-to-open stills from El Porto and Manhattan Pier'),
      phone('riptyde-map.webp', 'Riptyde cam map of the Los Angeles coast with pins from Santa Monica to Torrance'),
      phone('riptyde-crew-sessions.webp', 'Riptyde Crew screen with a friend, favorite spots, and recent sessions'),
      phone('riptyde-log-session.webp', 'Riptyde Log Session sheet with the spot, start time, duration, and wave count')
    ]
  },
  personas: [
    {
      title: 'Dawn Patrol Regulars',
      bullets: [
        'Check one or two home breaks before work and need a go or no-go in seconds.',
        'Know their spots well enough to catch a bad forecast, so the score has to match what they see in the water.',
        'Set a home break once and expect it waiting on the first screen every morning.'
      ]
    },
    {
      title: 'Road-Trippers and Travelers',
      bullets: [
        'Surf breaks they don’t know yet, where they can’t read the local conditions.',
        'Compare nearby spots by score and distance in the Lineup or on the map.',
        'Want a look at a beach cam before committing to the drive.'
      ]
    },
    {
      title: 'Forecast Nerds',
      bullets: [
        'Want the swell stack, tide curve, buoy readings, and model sources behind the number.',
        'Open the RAD breakdown to see which factor moved the score.',
        'Mark a report accurate or inaccurate when the water disagrees with it.'
      ]
    },
    {
      title: 'Crews',
      bullets: [
        'Surf with the same friends and share sessions and secret spots with them, and nobody else.',
        'Log sessions with waves and hours and keep a streak going.',
        'Put a swell alert on the calendar when a favorite break lights up.'
      ]
    }
  ],
  methods: [
    {
      title: 'Prototype First',
      bullets: [
        'Worked out the whole look in an HTML prototype before writing any Swift: brutalist 1980s surf graphics, hard ink outlines, offset shadows, and fuchsia, lime, and yellow on ocean blues.',
        'Rebuilt it screen by screen in SwiftUI, checking each one against the prototype.',
        'Set every number in a heavy display face, so the score is the first thing you see on any screen.'
      ],
      images: [phone('riptyde-profile.webp', 'Riptyde profile with preferred spot, streak, session stats, and crew')]
    },
    {
      title: 'Designing the Score',
      bullets: [
        'Built the RAD-O-METER™ from wave height, period, wind, swell direction, swell mix, short-period wind sea, and tide, each with its own rating and weight.',
        'Pulled the data from public sources: Open-Meteo marine models, NOAA buoys and tide predictions, and National Weather Service hourly forecasts.',
        'Tied each day’s score to that day’s forecast only. The live buoy feeds a separate “right now” read, so the day’s number stays put.'
      ],
      images: [phone('riptyde-granular-data.webp', 'Riptyde granular data listing the RAD factors, swell stack, tide station, and data sources behind a score')]
    },
    {
      title: 'Building It Native',
      bullets: [
        'Used MapKit for the spot map. The list follows whatever stretch of coast you’re looking at and loads forecasts only for the spots in view.',
        'Used EventKit to put swell alerts on your calendar and StoreKit 2 for Riptyde Pro.',
        'Kept accounts, favorites, sessions, and crew in Supabase, with row-level security so private spots and sessions stay private. AI summaries run on your own OpenAI or Anthropic key, stored in the iOS Keychain.'
      ],
      images: [
        phone('riptyde-spot-map.webp', 'Riptyde spot map of the San Francisco Bay Area coast with a button to drop a secret spot'),
        phone('riptyde-pro.webp', 'Riptyde Pro screen listing AI surf reads, secret spots and crew, and swell alerts')
      ]
    },
    {
      title: 'Porting It to the Web',
      bullets: [
        'Rebuilt the app as riptyde.app with Next.js on Cloudflare Workers, sharing the iOS app’s Supabase backend and AI proxy.',
        'Treated the iOS app as the source of truth. A test harness replays recorded forecast data through the Swift code, and the web version has to match its scores exactly.',
        'Rendered every public spot page with real forecast HTML, so search engines and link previews see the actual conditions.'
      ],
      images: [
        screen('riptyde-web-spots.webp', 'riptyde.app on desktop with The Lineup beside a full-height map of the South Bay'),
        screen('riptyde-web-cams.webp', 'riptyde.app on desktop with the Manhattan Pier cam still beside the cam map')
      ]
    }
  ],
  outcome: [
    'Live on the App Store, with Pro open to every signed-in surfer for now.',
    'riptyde.app on the web, with spot pages built to be found in search.',
    'One scoring model on iOS and the web, checked against the same recorded data.',
    'Close to 400 commits across the two apps since May 2026.'
  ],
  screens: {
    logo: { src: '/img/squares/riptyde-icon-square.webp', alt: 'Riptyde app icon' },
    link: { label: 'riptyde.app', href: 'https://riptyde.app' },
    hero: HERO,
    blocks: [
      {
        id: 'screens-today',
        title: 'Today',
        copy: 'The home screen leads with the score and the best window, then works down through conditions, the ten-day outlook, and an AI summary. Every break gets the same page, and Throwback rewinds it to any of the last ten days.',
        images: [
          phone('riptyde-home.webp', 'Riptyde home screen for Malibu First Point with conditions ticker and RAD-O-METER™ score'),
          phone('riptyde-home-bottom.webp', 'Riptyde surf-quality chart with wind, tide, water temperature, board pick, and AI summary cards'),
          phone('riptyde-spot-outlook.webp', 'Riptyde forecast for Steamer Lane in Santa Cruz with a ten-day outlook'),
          phone('riptyde-throwback.webp', 'Riptyde Throwback mode rewinding Malibu First Point to Monday, October 19')
        ]
      },
      {
        id: 'screens-score',
        title: 'The Score',
        navLabel: 'Score',
        copy: 'Tap the score for the breakdown. Every factor gets a rating and its share of the total, and the granular data underneath lists each reading and source the score came from. Tap any condition card for the reading behind it, like the wind’s bearing against the way the beach faces.',
        images: [
          phone('riptyde-rad-page.webp', 'Riptyde RAD-O-METER™ page for Malibu First Point with the best surf window and breakdown'),
          phone('riptyde-swell-tide.webp', 'Riptyde swell stack with primary and secondary swells, swell direction, and tide curve'),
          phone('riptyde-granular-data.webp', 'Riptyde granular data listing the RAD factors and data sources behind a score'),
          phone('riptyde-wind-detail.webp', 'Riptyde wind detail sheet with direction, bearing, speed, offshore type, beach facing, and source')
        ]
      },
      {
        id: 'screens-lineup',
        title: 'The Lineup',
        navLabel: 'Lineup',
        copy: 'The Lineup lists every spot with its score, filters by favorites, your own spots, or break type, and sorts by best rated, nearest, or biggest. Open the map and the list follows whatever stretch of coast you pan to.',
        images: [
          phone('riptyde-spots.webp', 'Riptyde Lineup of California spots ranked by RAD-O-METER™ score'),
          phone('riptyde-lineup-sort.webp', 'Riptyde Lineup of South Bay spots with the sort menu open to best rated, nearest, and biggest'),
          phone('riptyde-spot-map.webp', 'Riptyde spot map of the San Francisco Bay Area coast')
        ]
      },
      {
        id: 'screens-cams',
        title: 'Beach Cams',
        navLabel: 'Cams',
        copy: 'Licensed cams play right in the app. The rest show a still you can refresh or tap to open on the provider’s site, and dead feeds hide until they come back. The cam map finds the closest one.',
        images: [
          phone('riptyde-cam-live.webp', 'Riptyde Beach Cams playing the live Huntington Pier cam'),
          phone('riptyde-cams.webp', 'Riptyde Beach Cams with tap-to-open stills from El Porto and Manhattan Pier'),
          phone('riptyde-map.webp', 'Riptyde cam map of the Los Angeles coast')
        ]
      },
      {
        id: 'screens-profile',
        title: 'Profile, Crew, and Pro',
        navLabel: 'Profile',
        copy: 'The profile keeps your sessions, waves, hours, and best scores. A check-in posts a report from the beach to your crew, with the forecast attached and the day’s board pick already filled in. Pro covers AI surf reads, secret spots, crew sharing, and swell alerts, and for now it’s open to everyone who signs in.',
        images: [
          phone('riptyde-profile.webp', 'Riptyde profile with streak, session stats, and crew'),
          phone('riptyde-crew-sessions.webp', 'Riptyde Crew screen with a friend, favorite spots, and recent sessions'),
          phone('riptyde-check-in.webp', 'Riptyde Spot Check-In sheet for Malibu First with the forecast, board pick, wave quality, and a friend to share with'),
          phone('riptyde-pro.webp', 'Riptyde Pro screen')
        ]
      },
      {
        id: 'screens-web',
        title: 'On the Web',
        navLabel: 'Web',
        copy: 'riptyde.app brings the same forecast to the browser. On desktop the surf-quality chart runs wide next to the written forecast report, and the Lineup and the cams sit beside a full-height map.',
        images: [
          screen('riptyde-web-home.webp', 'riptyde.app forecast for Malibu First Point on desktop'),
          screen('riptyde-web-chart.webp', 'riptyde.app surf-quality chart for Lowers with the best window and forecast report on desktop'),
          screen('riptyde-web-spots.webp', 'riptyde.app Lineup beside the spot map on desktop'),
          screen('riptyde-web-cams.webp', 'riptyde.app Beach Cams beside the cam map on desktop')
        ]
      }
    ]
  }
};
