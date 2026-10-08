import styled, { keyframes } from 'styled-components';

import { hudButton, hudFrame, hudSubheading, neonButton, scanlines } from './hud';
import { THEME } from './theme';

/*
 * Bar Four (src/components/barfour/): a basement listening bar, record
 * exchange, and club under the alley, wired like a modular rack, with the
 * house Rackloose rack in its booth. The club only opens after dark: by day
 * the lights and the title are off and a flight-case lid covers the rack.
 * Those states follow html[data-theme] in CSS, so the static HTML never shows
 * the wrong one. Only @media and keyframes here; see styles/city.ts.
 */

const PAGE_GUTTER = 'clamp(16px, 4vw, 48px)';
const BOOTH_GUTTER = 'clamp(14px, 2.4vw, 28px)';
const BOOTH_NOTCH = '18px';
// The room fades out at its sides into the city instead of ending in a box.
const SIDE_FADE = 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)';

// Moving heads sweep their beams slowly across the room; no light flashes.
const beamSweep = keyframes`
  from { transform: rotate(var(--beam-from)); }
  to { transform: rotate(var(--beam-to)); }
`;

export const ClubRoot = styled.div`
  position: relative;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 ${PAGE_GUTTER} clamp(3em, 8vw, 5em);
  color: ${THEME.colors.white};

  .club-exit {
    display: flex;
    justify-content: center;
    margin-top: clamp(2em, 5vw, 3em);
  }

  .exit-link {
    ${hudButton}
    --hud-accent: var(--neon-amber);
  }
`;

/**
 * The room: a wall of records, a patch rail strung with cables, two moving
 * heads, speaker stacks, a lit floor, and the neon title. Only the text is
 * real; the rest is decorative.
 */
