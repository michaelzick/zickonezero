import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import SidebarSectionTabs, { type SidebarSectionConfig } from '../SidebarSectionTabs';
import { DemoStokeTldrCopy, PitchDeckLink } from '../../../styles';
import {
  AntisyphonHeroImageWrap,
  FlowImage,
  FlowImageButton,
  FlowMethodList,
  FlowSection,
  FlowStorySection,
  FlowText,
  PairedFlowImagesRow
} from '../../../styles/antisyphon';
import { PhoneFlowImage, PhoneFlowImageButton, PhoneFlowImagesRow } from '../../../styles/phoneScreens';
import {
  AnimatedSection,
  CaseStudySectionTitle,
  CompactCaseStudyPageInner,
  CompactIntroHeaderRow,
  CompactSectionNavRevealAnchor,
  HeroMediaFrame,
  PageShell,
  SectionsBlock,
  ShowcaseMediaButton
} from '../../../styles/projectShowcases';
import { trackEvent, trackLinkClick } from '../../lib/analytics';
import { SetAnimatedSectionRef, VisibleSections } from '../showcaseTypes';
import { type CaseStudyData, type CaseStudyScreenBlock } from './types';

type ScreensIntroProps = {
  study: CaseStudyData;
  openScreenLightbox: (index: number) => void;
};

const ScreensIntro = ({ study, openScreenLightbox }: ScreensIntroProps) => {
  const { name, analyticsId, screens } = study;
  const { link, logo, hero } = screens;
  return (
    <section id='screens-introduction'>
      <CompactIntroHeaderRow className='text-animate'>
        <img className='study-logo' src={logo.src} alt={logo.alt} loading='lazy' />
        <div>
          <h2 className='tab-header page-header'>{name} Product Screens</h2>
          <PitchDeckLink
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => {
              trackLinkClick({
                location: 'product_screens_intro',
                label: link.label,
                href: link.href,
                section: `${name} Product Screens`,
              });
              trackEvent('external_project_click', {
                location: `${analyticsId}_product_screens`,
                label: link.label,
                href: link.href,
                page_path: window.location.pathname,
              });
            }}
          >
            {link.label} <OpenInNewWindowIcon aria-hidden='true' />
          </PitchDeckLink>
        </div>
      </CompactIntroHeaderRow>
      <AntisyphonHeroImageWrap>
        <ShowcaseMediaButton
          type='button'
          className='image-animate'
          aria-label={`Open image: ${hero.alt}`}
          onClick={() => openScreenLightbox(0)}
        >
          <HeroMediaFrame>
            <img src={hero.src} alt={hero.alt} loading='lazy' />
          </HeroMediaFrame>
        </ShowcaseMediaButton>
      </AntisyphonHeroImageWrap>
      <CompactSectionNavRevealAnchor id={`${study.id}-screens-nav-anchor`} aria-hidden='true' />
    </section>
  );
};

type ScreenBlockProps = {
  block: CaseStudyScreenBlock;
  firstImageIndex: number;
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  openScreenLightbox: (index: number) => void;
};

const ScreenBlock = ({
  block,
  firstImageIndex,
  setAnimatedSectionRef,
  visibleSections,
  openScreenLightbox
}: ScreenBlockProps) => {
  const phones = block.images.every(({ portrait }) => portrait);
  const ImagesRow = phones ? PhoneFlowImagesRow : PairedFlowImagesRow;
  const ImageButton = phones ? PhoneFlowImageButton : FlowImageButton;
  const Image = phones ? PhoneFlowImage : FlowImage;
  return (
    <AnimatedSection
      ref={setAnimatedSectionRef(block.id)}
      data-animate-id={block.id}
      className={visibleSections[block.id] ? 'visible' : undefined}
    >
      <FlowStorySection id={block.id} className='story-section'>
        <FlowSection>
          <FlowText className='text-animate'>
            <CaseStudySectionTitle as='h2'>{block.title}</CaseStudySectionTitle>
            <DemoStokeTldrCopy>{block.copy}</DemoStokeTldrCopy>
          </FlowText>
          <ImagesRow className='image-animate'>
            {block.images.map((image, imageIndex) => (
              <ImageButton
                key={image.src}
                type='button'
                onClick={() => openScreenLightbox(firstImageIndex + imageIndex)}
                aria-label={`Open image: ${image.alt}`}
              >
                <Image src={image.src} alt={image.alt} loading='lazy' />
              </ImageButton>
            ))}
          </ImagesRow>
        </FlowSection>
      </FlowStorySection>
    </AnimatedSection>
  );
};

type ScreensTabProps = {
  study: CaseStudyData;
  sections: SidebarSectionConfig[];
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  topTabsEl: HTMLDivElement | null;
  isActive: boolean;
  openScreenLightbox: (index: number) => void;
};

const ScreensTab = ({
  study,
  sections,
  setAnimatedSectionRef,
  visibleSections,
  topTabsEl,
  isActive,
  openScreenLightbox
}: ScreensTabProps) => {
  // Block images follow the intro hero in the lightbox sources.
  let imageOffset = 1;
  return (
    <div id='screens-content' role='tabpanel' aria-labelledby='tab-screens' hidden={!isActive}>
      <PageShell>
        <CompactCaseStudyPageInner className='demostoke-inner'>
          <ScreensIntro study={study} openScreenLightbox={openScreenLightbox} />
          <SidebarSectionTabs
            sections={sections}
            topTabsEl={topTabsEl}
            isActive={isActive}
            scrollOffsetAdjustment={8}
            desktopRevealAnchorId={`${study.id}-screens-nav-anchor`}
          />
          <SectionsBlock as='div'>
            <FlowMethodList>
              {study.screens.blocks.map((block) => {
                const firstImageIndex = imageOffset;
                imageOffset += block.images.length;
                return (
                  <ScreenBlock
                    key={block.id}
                    block={block}
                    firstImageIndex={firstImageIndex}
                    setAnimatedSectionRef={setAnimatedSectionRef}
                    visibleSections={visibleSections}
                    openScreenLightbox={openScreenLightbox}
                  />
                );
              })}
            </FlowMethodList>
          </SectionsBlock>
        </CompactCaseStudyPageInner>
      </PageShell>
    </div>
  );
};

export default ScreensTab;
