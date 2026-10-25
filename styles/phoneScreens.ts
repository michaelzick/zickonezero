import styled from 'styled-components';

import {
  DemoStokeScrollImage,
  DemoStokeScrollItem,
  DemoStokeTldrImage,
} from './index';
import { FlowImageButton, FlowImagesRow, MethodImageButton, MethodImages } from './antisyphon';
import { THEME } from './theme';

const BEZEL_COLOR = '#06090f';

/*
 * A phone bezel for a portrait (1284:2778) screenshot. The bezel is a
 * content-box border, so size caps subtract 2 * var(--phone-bezel). Set
 * --phone-bezel and --phone-radius on smaller phones to keep it in proportion.
 */
export const phoneBezel = `
  --phone-bezel: 0.45em;
  --phone-radius: 2.1em;
  box-sizing: content-box;
  aspect-ratio: 1284 / 2778;
  object-fit: contain;
  border: var(--phone-bezel) solid ${BEZEL_COLOR};
  border-radius: var(--phone-radius);
  background: ${BEZEL_COLOR};
  box-shadow: 0 0 0 1px var(--glass-border), 0 30px 48px -30px var(--shadow-deep);
`;

const phoneHoverRing = `
  border-color: ${BEZEL_COLOR};
  box-shadow:
    0 30px 48px -30px var(--shadow-deep),
    0 0 0 1px var(--city-accent),
    0 0 24px -6px var(--city-glow);
`;

/*
 * Case-study phone screens (CaseStudyPage). Landscape captures keep Nice Guy
 * University's frames; these replace them for portrait images, which those
 * frames would crop.
 */

/* The What and The How: one phone centered in its column, capped by height. */
export const PhoneImage = styled(DemoStokeTldrImage)`
  ${phoneBezel}
  width: auto;
  max-width: calc(min(100%, 20rem) - 2 * var(--phone-bezel));
  max-height: calc(min(66vh, 34rem) - 2 * var(--phone-bezel));
  justify-self: center;
  margin-inline: auto;
`;

/* Carousel tiles: the item itself is the bezel. */
export const PhoneScrollItem = styled(DemoStokeScrollItem)`
  min-width: clamp(7.5em, 22vw, 9em);
  max-width: 9em;
  border: 0.3em solid ${BEZEL_COLOR};
  border-radius: 1.4em;
  background: ${BEZEL_COLOR};

  &::after {
    display: none;
  }

  &:hover {
    ${phoneHoverRing}
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    min-width: 9em;
    max-width: 9em;
  }
`;

export const PhoneScrollImage = styled(DemoStokeScrollImage)`
  aspect-ratio: 1284 / 2778;
  border-radius: 1.1em;
`;

/* Methods: up to two phones side by side. */
export const PhoneMethodImages = styled(MethodImages)`
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(0.6em, 2vw, 1.2em);
`;

export const PhoneMethodImageButton = styled(MethodImageButton)`
  flex: 0 1 auto;
  width: auto;
  min-width: 0;
  display: flex;
  justify-content: center;

  &::after {
    display: none;
  }
`;

export const PhoneMethodImage = styled.img`
  ${phoneBezel}
  display: block;
  width: auto;
  height: auto;
  max-width: calc(100% - 2 * var(--phone-bezel));
  max-height: calc(min(62vh, 32rem) - 2 * var(--phone-bezel));
  transition: box-shadow 0.18s ease;

  ${PhoneMethodImageButton}:hover &,
  ${PhoneMethodImageButton}:focus-visible & {
    ${phoneHoverRing}
  }
`;

/* Product Screens: a centered, wrapping row of phones, two across on phones. */
export const PhoneFlowImagesRow = styled(FlowImagesRow)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(0.75em, 2.4vw, 1.6em);

  /* rem, so the gap and the buttons' half width below measure alike and two phones fit a row. */
  @media (max-width: ${THEME.breakpoints.phone}) {
    gap: 0.75rem;
  }
`;

export const PhoneFlowImageButton = styled(FlowImageButton)`
  flex: 0 1 12em;
  min-width: 0;

  &::after {
    display: none;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    flex-basis: calc(50% - 0.5rem);
  }
`;

export const PhoneFlowImage = styled(DemoStokeTldrImage)`
  ${phoneBezel}
  width: calc(100% - 2 * var(--phone-bezel));
  transition: box-shadow 0.18s ease;

  ${PhoneFlowImageButton}:hover &,
  ${PhoneFlowImageButton}:focus-visible & {
    ${phoneHoverRing}
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    --phone-bezel: 0.35em;
    --phone-radius: 1.5em;
  }
`;
