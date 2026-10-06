import styled, { keyframes } from 'styled-components';

import { FooterContent, TopNavContent } from '../src/components';
import Seo from '../src/components/Seo';
import TrackedLink from '../src/components/TrackedLink';
import { Wrapper } from '../styles';
import { hudFrame, neonButton, scanlines } from '../styles/hud';
import { THEME } from '../styles/theme';

/* The sign browns out a few times per loop: partial dips, never a strobe. */
const signFlicker = keyframes`
  0%, 41%, 45%, 49%, 100% { opacity: 1; }
  43% { opacity: 0.4; }
  47% { opacity: 0.7; }
`;

/* A slice of the sign tears sideways for a moment, then snaps back. */
const signTear = keyframes`
  0%, 86%, 100% { clip-path: inset(0 0 100% 0); transform: translate3d(0, 0, 0); }
  88% { clip-path: inset(38% 0 44% 0); transform: translate3d(-0.08em, 0, 0); }
  91% { clip-path: inset(62% 0 18% 0); transform: translate3d(0.06em, 0, 0); }
  94% { clip-path: inset(12% 0 74% 0); transform: translate3d(-0.04em, 0, 0); }
`;

/* The trace draws across the monitor, then fades before the next sweep. */
const traceDraw = keyframes`
  0% { stroke-dashoffset: 1; opacity: 1; }
  70% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
`;

const NotFoundSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.1em;
  min-height: 60vh;
  padding: clamp(3em, 8vw, 6em) 1.5em;
  color: ${THEME.colors.white};

  h1 {
    margin: 0;
    font-family: ${THEME.fonts.hud};
    font-size: clamp(2em, 4.4vw, 3em);
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 1.1;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    max-width: 34em;
    font-family: ${THEME.fonts.body};
    font-size: 1.2em;
    line-height: 1.6;
    opacity: 0.9;
  }

  .home-link {
    ${neonButton}
    margin-top: 0.6em;
  }
`;

/* A dead neon sign above the monitor, built from aria-hidden text. */
const FlatlineSign = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0 0.35em;
  font-family: ${THEME.fonts.display};
  font-size: clamp(2.6rem, 9vw, 6.2rem);
  font-weight: 900;
  letter-spacing: 0.06em;
  line-height: 1;
  text-transform: uppercase;

  .word {
    position: relative;
    color: #ffe4ea;
    text-shadow:
      0 0 0.03em #fff,
      0 0 0.1em var(--neon-red),
      0 0 0.32em var(--neon-red),
      0 0 0.8em rgba(255, 58, 92, 0.45);
    animation: ${signFlicker} 7s linear 1.2s infinite;
  }

  /* A chromatic copy of the word that tears through on a loop. */
  .word::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: var(--neon-cyan);
    text-shadow: 0.04em 0 var(--neon-magenta);
    clip-path: inset(0 0 100% 0);
    animation: ${signTear} 5.5s steps(1, end) 2s infinite;
  }

  .code {
    font-family: ${THEME.fonts.mono};
    font-size: 0.42em;
    font-weight: 400;
    letter-spacing: 0.1em;
    color: var(--neon-cyan);
    text-shadow: 0 0 calc(0.4em * var(--neon-glow-strength, 1)) var(--city-glow);
  }

  html[data-theme='light'] & .word {
    color: var(--neon-red);
    text-shadow: 0 0 0.25em rgba(212, 38, 63, 0.3);
  }

  @media (prefers-reduced-motion: reduce) {
    .word,
    .word::after {
      animation: none;
    }
  }
`;

/* A vitals monitor whose trace beats twice, then flatlines. */
const FlatlineMonitor = styled.div`
  ${hudFrame({ blur: false })}
  --hud-notch: 12px;
  --hud-accent: var(--neon-red);
  --hud-frame-bg: ${scanlines}, var(--panel-bg);
  width: min(34rem, 100%);
  padding: 0.75em 1em 0.9em;

  .readout {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    margin-bottom: 0.4em;
    color: ${THEME.colors.mutedLabel};
    font-family: ${THEME.fonts.mono};
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .readout .vitals {
    color: var(--hud-red);
  }

  svg {
    display: block;
    width: 100%;
    height: 4.5rem;
    overflow: visible;
  }

  .grid {
    stroke: var(--glass-border);
    stroke-width: 1;
  }

  .trace {
    fill: none;
    stroke: var(--hud-red);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    filter: drop-shadow(0 0 4px var(--hud-red));
    animation: ${traceDraw} 3.2s ${THEME.easing.inOut} infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .trace {
      animation: none;
    }
  }
`;

const NotFoundPage = () => (
  <>
    <Seo title='Page Not Found' path='/404/' noIndex />
    <TopNavContent />
    <Wrapper>
      <NotFoundSection>
        <FlatlineSign aria-hidden='true'>
          <span className='word' data-text='Flatlined'>Flatlined</span>
          <span className='code'>{'// 404'}</span>
        </FlatlineSign>
        <FlatlineMonitor aria-hidden='true'>
          <div className='readout'>
            <span>Route signal</span>
            <span className='vitals'>No pulse</span>
          </div>
          <svg data-art viewBox='0 0 600 80' preserveAspectRatio='none' focusable='false'>
            <path className='grid' d='M0 40 H600 M150 0 V80 M300 0 V80 M450 0 V80' />
            <path
              className='trace'
              pathLength={1}
              d='M0 44 H96 l10 -6 l8 6 h18 l9 -36 l12 64 l9 -40 l7 12 h34 l8 -5 l7 5 h40 l9 -30 l11 52 l8 -32 l6 10 H600'
            />
          </svg>
        </FlatlineMonitor>
        <h1>Page not found</h1>
        <p>The page you are looking for moved or never existed. Let&rsquo;s get you back to the work.</p>
        <TrackedLink
          href='/'
          label='Back to home'
          location='not_found'
          section='cta'
          className='home-link'
        >
          Back to home
        </TrackedLink>
      </NotFoundSection>
    </Wrapper>
    <FooterContent />
  </>
);

export default NotFoundPage;
