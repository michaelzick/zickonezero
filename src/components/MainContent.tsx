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

import { TopNavContent, GridContent, FooterContent, AnimatedHeadline } from '.';
import { SectionHeader, Wrapper, WorkSectionHeader, HomeTabsBar, HomeTabButton, HomeTabsSpacer, IntroSection } from '../../styles';

type SectionKey = 'ux' | 'ui';
type ActiveSection = SectionKey | null;

const DESKTOP_NAV_OFFSET = 92; // Tighten the gap so section headers sit closer to the tabs
const MOBILE_TABS_HEIGHT_PX = 11.3 * 16; // Keep in sync with mobile scroll target for Home tabs
const DETECTION_BUFFER = 12;

const MainContent = () => {
  const { worksDataReversed } = useAppSelector(selectData);
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const uxSectionRef = useRef<HTMLHeadingElement | null>(null);
  const uiSectionRef = useRef<HTMLHeadingElement | null>(null);
  const uxContentRef = useRef<HTMLDivElement | null>(null);
  const uiContentRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const isManualScrolling = useRef(false);

  // Parallax refs and state
  const introTextRef = useRef<HTMLDivElement | null>(null);
  const introImageRef = useRef<HTMLDivElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ text: -60, image: -40 });

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

  const scrollToSection = useCallback((section: SectionKey) => {
    // Temporarily pause scroll-driven updates while we animate to the section
    isManualScrolling.current = true;
    setActiveSection(section);

    const target = section === 'ux' ? uxSectionRef.current : uiSectionRef.current;

    if (target) {
      const prefersMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;

      if (prefersMobile) {
        // On mobile, position the header right below the tabs
        // Tabs end at approximately 13.3em, so we want the header positioned there
        const tabsHeight = MOBILE_TABS_HEIGHT_PX; // Convert em to px (assuming 16px base font)
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - tabsHeight;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        // Desktop scrolling
        const navOffset = DESKTOP_NAV_OFFSET;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - navOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }

    // Clear the flag after a delay to allow manual scroll to complete
    setTimeout(() => {
      isManualScrolling.current = false;
    }, 1000);
  }, [setActiveSection]);

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
      const uxTop = uxSectionRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const uiTop = uiSectionRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

      let nextActive: ActiveSection = null;

      if (uiTop - detectionOffset <= 0) {
        nextActive = 'ui';
      } else if (uxTop - detectionOffset <= 0) {
        nextActive = 'ux';
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

  // Parallax scroll effect
  useEffect(() => {
    // Only enable parallax on desktop devices
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (!isDesktop) return;

    const handleScroll = () => {
      if (!introTextRef.current || !introImageRef.current) return;

      const scrollY = window.scrollY;

      // Simple parallax calculation based on scroll position
      // Text starts at -60px and moves slower (positive direction, slower than scroll)
      const textOffset = -60 + (scrollY * 0.2); // Start higher, then move 20% of scroll speed
      // Image moves in opposite direction (slower)
      const imageOffset = -40 + (scrollY * -0.05); // Image starts higher, then glides slightly upward

      setParallaxOffset({ text: textOffset, image: imageOffset });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <TopNavContent />

      <Wrapper isHomePage isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <HomeTabsBar role='tablist' aria-label='Homepage sections'>
          <HomeTabButton
            type="button"
            aria-selected={activeSection === 'ux'}
            role='tab'
            aria-controls='ux-design'
            tabIndex={activeSection === 'ux' ? 0 : -1}
            $isActive={activeSection === 'ux'}
            onClick={() => scrollToSection('ux')}
          >
            UX Design
          </HomeTabButton>
          <HomeTabButton
            type="button"
            aria-selected={activeSection === 'ui'}
            role='tab'
            aria-controls='ui-engineering'
            tabIndex={activeSection === 'ui' ? 0 : -1}
            $isActive={activeSection === 'ui'}
            onClick={() => scrollToSection('ui')}
          >
            UI Engineering
          </HomeTabButton>
        </HomeTabsBar>

        <HomeTabsSpacer aria-hidden='true' />
        <AnimatedHeadline />

        <IntroSection className="intro-section">
          <div
            className="intro-text"
            ref={introTextRef}
            style={{ transform: `translateY(${parallaxOffset.text}px)` }}
          >
            <h2>Michael Zick is ZICKONEZERO Creative.</h2>
            <p>
              Starting out as a frontend developer for digital agencies, Michael began crafting user experiences across a wide range of industries.
              After spending many years as a React and then full-stack Node developer, Michael realized he has a passion for UX design, where he&apos;s
              currently focusing his attention.
            </p>
            <p>
              From UX designs to rapid prototypes, to production-ready apps, Michael&apos;s range of experience and AI fluency can bring any project to
              life in record time.
            </p>
          </div>
          <div
            className="intro-image"
            ref={introImageRef}
            style={{ transform: `translateY(${parallaxOffset.image}px)` }}
          >
            <img
              src="/img/lifeguard-tower-transparent.webp"
              alt="Florescent lifeguard tower"
              loading="lazy"
            />
          </div>
        </IntroSection>

        <div ref={uxContentRef}>
          <SectionHeader ref={uxSectionRef} id='ux-design'>
            {/* Projects I{"'"}ve <CommandLine>#managed</CommandLine> */}
            <WorkSectionHeader>UX Design</WorkSectionHeader>
          </SectionHeader>

          <GridContent
            worksDataReversed={worksDataReversed}
            onThumbClick={onThumbClick}
            isManagedWork
          />
        </div>

        <br />
        <div ref={uiContentRef}>
          <SectionHeader ref={uiSectionRef} id='ui-engineering'>
            {/* Projects I{"'"}ve <CommandLine>$built</CommandLine> */}
            <WorkSectionHeader>UI Engineering</WorkSectionHeader>
          </SectionHeader>

          <GridContent
            worksDataReversed={worksDataReversed}
            onThumbClick={onThumbClick}
          />
        </div>

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
