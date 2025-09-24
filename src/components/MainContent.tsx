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
import { SectionHeader, Wrapper, WorkSectionHeader, HomeTabsBar, HomeTabButton, HomeTabsSpacer } from '../../styles';

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
  }, [setActiveSection]);

  useEffect(() => {
    const contentSections = [
      { key: 'ux' as SectionKey, ref: uxContentRef },
      { key: 'ui' as SectionKey, ref: uiContentRef },
    ];

    const prefersMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;

    const observer = new IntersectionObserver((entries) => {
      // Find the section with the highest intersection ratio (most visible)
      let mostVisibleSection: SectionKey | null = null;
      let highestRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
          if (entry.target === uxContentRef.current) {
            mostVisibleSection = 'ux';
            highestRatio = entry.intersectionRatio;
          } else if (entry.target === uiContentRef.current) {
            mostVisibleSection = 'ui';
            highestRatio = entry.intersectionRatio;
          }
        }
      });

      // Only update if we found a visible section
      if (mostVisibleSection) {
        setActiveSection(mostVisibleSection);
      }
    }, {
      root: null,
      // On mobile, account for tabs position; on desktop, use smaller margin
      rootMargin: prefersMobile
        ? '-213px 0px -20% 0px'  // Mobile: tabs are ~213px from top, smaller bottom margin
        : '-120px 0px -20% 0px',  // Desktop: smaller nav, smaller bottom margin
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
