import styled, { keyframes } from 'styled-components';

import { facadePalette } from './facade';
import { THEME } from './theme';

/*
 * The homepage billboard (src/components/home/HoloBillboard.tsx): a
 * full-width strip of screenshots that pans across a tower as the page
 * scrolls. The stage is tall and the frame inside it sticks for the length
 * of the pan. The component moves the track itself and writes --bp (0 to 1,
 * how far through the stage) on the stage. Each panel keeps its image's own
 * shape (--ar) at a shared height, so nothing is cropped, and the images
 * carry no overlays or filters: they are the focal point. The panels stay
 * flat: any 3D rotation resamples their layer and blurs the screenshots on
 * high-density screens, so depth comes from the tower drifting behind them.
 * Only @media and keyframes here; see styles/city.ts.
 */

// The strip opens from a bright line, like an old tube warming up.
const powerOn = keyframes`
  0% { clip-path: inset(49.5% 0 49.5% 0); filter: brightness(2.6); }
  40% { clip-path: inset(49.5% 0 49.5% 0); filter: brightness(2.6); }
  75% { clip-path: inset(0 0 0 0); filter: brightness(1.5); }
  100% { clip-path: inset(0 0 0 0); filter: brightness(1); }
`;

export const BillboardStage = styled.section`
  --bp: 0;
  /* Every panel's height; a 16:9 panel is 64vw (at most 1024px) wide. */
  --bb-slide-h: min(36vw, 576px, calc(100vh - 280px));
  /* Room above and below the panels for their shadows, inside the clip. */
  --bb-pad: 48px;
  --bb-gap: clamp(1.1rem, 2.8vw, 2rem);
  --bb-inset: clamp(1.25rem, 3.8vw, 3rem);
  /* Past the last panel: clear of the minimap HUD (216px, see styles/homeHud.ts). */
  --bb-end: calc(216px + clamp(12px, 1.6vw, 24px) + var(--bb-inset));
  --bb-shift: 40px;
  /* How far the tower drifts across the pan. */
  --bb-drift: 8vw;
  --bb-panel-bg: #02050a;
  /* A dark wash over the tower, so the screenshots stand out against it. */
  --bb-shade-rgb: 2, 4, 9;
  --bb-shade: 0.66;
  position: relative;
  height: 320vh;
  color: var(--color-white);
  ${facadePalette}

  html[data-theme='light'] & {
    --bb-panel-bg: #0b1418;
    --bb-shade-rgb: 14, 18, 22;
    --bb-shade: 0.56;
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
    left: 0;
    right: 0;
    z-index: 2;
    padding: var(--bb-pad) 0;
    overflow: hidden;
    transform: translate3d(0, -50%, 0);
  }

  &[data-standby] .bb-screen > * {
    visibility: hidden;
  }

  &[data-powered] .bb-screen {
    animation: ${powerOn} 0.9s ${THEME.easing.out} backwards;
  }

  .bb-track {
    display: flex;
    align-items: center;
    gap: var(--bb-gap);
    width: max-content;
    height: var(--bb-slide-h);
    padding: 0 var(--bb-end) 0 var(--bb-inset);
    will-change: transform;
  }

  .bb-slide {
    flex: 0 0 auto;
    height: 100%;
    aspect-ratio: var(--ar, 16 / 9);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: ${THEME.radii.md};
    background: var(--bb-panel-bg);
    box-shadow:
      0 0 calc(28px * var(--neon-glow-strength, 1)) rgba(47, 243, 255, 0.16),
      0 34px 48px -30px rgba(0, 0, 0, 0.82);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
  }

  /* A thin rail under the strip, filling as the pan runs. */
  .bb-progress {
    position: absolute;
    left: 50%;
    bottom: calc(var(--bb-pad) / 2 - 1px);
    width: clamp(120px, 22vw, 280px);
    height: 2px;
    background: rgba(255, 255, 255, 0.14);
    transform: translate3d(-50%, 0, 0);
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta));
      transform: scaleX(var(--bp));
      transform-origin: 0 50%;
    }
  }

  /* The tower behind the panels, drifting left as the pan runs. */
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

    /* Shade over the facade, darkest at the edges, so the panels read first. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 60% 50% at 50% 52%, transparent 40%, rgba(var(--bb-shade-rgb), 0.6)),
        linear-gradient(to bottom, rgba(var(--bb-shade-rgb), 0.4), transparent 40%),
        rgba(var(--bb-shade-rgb), var(--bb-shade));
    }
  }

  /* The light the strip throws on the tower. */
  .bb-spill {
    position: absolute;
    z-index: 0;
    left: 50%;
    top: calc(50% + var(--bb-shift));
    width: 120vw;
    height: calc(var(--bb-slide-h) * 2.2);
    transform: translate3d(-50%, -50%, 0);
    background: radial-gradient(
      closest-side,
      rgba(47, 243, 255, calc(0.2 * var(--neon-glow-strength, 1))),
      rgba(255, 43, 214, calc(0.08 * var(--neon-glow-strength, 1))) 55%,
      transparent
    );
    pointer-events: none;
  }

  .bb-plate {
    position: absolute;
    z-index: 3;
    left: 50%;
    top: calc(50% + var(--bb-shift) - var(--bb-slide-h) / 2 - 18px);
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
    }
  }

  /* Wet pavement under the tower, catching the strip's light. */
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
    /* A 16:9 panel is 78vw wide. */
    --bb-slide-h: min(43.875vw, calc(100vh - 260px));
  }

  /* The HUD is a bottom bar here, below the strip. */
  @media (max-width: ${THEME.breakpoints.smallTablet}), (max-height: 560px) {
    --bb-end: calc(var(--bb-inset) * 2.5);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    /* A 16:9 panel is 84vw wide. */
    --bb-slide-h: min(47.25vw, calc(100vh - 240px));
    --bb-pad: 32px;
    --bb-drift: 14vw;
    height: 240vh;

    .bb-plate {
      gap: 10px;
      padding: 5px 12px;
      font-size: 11px;
      letter-spacing: 0.24em;
    }
  }

  /* Reduced motion: no pan; the strip becomes a still wall of panels. */
  @media (prefers-reduced-motion: reduce) {
    --bb-slide-h: min(20vw, 288px);
    height: auto;

    .bb-frame {
      position: relative;
      height: auto;
      padding: clamp(96px, 16vh, 150px) 0 clamp(48px, 10vh, 96px);
    }

    .bb-screen {
      position: relative;
      top: auto;
      transform: none;
    }

    .bb-track {
      flex-wrap: wrap;
      justify-content: center;
      width: auto;
      height: auto;
      padding: 0 var(--bb-inset);
      transform: none;
    }

    .bb-slide {
      height: var(--bb-slide-h);
    }

    .bb-rig {
      transform: none;
    }

    .bb-spill {
      top: 50%;
    }

    /* Above the panels, which now start below the frame's top padding. */
    .bb-plate {
      top: calc(clamp(96px, 16vh, 150px) + var(--bb-pad) - 18px);
    }

    .bb-progress {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) and (max-width: ${THEME.breakpoints.phone}) {
    --bb-slide-h: 47.25vw;
  }
`;
