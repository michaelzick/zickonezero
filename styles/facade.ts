import { css } from 'styled-components';

/*
 * Colors for a generated facade (src/components/city/AlleyWall.tsx), shared
 * by the hero alley and the billboard tower. Interpolate facadePalette into
 * the styled component that renders the wall: it sets the --facade-* colors,
 * night by default and the sunlit street by day, and styles the wall's
 * classes. Only @media and keyframes belong in styled-components; see
 * styles/city.ts.
 */
export const facadePalette = css`
  --facade-wall-a: #0b1621;
  --facade-wall-b: #0d1a26;
  --facade-trim: rgba(111, 244, 255, 0.07);
  --facade-pane: rgba(150, 210, 230, 0.07);
  --facade-unit: #142230;
  --facade-unit-edge: rgba(150, 210, 230, 0.12);
  --facade-grille: rgba(150, 210, 230, 0.18);
  --facade-shutter: #0e1923;
  --facade-slat: rgba(255, 255, 255, 0.05);
  --facade-pipe: #18242f;

  html[data-theme='light'] & {
    --facade-wall-a: #b4513a;
    --facade-wall-b: #1f6f78;
    --facade-trim: rgba(20, 30, 34, 0.18);
    --facade-pane: rgba(225, 245, 245, 0.55);
    --facade-unit: #d9d2c6;
    --facade-unit-edge: rgba(0, 0, 0, 0.15);
    --facade-grille: rgba(0, 0, 0, 0.3);
    --facade-shutter: #8d8f8c;
    --facade-slat: rgba(0, 0, 0, 0.18);
    --facade-pipe: #5b5f60;
  }

  .tone-magenta {
    --tone: var(--neon-magenta);
  }

  .tone-cyan {
    --tone: var(--neon-cyan);
  }

  .tone-amber {
    --tone: var(--neon-amber);
  }

  .tone-violet {
    --tone: var(--neon-violet);
  }

  .tone-red {
    --tone: var(--neon-red);
  }

  .wall-a {
    fill: var(--facade-wall-a);
  }

  .wall-b {
    fill: var(--facade-wall-b);
  }

  .trim,
  .panes,
  .lit,
  .cool,
  .pipes,
  .grilles,
  .slats {
    fill: none;
  }

  .trim {
    stroke: var(--facade-trim);
    stroke-width: 3;
  }

  .panes {
    stroke: var(--facade-pane);
  }

  .lit {
    stroke: var(--window-lit);
    opacity: calc(0.75 * var(--night-only, 1));
  }

  .cool {
    stroke: var(--window-cool);
    opacity: calc(0.55 * var(--night-only, 1));
  }

  .pipes {
    stroke: var(--facade-pipe);
    stroke-width: 7;
  }

  .units {
    fill: var(--facade-unit);
    stroke: var(--facade-unit-edge);
    stroke-width: 2;
  }

  .grilles {
    stroke: var(--facade-grille);
    stroke-width: 2;
  }

  .shutters {
    fill: var(--facade-shutter);
  }

  .slats {
    stroke: var(--facade-slat);
    stroke-width: 2;
  }

  .shop {
    fill: var(--tone);
    stroke: #05080d;
    stroke-width: 10;
    opacity: calc(0.25 + 0.3 * var(--night-only, 1));
  }

  .signs {
    filter: drop-shadow(0 0 calc(10px * var(--neon-glow-strength, 1)) rgba(255, 43, 214, 0.35));
  }

  .sign-box {
    fill: rgba(5, 8, 14, 0.85);
    stroke: var(--tone);
    stroke-width: 4;
  }

  .sign-glyphs {
    fill: var(--tone);
  }
`;
