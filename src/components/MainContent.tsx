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
    const sections = [
      { key: 'ux' as SectionKey, ref: uxSectionRef },
      { key: 'ui' as SectionKey, ref: uiSectionRef },
    ];

    const observer = new IntersectionObserver((entries) => {
      const prefersMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === uxSectionRef.current) {
            setActiveSection('ux');
          } else if (entry.target === uiSectionRef.current) {
            setActiveSection('ui');
          }
        }
      });
    }, {
      root: null,
      // On mobile, account for tabs position; on desktop, use smaller margin
      rootMargin: typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
        ? '-213px 0px -50% 0px'  // Mobile: tabs are ~213px from top
        : '-120px 0px -50% 0px',  // Desktop: smaller nav
      threshold: [0.1, 0.5],
    });

    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
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

        <SectionHeader ref={uxSectionRef} id='ux-design'>
          {/* Projects I{"'"}ve <CommandLine>#managed</CommandLine> */}
          <WorkSectionHeader>UX Design</WorkSectionHeader>
        </SectionHeader>

        <GridContent
          worksDataReversed={worksDataReversed}
          onThumbClick={onThumbClick}
          isManagedWork
        />

        <br />
        <SectionHeader ref={uiSectionRef} id='ui-engineering'>
          {/* Projects I{"'"}ve <CommandLine>$built</CommandLine> */}
          <WorkSectionHeader>UI Engineering</WorkSectionHeader>
        </SectionHeader>

        <GridContent
          worksDataReversed={worksDataReversed}
          onThumbClick={onThumbClick}
        />

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
