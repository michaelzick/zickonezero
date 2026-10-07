import styled, { keyframes } from 'styled-components';

import { facadePalette } from './facade';
import { hudButton, hudFrame, hudSubheading, neonButton, notchPolygon, scanlines } from './hud';
import { THEME } from './theme';

/*
 * The hidden Night Market (src/components/nightmarket/): an after-hours lane
 * under festoon lights, and a synth stall whose counter holds the Rackloose
 * rack. The market only opens after dark: by day the bulbs and the sign are
 * off and the stall's shutter is down. Those states follow html[data-theme]
 * in CSS, so the static HTML never shows the wrong one. Only @media and
 * keyframes here; see styles/city.ts.
 */

const PAGE_GUTTER = 'clamp(16px, 4vw, 48px)';
const STALL_GUTTER = 'clamp(14px, 2.4vw, 28px)';
const STALL_NOTCH = '18px';

// Paper lanterns turn a few degrees on their strings; no light changes.
const lanternSway = keyframes`
  from { transform: rotate(-2.5deg); }
  to { transform: rotate(2.5deg); }
`;

export const MarketRoot = styled.div`
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 ${PAGE_GUTTER} clamp(3em, 8vw, 5em);
  color: ${THEME.colors.white};

  .market-exit {
    display: flex;
    justify-content: center;
    margin-top: clamp(2em, 5vw, 3em);
  }

  .exit-link {
    ${hudButton}
    --hud-accent: var(--neon-amber);
  }
`;

