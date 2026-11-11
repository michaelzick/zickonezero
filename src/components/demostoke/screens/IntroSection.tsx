import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import { PitchDeckLink } from '../../../../styles';
import { AntisyphonHeroImageWrap } from '../../../../styles/antisyphon';
import { trackEvent, trackLinkClick } from '../../../lib/analytics';
import {
  CompactIntroHeaderRow,
  CompactSectionNavRevealAnchor,
  HeroMediaFrame,
  ShowcaseMediaButton
} from '../../../../styles/projectShowcases';
import { SCREEN_HERO_IMAGE } from '../screenData';

type IntroSectionProps = {
  openScreenLightbox: (index: number) => void;
};

const PROJECT_URL = 'https://www.demostoke.com/';

const IntroSection = ({ openScreenLightbox }: IntroSectionProps) => (
  <section id='screens-introduction'>
    <CompactIntroHeaderRow className='text-animate'>
      <img className='ds-logo' src='/img/squares/demostoke-logo-square.webp' alt='DemoStoke logo' loading='lazy' />
      <div>
        <h2 className='tab-header page-header'>DemoStoke Product Screens</h2>
        <PitchDeckLink
          href={PROJECT_URL}
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => {
            trackLinkClick({
              location: 'product_screens_intro',
              label: 'www.demostoke.com',
              href: PROJECT_URL,
              section: 'DemoStoke Product Screens',
            });
            trackEvent('external_project_click', {
              location: 'demostoke_product_screens',
              label: 'www.demostoke.com',
              href: PROJECT_URL,
              page_path: window.location.pathname,
            });
          }}
        >
          www.demostoke.com <OpenInNewWindowIcon aria-hidden='true' />
        </PitchDeckLink>
      </div>
    </CompactIntroHeaderRow>
    <AntisyphonHeroImageWrap>
      <ShowcaseMediaButton
        type='button'
        className='image-animate'
        aria-label={`Open image: ${SCREEN_HERO_IMAGE.alt}`}
        onClick={() => openScreenLightbox(0)}
      >
        <HeroMediaFrame>
          <img
            src={SCREEN_HERO_IMAGE.src}
            alt={SCREEN_HERO_IMAGE.alt}
            loading='lazy'
          />
        </HeroMediaFrame>
      </ShowcaseMediaButton>
    </AntisyphonHeroImageWrap>
    <CompactSectionNavRevealAnchor id='demostoke-screens-nav-anchor' aria-hidden='true' />
  </section>
);

export default IntroSection;
