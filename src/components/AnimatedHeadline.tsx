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
  'AI-Assisted Prototyping',
  'React Development',
  'Product Leadership'
] as const;

const LONGEST_PHRASE = HEADLINE_PHRASES.reduce((longest, phrase) =>
  phrase.length > longest.length ? phrase : longest
, HEADLINE_PHRASES[0]);

const PHRASE_DURATION_MS = 4000;

const AnimatedHeadline = () => {
  return (
    <AnimatedHeadlineWrapper
      role="text"
      aria-label="Roles & Abilities: UX Design, AI-Assisted Prototyping, React Development, Product Leadership"
    >
      <AnimatedHeadlineStatic>Roles & Abilities:</AnimatedHeadlineStatic>
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
