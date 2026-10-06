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
import { useState, useRef, useEffect, memo, useCallback } from 'react';

import FsLightbox from 'fslightbox-react';

import { TopNavContent, GridContent, FooterContent } from '.';
import {
  Wrapper,
  HomeTabsBar,
  HomeTabButton,
} from '../../styles';
import { trackEvent } from '../lib/analytics';
import District from './home/District';
import HeroScene from './home/HeroScene';
import HoloBillboard from './home/HoloBillboard';
import type { DistrictTone, WorksData } from '../types';

type HomeSectionKey = 'case-studies' | 'ux' | 'ui';
type ActiveSection = HomeSectionKey | null;

type MainContentProps = {
  worksDataReversed?: Array<WorksData>;
};

const DESKTOP_NAV_OFFSET = 92; // Tighten the gap so section headers sit closer to the tabs
const MOBILE_TABS_HEIGHT_PX = 11.3 * 16; // Keep in sync with mobile scroll target for Home tabs
const DETECTION_BUFFER = 12;
const CASE_STUDY_GROUPS = new Set(['demostoke', 'antisyphon-training', 'nice-guy-university']);

type HomeDistrict = {
  section: HomeSectionKey;
  tone: DistrictTone;
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

const MainContent = ({ worksDataReversed: worksDataReversedProp }: MainContentProps = {}) => {
  const { worksDataReversed: worksDataReversedStore } = useAppSelector(selectData);
  // Prefer the prop (populated during static generation) and fall back to the
  // store so `<MainContent />` still renders when driven by a preloaded store.
  const worksDataReversed = worksDataReversedProp ?? worksDataReversedStore;
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const sectionRefs = useRef<Record<HomeSectionKey, HTMLElement | null>>({
    'case-studies': null,
    ux: null,
    ui: null,
  });
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const isManualScrolling = useRef(false);
  const manualScrollTimeoutRef = useRef<number | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

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

  const clearManualScrollTimeout = useCallback(() => {
    if (manualScrollTimeoutRef.current === null) return;
    window.clearTimeout(manualScrollTimeoutRef.current);
    manualScrollTimeoutRef.current = null;
  }, []);

  const cancelScrollAnimation = useCallback(() => {
    if (scrollAnimationRef.current === null) return;
    cancelAnimationFrame(scrollAnimationRef.current);
    scrollAnimationRef.current = null;
  }, []);

  const animateScrollTo = useCallback((targetY: number) => {
    cancelScrollAnimation();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      return 0;
    }

    const startY = window.scrollY;
    const delta = targetY - startY;
    if (Math.abs(delta) < 1) {
      return 0;
    }

    const distance = Math.abs(delta);
    const durationMs = Math.min(1800, Math.max(900, distance * 0.7));
    const startTime = performance.now();

    const easeInOutCubic = (t: number) => (
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    );

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + delta * eased);
      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(tick);
        return;
      }

      scrollAnimationRef.current = null;
    };

    scrollAnimationRef.current = requestAnimationFrame(tick);
    return durationMs;
  }, [cancelScrollAnimation]);

  const startManualScroll = useCallback((durationMs: number) => {
    clearManualScrollTimeout();
    isManualScrolling.current = true;

    if (durationMs <= 0) {
      isManualScrolling.current = false;
      return;
    }

    manualScrollTimeoutRef.current = window.setTimeout(() => {
      isManualScrolling.current = false;
      manualScrollTimeoutRef.current = null;
    }, Math.ceil(durationMs) + 50);
  }, [clearManualScrollTimeout]);

  const scrollToHomeSection = useCallback((section: HomeSectionKey) => {
    const target = sectionRefs.current[section];

    if (!target) return;

    setActiveSection(section);

    const prefersMobile = window.matchMedia('(max-width: 600px)').matches;
    const offset = prefersMobile ? MOBILE_TABS_HEIGHT_PX : DESKTOP_NAV_OFFSET;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = targetPosition - offset;
    const durationMs = animateScrollTo(offsetPosition);
    startManualScroll(durationMs);
  }, [animateScrollTo, startManualScroll]);

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

  useEffect(() => {
    return () => {
      clearManualScrollTimeout();
      cancelScrollAnimation();
    };
  }, [cancelScrollAnimation, clearManualScrollTimeout]);

  useEffect(() => {
    const getDetectionOffset = () => {
      const prefersMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches;
      const baseOffset = prefersMobile ? MOBILE_TABS_HEIGHT_PX : DESKTOP_NAV_OFFSET;
      return baseOffset + DETECTION_BUFFER;
    };

    const updateActiveSectionOnScroll = () => {
      if (isManualScrolling.current) {
        return;
      }

      const detectionOffset = getDetectionOffset();
      const getTop = (section: HomeSectionKey) => (
        sectionRefs.current[section]?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      );
      const caseStudiesTop = getTop('case-studies');
      const uxTop = getTop('ux');
      const uiTop = getTop('ui');

      let nextActive: ActiveSection = null;

      if (uiTop - detectionOffset <= 0) {
        nextActive = 'ui';
      } else if (uxTop - detectionOffset <= 0) {
        nextActive = 'ux';
      } else if (caseStudiesTop - detectionOffset <= 0) {
        nextActive = 'case-studies';
      }

      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
    };

    updateActiveSectionOnScroll();
    window.addEventListener('scroll', updateActiveSectionOnScroll, { passive: true });
    window.addEventListener('resize', updateActiveSectionOnScroll);

    return () => {
      window.removeEventListener('scroll', updateActiveSectionOnScroll);
      window.removeEventListener('resize', updateActiveSectionOnScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <>
      <TopNavContent />

      <Wrapper isHomePage isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <HeroScene onSeeCaseStudies={handleSeeCaseStudies} />


        <HomeTabsBar as='nav' aria-label='Homepage sections'>
          <HomeTabButton
            type="button"
            aria-current={activeSection === 'case-studies' ? 'true' : undefined}
            $isActive={activeSection === 'case-studies'}
            onClick={() => handleHomeSectionClick('case-studies', 'Case Studies', 'home_tabs')}
          >
            Case Studies
          </HomeTabButton>
          <HomeTabButton
            type="button"
            aria-current={activeSection === 'ux' ? 'true' : undefined}
            $isActive={activeSection === 'ux'}
            onClick={() => handleHomeSectionClick('ux', 'Product Engineering', 'home_tabs')}
          >
            Product Engineering
          </HomeTabButton>
          <HomeTabButton
            type="button"
            aria-current={activeSection === 'ui' ? 'true' : undefined}
            $isActive={activeSection === 'ui'}
            onClick={() => handleHomeSectionClick('ui', 'Web Dev', 'home_tabs')}
          >
            Web Dev
          </HomeTabButton>
        </HomeTabsBar>


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

        {imgs && <FsLightbox
          toggler={lightboxController.toggler}
          sources={imgs}
          slide={1}
        />}
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default memo(MainContent);
