import styled, { css, keyframes } from 'styled-components';

import { THEME } from './theme';

/*
 * HUD primitives shared by the navigation, the homepage HUD, and the inner
 * pages. Jest's CSS parser drops a whole stylesheet when it meets @supports,
 * @container, @layer, or @property, so these styles use only @media and
 * keyframes (see styles/globals.scss for the registered properties).
 *
 * Notched shapes clip a pseudo-element, never the element itself, so focus
 * outlines, drop-shadow glows, and children near the edges stay visible.
 */

/** Clip-path polygon for the notched HUD corners (top right and bottom left). */
export const notchPolygon = (size: string) => `polygon(
  0 0,
  calc(100% - ${size}) 0,
  100% ${size},
  100% 100%,
  ${size} 100%,
  0 calc(100% - ${size})
)`;

export const hudNotch = (size = '10px') => css`
  clip-path: ${notchPolygon(size)};
`;

/**
 * Background layers that stroke both notch diagonals. A 45-degree gradient's
 * bands run parallel to the notch edge, which sits size × cos(45°) from the
 * corner, so a hard stop just past that distance draws a 1px edge.
 */
export const notchStrokes = (size: string, color: string) => `
  linear-gradient(225deg, ${color} 0 calc(${size} * 0.7071 + 1px), transparent calc(${size} * 0.7071 + 2px)),
  linear-gradient(45deg, ${color} 0 calc(${size} * 0.7071 + 1px), transparent calc(${size} * 0.7071 + 2px))
`;

export const scanSweep = keyframes`
  from { background-position: 160% 0; }
  to { background-position: -60% 0; }
`;

/** Background layers for accent corner brackets, top left and bottom right. */
export const cornerBrackets = (size: string, color = 'var(--hud-accent, var(--city-accent))') => `
  linear-gradient(${color}, ${color}) left top / ${size} 2px no-repeat,
  linear-gradient(${color}, ${color}) left top / 2px ${size} no-repeat,
  linear-gradient(${color}, ${color}) right bottom / ${size} 2px no-repeat,
  linear-gradient(${color}, ${color}) right bottom / 2px ${size} no-repeat
`;

/** A background layer of faint horizontal scanlines. */
export const scanlines = 'repeating-linear-gradient(0deg, var(--scanline) 0 1px, transparent 1px 3px)';

/**
 * Turns a screenshot's wrapper into a HUD screen: corner brackets and
 * scanlines on ::after that brighten on hover and keyboard focus. The
 * wrapper needs position: relative and must hug the image.
 */
export const screenOverlay = css`
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${cornerBrackets('16px', 'var(--city-accent)')}, ${scanlines};
    opacity: 0.65;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
  }
`;

/** Square, icon-only HUD control with a 44px touch target. */
export const HudIconButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: var(--color-white);
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
`;

type HudFrameOptions = {
  /**
   * Frosted glass on wider screens. Long panels leave it off: blurring a
   * large area over the animated city costs a repaint every frame.
   */
  blur?: boolean;
};

/**
 * Glass panel with notched corners, accent strokes along the notches, and
 * corner brackets. Set --hud-accent to recolor it (defaults to the city
 * accent), --hud-notch to resize the notches, and --hud-frame-bg to change
 * the glass. The panel paints on pseudo-elements, so it never clips its
 * content or the focus rings inside it.
 */
export const hudFrame = ({ blur = true }: HudFrameOptions = {}) => css`
  --hud-notch: 14px;
  position: relative;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border: 1px solid var(--glass-border);
    background:
      ${notchStrokes('var(--hud-notch)', 'var(--hud-accent, var(--city-accent))')},
      linear-gradient(160deg, var(--glass-highlight), transparent 42%),
      var(--hud-frame-bg, var(--glass-bg));
    background-origin: border-box;
    background-repeat: no-repeat;
    clip-path: ${notchPolygon('var(--hud-notch)')};
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${cornerBrackets('18px')};
    pointer-events: none;
  }

  ${blur && css`
    /* Phones get translucent glass; blur is costly on low-end GPUs. */
    @media (min-width: 601px) {
      &::before {
        -webkit-backdrop-filter: blur(12px) saturate(140%);
        backdrop-filter: blur(12px) saturate(140%);
      }
    }
  `}
`;

export const HudFrame = styled.div`
  ${hudFrame()}
`;

/**
 * The panel behind long-form inner-page content: unblurred, more opaque
 * glass so body copy stays readable over the city.
 */
export const storyPanel = css`
  ${hudFrame({ blur: false })}
  --hud-notch: 18px;
  --hud-frame-bg: var(--panel-bg);
  padding: clamp(1em, 2.4vw, 1.75em) clamp(0.85em, 2.4vw, 1.75em);
`;

/** Thin accent scrollbars for galleries and scrolling dialog copy. */
export const hudScrollbar = css`
  scrollbar-width: thin;
  scrollbar-color: var(--city-accent) transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--city-accent);
    border-radius: 0;
  }

  &::-webkit-scrollbar-track {
    background: var(--glass-border);
  }
`;

/** A small mono "//" readout prefix, left out of the accessible name. */
export const hudSlashes = css`
  content: '//';
  content: '//' / '';
  font-family: ${THEME.fonts.mono};
  font-weight: 400;
  letter-spacing: 0;
  color: var(--hud-accent, var(--city-accent));
