import styled, { keyframes } from 'styled-components';

import { facadePalette } from './facade';
import { THEME } from './theme';

/*
 * The homepage billboard (src/components/home/HoloBillboard.tsx): a giant
 * screen on a tower that pans through screenshots as the page scrolls. The
 * stage is tall and the frame inside it sticks for the length of the pan.
 * The component moves the track itself and writes --bp (0 to 1, how far
 * through the stage) and --slide (the slide nearest the middle, from 1) on
 * the stage. The screen stays flat: any 3D rotation resamples its layer and
 * blurs the screenshots on high-density screens, so depth comes from the
 * tower drifting behind it. Only @media and keyframes here; see
 * styles/city.ts.
 */

const refreshSweep = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, 760%, 0); }
`;

// Two shallow dips in an eight-second loop.
const screenFlicker = keyframes`
  0%, 47%, 50%, 53%, 100% { opacity: 1; }
  48% { opacity: 0.84; }
  51% { opacity: 0.9; }
`;

// The screen opens from a bright line, like an old tube warming up.
const powerOn = keyframes`
  0% { clip-path: inset(49.5% 0 49.5% 0); filter: brightness(2.6); }
  40% { clip-path: inset(49.5% 0 49.5% 0); filter: brightness(2.6); }
  75% { clip-path: inset(0 0 0 0); filter: brightness(1.5); }
  100% { clip-path: inset(0 0 0 0); filter: brightness(1); }
`;

const beaconBlink = keyframes`
  0%, 55%, 100% { opacity: 1; }
  65%, 90% { opacity: 0.25; }