export const ClubScene = styled.header`
  --audio: #eeb558;
  --cv: #65bdd5;
  --gate: #ea8476;
  --rail-height: clamp(110px, 13vw, 170px);
  position: relative;
  isolation: isolate;
  padding: clamp(7rem, 14vw, 10rem) 0 clamp(2rem, 5vw, 3.5rem);
  text-align: center;

  /* Records: dark sleeves, a few bright ones, and plain shelf boards. */
  .record-wall {
    position: absolute;
    inset: 0 calc(-1 * ${PAGE_GUTTER});
    z-index: -1;
    opacity: 0.7;
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 62%, transparent 92%);
    mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 62%, transparent 92%);
    pointer-events: none;

    svg {
      display: block;
      width: 100%;
      height: 100%;
      -webkit-mask-image: ${SIDE_FADE};
      mask-image: ${SIDE_FADE};
    }

    /* A soft shade behind the title, so the records never compete with it. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 40% 36% at 50% 52%, rgba(3, 7, 12, 0.9), transparent 78%);
    }
  }

  .shelf { fill: #05080a; }
  .record-slate { fill: #222b36; }
  .record-plum { fill: #2e2236; }
  .record-umber { fill: #35271c; }
  .record-teal { fill: #1b2f31; }
  .record-ochre { fill: #3d3121; }
  .record-amber { fill: #a86c22; }
  .record-magenta { fill: #84275c; }
  .record-cyan { fill: #22707a; }

  .sleeve-ring {
    fill: none;
    stroke: rgba(255, 236, 200, 0.4);
    stroke-width: 3;
  }

  .sleeve-label { fill: #ffd28a; }

  /* A lit floor in perspective, fading into the room and the page. */
  .dance-floor {
    position: absolute;
    right: calc(-1 * ${PAGE_GUTTER});
    bottom: 0;
    left: calc(-1 * ${PAGE_GUTTER});
    z-index: -1;
    height: clamp(150px, 24vw, 260px);
    -webkit-mask-image: ${SIDE_FADE};
    mask-image: ${SIDE_FADE};
    pointer-events: none;
  }

  .dance-floor i {
    position: absolute;
    inset: 0;
    overflow: hidden;
    perspective: 320px;
    -webkit-mask-image: linear-gradient(to top, transparent, #000 22%, #000 50%, transparent);
    mask-image: linear-gradient(to top, transparent, #000 22%, #000 50%, transparent);

    &::before {
      content: '';
      position: absolute;
      inset: -10% -60% -30%;
      background:
        radial-gradient(ellipse 30% 55% at 50% 70%, rgba(255, 176, 59, 0.28), transparent 70%),
        radial-gradient(ellipse 24% 40% at 30% 80%, rgba(255, 79, 216, 0.16), transparent 70%),
        radial-gradient(ellipse 24% 40% at 70% 80%, rgba(47, 243, 255, 0.14), transparent 70%),
        linear-gradient(90deg, rgba(255, 176, 59, 0.32) 2px, transparent 2px) 50% 0 / 64px 64px,
        linear-gradient(rgba(255, 176, 59, 0.32) 2px, transparent 2px) 50% 0 / 64px 64px,
        #06090c;
      transform: rotateX(64deg);
      transform-origin: 50% 100%;
    }
  }

  /* Stacked cabinets either side of the floor, cones ringed in neon. */
  .speaker {
    --ring: var(--neon-magenta);
    position: absolute;
    bottom: clamp(1.5rem, 4vw, 3rem);
    z-index: -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: clamp(64px, 7vw, 104px);
    height: clamp(128px, 14vw, 208px);
    border: 3px solid #1d2429;
    background: linear-gradient(180deg, #151b20, #090c0f);
    box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.35), inset 0 0 0 2px #05080a;
    pointer-events: none;

    i {
      display: block;
      width: 72%;
      height: 0;
      padding-bottom: 72%;
      border-radius: 50%;
      background: radial-gradient(circle, #2c3338 0 16%, #0a0d10 18% 56%, #1b2126 58% 68%, #05070a 70%);
      box-shadow: 0 0 0 2px var(--ring), 0 0 calc(12px * var(--neon-glow-strength, 1)) var(--ring);
    }

    i:first-child {
      width: 30%;
      padding-bottom: 30%;
    }
  }

  .speaker-left { left: 0; }

  .speaker-right {
    --ring: var(--neon-cyan);
    right: 0;
  }

  /* Moving heads under the rail; each throws one slow beam. */
  .light {
    position: absolute;
    top: calc(var(--rail-height) * 0.16);
    z-index: -1;
    width: 30px;
    height: 22px;
    border: 2px solid #2b3338;
    border-radius: 5px 5px 12px 12px;
    background: radial-gradient(circle at 50% 80%, #fff3d6 0 3px, #11171b 4px);
    pointer-events: none;

    i {
      --beam-width: clamp(180px, 24vw, 340px);
      position: absolute;
      top: 100%;
      left: calc(50% - var(--beam-width) / 2);
      width: var(--beam-width);
      height: clamp(360px, 48vw, 600px);
      background: linear-gradient(to bottom, var(--beam), transparent 85%);
      clip-path: polygon(47% 0, 53% 0, 100% 100%, 0 100%);
      transform: rotate(var(--beam-from));
      transform-origin: 50% 0;
      animation: ${beamSweep} 9s ${THEME.easing.inOut} infinite alternate;
      animation-play-state: paused;
    }
  }

  .light-left {
    --beam: rgba(255, 79, 216, 0.22);
    --beam-from: -30deg;
    --beam-to: 6deg;
    left: 20%;
  }

  .light-right {
    --beam: rgba(47, 243, 255, 0.18);
    --beam-from: 30deg;
    --beam-to: -6deg;
    right: 20%;

    i { animation-delay: -4s; }
  }

  &[data-scene-motion='running'] .light i { animation-play-state: running; }
  &[data-scene-motion='still'] .light i { animation: none; }

  /* The ceiling is a patch bay: jacks along a rail, cables slung between. */
  .patch-rail {
    position: absolute;
    top: 0;
    left: calc(-1 * ${PAGE_GUTTER});
    width: calc(100% + 2 * ${PAGE_GUTTER});
    height: var(--rail-height);
    -webkit-mask-image: ${SIDE_FADE};
    mask-image: ${SIDE_FADE};
    pointer-events: none;
  }

  .rail {
    fill: #0b1013;
  }

  .jack {
    fill: #020304;
    stroke: #3a4348;
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .cable { --cable: var(--audio); }
  .cable-cv { --cable: var(--cv); }
  .cable-gate { --cable: var(--gate); }

  .cord {
    fill: none;
    stroke: var(--cable);
    stroke-linecap: round;
    stroke-width: 5;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 calc(5px * var(--neon-glow-strength, 1)) var(--cable));
  }

  .plug {
    fill: #161b1f;
    stroke: var(--cable);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .club-eyebrow {
    margin: 0 0 0.6em;
    color: var(--neon-amber);
    font-family: ${THEME.fonts.mono};
    font-size: 0.82rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* Lit tubes: a warm core, a cream edge, and an amber halo. */
  .club-title {
    margin: 0;
    color: #fff1d6;
    font-family: ${THEME.fonts.display};
    font-size: clamp(2.7rem, 9vw, 6rem);
    font-weight: 900;
    letter-spacing: 0.06em;
    line-height: 1.05;
    text-transform: uppercase;
    -webkit-text-stroke: 1.5px #ffd28a;
    text-shadow:
      0 0 4px #ffd28a,
      0 0 calc(14px * var(--neon-glow-strength, 1)) #ffb03b,
      0 0 calc(36px * var(--neon-glow-strength, 1)) rgba(255, 144, 36, 0.8);
  }

  .club-caption {
    margin: 0.7em 0 0;
    color: #b8b3a4;
    font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.14em;
  }

  .club-intro {
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

  /* By day the club is shut: lights, tubes, and the floor are off. */
  html[data-theme='light'] & {
    .record-wall {
      opacity: 0.35;

      &::after {
        background: radial-gradient(ellipse 40% 36% at 50% 52%, rgba(255, 251, 244, 0.88), transparent 78%);
      }
    }

    .shelf { fill: #5d554b; }
    .record-slate { fill: #9aa2aa; }
    .record-plum { fill: #a89ea9; }
    .record-umber { fill: #ab9c8c; }
    .record-teal { fill: #93a7a6; }
    .record-ochre { fill: #b9ac92; }
    .record-amber { fill: #cfa66b; }
    .record-magenta { fill: #b98fa5; }
    .record-cyan { fill: #86abae; }
    .sleeve-ring { stroke: rgba(30, 24, 18, 0.35); }
    .sleeve-label { fill: #5d554b; }

    .dance-floor i::before {
      background:
        linear-gradient(90deg, rgba(60, 54, 46, 0.25) 2px, transparent 2px) 50% 0 / 64px 64px,
        linear-gradient(rgba(60, 54, 46, 0.25) 2px, transparent 2px) 50% 0 / 64px 64px,
        #cfc8bb;
    }

    .speaker i {
      box-shadow: 0 0 0 2px #59616a;
    }

    .light i {
      display: none;
    }

    .light {
      background: #2b3338;
    }

    .cord {
      filter: none;
    }

    .club-title {
      color: #3a3833;
      -webkit-text-stroke-color: #9c958a;
      text-shadow: none;
    }

    .club-caption {
      color: #4b4840;
    }

    .club-eyebrow {
      color: #7a3d06;
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    .speaker {
      display: none;
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    .light {
      display: none;
    }

    .club-intro {
      font-size: 1.08rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .light i {
      animation: none;
    }
  }
`;

