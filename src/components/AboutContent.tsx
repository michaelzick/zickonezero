import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import {
  DemoStokeMiniCardModal,
  DemoStokeMiniCardModalClose,
  DemoStokeMiniCardModalCopy,
  DemoStokeMiniCardModalOverlay,
  DemoStokeMiniCardModalTitle,
  VisuallyHidden,
  Wrapper
} from '../../styles';
import { neonButton, notchPolygon, notchStrokes, scanlines } from '../../styles/hud';
import { AnimatedSection } from '../../styles/projectShowcases';
import { THEME } from '../../styles/theme';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { trackEvent } from '../lib/analytics';
import FooterContent from './FooterContent';
import TopNavContent from './TopNavContent';
import TrackedLink from './TrackedLink';

/** Corner brackets on all four corners plus centre ticks: a camera viewfinder. */
const viewfinder = (size: string, color: string) => `
  linear-gradient(${color}, ${color}) left top / ${size} 2px no-repeat,
  linear-gradient(${color}, ${color}) left top / 2px ${size} no-repeat,
  linear-gradient(${color}, ${color}) right top / ${size} 2px no-repeat,
  linear-gradient(${color}, ${color}) right top / 2px ${size} no-repeat,
  linear-gradient(${color}, ${color}) left bottom / ${size} 2px no-repeat,
  linear-gradient(${color}, ${color}) left bottom / 2px ${size} no-repeat,
  linear-gradient(${color}, ${color}) right bottom / ${size} 2px no-repeat,
  linear-gradient(${color}, ${color}) right bottom / 2px ${size} no-repeat,
  linear-gradient(${color}, ${color}) center top / 2px 10px no-repeat,
  linear-gradient(${color}, ${color}) center bottom / 2px 10px no-repeat,
  linear-gradient(${color}, ${color}) left center / 10px 2px no-repeat,
  linear-gradient(${color}, ${color}) right center / 10px 2px no-repeat
`;

/*
 * Each snow layer loops by exactly one tile height, so the wrap is seamless,
 * and sways side to side on the way down.
 */
const snowFall = keyframes`
  0% { transform: translate3d(0, calc(var(--snow-tile) * -1), 0); }
  25% { transform: translate3d(var(--snow-sway), calc(var(--snow-tile) * -0.75), 0); }
  50% { transform: translate3d(0, calc(var(--snow-tile) * -0.5), 0); }
  75% { transform: translate3d(calc(var(--snow-sway) * -1), calc(var(--snow-tile) * -0.25), 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

/* One slow pass down the portrait, then a rest off-screen. */
const dossierScan = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  42%,
  100% { transform: translate3d(0, calc(100% + 9em), 0); }
`;

const statusPulse = keyframes`
  0%,
  100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

/* A glint crosses the CTA every few seconds while it waits. */
const ctaGlint = keyframes`
  0%,
  74% { background-position: 160% 0; }
  100% { background-position: -60% 0; }
`;

// The hero's photo is the page's largest paint; it is preloaded below because
// a CSS background is otherwise found only after the styles apply.
const ABOUT_HERO_IMAGE = '/img/illustrated-mt-hood-selfie.webp';

const AboutHero = styled.section`
  position: relative;
  min-height: calc(100svh - 5em);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  background: url('${ABOUT_HERO_IMAGE}') center center / cover no-repeat;
  background-color: var(--color-darkest);

  /* Neon spill: magenta from the street below, cyan from the signs above. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(85% 70% at 0% 100%, rgba(255, 43, 214, 0.42), transparent 62%),
      radial-gradient(75% 65% at 100% 0%, rgba(47, 243, 255, 0.3), transparent 60%);
    mix-blend-mode: screen;
    pointer-events: none;
  }

  /* Scanlines over a vignette that keeps the readouts legible. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      ${scanlines},
      linear-gradient(180deg, rgba(2, 6, 14, 0.5), transparent 24%, transparent 66%, rgba(2, 6, 14, 0.62)),
      radial-gradient(130% 95% at 50% 42%, transparent 52%, rgba(2, 6, 14, 0.5));
    pointer-events: none;
  }

  /* By day the spill becomes warm sun haze over a lighter vignette. */
  html[data-theme='light'] &::before {
    background:
      radial-gradient(85% 70% at 100% 0%, rgba(255, 196, 120, 0.5), transparent 62%),
      radial-gradient(75% 65% at 0% 100%, rgba(31, 111, 120, 0.32), transparent 60%);
    mix-blend-mode: soft-light;
  }

  html[data-theme='light'] &::after {
    background:
      ${scanlines},
      linear-gradient(180deg, rgba(24, 35, 41, 0.3), transparent 24%, transparent 70%, rgba(24, 35, 41, 0.38));
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    min-height: calc(100svh - 5.2em);
    background-position: 62% center;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    min-height: calc(100svh - 8.7em);
    background-position: 68% center;
  }
