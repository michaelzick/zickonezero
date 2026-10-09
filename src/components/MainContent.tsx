import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  selectData,
} from '../worksDataSlice';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';
import { useState, useRef, useEffect, memo, useCallback, type MouseEvent } from 'react';

import FooterContent from './FooterContent';
import GridContent from './GridContent';
import TopNavContent from './TopNavContent';
import { Wrapper } from '../../styles';
import useActiveSection from '../hooks/useActiveSection';
import { trackEvent } from '../lib/analytics';
import { setCityAccent } from '../lib/city/accent';
import type { CityAccent } from '../lib/city/routes';
import { createScrollJumper } from '../lib/city/scroll';
import CityGapScene from './home/CityGapScene';
import District from './home/District';
import HeroScene from './home/HeroScene';
import HoloBillboard from './home/HoloBillboard';
import HomeHud from './home/HomeHud';
import LazyLightbox from './LazyLightbox';
import type { DistrictTone, HomeSectionKey, WorksData } from '../types';

type MainContentProps = {
  worksDataReversed?: Array<WorksData>;
};

// Where a district's sign lands below the fixed nav after a jump: the nav is
// about 78px tall above 600px wide and about 135px on phones.
const DESKTOP_NAV_OFFSET = 92;
const PHONE_NAV_OFFSET = 148;
const PHONE_QUERY = '(max-width: 600px)';
const DETECTION_BUFFER = 12;
const CASE_STUDY_GROUPS = new Set(['demostoke', 'antisyphon-training', 'nice-guy-university']);

const getNavOffset = () => (window.matchMedia(PHONE_QUERY).matches ? PHONE_NAV_OFFSET : DESKTOP_NAV_OFFSET);
const getDetectionOffset = () => getNavOffset() + DETECTION_BUFFER;

type HomeDistrict = {
  section: HomeSectionKey;
  /** The HUD pin's text, which is also the analytics label. */
  tabLabel: string;
  tone: DistrictTone;
  /** The city's glow while the district is active. */
  accent: CityAccent;
  title: string;
  headingId: string;
  /** Decorative Japanese street name for the district's sign. */
  japanese: string;
  /** What the sign's readout counts. */
  unit: string;
  /** The status chip on each of the district's cards. */
  status: string;
  carouselLabel: string;
  includeItem: (item: WorksData) => boolean;
  /** Linked cards navigate; only gallery cards open the lightbox. */
  disableThumbClick?: boolean;
};

const HOME_DISTRICTS: readonly HomeDistrict[] = [
  {
    section: 'case-studies',
    tabLabel: 'Case Studies',
    accent: 'magenta',
    tone: 'case',
    title: 'Case Studies',
    headingId: 'case-studies',
    japanese: '事例研究',
    unit: 'Case files',
    status: 'Case file',
    carouselLabel: 'Case Studies projects',
    includeItem: ({ group }) => CASE_STUDY_GROUPS.has(group),
    disableThumbClick: true,
  },
  {
    section: 'ux',
    tabLabel: 'Product Engineering',
    accent: 'cyan',
    tone: 'product',
    title: 'Product Engineering',
    headingId: 'ux-design',
    japanese: '製品開発',
    unit: 'Live products',
    status: 'Live',
    carouselLabel: 'Product Engineering projects',
    includeItem: (item) => Boolean(item.link) && !CASE_STUDY_GROUPS.has(item.group),
    disableThumbClick: true,
  },
  {
    section: 'ui',
    tabLabel: 'Web Dev',
    accent: 'amber',
    tone: 'web',
    title: 'Web Development',
    headingId: 'web-development',
    japanese: 'ウェブ開発',
    unit: 'Archive gigs',
    status: 'Archive',
    carouselLabel: 'Web Development projects',
    includeItem: (item) => !item.link,
  },
];

const SECTION_ORDER: readonly HomeSectionKey[] = HOME_DISTRICTS.map(({ section }) => section);

const HUD_DISTRICTS = HOME_DISTRICTS.map(({ section, tabLabel, title, tone }) => ({
  section,
  label: tabLabel,
  title,
  tone,
}));

// The hero and billboard glow in the home route's cyan.
const HOME_ACCENT: CityAccent = 'cyan';

