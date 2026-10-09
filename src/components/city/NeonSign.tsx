import { Fragment, useState } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

import { NeonSignRoot } from '../../../styles/neon';
import { isFirstCityLoad } from '../../lib/city/powerOn';

export type NeonLine = {
  text: string;
  /**
   * tube: glowing glass letters. caption: a small line between two neon
   * rules. led: a huge striped-LED fill.
   */
  variant: 'tube' | 'caption' | 'led';
};

type Props = {
  lines: readonly NeonLine[];
  /** The element to render, such as 'h1' for a page title. */
  as?: ElementType;
  id?: string;
  className?: string;
};

type Letter = { character: string; order: number };

/** Splits each line into words of letters, numbered across the whole sign for the power-on stagger. */
const layoutLines = (lines: readonly NeonLine[]): Letter[][][] => {
  let order = 0;

  return lines.map((line) => line.text.split(' ').map((word) => [...word].map((character) => {
    const letter = { character, order };
    order += 1;
    return letter;
  })));
};

/**
 * Neon lettering that powers on letter by letter on the first page load; on
 * later pages it is already lit (see src/lib/city/powerOn.ts). The real text
 * stays in the DOM, so a heading keeps its exact accessible name: letters are
 * inline spans and words and lines are separated by real spaces.
 */
const NeonSign = ({ lines, as = 'p', id, className }: Props) => {
  const layout = layoutLines(lines);
  const [isLit] = useState(() => !isFirstCityLoad());

  return (
    <NeonSignRoot as={as} id={id} className={className} data-lit={isLit ? '' : undefined}>
      {lines.map((line, lineIndex) => {
        const words: ReactNode = layout[lineIndex].map((letters, wordIndex) => (
          <Fragment key={wordIndex}>
            {wordIndex > 0 && ' '}
            {letters.map(({ character, order }) => (
              <span
                key={order}
                className='letter'
                style={{ '--i': order } as CSSProperties}
              >
                {character}
              </span>
            ))}
          </Fragment>
        ));

        return (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && ' '}
            <span className={`sign-line sign-${line.variant}`}>
              {line.variant === 'led' && (
                <span className='led-glow'>
                  <span className='led-word'>{words}</span>
                </span>
              )}
              {/* A flex line blockifies its children, so the letters get one inline wrapper. */}
              {line.variant === 'caption' && <span>{words}</span>}
              {line.variant === 'tube' && words}
            </span>
          </Fragment>
        );
      })}
    </NeonSignRoot>
  );
};

export default NeonSign;
