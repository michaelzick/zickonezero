import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import { PitchDeckLink } from '../../../../styles';
import { AntisyphonHeroImageWrap } from '../../../../styles/antisyphon';
import { trackEvent, trackLinkClick } from '../../../lib/analytics';
import {
  HeroMediaFrame,
  CompactIntroHeaderRow,
  CompactSectionNavRevealAnchor,
  ShowcaseMediaButton
} from '../../../../styles/projectShowcases';

type IntroSectionProps = {
  openFlowLightbox: (index: number) => void;
};

const IntroSection = ({ openFlowLightbox }: IntroSectionProps) => (
  <section id='screens-introduction'>
    <CompactIntroHeaderRow className='text-animate'>
      <img className='at-logo' src='/img/squares/at_logo_purple.webp' alt='Antisyphon Training Logo' />
      <div>
        <h2 className='tab-header page-header'>Antisyphon Product Screens</h2>
        <PitchDeckLink
          href='https://www.antisyphontraining.com/'
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => {
            trackLinkClick({
              location: 'product_screens_intro',
              label: 'www.antisyphontraining.com',
              href: 'https://www.antisyphontraining.com/',
              section: 'Antisyphon Product Screens',
            });
            trackEvent('external_project_click', {
              location: 'product_screens_intro',
              label: 'www.antisyphontraining.com',
              href: 'https://www.antisyphontraining.com/',
              page_path: window.location.pathname,
            });
          }}
        >
          www.antisyphontraining.com <OpenInNewWindowIcon aria-hidden='true' />
        </PitchDeckLink>
      </div>
    </CompactIntroHeaderRow>
    <AntisyphonHeroImageWrap>
      <ShowcaseMediaButton
        type='button'
        className='image-animate'
        aria-label='Open image: Full course catalog with category filters and badges'
        onClick={() => openFlowLightbox(0)}
      >
        <HeroMediaFrame>
          <img
            src='/img/antisyphon/course-catalog.webp'
            alt='Full course catalog with category filters and badges'
            loading='lazy'
          />
        </HeroMediaFrame>
      </ShowcaseMediaButton>
    </AntisyphonHeroImageWrap>
    <CompactSectionNavRevealAnchor id='antisyphon-screens-nav-anchor' aria-hidden='true' />
  </section>
);

export default IntroSection;