`;

/** Small HUD subheadings: condensed uppercase type after an accent diamond. */
export const hudSubheading = css`
  margin: 0;
  font-family: ${THEME.fonts.hud};
  font-size: clamp(1.1em, 2vw, 1.35em);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;

  &::before {
    content: '';
    display: inline-block;
    width: 0.42em;
    height: 0.42em;
    margin-right: 0.55em;
    vertical-align: 0.12em;
    background: var(--hud-accent, var(--city-accent));
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  }
`;

const buttonBase = css`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  min-height: 48px;
  padding: 0 1.7em;
  margin: 0;
  border: 0;
  background: transparent;
  font-family: ${THEME.fonts.hud};
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.2s ${THEME.easing.out}, filter 0.25s ease, color 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 3px;
  }
`;

/** Primary call to action: a notched hot-yellow plate with a scan sweep. */
export const neonButton = css`
  ${buttonBase}
  color: #0b0e05;

  &::before {
    background:
      linear-gradient(100deg, transparent 42%, rgba(255, 255, 255, 0.75) 50%, transparent 58%) no-repeat,
      var(--hud-yellow);
    background-size: 250% 100%;
    background-position: 160% 0;
    clip-path: ${notchPolygon('12px')};
  }

  &:hover,
  &:focus-visible {
    color: #0b0e05;
    filter: drop-shadow(0 0 calc(14px * var(--neon-glow-strength, 1)) rgba(243, 230, 0, 0.55));
  }

  &:hover::before,
  &:focus-visible::before {
    animation: ${scanSweep} 0.75s ${THEME.easing.out};
  }
`;

/** Secondary action: a notched glass outline in the accent color. */
export const hudButton = css`
  ${buttonBase}
  color: var(--color-white);

  &::before {
    border: 1px solid var(--hud-accent, var(--city-accent));
    background:
      ${notchStrokes('10px', 'var(--hud-accent, var(--city-accent))')},
      rgba(var(--color-dark-rgb), 0.45);
    clip-path: ${notchPolygon('10px')};
  }

  &:hover,
  &:focus-visible {
    color: var(--hud-accent, var(--city-accent));
    filter: drop-shadow(0 0 calc(12px * var(--neon-glow-strength, 1)) var(--hud-accent, var(--city-accent)));
  }
`;

export const NeonButton = styled.a`
  ${neonButton}
`;

export const HudButton = styled.a`
  ${hudButton}
`;

/** The notched track shared by the nav's toggles. */
const toggleTrack = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 28px;
  border: 1px solid var(--glass-border);
  background: rgba(var(--color-dark-rgb), 0.55);
  ${hudNotch('7px')}
  transition: border-color 0.3s ease, background-color 0.3s ease;
`;

type TimeToggleProps = { $isNight: boolean };

export const TimeToggleButton = styled(HudIconButton)`
  .track {
    ${toggleTrack}
    justify-content: space-between;
    width: 60px;
    padding: 0 7px;
  }

  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 26px;
    height: 20px;
    background: ${(props: TimeToggleProps) => (props.$isNight ? THEME.neon.cyan : THEME.neon.yellow)};
    ${hudNotch('5px')}
    transform: translateX(${(props: TimeToggleProps) => (props.$isNight ? '0' : '28px')});
    box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.55);
    transition: transform 0.5s ${THEME.easing.out}, background-color 0.5s ease;
  }

  svg {
    position: relative;
    z-index: 1;
    width: 14px;
    height: 14px;
    transition: color 0.4s ease, opacity 0.4s ease;
  }

  .icon-night {
    color: ${(props: TimeToggleProps) => (props.$isNight ? THEME.colors.contrast : 'var(--color-grey)')};
  }

  .icon-day {
    color: ${(props: TimeToggleProps) => (props.$isNight ? 'var(--color-grey)' : '#182329')};
  }

  &:hover .track {
    border-color: ${THEME.neon.cyan};
  }
`;

const meterBounce = keyframes`
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
`;

/**
 * Speaker with a level meter. aria-pressed lights it; the bars only dance
 * while the city is audible (data-playing), so a remembered "on" that is
 * still waiting for a first click reads as lit but still.
 */
export const SoundToggleButton = styled(HudIconButton)`
  color: var(--color-grey);

  .track {
    ${toggleTrack}
    justify-content: center;
    gap: 2px;
    width: 42px;
    padding: 6px 0;
    align-items: flex-end;
  }

  .speaker {
    align-self: center;
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }

  .bar {
    width: 3px;
    height: 100%;
    background: currentColor;
    opacity: 0.7;
    transform: scaleY(0.2);
    transform-origin: 50% 100%;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  &[aria-pressed='true'] {
    color: ${THEME.neon.cyan};
  }

  /* Resting "on" levels, also what reduced motion shows. */
  &[aria-pressed='true'] .bar {
    opacity: 1;
    transform: scaleY(0.55);
  }

  &[aria-pressed='true'] .bar:nth-of-type(2) {
    transform: scaleY(0.9);
  }

  &[aria-pressed='true'] .bar:nth-of-type(3) {
    transform: scaleY(0.4);
  }

  &[data-playing='true'] .bar {
    animation: ${meterBounce} 0.9s ease-in-out infinite;
  }

  &[data-playing='true'] .bar:nth-of-type(2) {
    animation-duration: 0.7s;
    animation-delay: -0.3s;
  }

  &[data-playing='true'] .bar:nth-of-type(3) {
    animation-duration: 1.1s;
    animation-delay: -0.5s;
  }

  &:hover .track {
    border-color: ${THEME.neon.cyan};
  }
`;
