import styled, { keyframes } from 'styled-components';

import { THEME } from './theme';

/*
 * Neon signage: the NeonSign lettering and the LED ticker
 * (src/components/city/). Only @media and keyframes here; see styles/city.ts.
 *
 * Motion safety (WCAG 2.3.1): a letter powers on with one strike and one
 * partial dip, and the dying letter dips twice every nine seconds. No dip
 * goes fully dark, and nothing flashes more than three times a second.
 */

const ignite = keyframes`
  0% { opacity: 0.12; }
  20% { opacity: 1; }
  32% { opacity: 0.35; }
  48%, 100% { opacity: 1; }
`;

const buzz = keyframes`
  0%, 62%, 64%, 65%, 67%, 100% { opacity: 1; }
  63% { opacity: 0.35; }
  66% { opacity: 0.55; }
`;

const tickerScroll = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
`;

/**
 * A sign on a dark notched plate. Letters stay inline so the heading's
 * accessible name reads as words; only the line wrappers are blocks.
 * Set --sign-tone and --sign-halo to recolor the tube lines.
 */
export const NeonSignRoot = styled.p`
  --sign-tone: var(--neon-magenta);
  --sign-halo: rgba(255, 43, 214, 0.65);
  --sign-caption-tone: var(--neon-cyan);
  position: relative;
  isolation: isolate;
  margin: 0;
  padding: 0.18em 0.22em 0.2em;
  font-family: ${THEME.fonts.display};
  font-weight: 900;
  line-height: 0.9;
  text-align: center;
  text-transform: uppercase;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border: 1px solid rgba(150, 210, 230, 0.16);
    background:
      linear-gradient(rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0)),
      rgba(3, 6, 12, 0.55);
    clip-path: polygon(0 0, calc(100% - 0.22em) 0, 100% 0.22em, 100% 100%, 0.22em 100%, 0 calc(100% - 0.22em));
  }

  html[data-theme='light'] &::before {
    background: rgba(10, 16, 26, 0.92);
  }

  .sign-line {
    display: block;
  }

  /*
   * Letters stay inline, so the sign's accessible name reads as words rather
   * than spaced-out letters. Explicit because jsdom has no default display.
   */
  .letter {
    display: inline;
    animation: ${ignite} 0.5s ease-out both;
    animation-delay: calc(0.35s + var(--i, 0) * 0.11s);
  }

  .letter.is-dying {
    animation:
      ${ignite} 0.5s ease-out both,
      ${buzz} 9s linear infinite;
    animation-delay:
      calc(0.35s + var(--i, 0) * 0.11s),
      calc(3s + var(--i, 0) * 0.11s);
  }

  /* Glass tubes: a white-hot core inside a colored glow. */
  .sign-tube {
    font-size: 0.5em;
    letter-spacing: 0.1em;
    color: #ffe6fb;
    text-shadow:
      0 0 0.03em #fff,
      0 0 calc(0.1em * var(--neon-glow-strength, 1)) var(--sign-tone),
      0 0 calc(0.24em * var(--neon-glow-strength, 1)) var(--sign-tone),
      0 0 calc(0.5em * var(--neon-glow-strength, 1)) var(--sign-halo);
  }

  /* A small line of lettering between two neon rules. */
  .sign-caption {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6em;
    margin: 0.2em 0 0.1em;
    font-family: ${THEME.fonts.hud};
    font-size: 0.2em;
    font-weight: 700;
    letter-spacing: 0.4em;
    color: #e3feff;
    text-shadow:
      0 0 0.1em #fff,
      0 0 calc(0.3em * var(--neon-glow-strength, 1)) var(--sign-caption-tone),
      0 0 calc(0.7em * var(--neon-glow-strength, 1)) var(--sign-caption-tone);
  }

  .sign-caption::before,
  .sign-caption::after {
    content: '';
    width: 2.6em;
    height: 0.12em;
    background: var(--sign-caption-tone);
    box-shadow: 0 0 calc(0.3em * var(--neon-glow-strength, 1)) var(--sign-caption-tone);
  }

  /* Letter spacing trails the last letter; pull the right rule back. */
  .sign-caption::after {
    margin-left: -0.4em;
  }

  /* Striped LEDs, like a hotel sign's pixel rows. */
  .led-glow {
    display: block;
    filter:
      drop-shadow(0 0 0.015em rgba(255, 255, 255, 0.9))
      drop-shadow(0 0 calc(0.06em * var(--neon-glow-strength, 1)) rgba(255, 43, 214, 0.9))
      drop-shadow(0 0 calc(0.22em * var(--neon-glow-strength, 1)) rgba(163, 91, 255, 0.55));
  }

  .led-word {
    display: block;
    letter-spacing: 0.02em;
    -webkit-mask-image: repeating-linear-gradient(to bottom, #000 0 0.055em, rgba(0, 0, 0, 0.18) 0.055em 0.085em);
    mask-image: repeating-linear-gradient(to bottom, #000 0 0.055em, rgba(0, 0, 0, 0.18) 0.055em 0.085em);
  }

  .sign-led .letter {
    background: linear-gradient(180deg, #ffffff 8%, #ffb8f3 30%, #ff2bd6 58%, #b45cff 92%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

/**
 * An LED dot-matrix banner. The phrases render twice and the track scrolls
 * by half its width, so the loop is seamless; spacing is a margin after every
 * item (not a gap) to keep both halves exactly equal.
 */
export const LedTickerRoot = styled.div`
  overflow: hidden;
  border-top: 6px solid #151c26;
  border-bottom: 6px solid #151c26;
  background:
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.55) 0 2px, transparent 2px 6px),
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.55) 0 2px, transparent 2px 6px),
    #0a0610;

  .ticker-track {
    display: flex;
    align-items: center;
    width: max-content;
    height: 100%;
    font-family: ${THEME.fonts.display};
    font-weight: 800;
    color: var(--hud-yellow);
    text-shadow: 0 0 calc(0.13em * var(--neon-glow-strength, 1)) rgba(243, 230, 0, 0.8);
    text-transform: uppercase;
    white-space: nowrap;
    animation: ${tickerScroll} var(--ticker-duration, 26s) linear infinite;
    will-change: transform;
  }

  .ticker-item {
    margin-right: 0.52em;
  }

  /* Same gap as the items, in the gem's smaller ems. */
  .ticker-gem {
    margin-right: 0.87em;
    color: var(--neon-magenta);
    font-size: 0.6em;
    text-shadow: 0 0 calc(0.2em * var(--neon-glow-strength, 1)) var(--neon-magenta);
  }
`;
