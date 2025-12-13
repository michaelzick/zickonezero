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
import {
  SectionHeader,
  Wrapper,
  WorkSectionHeader,
  HomeTabsBar,
  HomeTabButton,
  HomeTabsSpacer,
  IntroSection,
  FloatingCloudsViewport,
  FloatingClouds,
  WorksParallaxStage,
  WorksRevealCurtain,
  WorksFixedIllustration,
  WorksSectionContent
} from '../../styles';
import { AnimatedSection } from '../../styles/projectShowcases';

type SectionKey = 'ux' | 'ui';
type ActiveSection = SectionKey | null;

const DESKTOP_NAV_OFFSET = 92; // Tighten the gap so section headers sit closer to the tabs
const MOBILE_TABS_HEIGHT_PX = 11.3 * 16; // Keep in sync with mobile scroll target for Home tabs
const DETECTION_BUFFER = 12;
const CASE_STUDY_GROUPS = new Set(['demostoke', 'antisyphon-training']);

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
  const [parallaxOffset, setParallaxOffset] = useState({ text: 5, image: -20 });
  const neonCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const introAnimatedRef = useRef<HTMLDivElement | null>(null);
  const [introVisible, setIntroVisible] = useState(false);
  const [showWorksIllustration, setShowWorksIllustration] = useState(false);
  const [cloudsActive, setCloudsActive] = useState(false);

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

  useEffect(() => {
    setCloudsActive(true);
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
      // Text starts near baseline and glides down slightly with scroll
      const textOffset = 5 + (scrollY * 0.1);
      // Image lifts a touch for depth without losing the baseline alignment
      const imageOffset = -20 + (scrollY * -0.035);

      setParallaxOffset({ text: textOffset, image: imageOffset });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade-in animation for intro hero
  useEffect(() => {
    const node = introAnimatedRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIntroVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Delay mounting the Works illustration to avoid alt-text flashing on hard refresh
  useEffect(() => {
    const rafId = requestAnimationFrame(() => setShowWorksIllustration(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Neon trail effect on the intro image
  useEffect(() => {
    const canvas = neonCanvasRef.current;
    const imageContainer = introImageRef.current;

    if (!canvas || !imageContainer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (prefersReducedMotion || !hasFinePointer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pickNeonHue = () => 120 + Math.random() * 220; // Bright fluorescent range

    type Segment = {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      life: number;
      width: number;
      hue: number;
    };

    let segments: Segment[] = [];
    let rafId = 0;
    let dpr = 1;
    let isHovering = false;
    let lastPos: { x: number; y: number; } | null = null;
    let currentHue = pickNeonHue();

    const setSize = () => {
      const rect = imageContainer.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();

    const imageEl = imageContainer.querySelector('img');
    if (imageEl) {
      if (imageEl.complete) {
        setSize();
      } else {
        imageEl.addEventListener('load', setSize);
      }
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.globalCompositeOperation = 'lighter';

      segments = segments
        .map((s) => ({
          ...s,
          life: s.life - 0.01
        }))
        .filter((s) => s.life > 0);

      for (const s of segments) {
        const alpha = Math.min(1, Math.max(s.life, 0) * 1.35);
        const grad = ctx.createLinearGradient(s.x1, s.y1, s.x2, s.y2);
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 65%, ${alpha})`);
        grad.addColorStop(1, `hsla(${s.hue}, 100%, 50%, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.shadowColor = `hsla(${s.hue}, 100%, 65%, ${alpha * 0.9})`;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
      }

      if (segments.length) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      rafId = 0;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    };

    const addStreak = (event: MouseEvent) => {
      const rect = imageContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxSegments = 120;

      if (!lastPos) {
        lastPos = { x, y };
        currentHue = pickNeonHue();
        return;
      }

      const width = 11 + Math.random() * 3;
      segments.push({
        x1: lastPos.x,
        y1: lastPos.y,
        x2: x,
        y2: y,
        life: 1,
        width,
        hue: currentHue
      });

      lastPos = { x, y };

      if (segments.length > maxSegments) {
        segments = segments.slice(segments.length - maxSegments);
      }

      if (!rafId) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleMouseEnter = () => {
      isHovering = true;
      if (!rafId && segments.length) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleMouseLeave = () => {
      isHovering = false;
      lastPos = null;
      // Let existing streaks finish fading out
      if (!rafId && segments.length) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleResize = () => setSize();

    imageContainer.addEventListener('mouseenter', handleMouseEnter);
    imageContainer.addEventListener('mouseleave', handleMouseLeave);
    imageContainer.addEventListener('mousemove', addStreak);
    window.addEventListener('resize', handleResize);

    return () => {
      if (imageEl) {
        imageEl.removeEventListener('load', setSize);
      }
      imageContainer.removeEventListener('mouseenter', handleMouseEnter);
      imageContainer.removeEventListener('mouseleave', handleMouseLeave);
      imageContainer.removeEventListener('mousemove', addStreak);
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <TopNavContent />

      <Wrapper isHomePage isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <FloatingCloudsViewport aria-hidden="true">
          <FloatingClouds $isActive={cloudsActive}>
            <img
              src="/img/neon-clouds-cropped.webp"
              alt=""
              loading="lazy"
            />
          </FloatingClouds>
        </FloatingCloudsViewport>

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

        <AnimatedSection
          ref={introAnimatedRef}
          data-animate-id='home-intro'
          className={introVisible ? 'visible' : undefined}
        >
          <IntroSection className="intro-section">
            <div
              className="intro-image"
              ref={introImageRef}
              style={{ transform: `translateY(${parallaxOffset.image - 20}px)` }}
            >
              <img
                className="image-animate"
                src="/img/lifeguard-tower-transparent.webp"
                alt="Florescent lifeguard tower"
                loading="lazy"
              />
              <canvas ref={neonCanvasRef} className="neon-trail" aria-hidden="true" />
            </div>
            <div
              className="intro-text"
              ref={introTextRef}
              style={{ transform: `translateY(${parallaxOffset.text}px)` }}
            >
              <div className="text-animate">
                <h2>
                  Michael Zick is <span className="hotword">ZICKONEZERO Creative</span>.
                </h2>
                <AnimatedHeadline className="intro-rotator-headline" />
              </div>
            </div>
          </IntroSection>
        </AnimatedSection>

        <WorksParallaxStage>
          {showWorksIllustration && (
            <WorksFixedIllustration>
              <img
                src="/img/illustrated-mt-hood-selfie.webp"
                alt="Illustrated self-portrait near Mt. Hood"
                loading="lazy"
              />
            </WorksFixedIllustration>
          )}

          <WorksRevealCurtain aria-hidden="true" />

          <WorksSectionContent>
            <div>
              <SectionHeader id='case-studies'>
                <WorkSectionHeader>Case Studies</WorkSectionHeader>
              </SectionHeader>

              <GridContent
                worksDataReversed={worksDataReversed}
                onThumbClick={onThumbClick}
                includeItem={({ group }) => CASE_STUDY_GROUPS.has(group)}
                disableThumbClick
              />
            </div>

            <br />

            <div ref={uxContentRef}>
              <SectionHeader ref={uxSectionRef} id='ux-design'>
                <WorkSectionHeader>UX Design</WorkSectionHeader>
              </SectionHeader>

              <GridContent
                worksDataReversed={worksDataReversed}
                onThumbClick={onThumbClick}
                includeItem={(item) => Boolean(item.link) && !CASE_STUDY_GROUPS.has(item.group)}
                disableThumbClick
              />
            </div>

            <br />
            <div ref={uiContentRef}>
              <SectionHeader ref={uiSectionRef} id='ui-engineering'>
                <WorkSectionHeader>UI Engineering</WorkSectionHeader>
              </SectionHeader>

              <GridContent
                worksDataReversed={worksDataReversed}
                onThumbClick={onThumbClick}
                includeItem={(item) => !item.link}
              />
            </div>
          </WorksSectionContent>
        </WorksParallaxStage>

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