/** The lane: a back wall, two strands of bulbs, lanterns, and the neon title. */
export const MarketLane = styled.header`
  ${facadePalette}
  position: relative;
  isolation: isolate;
  padding: clamp(6.5rem, 13vw, 8.5rem) 0 clamp(1.5rem, 4vw, 2.5rem);
  text-align: center;

  .lane-wall {
    position: absolute;
    inset: 0 calc(-1 * ${PAGE_GUTTER});
    z-index: -1;
    opacity: 0.6;
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 25%, #000 65%, transparent);
    mask-image: linear-gradient(to bottom, transparent, #000 25%, #000 65%, transparent);
    pointer-events: none;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* A soft shade behind the title, so the windows never compete with it. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 42% 34% at 50% 56%, rgba(3, 7, 12, 0.85), transparent 75%);
    }
  }

  .lane-lights {
    position: absolute;
    top: 0;
    left: calc(-1 * ${PAGE_GUTTER});
    width: calc(100% + 2 * ${PAGE_GUTTER});
    height: clamp(90px, 12vw, 140px);
    overflow: visible;
    pointer-events: none;

    .wire,
    .bulb-cap {
      fill: none;
      stroke: #05080c;
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
    }

    .bulb-cap {
      stroke-width: 3;
    }

    .bulb circle {
      fill: #ffe0a3;
      filter: drop-shadow(0 0 calc(5px * var(--neon-glow-strength, 1)) rgba(255, 176, 59, 0.95));
    }
  }

  .lantern {
    position: absolute;
    top: clamp(48px, 7vw, 80px);
    width: clamp(34px, 4vw, 50px);
    height: clamp(52px, 6vw, 74px);
    transform-origin: 50% -40px;
    animation: ${lanternSway} 5.5s ${THEME.easing.inOut} infinite alternate;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: calc(50% - 1px);
      width: 2px;
      height: 40px;
      background: #05080c;
    }

    i {
      position: absolute;
      inset: 0;
      border-radius: 45%;
      background:
        repeating-linear-gradient(180deg, transparent 0 9px, rgba(60, 8, 6, 0.4) 9px 10px),
        radial-gradient(ellipse at 50% 45%, #ffb26b, #d6402f 60%, #7c1717);
      box-shadow:
        inset 0 6px 0 -2px #2a0b08,
        inset 0 -6px 0 -2px #2a0b08,
        0 0 calc(24px * var(--neon-glow-strength, 1)) rgba(255, 98, 54, 0.55);
    }
  }

  .lantern-left {
    left: 6%;
  }

  .lantern-right {
    right: 7%;
    animation-delay: -2.2s;
    animation-direction: alternate-reverse;
  }

  .lane-eyebrow {
    margin: 0 0 0.6em;
    color: var(--neon-amber);
    font-family: ${THEME.fonts.mono};
    font-size: 0.82rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* Lit tubes: a warm core, a cream edge, and an amber halo. */
  .lane-title {
    margin: 0;
    color: #fff1d6;
    font-family: ${THEME.fonts.display};
    font-size: clamp(2.5rem, 8vw, 5.4rem);
    font-weight: 900;
    letter-spacing: 0.04em;
    line-height: 1.05;
    text-transform: uppercase;
    -webkit-text-stroke: 1.5px #ffd28a;
    text-shadow:
      0 0 4px #ffd28a,
      0 0 calc(14px * var(--neon-glow-strength, 1)) #ffb03b,
      0 0 calc(36px * var(--neon-glow-strength, 1)) rgba(255, 144, 36, 0.8);
  }

  .lane-caption {
    margin: 0.7em 0 0;
    color: #b8b3a4;
    font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.14em;
  }

  .lane-intro {
    ${hudFrame({ blur: false })}
    --hud-notch: 12px;
    --hud-accent: var(--neon-amber);
    --hud-frame-bg: var(--panel-bg);
    width: min(38rem, 100%);
    margin: 1.4em auto 0;
    padding: 0.9em 1.2em;
    font-family: ${THEME.fonts.hud};
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.4;
  }

  /* By day the market is shut: bulbs and sign off, lanterns dark. */
  html[data-theme='light'] & .bulb circle {
    fill: #d9d3c6;
    filter: none;
  }

  html[data-theme='light'] & .lane-title {
    color: #3a3833;
    -webkit-text-stroke-color: #9c958a;
    text-shadow: none;
  }

  html[data-theme='light'] & .lantern i {
    background:
      repeating-linear-gradient(180deg, transparent 0 9px, rgba(60, 8, 6, 0.3) 9px 10px),
      #b4483c;
    box-shadow: inset 0 6px 0 -2px #2a0b08, inset 0 -6px 0 -2px #2a0b08;
  }

  html[data-theme='light'] & .lane-caption {
    color: #4b4840;
  }

  html[data-theme='light'] & .lane-wall {
    opacity: 0.4;

    &::after {
      background: radial-gradient(ellipse 42% 34% at 50% 56%, rgba(255, 251, 244, 0.85), transparent 75%);
    }
  }

  html[data-theme='light'] & .lane-eyebrow {
    color: #7a3d06;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    .lantern {
      display: none;
    }

    .lane-intro {
      font-size: 1.08rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lantern {
      animation: none;
    }
  }
`;

/**
 * The stall: a striped awning over the vendor's card and a counter. The
 * counter has a fixed height so the rack scrolls inside it, as Rackloose
 * expects of its host, and a roller shutter that comes down by day.
 */
