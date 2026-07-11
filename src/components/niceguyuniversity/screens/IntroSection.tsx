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

const PROJECT_URL = 'https://www.niceguyuniversity.com/';

const IntroSection = ({ openScreenLightbox }: IntroSectionProps) => (
  <section id='screens-introduction'>
    <CompactIntroHeaderRow className='text-animate'>
      <img className='ngu-logo' src='/img/squares/ngu-logo-square.webp' alt='Nice Guy University Logo' />
      <div>
        <h2 className='tab-header page-header'>Nice Guy University Product Screens</h2>
        <PitchDeckLink
          href={PROJECT_URL}
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => {
            trackLinkClick({
              location: 'product_screens_intro',
              label: 'NiceGuyUniversity.com',
              href: PROJECT_URL,
              section: 'Nice Guy University Product Screens',
            });
            trackEvent('external_project_click', {
              location: 'nice_guy_university_product_screens',
              label: 'NiceGuyUniversity.com',
              href: PROJECT_URL,
              page_path: window.location.pathname,
            });
          }}
        >
          NiceGuyUniversity.com <OpenInNewWindowIcon aria-hidden='true' />
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
    <CompactSectionNavRevealAnchor id='nice-guy-university-screens-nav-anchor' aria-hidden='true' />
  </section>
);

export default IntroSection;
