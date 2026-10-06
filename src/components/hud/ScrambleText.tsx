import { useEffect, useRef } from 'react';

import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/=';
// How often the unresolved characters reshuffle, in milliseconds.
const CHURN_MS = 45;

type Props = {
  text: string;
  className?: string;
  /** Replays the decode when it changes, even if the text has not. */
  replayKey?: string | number;
  durationMs?: number;
};

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * HUD readout text that decodes itself left to right whenever it changes.
 * Only for decorative, aria-hidden readouts: the DOM text churns while it
 * runs. The first render is the plain text, so the static HTML matches, and
 * reduced motion swaps the text without the effect.
 */
const ScrambleText = ({ text, className, replayKey, durationMs = 520 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef({ text, replayKey });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const previous = shown.current;
    shown.current = { text, replayKey };
    if (!node) {
      return undefined;
    }

    const isChange = previous.text !== text || previous.replayKey !== replayKey;
    if (!isChange || prefersReducedMotion) {
      node.textContent = text;
      return undefined;
    }

    const characters = [...text];
    const start = performance.now();
    let lastChurn = -Infinity;
    let frame = 0;

    const render = (now: number) => {
      const progress = Math.min(Math.max((now - start) / durationMs, 0), 1);
      if (progress >= 1) {
        node.textContent = text;
        return;
      }

      if (now - lastChurn >= CHURN_MS) {
        lastChurn = now;
        const resolved = Math.floor(progress * characters.length);
        node.textContent = characters
          .map((character, index) => (index < resolved || character === ' ' ? character : randomGlyph()))
          .join('');
      }

      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [text, replayKey, durationMs, prefersReducedMotion]);

  return <span ref={ref} className={className}>{text}</span>;
};

export default ScrambleText;