export const StallRoot = styled.section`
  ${hudFrame({ blur: false })}
  --hud-notch: ${STALL_NOTCH};
  --hud-accent: var(--neon-amber);
  --hud-frame-bg: var(--panel-bg);
  --awning-a: #7a1e25;
  --awning-b: #a8916a;
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  padding: 0 ${STALL_GUTTER} ${STALL_GUTTER};
  text-align: left;

  html[data-theme='light'] & {
    --awning-a: #c23a30;
    --awning-b: #f2e3c6;
  }

  .awning {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    height: 76px;
    margin: 0 calc(-1 * ${STALL_GUTTER});
    padding-top: 12px;
    background:
      repeating-linear-gradient(90deg, var(--awning-a) 0 48px, var(--awning-b) 48px 96px) top / 100% 52px no-repeat,
      radial-gradient(circle at 24px 0, var(--awning-a) 0 23px, transparent 24px) 0 52px / 96px 24px repeat-x,
      radial-gradient(circle at 72px 0, var(--awning-b) 0 23px, transparent 24px) 0 52px / 96px 24px repeat-x;
    clip-path: ${notchPolygon(STALL_NOTCH)};
  }

  .awning-sign {
    padding: 0.35em 0.9em;
    border: 1px solid rgba(255, 210, 138, 0.5);
    background: #0b1316;
    color: #ffd28a;
    font-family: ${THEME.fonts.mono};
    font-size: 0.78rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    text-shadow: 0 0 calc(6px * var(--neon-glow-strength, 1)) rgba(255, 176, 59, 0.9);

    i {
      font-style: normal;
      opacity: 0.6;
    }
  }

  html[data-theme='light'] & .awning-sign {
    color: #8d877b;
    text-shadow: none;
  }

  .stall-body {
    display: grid;
    grid-template-columns: minmax(15rem, 0.34fr) minmax(0, 1fr);
    gap: clamp(1em, 2.4vw, 2em);
    padding-top: 1.4em;
  }

  .stall-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.9em;

    h2 {
      ${hudSubheading}
    }

    p {
      margin: 0;
      font-family: ${THEME.fonts.hud};
      font-size: 1.12rem;
      line-height: 1.45;
    }
  }

  /* A hand-lettered card propped on the counter. */
  .stall-tag {
    display: inline-block;
    padding: 0.25em 0.75em;
    background: #f2e3c6;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.35);
    color: #2a1d10;
    font-weight: 700;
    letter-spacing: 0.04em;
    transform: rotate(-3deg);
  }

  .stall-copy .stall-tag {
    font-size: 1rem;
  }

  .stall-link {
    ${hudButton}
    margin-top: 0.3em;
  }

  .stall-counter {
    position: relative;
    height: min(780px, calc(100vh - 160px));
    height: min(780px, calc(100dvh - 160px));
    min-height: 460px;
    overflow: hidden;
    border: 1px solid var(--glass-border);
    background: #0b0f12;
    box-shadow: inset 0 3px 0 rgba(255, 176, 59, 0.45);
  }

  .stall-slot {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .stall-rack {
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .rack-standby {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    padding: 1.5em;
    background: ${scanlines}, #0b0f12;
    color: #ffd28a;
    font-family: ${THEME.fonts.mono};
    font-size: 0.85rem;
    letter-spacing: 0.16em;
    text-align: center;
    text-transform: uppercase;

    p {
      margin: 0;
    }
  }

  /* A roller shutter, rolled up out of sight after dark. */
  .stall-shutter {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 1.4em;
    padding: clamp(2.5rem, 10vh, 6rem) 1.5em 1.5em;
    background:
      linear-gradient(to bottom, transparent calc(100% - 18px), #3f4547 calc(100% - 18px)),
      repeating-linear-gradient(180deg, #9aa0a2 0 14px, #6d7375 14px 16px, #b3b8ba 16px 18px);
    text-align: center;
    visibility: hidden;
    transform: translateY(-101%);
    transition: transform 1.1s ${THEME.easing.inOut}, visibility 0s linear 1.1s;
  }

  .shutter-note {
    margin: 0;
    padding: 0.7em 1.1em;
    background: #f6efdd;
    box-shadow: 3px 4px 0 rgba(0, 0, 0, 0.3);
    color: #1c1d1f;
    font-family: ${THEME.fonts.hud};
    font-size: 1.25rem;
    font-weight: 600;
    transform: rotate(-1.5deg);
  }

  .stall-button {
    ${neonButton}
  }

  html[data-theme='light'] & {
    .stall-shutter {
      visibility: visible;
      transform: none;
      transition: transform 0.9s ${THEME.easing.inOut}, visibility 0s;
    }

    .stall-slot,
    .stall-open-note {
      visibility: hidden;
    }

    .stall-open-note {
      display: none;
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    .stall-body {
      grid-template-columns: minmax(0, 1fr);
    }

    .stall-counter {
      height: min(720px, calc(100vh - 150px));
      height: min(720px, calc(100dvh - 150px));
      min-height: 480px;
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    .awning-sign {
      font-size: 0.66rem;
      letter-spacing: 0.14em;
    }
  }
`;