`;

/* Decorative HUD over the portrait: snow, a viewfinder, a scanner, and readouts. */
const AboutHeroHud = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;

  .snow {
    position: absolute;
    inset: -6% -10%;
    transform: skewX(-4deg);
  }

  .snow-layer {
    position: absolute;
    top: calc(var(--snow-tile) * -1);
    right: 0;
    bottom: 0;
    left: 0;
    will-change: transform;
    animation: ${snowFall} var(--snow-speed) linear infinite;
  }

  .snow-far {
    --snow-tile: 180px;
    --snow-speed: 9s;
    --snow-sway: 6px;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(236, 248, 255, 0.7) 1.2px, transparent 2px),
      radial-gradient(circle at 70% 78%, rgba(236, 248, 255, 0.55) 1px, transparent 1.8px),
      radial-gradient(circle at 45% 55%, rgba(236, 248, 255, 0.5) 0.9px, transparent 1.6px);
    background-size: 61px 180px, 97px 180px, 79px 180px;
  }

  .snow-near {
    --snow-tile: 300px;
    --snow-speed: 6s;
    --snow-sway: 14px;
    background-image:
      radial-gradient(circle at 35% 20%, rgba(255, 255, 255, 0.85) 2px, transparent 3px),
      radial-gradient(circle at 80% 62%, rgba(255, 255, 255, 0.72) 1.6px, transparent 2.6px),
      radial-gradient(circle at 12% 86%, rgba(255, 255, 255, 0.78) 2.4px, transparent 3.4px);
    background-size: 137px 300px, 211px 300px, 173px 300px;
  }

  .viewfinder {
    position: absolute;
    inset: clamp(0.6rem, 1.4vw, 1.1rem);
    background: ${viewfinder('clamp(1.6rem, 3vw, 2.6rem)', 'var(--city-accent)')};
    opacity: 0.85;
    filter: drop-shadow(0 0 6px var(--city-glow));
  }

  .scanner {
    position: absolute;
    inset: 0;
    animation: ${dossierScan} 9s ${THEME.easing.inOut} 1.4s infinite;
  }

  .scanner::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 100%;
    left: 0;
    height: 9em;
    background: linear-gradient(
      180deg,
      transparent,
      rgba(47, 243, 255, 0.06) 78%,
      rgba(47, 243, 255, 0.2) 97%,
      rgba(200, 252, 255, 0.8) 99.4%,
      transparent
    );
  }

  .dossier {
    --hud-notch: 12px;
    --hud-accent: var(--city-accent);
    /* The plate is dark in both themes, so keep the bright night teal. */
    --hud-teal: #5ef6e6;
    position: absolute;
    top: clamp(1.4rem, 3.2vw, 2.4rem);
    left: clamp(1.4rem, 3.2vw, 2.4rem);
    width: min(26rem, calc(100% - 2.8rem));
    padding: 0.85rem 1.05rem 0.95rem;
    color: var(--hud-ink);
    font-family: ${THEME.fonts.mono};
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    line-height: 1.35;
    text-align: left;
    text-transform: uppercase;
    isolation: isolate;
  }

  /* The plate stays dark teal in both themes, like the reference HUD. */
  .dossier::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border: 1px solid var(--hud-panel-border);
    background:
      ${notchStrokes('var(--hud-notch)', 'var(--hud-accent)')},
      ${scanlines},
      var(--hud-panel-bg);
    background-origin: border-box;
    background-repeat: no-repeat;
    clip-path: ${notchPolygon('var(--hud-notch)')};
  }

  .dossier-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    margin: 0 0 0.6em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid var(--hud-panel-border);
    color: var(--hud-yellow);
    font-family: ${THEME.fonts.hud};
    font-size: 1.15em;
    font-weight: 700;
    letter-spacing: 0.2em;
  }

  .dossier-id {
    color: var(--hud-ink-dim);
    font-family: ${THEME.fonts.mono};
    font-size: 0.78em;
    font-weight: 400;
    letter-spacing: 0.12em;
  }

  .dossier-rows {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 0.38em 1.1em;
    margin: 0;
  }

  .dossier-rows dt {
    color: var(--hud-ink-dim);
  }

  .dossier-rows dd {
    margin: 0;
    overflow-wrap: anywhere;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.55em;
    color: var(--hud-teal);
  }

  .status::before {
    content: '';
    width: 0.55em;
    height: 0.55em;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
    animation: ${statusPulse} 1.8s ease-in-out infinite;
  }

  .feed {
    position: absolute;
    top: clamp(1.4rem, 3.2vw, 2.4rem);
    right: clamp(1.4rem, 3.2vw, 2.4rem);
    display: flex;
    align-items: center;
    gap: 0.6em;
    padding: 0.35rem 0.7rem;
    background: rgba(2, 8, 16, 0.55);
    color: var(--hud-ink);
    font-family: ${THEME.fonts.mono};
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .feed::before {
    content: '';
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    background: var(--hud-red);
    box-shadow: 0 0 8px var(--hud-red);
    animation: ${statusPulse} 1.2s steps(2, jump-none) infinite;
  }

  /* Day snow catches a soft shadow so it reads on the lighter vignette. */
  html[data-theme='light'] & .snow {
    filter: drop-shadow(0 0 1.5px rgba(24, 35, 41, 0.45));
  }

  html[data-theme='light'] & .scanner::before {
    background: linear-gradient(
      180deg,
      transparent,
      rgba(255, 255, 255, 0.08) 78%,
      rgba(255, 255, 255, 0.24) 97%,
      rgba(255, 255, 255, 0.85) 99.4%,
      transparent
    );
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    .dossier {
      top: 0.85rem;
      left: 0.85rem;
      width: min(16.5rem, calc(100% - 1.7rem));
      padding: 0.6rem 0.75rem 0.7rem;
      font-size: 0.62rem;
    }

    .dossier-row-optional,
    .feed {
      display: none;
    }
  }

  /* Still snow reads as a gentle flurry, so reduced motion keeps the flakes
     and drops only the scanner. */
  @media (prefers-reduced-motion: reduce) {
    .snow-layer {
      animation: none;
    }

    .scanner {
      display: none;
    }
  }
`;

