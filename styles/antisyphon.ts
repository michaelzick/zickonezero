import styled from 'styled-components';

import {
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeTldrImage
} from './index';
import { THEME } from './theme';

export const FlowMethodList = styled(DemoStokeMethodList)`
  gap: 2.5em;
`;

export const FlowSection = styled(DemoStokeMethodCard)`
  display: flex;
  flex-direction: column;
  gap: clamp(0.85em, 2vw, 1.3em);
`;

export const FlowText = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.35em;
`;

export const FlowImageButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: ${THEME.radii.md};

  &:focus-visible {
    outline: 2px solid ${THEME.colors.demostoke};
    outline-offset: 4px;
  }
`;

export const FlowImage = styled(DemoStokeTldrImage)`
  width: 100%;
  height: auto;
  aspect-ratio: 656 / 365;
  object-fit: cover;
  max-width: 100%;
  border-radius: ${THEME.radii.md};
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  ${FlowImageButton}:hover &,
  ${FlowImageButton}:focus-visible & {
    border-color: ${THEME.colors.hotRed};
    box-shadow: 0 24px 48px -32px rgb(0 0 0 / 70%), 0 0 0 1px ${THEME.colors.hotRed};
  }
`;

export const FlowImagesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(0.75em, 1.8vw, 1.2em);
`;

export const FlowStorySection = styled.section`
  width: 100%;
`;
