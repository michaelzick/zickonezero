import styled from 'styled-components';

import { THEME } from './theme';

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: clamp(1.6em, 4vw, 3.2em);
  align-items: start;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
  }
`;

export const ContactIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9em;
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: 1.7;

  p {
    margin: 0;
    opacity: 0.9;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
    color: ${THEME.colors.white};
    font-weight: 600;
    text-decoration: none;
    border-bottom: 2px solid ${THEME.colors.white};
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: ${THEME.colors.orange};
      border-color: ${THEME.colors.orange};
    }

    svg {
      width: 0.85em;
      height: 0.85em;
      flex-shrink: 0;
    }
  }
`;

export const ContactProfileLinks = styled.ul`
  list-style: none;
  margin: 0.2em 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;

  li {
    margin: 0;
  }
`;

export const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1em;
  padding: clamp(1.1em, 2.6vw, 1.8em);
  border: 1px solid rgba(199, 197, 197, 0.3);
  border-radius: ${THEME.radii.md};
  background: ${THEME.colors.surface};
  box-shadow: 0 24px 38px -30px rgb(0 0 0 / 55%);
  font-family: Roboto, sans-serif;
`;

export const ContactField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35em;

  label {
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    font-size: 0.72em;
    color: ${THEME.colors.mutedLabel};
  }

  input,
  textarea {
    width: 100%;
    padding: 0.7em 0.85em;
    font: inherit;
    font-size: 0.95em;
    line-height: 1.5;
    color: ${THEME.colors.white};
    background: ${THEME.colors.dark};
    border: 1px solid rgba(199, 197, 197, 0.4);
    border-radius: ${THEME.radii.md};
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder {
      color: ${THEME.colors.grey};
      opacity: 0.7;
    }

    &:focus {
      outline: none;
      border-color: ${THEME.colors.orange};
      box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.25);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  textarea {
    min-height: 9em;
    resize: vertical;
  }
`;

// Honeypot: kept in the DOM for bots but removed from the visual and
// accessibility tree for people.
export const ContactHoneypot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

export const ContactActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1em;
  margin-top: 0.3em;
`;

export const ContactSubmit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7em 1.6em;
  border-radius: ${THEME.radii.md};
  border: 2px solid ${THEME.colors.hotYellow};
  background-color: ${THEME.colors.hotYellow};
  color: ${THEME.colors.contrast};
  font-family: Roboto, sans-serif;
  font-size: 1em;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${THEME.colors.accent};
    border-color: ${THEME.colors.accent};
    color: #fff;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotYellow};
    outline-offset: 4px;
  }

  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;

type ContactStatusProps = { $tone: 'error' | 'success' };

export const ContactStatus = styled.p<ContactStatusProps>`
  margin: 0;
  padding: 0.75em 0.9em;
  border-radius: ${THEME.radii.md};
  font-size: 0.92em;
  line-height: 1.5;
  border: 1px solid ${(props: ContactStatusProps) => (props.$tone === 'error' ? THEME.colors.hotRed : THEME.colors.hotYellow)};
  color: ${THEME.colors.white};
  background: ${(props: ContactStatusProps) => (props.$tone === 'error' ? 'rgba(254, 0, 101, 0.12)' : 'rgba(211, 255, 0, 0.1)')};
`;

export const ContactSuccess = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: clamp(1.1em, 2.6vw, 1.8em);
  border: 1px solid ${THEME.colors.hotYellow};
  border-radius: ${THEME.radii.md};
  background: rgba(211, 255, 0, 0.08);
  font-family: Roboto, sans-serif;

  h2 {
    margin: 0;
    font-size: 1.3em;
    color: ${THEME.colors.hotYellow};
  }

  p {
    margin: 0;
    line-height: 1.6;
    opacity: 0.9;
  }
`;
