import { Fragment } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

import { NeonSignRoot } from '../../../styles/neon';

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
  /**
   * The letter that never quite settles, as [line, letter]. Letters count
   * from 0 within the line and skip spaces.
   */
  dying?: readonly [number, number];
};

type Letter = { character: string; order: number; isDying: boolean };

/** Splits each line into words of letters, numbered across the whole sign for the power-on stagger. */
const layoutLines = (lines: readonly NeonLine[], dying?: readonly [number, number]): Letter[][][] => {
  let order = 0;

  return lines.map((line, lineIndex) => {
    let letterIndex = 0;

    return line.text.split(' ').map((word) => [...word].map((character) => {
      const letter = {
        character,
        order,
        isDying: dying?.[0] === lineIndex && dying[1] === letterIndex,
      };
      order += 1;
      letterIndex += 1;
      return letter;
    }));
  });
};

/**
 * Neon lettering that powers on letter by letter. The real text stays in the
 * DOM, so a heading keeps its exact accessible name: letters are inline spans
 * and words and lines are separated by real spaces.
 */
const NeonSign = ({ lines, as = 'p', id, className, dying }: Props) => {
  const layout = layoutLines(lines, dying);

  return (
    <NeonSignRoot as={as} id={id} className={className}>
      {lines.map((line, lineIndex) => {
        const words: ReactNode = layout[lineIndex].map((letters, wordIndex) => (
          <Fragment key={wordIndex}>
            {wordIndex > 0 && ' '}
            {letters.map(({ character, order, isDying }) => (
              <span
                key={order}
                className={isDying ? 'letter is-dying' : 'letter'}
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
