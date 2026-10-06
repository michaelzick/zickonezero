import styled, { css, keyframes } from 'styled-components';

import { hudFrame, neonButton, notchPolygon, scanlines } from './hud';
import { THEME } from './theme';

/*
 * The contact page as a "secure channel" terminal: a glass console with mono
 * HUD labels, neon focus, and the shared neon CTA. Every decoration is CSS or
 * an aria-hidden sibling, so labels, alerts, and the status keep their copy.
 */

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: clamp(1.6em, 4vw, 3.2em);
  align-items: start;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ContactIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9em;
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: 1.7;

  p {
    margin: 0;
    opacity: 0.9;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.45em;
    min-height: 44px;
    color: ${THEME.colors.white};
    font-family: ${THEME.fonts.hud};
    font-size: 0.95em;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: var(--city-accent);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.35em;
    transition: color 0.2s ease, text-shadow 0.2s ease;

    &:hover,
    &:focus-visible {
      color: var(--city-accent);
      text-shadow: 0 0 calc(0.5em * var(--neon-glow-strength, 1)) var(--city-glow);
    }

    &:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 3px;
    }

    svg {
      width: 0.85em;
      height: 0.85em;
      flex-shrink: 0;
    }
  }
`;

export const ContactProfileLinks = styled.ul`
  list-style: none;
  margin: 0.2em 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.2em 1.6em;

  li {
    margin: 0;
  }
`;

/* The console: notched glass in the route accent with faint scanlines. */
const consolePanel = css`
  ${hudFrame({ blur: false })}
  --hud-notch: 18px;
  --hud-frame-bg: ${scanlines}, var(--panel-bg);
  padding: clamp(1.1em, 2.6vw, 1.8em);
`;

export const ContactForm = styled.form`
  ${consolePanel}
  display: flex;
  flex-direction: column;
  gap: 1.1em;
  font-family: ${THEME.fonts.body};
`;

const signalBars = keyframes`
  0%,
  100% { transform: scaleY(0.45); }
  50% { transform: scaleY(1); }
`;

/* The console's title bar: a channel readout and a live signal meter. */
export const ContactChannel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  margin: -0.15em 0 0.1em;
  padding-bottom: 0.7em;
  border-bottom: 1px solid var(--glass-border);
  color: ${THEME.colors.mutedLabel};
  font-family: ${THEME.fonts.mono};
  font-size: 0.62em;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  .channel {
    display: inline-flex;
    align-items: center;
    gap: 0.7em;
  }

  .channel::before {
    content: '';
    width: 0.7em;
    height: 0.7em;
    background: var(--city-accent);
    box-shadow: 0 0 8px var(--city-glow);
    clip-path: ${notchPolygon('3px')};
  }

  .signal {
    display: inline-flex;
    align-items: center;
    gap: 0.8em;
    color: var(--hud-teal);
  }

  .bars {
    display: inline-flex;
    align-items: flex-end;
    gap: 2px;
    height: 1em;
  }

  .bars span {
    width: 3px;
    height: 100%;
    background: currentColor;
    transform-origin: 50% 100%;
    animation: ${signalBars} 1.4s ease-in-out infinite;
  }

  .bars span:nth-child(2) {
    animation-delay: -0.35s;
  }

  .bars span:nth-child(3) {
    animation-delay: -0.7s;
  }

  .bars span:nth-child(4) {
    animation-delay: -1.05s;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 0.68em;
    letter-spacing: 0.14em;
  }
`;