const MainContent = ({ worksDataReversed: worksDataReversedProp }: MainContentProps = {}) => {
  // Prefer the prop (populated during static generation) and fall back to the
  // store so `<MainContent />` still renders when driven by a preloaded store.
  // Only read the store without the prop: pages/index.tsx syncs the same data
  // into it after hydration, which would otherwise re-render the whole city.
  const worksDataReversedStore = useAppSelector(
    (state) => (worksDataReversedProp ? undefined : selectData(state).worksDataReversed),
  );
  const worksDataReversed = worksDataReversedProp ?? worksDataReversedStore ?? [];
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const sectionRefs = useRef<Record<HomeSectionKey, HTMLElement | null>>({
    'case-studies': null,
    ux: null,
    ui: null,
  });
  const footerRef = useRef<HTMLDivElement>(null);
  const [jumper] = useState(createScrollJumper);
  const [activeSection, setActiveSection] = useActiveSection(sectionRefs, SECTION_ORDER, {
    getOffset: getDetectionOffset,
    isPaused: jumper.isJumping,
  });

  // For lightbox
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    productIndex: 0
  });

  const onThumbClick = (index: number, squareLinkOut?: boolean) => {
    if (squareLinkOut) return;

    setLightboxController({
      toggler: !lightboxController.toggler,
      productIndex: index
    });
  };

  // Grab the images from the correct index supplied by Lightbox
  const { imgs } = worksDataReversed[lightboxController.productIndex] || [];

  const scrollToHomeSection = useCallback((section: HomeSectionKey) => {
    const target = sectionRefs.current[section];

    if (!target) return;

    setActiveSection(section);
    jumper.jumpTo(target.getBoundingClientRect().top + window.scrollY - getNavOffset());
  }, [jumper, setActiveSection]);

  const handleHomeSectionClick = useCallback((section: HomeSectionKey, label: string, location: string) => {
    trackEvent(label === 'See Case Studies' ? 'cta_click' : 'section_tab_click', {
      location,
      label,
      section,
      page_path: window.location.pathname,
    });
    scrollToHomeSection(section);
  }, [scrollToHomeSection]);

  const handleSeeCaseStudies = useCallback(() => {
    handleHomeSectionClick('case-studies', 'See Case Studies', 'home_intro');
  }, [handleHomeSectionClick]);

  const handleTravel = useCallback((section: HomeSectionKey, label: string) => {
    handleHomeSectionClick(section, label, 'home_tabs');
  }, [handleHomeSectionClick]);

  const handleReturnToSurface = useCallback(() => {
    trackEvent('section_tab_click', {
      location: 'home_tabs',
      label: 'Return to surface',
      section: 'hero',
      page_path: window.location.pathname,
    });
    setActiveSection(null);
    jumper.jumpTo(0);
  }, [jumper, setActiveSection]);

  // The brand already points home, so here it goes back to the top, like
  // Return to surface but at once, instead of reloading the page under the
  // visitor or losing to a fast-travel jump still under way. Modified clicks
  // (a new tab) still navigate.
  const handleBrandClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    jumper.cancel();
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [jumper, setActiveSection]);

  // Where the HUD's player reaches each stop: the start, each district (when
  // its sign meets the nav, or the page end if sooner), and the page end.
  const measureRouteStops = useCallback(() => {
    const offset = getNavOffset();
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const stopAt = (node: HTMLElement | null) => (
      node ? Math.min(node.getBoundingClientRect().top + window.scrollY - offset, maxScroll) : maxScroll
    );

    const stops = [0];
    SECTION_ORDER.forEach((section) => {
      stops.push(Math.max(stops[stops.length - 1], stopAt(sectionRefs.current[section])));
    });
    stops.push(maxScroll);
    return stops;
  }, []);

  useEffect(() => () => jumper.cancel(), [jumper]);

  useEffect(() => {
    const district = HOME_DISTRICTS.find(({ section }) => section === activeSection);
    setCityAccent(district?.accent ?? HOME_ACCENT);
  }, [activeSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <TopNavContent onBrandClick={handleBrandClick} />

      <HomeHud
        districts={HUD_DISTRICTS}
        active={activeSection}
        onTravel={handleTravel}
        onReturnToSurface={handleReturnToSurface}
        measureStops={measureRouteStops}
        parkRef={footerRef}
      />

      <Wrapper isHomePage isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <HeroScene onSeeCaseStudies={handleSeeCaseStudies} />

        <HoloBillboard />

        {HOME_DISTRICTS.map((district, districtIndex) => (
          <District
            key={district.section}
            sectionRef={(node) => {
              sectionRefs.current[district.section] = node;
            }}
            tone={district.tone}
            number={districtIndex + 1}
            title={district.title}
            headingId={district.headingId}
            japanese={district.japanese}
            readout={{ count: worksDataReversed.filter(district.includeItem).length, unit: district.unit }}
          >
            <GridContent
              worksDataReversed={worksDataReversed}
              onThumbClick={onThumbClick}
              includeItem={district.includeItem}
              disableThumbClick={district.disableThumbClick}
              carouselLabel={district.carouselLabel}
              tone={district.tone}
              status={district.status}
            />
          </District>
        ))}

        {/* Open air at the end of the route, with a carp streamer by night and an airship by day. */}
        <CityGapScene />

        {imgs && <LazyLightbox
          toggler={lightboxController.toggler}
          sources={imgs}
          slide={1}
        />}
      </Wrapper>
      <div ref={footerRef}>
        <FooterContent />
      </div>
    </>
  );
};

export default memo(MainContent);
