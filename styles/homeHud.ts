import styled, { keyframes } from 'styled-components';

import { THEME } from './theme';

/*
 * The homepage HUD (src/components/home/HomeHud.tsx). Wide screens get a
 * minimap, clock, and quest tracker in the bottom-right corner; narrow or
 * short screens get the same district buttons as a bottom bar. The component
 * moves the player, writes --hud-progress (0 to 1 along the route), and sets
 * data-hero (over the hero, where the bar would cover its buttons) and
 * data-parked (over the footer) to tuck the HUD away, and data-focus while
 * keyboard focus is inside, which brings it back.
 * The HUD stays a dark game panel by night and a teal one by day.
 * Only @media and keyframes here; see styles/hud.ts.
 */

const BAR_LAYOUT = `(max-width: ${THEME.breakpoints.smallTablet}), (max-height: 560px)`;

const radarSweep = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pinPulse = keyframes`
  from { transform: rotate(45deg) scale(1); opacity: 0.85; }
  to { transform: rotate(45deg) scale(2.6); opacity: 0; }
`;

const playerPing = keyframes`
  from { transform: scale(0.4); opacity: 0.7; }
  to { transform: scale(1.8); opacity: 0; }
`;

// Tucking slides the HUD fully below the viewport, so it needs no
// pointer-events switch; tabbing into it brings it back.
const tucked = `
  opacity: 0;
  transform: translate3d(0, calc(100% + 40px), 0);
`;

const untucked = `
  opacity: 1;
  transform: none;
`;

