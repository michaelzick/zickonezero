import ProjectShowcase from '../src/components/ProjectShowcase';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const PATH = '/12-step-meetings/';
const TITLE = '12 Step Meetings';
const SUMMARY = 'A searchable directory of in-person recovery meetings across Los Angeles and Ventura counties.';
const HERO_IMAGE = { src: '/img/projects/12-step-meetings/12-step-meetings-hybrid.webp', alt: '12 Step Meetings directory listing upcoming meetings near Santa Monica beside a map of nearby meetings' };

const TwelveStepMeetingsPage = () => (
  <>
    <Seo
      title={TITLE}
      description={SUMMARY}
      path={PATH}
      type='article'
      ogImage={HERO_IMAGE.src}
      ogImageAlt={HERO_IMAGE.alt}
      ogImageWidth={3456}
      ogImageHeight={1934}
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
      projectLink={{ href: 'https://www.12stepmeetings.org/' }}
      sections={[
        {
          title: 'One place to start',
          body: (
            <>
              Meeting listings are scattered across separate program directories. I brought AA,
              Al-Anon, CoDA, NA, OA, and SLAA into one searchable view, with upcoming meetings beside
              a map. Users can start browsing right away, no account needed.
            </>
          ),
          image: { src: '/img/projects/12-step-meetings/12-step-meetings-al-anon.webp', alt: '12 Step Meetings directory filtered to Al-Anon, listing upcoming meetings near Santa Monica beside a map of nearby meetings' },
        },
        {
          title: 'Find a meeting that fits',
          body: (
            <>
              Finding support should be easy and intuitive. I made program, day, time,
              and location filters quick to scan, then added format and accessibility options for a closer
              fit. The list and map update together, so each filter narrows both at once.
            </>
          ),
          image: { src: '/img/projects/12-step-meetings/12-step-meetings-filters.webp', alt: '12 Step Meetings list showing program, day, time, and location filters with the location menu open to city suggestions for Santa' },
        },
        {
          title: 'Explore what’s nearby',
          body: (
            <>
              A good meeting also has to be within reach. I added city and ZIP searches with
              distance sorting, and clustered map markers to keep busy areas readable. Users can
              switch between a list, a map, and a combined view as they narrow down where to go.
            </>
          ),
          image: { src: '/img/projects/12-step-meetings/12-step-meetings-map.webp', alt: 'Map view of meetings near Pasadena with a ZIP search, radius filter, and clustered meeting markers' },
        },
        {
          title: 'Know before you go',
          body: (
            <>
              I put the practical details in a side panel: when the meeting happens, where to find
              it, and any format or accessibility notes. Directions, calendar options, and the source
              listing sit together, so users can double-check the details and get on their way.
            </>
          ),
          image: { src: '/img/projects/12-step-meetings/12-step-meetings-detail.webp', alt: 'Meeting detail panel with schedule, location, format, accessibility, directions, and calendar options' },
        },
      ]}
    />
  </>
);

export default TwelveStepMeetingsPage;
