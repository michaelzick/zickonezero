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

const MainContent = () => {
  const { worksDataReversed } = useAppSelector(selectData);
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const uxSectionRef = useRef<HTMLHeadingElement | null>(null);
  const uiSectionRef = useRef<HTMLHeadingElement | null>(null);
  const uxContentRef = useRef<HTMLDivElement | null>(null);
  const uiContentRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('ux');
  const isManualScrolling = useRef(false);

  // Parallax refs and state
  const introTextRef = useRef<HTMLDivElement | null>(null);
  const introImageRef = useRef<HTMLDivElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ text: -60, image: 0 });

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
    // Set flag to prevent intersection observer from interfering
    isManualScrolling.current = true;
    setActiveSection(section);

    const target = section === 'ux' ? uxSectionRef.current : uiSectionRef.current;

    if (target) {
      const prefersMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;

      if (prefersMobile) {
        // On mobile, position the header right below the tabs
        // Tabs end at approximately 13.3em, so we want the header positioned there
        const tabsHeight = 13.3 * 16; // Convert em to px (assuming 16px base font)
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - tabsHeight;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        // Desktop scrolling
        const navOffset = 120;
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
    const contentSections = [
      { key: 'ux' as SectionKey, ref: uxContentRef },
      { key: 'ui' as SectionKey, ref: uiContentRef },
    ];

    const observer = new IntersectionObserver((entries) => {
      // Don't update if user just clicked a tab
      if (isManualScrolling.current) {
        return;
      }

      let uxRatio = 0;
      let uiRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === uxContentRef.current) {
            uxRatio = entry.intersectionRatio;
          } else if (entry.target === uiContentRef.current) {
            uiRatio = entry.intersectionRatio;
          }
        }
      });

      console.log('Observer fired:', { uxRatio, uiRatio, currentActive: activeSection });

      // Asymmetric switching logic:
      // - Switch to UI Engineering only when it has more visibility AND meets minimum threshold
      // - Switch back to UX Design when it has any more visibility than UI Engineering
      if (uiRatio > 0.05 && uiRatio > uxRatio) {
        console.log('Switching to UI');
        setActiveSection('ui');
      } else if (uxRatio > uiRatio) {
        console.log('Switching to UX');
        setActiveSection('ux');
      }
    }, {
      root: null,
      // Use a simpler rootMargin that works on all screen sizes
      rootMargin: '-150px 0px -20% 0px',
      threshold: [0.1, 0.3, 0.5, 0.7],
    });

    contentSections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      contentSections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
      observer.disconnect();
    };
  }, [activeSection]);

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
      // Image moves in opposite direction
      const imageOffset = scrollY * -0.1; // Image moves 10% opposite direction

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
              Starting out as a frontend developer for digital agencies, Michael began crafting user experiences across a wide range of industries. After spending many years as a React and then full-stack Node developer, Michael realized he has a passion for UX design, where he's currently focusing his attention.
            </p>
            <p>
              From UX designs to rapid prototypes, to production-ready apps, Michael's range of experience and AI fluency can bring any project to life in record time.
            </p>
          </div>
          <div
            className="intro-image"
            ref={introImageRef}
            style={{ transform: `translateY(${parallaxOffset.image}px)` }}
          >
            <img
              src="/img/florescent-lifeguard-tower.webp"
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