export const HomeHudRoot = styled.nav`
  --hud-progress: 0;
  --map-w: 216px;
  --map-h: 144px;
  --map-line: rgba(94, 246, 230, 0.32);
  --map-block: rgba(94, 246, 230, 0.075);
  position: fixed;
  right: clamp(12px, 1.6vw, 24px);
  bottom: clamp(12px, 2.4vh, 24px);
  z-index: ${THEME.z.hud};
  width: var(--map-w);
  color: var(--hud-ink);
  transition: transform 0.5s ${THEME.easing.out}, opacity 0.35s ease;

  &[data-parked] {
    ${tucked}
  }

  &[data-parked][data-focus] {
    ${untucked}
  }

  .hud-map {
    position: relative;
    width: var(--map-w);
    height: var(--map-h);
  }

  .hud-map-art {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 10px;
    background:
      radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.45)),
      var(--hud-panel-bg);
    box-shadow:
      0 0 calc(22px * var(--neon-glow-strength, 1)) rgba(94, 246, 230, 0.16),
      0 18px 36px -18px rgba(0, 0, 0, 0.85);

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* A radar sweep over the streets. */
    &::before {
      content: '';
      position: absolute;
      inset: -60%;
      background: conic-gradient(from 0deg, rgba(94, 246, 230, 0.16), transparent 16%);
      animation: ${radarSweep} 7s linear infinite;
      pointer-events: none;
    }

    /* The frame and scanlines, over everything. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid var(--hud-panel-border);
      border-radius: inherit;
      background: repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.16) 0 1px, transparent 1px 3px);
      pointer-events: none;
    }
  }

  .map-blocks {
    fill: var(--map-block);
    stroke: var(--map-line);
    stroke-width: 0.75;
  }

  .map-parks {
    fill: rgba(80, 220, 150, 0.14);
    stroke: rgba(80, 220, 150, 0.32);
    stroke-width: 0.75;
  }

  .map-district {
    --tone: var(--neon-cyan);
    fill: var(--tone);
    fill-opacity: 0.1;
    stroke: var(--tone);
    stroke-opacity: 0.35;
    stroke-width: 1;
    transition: fill-opacity 0.4s ease, stroke-opacity 0.4s ease;
  }

  .map-district.tone-case {
    --tone: var(--neon-magenta);
  }

  .map-district.tone-web {
    --tone: var(--neon-amber);
  }

  .map-district[data-active] {
    fill-opacity: 0.38;
    stroke-opacity: 1;
  }

  .map-route {
    fill: none;
    stroke: var(--hud-yellow);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 0.1 5;
  }

  .map-start {
    fill: none;
    stroke: var(--neon-cyan);
    stroke-width: 1.5;
  }

  .map-goal {
    fill: rgba(3, 12, 16, 0.9);
    stroke: var(--hud-yellow);
    stroke-width: 1.5;
  }

  .map-poi {
    fill: none;
    stroke-width: 1.2;
    opacity: 0.75;
  }

  .poi-gig {
    stroke: var(--hud-yellow);
  }

  .poi-fixer {
    stroke: var(--neon-cyan);
  }

  .poi-shop {
    stroke: var(--neon-magenta);
  }

  .map-north {
    fill: var(--hud-ink-dim);
    font-family: ${THEME.fonts.mono};
    font-size: 9px;
    letter-spacing: 0.1em;
  }

  /* The player: a cyan arrow the component walks along the route. */
  .hud-player {
    --heading: 0deg;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 0;
    height: 0;
    transform: translate3d(36px, 136px, 0);
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      width: 20px;
      height: 20px;
      border: 1px solid var(--neon-cyan);
      border-radius: 50%;
      animation: ${playerPing} 2.2s ease-out infinite;
    }

    i {
      position: absolute;
      top: -8px;
      left: -7px;
      width: 14px;
      height: 16px;
      filter: drop-shadow(0 0 calc(4px * var(--neon-glow-strength, 1)) var(--neon-cyan));
      transform: rotate(var(--heading));
      transition: transform 0.3s ${THEME.easing.out};
    }

    i::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(#e8feff, var(--neon-cyan) 60%);
      clip-path: polygon(50% 0, 100% 100%, 50% 76%, 0 100%);
    }
  }

  .hud-pins {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* District pins: a marker on the route with its name on a chip. */
  .hud-pin {
    --pin-tone: var(--neon-cyan);
    position: absolute;
    top: var(--pin-y);
    left: var(--pin-x);
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 26px;
    margin: 0;
    padding: 0 2px 0 0;
    border: 0;
    background: transparent;
    color: var(--hud-ink);
    font-family: ${THEME.fonts.mono};
    font-size: 10px;
    letter-spacing: 0.06em;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
    transform: translate3d(-7px, -50%, 0);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 1px;
    }
  }

  .hud-pin[data-tone='case'] {
    --pin-tone: var(--neon-magenta);
  }

  .hud-pin[data-tone='web'] {
    --pin-tone: var(--neon-amber);
  }

  .pin-marker {
    position: relative;
    flex: none;
    width: 10px;
    height: 10px;
    margin: 0 2px;
    border: 2px solid var(--pin-tone);
    background: var(--hud-panel-bg);
    transform: rotate(45deg);
    box-shadow: 0 0 calc(6px * var(--neon-glow-strength, 1)) var(--pin-tone);
  }

  .hud-pin[data-state='visited'] .pin-marker,
  .hud-pin[aria-current='true'] .pin-marker {
    background: var(--pin-tone);
  }

  .hud-pin[aria-current='true'] .pin-marker::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: 1px solid var(--pin-tone);
    animation: ${pinPulse} 1.6s ease-out infinite;
  }

  .pin-label {
    padding: 4px 6px;
    border: 1px solid rgba(94, 246, 230, 0.22);
    background: rgba(2, 12, 16, 0.86);
    transition: border-color 0.25s ease, color 0.25s ease, text-shadow 0.25s ease;
  }

  html[data-theme='light'] & .pin-label {
    background: rgba(6, 46, 52, 0.9);
  }

  .hud-pin:hover .pin-label,
  .hud-pin:focus-visible .pin-label,
  .hud-pin[aria-current='true'] .pin-label {
    border-color: var(--pin-tone);
    color: #fff;
    text-shadow: 0 0 calc(8px * var(--neon-glow-strength, 1)) var(--pin-tone);
  }

  /* Clock and quest tracker, right-aligned under the map like a game HUD. */
  .hud-readouts {
    margin-top: 8px;
    padding: 8px 10px 9px;
    border-right: 2px solid var(--hud-yellow);
    background: linear-gradient(to left, rgba(2, 8, 14, 0.92), rgba(2, 8, 14, 0.78));
    text-align: right;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);

    p {
      margin: 0;
    }
  }

  html[data-theme='light'] & .hud-readouts {
    background: linear-gradient(to left, rgba(10, 58, 64, 0.95), rgba(10, 58, 64, 0.84));
  }

  .hud-clock {
    display: block;
    color: var(--hud-ink);
    font-family: ${THEME.fonts.mono};
    font-size: 19px;
    letter-spacing: 0.14em;
    line-height: 1.1;
    text-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) rgba(47, 243, 255, 0.55);
  }

  .quest {
    margin-top: 6px;
  }

  .quest-label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    color: var(--hud-red);
    font-family: ${THEME.fonts.hud};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      background: var(--hud-red);
      transform: rotate(45deg);
    }
  }

  .quest-objective {
    margin-top: 2px;
    color: var(--hud-yellow);
    font-family: ${THEME.fonts.mono};
    font-size: 11.5px;
    letter-spacing: 0.04em;
    line-height: 1.3;
    text-transform: uppercase;
  }

  .quest-distance {
    margin-top: 3px;
    color: var(--hud-ink-dim);
    font-family: ${THEME.fonts.mono};
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  /* Short desktop windows: the map and clock only. */
  @media (max-height: 760px) {
    .quest-distance {
      display: none;
    }
  }

  @media (max-height: 680px) {
    .quest {
      display: none;
    }
  }

  /* The bottom bar: one row of district chips with a progress line on top. */
  @media ${BAR_LAYOUT} {
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    padding: 8px 10px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid var(--glass-border);
    background: rgba(var(--color-dark-rgb), 0.96);

    &::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, var(--neon-magenta), var(--neon-cyan), var(--neon-amber));
      box-shadow: 0 0 calc(8px * var(--neon-glow-strength, 1)) rgba(47, 243, 255, 0.6);
      transform: scaleX(var(--hud-progress));
      transform-origin: 0 50%;
    }

    &[data-hero] {
      ${tucked}
    }

    &[data-hero][data-focus] {
      ${untucked}
    }

    .hud-map {
      width: auto;
      height: auto;
    }

    .hud-map-art,
    .hud-player,
    .hud-readouts {
      display: none;
    }

    .hud-pins {
      display: flex;
      gap: 6px;
      max-width: 40em;
      margin: 0 auto;
    }

    .hud-pins li {
      display: flex;
      flex: 1 1 0;
      min-width: 0;
    }

    .hud-pin {
      position: relative;
      top: auto;
      left: auto;
      flex: 1 1 auto;
      justify-content: center;
      gap: 7px;
      min-height: 44px;
      padding: 4px 8px;
      border: 1px solid var(--glass-border);
      background: rgba(var(--color-dark-rgb), 0.6);
      color: var(--color-white);
      font-family: ${THEME.fonts.hud};
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      line-height: 1.15;
      text-align: center;
      white-space: normal;
      transform: none;
    }

    .hud-pin[aria-current='true'] {
      border-color: var(--pin-tone);
      box-shadow: inset 0 -2px 0 var(--pin-tone);
    }

    .pin-marker {
      width: 8px;
      height: 8px;
      margin: 0;
    }

    .pin-label,
    html[data-theme='light'] & .pin-label {
      padding: 0;
      border: 0;
      background: none;
    }

    .hud-pin:hover .pin-label,
    .hud-pin:focus-visible .pin-label,
    .hud-pin[aria-current='true'] .pin-label {
      color: var(--color-white);
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    .hud-pin {
      font-size: 11px;
      letter-spacing: 0.05em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease;

    .hud-map-art::before {
      display: none;
    }

    .hud-player::before,
    .hud-pin[aria-current='true'] .pin-marker::after {
      animation: none;
      opacity: 0;
    }

    .hud-player i {
      transition: none;
    }
  }
`;