/**
 * The booth: the house rack on a deck with a fixed height, so the rack
 * scrolls inside it, as Rackloose expects of its host, and a flight-case lid
 * that closes over it by day.
 */
export const BoothRoot = styled.section`
  ${hudFrame({ blur: false })}
  --hud-notch: ${BOOTH_NOTCH};
  --hud-accent: var(--neon-amber);
  --hud-frame-bg: var(--panel-bg);
  display: grid;
  grid-template-columns: minmax(15rem, 0.34fr) minmax(0, 1fr);
  gap: clamp(1em, 2.4vw, 2em);
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
  padding: ${BOOTH_GUTTER};
  text-align: left;

  .booth-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.9em;
    padding-top: 0.4em;

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

  /* A torn-off ticket stub, perforated at one end. */
  .booth-copy .booth-tag {
    display: inline-block;
    padding: 0.3em 0.95em 0.3em 1.6em;
    background:
      linear-gradient(#7a5a2a 50%, transparent 50%) 0.85em 0 / 1px 6px repeat-y,
      #ffd28a;
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.35);
    color: #2a1d10;
    font-family: ${THEME.fonts.mono};
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    clip-path: polygon(
      0 0, 100% 0, 100% 35%, calc(100% - 5px) 50%, 100% 65%,
      100% 100%, 0 100%, 0 65%, 5px 50%, 0 35%
    );
    transform: rotate(-3deg);
  }

  .booth-link {
    ${hudButton}
    margin-top: 0.3em;
  }

  .booth-deck {
    position: relative;
    height: min(780px, calc(100vh - 160px));
    height: min(780px, calc(100dvh - 160px));
    min-height: 460px;
    overflow: hidden;
    border: 1px solid var(--glass-border);
    background: #0b0f12;
    box-shadow: inset 0 3px 0 rgba(255, 176, 59, 0.45);
  }

  .booth-slot {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .booth-rack {
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

  /*
   * A road case lid: black laminate in an aluminium frame with ball corners.
   * It lifts out of sight after dark and drops back over the rack by day.
   */
  .booth-case {
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
      radial-gradient(circle at 15px 15px, #d7dbdd 0 7px, #7d8486 8px 12px, transparent 13px),
      radial-gradient(circle at calc(100% - 15px) 15px, #d7dbdd 0 7px, #7d8486 8px 12px, transparent 13px),
      radial-gradient(circle at 15px calc(100% - 15px), #d7dbdd 0 7px, #7d8486 8px 12px, transparent 13px),
      radial-gradient(circle at calc(100% - 15px) calc(100% - 15px), #d7dbdd 0 7px, #7d8486 8px 12px, transparent 13px),
      repeating-linear-gradient(45deg, #1c2124 0 2px, #15191c 2px 6px);
    box-shadow: inset 0 0 0 9px #a3a9ab, inset 0 0 0 11px #5e6466;
    text-align: center;
    visibility: hidden;
    transform: translateY(-101%);
    transition: transform 1.1s ${THEME.easing.inOut}, visibility 0s linear 1.1s;

    /* Butterfly latches on either side. */
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: calc(50% - 22px);
      width: 18px;
      height: 44px;
      border-radius: 3px;
      background: linear-gradient(90deg, #8d9496, #d7dbdd 45%, #8d9496);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
    }

    &::before { left: 0; }
    &::after { right: 0; }
  }

  /* A strip of console tape, written on in marker. */
  .case-note {
    margin: 0;
    padding: 0.7em 1.3em;
    background: #f1eee4;
    box-shadow: 0 3px 0 rgba(0, 0, 0, 0.3);
    color: #1c1d1f;
    font-family: ${THEME.fonts.hud};
    font-size: 1.25rem;
    font-weight: 600;
    clip-path: polygon(
      0 4%, 3% 0, 97% 2%, 100% 0, 99% 50%, 100% 100%, 96% 97%, 4% 100%, 0 96%, 1% 50%
    );
    transform: rotate(-1.5deg);
  }

  .booth-button {
    ${neonButton}
  }

  html[data-theme='light'] & {
    .booth-case {
      visibility: visible;
      transform: none;
      transition: transform 0.9s ${THEME.easing.inOut}, visibility 0s;
    }

    .booth-slot,
    .booth-open-note {
      visibility: hidden;
    }

    .booth-open-note {
      display: none;
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    grid-template-columns: minmax(0, 1fr);

    .booth-deck {
      height: min(720px, calc(100vh - 150px));
      height: min(720px, calc(100dvh - 150px));
      min-height: 480px;
    }
  }
`;