export const ContactField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45em;

  label {
    display: inline-flex;
    align-items: center;
    gap: 0.6em;
    color: ${THEME.colors.mutedLabel};
    font-family: ${THEME.fonts.mono};
    font-size: 0.66em;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* A notched marker, drawn as a shape so the label text stays exact. */
  label::before {
    content: '';
    width: 0.6em;
    height: 0.6em;
    border: 1px solid currentColor;
    clip-path: ${notchPolygon('2px')};
    transition: background-color 0.2s ease;
  }

  &:focus-within label {
    color: var(--focus-ring);
  }

  &:focus-within label::before {
    background-color: currentColor;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75em 0.9em;
    font-family: ${THEME.fonts.mono};
    /* Never below 16px, or iOS zooms the page on focus. */
    font-size: max(16px, 0.86em);
    line-height: 1.55;
    color: ${THEME.colors.white};
    caret-color: var(--focus-ring);
    background: rgba(var(--color-dark-rgb), 0.72);
    border: 1px solid var(--glass-border);
    border-radius: 0;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

    &::placeholder {
      color: ${THEME.colors.grey};
      opacity: 0.75;
    }

    &:hover:not(:disabled):not(:focus) {
      border-color: var(--city-accent);
    }

    &:focus {
      outline: none;
      border-color: var(--focus-ring);
      background: rgba(var(--color-dark-rgb), 0.9);
      box-shadow:
        0 0 0 1px var(--focus-ring),
        0 0 calc(18px * var(--neon-glow-strength, 1)) -4px var(--focus-ring);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  textarea {
    min-height: 9em;
    resize: vertical;
  }
`;

// Honeypot: kept in the DOM for bots but removed from the visual and
// accessibility tree for people.
export const ContactHoneypot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

export const ContactActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1em 1.4em;
  margin-top: 0.3em;
`;

export const ContactSubmit = styled.button`
  ${neonButton}

  &:disabled {
    cursor: wait;
    filter: saturate(0.55) brightness(0.85);
  }
`;

const uplinkSweep = keyframes`
  from { transform: translate3d(-100%, 0, 0); }
  to { transform: translate3d(250%, 0, 0); }
`;

/* An indeterminate uplink bar beside the button while the message sends. */
export const ContactUplink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8em;
  flex: 1 1 10em;
  min-width: 8em;
  color: var(--hud-teal);
  font-family: ${THEME.fonts.mono};
  font-size: 0.62em;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  .track {
    position: relative;
    flex: 1;
    height: 4px;
    overflow: hidden;
    background: var(--glass-border);
  }

  .track::before {
    content: '';
    position: absolute;
    inset: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, currentColor 60%, #fff);
    box-shadow: 0 0 10px currentColor;
    animation: ${uplinkSweep} 1.1s ${THEME.easing.inOut} infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .track::before {
      width: 100%;
      animation: none;
      opacity: 0.6;
    }
  }
`;

type ContactStatusProps = { $tone: 'error' | 'success' };

const toneColor = (props: ContactStatusProps) => (props.$tone === 'error' ? 'var(--hud-red)' : 'var(--hud-yellow)');

/* Alerts read as a HUD warning strip with a notched glyph. */
export const ContactStatus = styled.p<ContactStatusProps>`
  position: relative;
  margin: 0;
  padding: 0.75em 0.9em 0.75em 2.6em;
  font-size: 0.92em;
  line-height: 1.5;
  color: ${THEME.colors.white};
  border: 1px solid ${toneColor};
  border-left-width: 3px;
  background: ${(props: ContactStatusProps) => (props.$tone === 'error' ? 'rgba(255, 79, 69, 0.12)' : 'rgba(243, 230, 0, 0.1)')};

  &::before {
    content: '';
    position: absolute;
    top: 0.95em;
    left: 0.95em;
    width: 1em;
    height: 0.9em;
    background: ${toneColor};
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
`;

/* Message sent: the console reports a completed transmission. */
export const ContactSuccess = styled.div`
  ${consolePanel}
  --hud-accent: var(--hud-yellow);
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  font-family: ${THEME.fonts.body};

  h2 {
    margin: 0;
    color: ${THEME.colors.white};
    font-family: ${THEME.fonts.display};
    font-size: 1.3em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-shadow: 0 0 calc(0.45em * var(--neon-glow-strength, 1)) rgba(243, 230, 0, 0.45);
  }

  p {
    margin: 0;
    line-height: 1.6;
    opacity: 0.9;
  }
`;