`;

export const BillboardStage = styled.section`
  --bp: 0;
  --slide: 1;
  --bb-w: min(1120px, 80vw, calc((100vh - 230px) * 2));
  --bb-h: calc(var(--bb-w) / 2);
  --bb-bezel: 10px;
  --bb-shift: 40px;
  --bb-slide-w: calc((var(--bb-h) - var(--bb-bezel) * 2) * 1.6);
  /* How far the tower drifts across the pan. */
  --bb-drift: 8vw;
  --bb-bezel-color: #05080d;
  --bb-screen-bg: #02050a;
  position: relative;
  height: 320vh;
  color: var(--color-white);
  ${facadePalette}

  html[data-theme='light'] & {
    --bb-bezel-color: #263034;
    --bb-screen-bg: #0b1418;
  }

  .bb-frame {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;

    /* Fog where the alley's street meets the plaza. */
    &::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      z-index: 1;
      height: 22vh;
      background: linear-gradient(to bottom, var(--street), transparent);
      pointer-events: none;
    }
  }

  /* The screen: the scroller's viewport, so it must stay the frame's first child. */
  .bb-screen {
    position: absolute;
    top: calc(50% + var(--bb-shift));
    left: 50%;
    z-index: 2;
    width: var(--bb-w);
    height: var(--bb-h);
    overflow: hidden;
    border: var(--bb-bezel) solid var(--bb-bezel-color);
    background: var(--bb-screen-bg);
    box-shadow:
      0 0 0 1px rgba(47, 243, 255, 0.55),
      0 0 calc(46px * var(--neon-glow-strength, 1)) rgba(47, 243, 255, 0.3),
      0 40px 90px -30px rgba(0, 0, 0, 0.9);
    transform: translate3d(-50%, -50%, 0);
    animation: ${screenFlicker} 8s linear 2s infinite;
  }

  &[data-standby] .bb-screen > * {
    visibility: hidden;
  }

  &[data-powered] .bb-screen {
    animation:
      ${powerOn} 0.9s ${THEME.easing.out} backwards,
      ${screenFlicker} 8s linear 2s infinite;
  }

  .bb-track {
    display: flex;
    width: max-content;
    height: 100%;
    will-change: transform;
  }

  .bb-slide {
    position: relative;
    flex: 0 0 auto;
    width: var(--bb-slide-w);
    height: 100%;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top left;
      filter: saturate(1.08) contrast(1.04);
    }

    /* Chromatic fringes along the panel edges. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      box-shadow:
        inset 3px 0 0 rgba(47, 243, 255, 0.45),
        inset -3px 0 0 rgba(255, 43, 214, 0.45);
      pointer-events: none;
    }
  }

  .bb-slide + .bb-slide {
    border-left: 3px solid #000;
  }

  .bb-scan,
  .bb-bug,
  .bb-channel,
  .bb-progress {
    position: absolute;
    pointer-events: none;
  }

  .bb-scan {
    inset: 0;
    overflow: hidden;
    background:
      repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.22) 0 1px, transparent 1px 3px),
      linear-gradient(170deg, rgba(47, 243, 255, 0.12), transparent 38%, transparent 70%, rgba(255, 43, 214, 0.1));

    &::after {
      content: '';
      position: absolute;
      top: -16%;
      left: 0;
      right: 0;
      height: 16%;
      background: linear-gradient(to bottom, transparent, rgba(160, 250, 255, 0.12), transparent);
      animation: ${refreshSweep} 6s linear infinite;
    }
  }

  .bb-bug,
  .bb-channel {
    top: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    background: rgba(2, 5, 10, 0.86);
    color: #dffbff;
    font-family: ${THEME.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .bb-bug {
    left: 12px;

    i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ff3a5c;
      box-shadow: 0 0 8px #ff3a5c;
      animation: ${beaconBlink} 1.6s steps(1) infinite;
    }
  }

  .bb-channel {
    right: 12px;

    &::after {
      counter-reset: slide var(--slide) total var(--slide-count, 6);
      content: 'CH ' counter(slide, decimal-leading-zero) ' / ' counter(total, decimal-leading-zero);
    }
  }

  .bb-progress {
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
    transform: scaleX(var(--bp));
    transform-origin: 0 50%;
  }

  /* The tower behind the screen, drifting left as the pan runs. */
  .bb-rig {
    position: absolute;
    inset: -6vh calc(var(--bb-drift) / -2 - 2vw);
    z-index: 0;
    transform: translate3d(calc((0.5 - var(--bp)) * var(--bb-drift)), 0, 0);
    pointer-events: none;
  }

  .bb-tower {
    position: absolute;
    inset: 0;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* Haze over the facade so the screen reads first. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 60% 50% at 50% 52%, transparent 40%, rgba(var(--color-dark-rgb), 0.55)),
        linear-gradient(to bottom, rgba(var(--color-dark-rgb), 0.35), transparent 40%);
    }
  }

  /* The light the screen throws on the tower. */
  .bb-spill {
    position: absolute;
    z-index: 0;
    left: 50%;
    top: calc(50% + var(--bb-shift));
    width: calc(var(--bb-w) * 1.7);
    height: calc(var(--bb-h) * 2.1);
    transform: translate3d(-50%, -50%, 0);
    background: radial-gradient(
      closest-side,
      rgba(47, 243, 255, calc(0.26 * var(--neon-glow-strength, 1))),
      rgba(255, 43, 214, calc(0.12 * var(--neon-glow-strength, 1))) 55%,
      transparent
    );
    pointer-events: none;
  }

  .bb-plate {
    position: absolute;
    z-index: 3;
    left: 50%;
    top: calc(50% + var(--bb-shift) - var(--bb-h) / 2 - 18px);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 6px 18px;
    border: 1px solid rgba(255, 43, 214, 0.6);
    background: rgba(5, 8, 14, 0.88);
    color: #ffe6fb;
    font-family: ${THEME.fonts.hud};
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    white-space: nowrap;
    text-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) var(--neon-magenta);
    transform: translate3d(-50%, -100%, 0);

    b {
      color: var(--hud-yellow);
      font-weight: 700;
      text-shadow: none;
    }

    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff3a5c;
      box-shadow: 0 0 10px #ff3a5c;
      animation: ${beaconBlink} 2.4s steps(1) infinite;
    }
  }

  /* Wet pavement under the tower, catching the screen's light. */
  .bb-street {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    height: 16vh;
    background:
      radial-gradient(ellipse 34% 60% at 50% 0%, rgba(47, 243, 255, calc(0.18 * var(--night-only, 1))), transparent 70%),
      linear-gradient(to bottom, transparent, var(--street) 70%);
    pointer-events: none;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    --bb-w: min(900px, 90vw, calc((100vh - 230px) * 1.9));
    --bb-h: calc(var(--bb-w) / 1.9);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    --bb-w: 92vw;
    --bb-h: calc(var(--bb-w) * 0.66);
    --bb-bezel: 6px;
    --bb-slide-w: calc((var(--bb-w) - var(--bb-bezel) * 2) * 0.86);
    --bb-drift: 14vw;
    height: 240vh;

    .bb-bug,
    .bb-channel {
      top: 8px;
      padding: 2px 6px;
      font-size: 9px;
    }

    .bb-bug {
      left: 8px;
    }

    .bb-channel {
      right: 8px;
    }

    .bb-plate {
      gap: 10px;
      padding: 5px 12px;
      font-size: 11px;
      letter-spacing: 0.24em;
    }
  }

  /* Reduced motion: no pan; the screen becomes a still wall of panels. */
  @media (prefers-reduced-motion: reduce) {
    height: auto;

    .bb-frame {
      position: relative;
      height: auto;
      padding: clamp(96px, 16vh, 150px) 0 clamp(48px, 10vh, 96px);
    }

    .bb-screen {
      position: relative;
      top: auto;
      left: auto;
      width: var(--bb-w);
      height: auto;
      margin: 0 auto;
      transform: none;
    }

    .bb-track {
      flex-wrap: wrap;
      width: auto;
      height: auto;
      transform: none;
    }

    .bb-slide {
      width: 50%;
      height: auto;
      aspect-ratio: 16 / 10;
      border-left: 0;
    }

    .bb-rig {
      transform: none;
    }

    .bb-spill {
      top: 50%;
    }

    /* Above the screen, which now starts at the frame's top padding. */
    .bb-plate {
      top: calc(clamp(96px, 16vh, 150px) - 18px);
    }

    .bb-progress {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) and (max-width: ${THEME.breakpoints.phone}) {
    .bb-slide {
      width: 100%;
    }
  }
`;