const AboutFixedCta = styled.button`
  ${neonButton}
  position: absolute;
  right: clamp(0.85rem, 3vw, 2.1rem);
  bottom: clamp(0.85rem, 3vw, 1.8rem);
  z-index: 2;
  max-width: min(18rem, calc(100% - 1.7rem));
  min-height: 56px;
  padding: 0 1.9em;
  font-size: 1.2rem;

  &::before {
    animation: ${ctaGlint} 5.5s ease-in-out 1.5s infinite;
  }

  /* A play-style arrow, drawn as a shape so it stays out of the name. */
  &::after {
    content: '';
    width: 0.48em;
    height: 0.6em;
    background: currentColor;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    transition: transform 0.2s ${THEME.easing.out};
  }

  &:hover::after,
  &:focus-visible::after {
    transform: translateX(3px);
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    max-width: min(17rem, calc(100% - 1.6rem));
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    right: clamp(0.6rem, 3vw, 1rem);
    bottom: clamp(0.6rem, 3vw, 1rem);
    max-width: min(15rem, calc(100% - 1.2rem));
    min-height: 50px;
    padding: 0 1.35em;
    font-size: 1.02rem;
  }
`;

/* The bio opens as a decrypted data shard. */
const AboutModalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4em 1.4em;
  margin: 0 0 0.9em;
  padding-right: 3em;
  color: var(--hud-ink-dim);
  font-family: ${THEME.fonts.mono};
  font-size: 0.8em;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  .shard {
    color: var(--hud-yellow);
  }

  .decrypted {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    color: var(--hud-teal);
  }

  .decrypted::before {
    content: '';
    width: 0.5em;
    height: 0.5em;
    background: currentColor;
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  }
`;

const AboutModalCopy = styled(DemoStokeMiniCardModalCopy)`
  text-align: left;
  font-size: 2em;
  line-height: 1.6;
  padding-left: 0.7em;
  border-left: 1px solid var(--hud-panel-border);

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    font-size: 1.6em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 1.28em;
  }
`;

const AboutModal = styled(DemoStokeMiniCardModal)`
  width: min(960px, 96vw);
`;

const AboutModalTitle = styled(DemoStokeMiniCardModalTitle)`
  font-size: clamp(2.5em, 4.6vw, 3em);
  margin-bottom: 0.55em;
  text-align: left;
