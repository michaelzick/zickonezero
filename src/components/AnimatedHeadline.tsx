import Image from 'next/image';
import {
  AnimatedHeadlineWrapper,
  AnimatedHeadlineStatic,
  AnimatedHeadlineDynamic,
  AnimatedHeadlineTrack,
  AnimatedHeadlinePhrase,
  AnimatedHeadlineSizer
} from '../../styles';

const HEADLINE_PHRASES = [
  'UX Design',
  'UX Engineering',
  'Product Mgmt.',
  'Analytics'
] as const;

const LONGEST_PHRASE = HEADLINE_PHRASES.reduce((longest, phrase) =>
  phrase.length > longest.length ? phrase : longest
  , HEADLINE_PHRASES[0]);

const PHRASE_DURATION_MS = 3000;

type AnimatedHeadlineProps = {
  className?: string;
};

const AnimatedHeadline = ({ className }: AnimatedHeadlineProps) => {
  return (
    <AnimatedHeadlineWrapper
      className={className}
      role="text"
      aria-label="I ****: UX Design, UX Research, Product Leadership, Web Development"
    >
      <AnimatedHeadlineStatic>
        I{' '}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          funk
          <Image
            src="/img/white-scribble.webp"
            alt=""
            width={100}
            height={82}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: 'auto',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
          <Image
            src="/img/white-scribble.webp"
            alt=""
            width={100}
            height={82}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scaleX(-1)',
              width: '120%',
              height: 'auto',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />
        </span>
        with:
      </AnimatedHeadlineStatic>
      <AnimatedHeadlineDynamic aria-hidden="true">
        <AnimatedHeadlineSizer aria-hidden="true">{LONGEST_PHRASE}</AnimatedHeadlineSizer>
        <AnimatedHeadlineTrack>
          {HEADLINE_PHRASES.map((phrase, index) => (
            <AnimatedHeadlinePhrase
              key={`${phrase}-${index}`}
              style={{ animationDelay: `${index * PHRASE_DURATION_MS}ms` }}
            >
              {phrase}
            </AnimatedHeadlinePhrase>
          ))}
        </AnimatedHeadlineTrack>
      </AnimatedHeadlineDynamic>
    </AnimatedHeadlineWrapper>
  );
};

export default AnimatedHeadline;