`;

const AboutContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useBodyScrollLock(isAboutModalOpen);

  const openAboutModal = useCallback(() => {
    trackEvent('modal_open', {
      location: 'about_hero',
      label: 'About Michael',
      modal: 'about_michael',
      page_path: window.location.pathname,
    });
    setIsAboutModalOpen(true);
  }, []);

  const closeAboutModal = useCallback(() => {
    trackEvent('modal_close', {
      location: 'about_modal',
      label: 'About Michael',
      modal: 'about_michael',
      page_path: window.location.pathname,
    });
    setIsAboutModalOpen(false);
    openButtonRef.current?.focus();
  }, []);

  const handleAboutModalClick = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  // The bio stays in the page's HTML, so move focus into it when it opens.
  useEffect(() => {
    if (isAboutModalOpen) closeButtonRef.current?.focus();
  }, [isAboutModalOpen]);

  useEffect(() => {
    if (!isAboutModalOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAboutModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAboutModalOpen, closeAboutModal]);

  return (
    <>
      <Head>
        <link key='about-hero-image' rel='preload' as='image' href={ABOUT_HERO_IMAGE} fetchPriority='high' />
      </Head>
      <TopNavContent />
      <Wrapper
        isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}
      >
        {/* The hero opens the page, so it boots up from the first paint
            rather than waiting for scripts to see it. */}
        <AnimatedSection data-animate-id='about-hero' data-reveal='load' className='visible'>
          <AboutHero aria-label='About page hero'>
            <VisuallyHidden>About Michael Zick</VisuallyHidden>
            <AboutHeroHud aria-hidden='true'>
              <div className='snow'>
                <div className='snow-layer snow-far' />
                <div className='snow-layer snow-near' />
              </div>
              <div className='scanner' />
              <div className='viewfinder' />
              <div className='dossier'>
                <div className='dossier-head'>
                  <span>Dossier</span>
                  <span className='dossier-id'>MZ-0117</span>
                </div>
                <dl className='dossier-rows'>
                  <dt>Subject</dt>
                  <dd>M. Zick</dd>
                  <dt>Class</dt>
                  <dd>Product Engineer + UX designer</dd>
                  <dt>Status</dt>
                  <dd><span className='status'>Open to connect</span></dd>
                  <dt className='dossier-row-optional'>Last seen</dt>
                  <dd className='dossier-row-optional'>El Porto, Manhattan Beach, CA</dd>
                </dl>
              </div>
              <div className='feed'>Feed 04 // Live</div>
            </AboutHeroHud>
            <AboutFixedCta ref={openButtonRef} type='button' onClick={openAboutModal} aria-controls='about-bio' aria-expanded={isAboutModalOpen} aria-haspopup='dialog'>
              About Michael
            </AboutFixedCta>
          </AboutHero>
        </AnimatedSection>

        <div id='about-bio' hidden={!isAboutModalOpen}>
          <DemoStokeMiniCardModalOverlay onClick={closeAboutModal} role='presentation'>
            <AboutModal
              role='dialog'
              aria-modal='true'
              aria-label='About Michael'
              onClick={handleAboutModalClick}
            >
              <DemoStokeMiniCardModalClose ref={closeButtonRef} type='button' onClick={closeAboutModal} aria-label='Close dialog'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </DemoStokeMiniCardModalClose>
              <AboutModalMeta aria-hidden='true'>
                <span className='shard'>Shard // bio.dat</span>
                <span className='decrypted'>Decrypted</span>
              </AboutModalMeta>
              <AboutModalTitle as='h2'>About Michael</AboutModalTitle>
              <AboutModalCopy>
                <p>
                  Michael is a results-oriented Product Leader with a background in product engineering, UX design,
                  DevOps, SEO, and e-commerce platforms.
                </p>
                <p>
                  He has hired and led engineering teams to build high-engagement products from 0 to 1 under tight
                  deadlines, while aligning cross-functional stakeholders in highly ambiguous environments.
                </p>
                <p>
                  From concept to launch, Michael thrives on solving complex problems with elegant, user-centered solutions.
                </p>
                <p>
                  Samples of his work can be found in the <TrackedLink href='/' label='main gallery' location='about_modal' section='body'>main gallery</TrackedLink>, with code examples on{' '}
                  <TrackedLink href='https://github.com/michaelzick' label='GitHub' location='about_modal' section='body'
                    target='_blank' rel='noopener noreferrer'>GitHub</TrackedLink>, and a
                  full list of qualifications on <TrackedLink href='https://linkedin.com/in/michaelzick'
                    label='LinkedIn' location='about_modal' section='body'
                    target='_blank' rel='noopener noreferrer'>LinkedIn</TrackedLink>.
                </p>
              </AboutModalCopy>
            </AboutModal>
          </DemoStokeMiniCardModalOverlay>
        </div>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default AboutContent;
