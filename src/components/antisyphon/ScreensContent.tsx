import {
  BioBox,
  DemoStokeContentGrid,
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeMethodRow,
  DemoStokeTitle,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
  DemoStokeTldrTitle
} from '../../../styles';
import SidebarSectionTabs, { SidebarSectionConfig } from '../SidebarSectionTabs';
import { AnimatedSection } from '../../../styles/projectShowcases';
import { FLOW_BLOCKS } from './data';

type ScreensContentProps = {
  setAnimatedSectionRef: (id: string) => (el: HTMLDivElement | null) => void;
  visibleSections: Record<string, boolean>;
  topTabsEl: HTMLDivElement | null;
  sections: SidebarSectionConfig[];
  isActive: boolean;
};

const ScreensContent = ({
  setAnimatedSectionRef,
  visibleSections,
  topTabsEl,
  sections,
  isActive
}: ScreensContentProps) => {
  return (
    <div id="screens-content">
      <BioBox direction='right' noBottomPadding top>
        <div className='biobox-inner demostoke-inner'>
          <DemoStokeContentGrid>
            <div>
              <section id='screens-introduction' className='story-section'>
                <DemoStokeTitle $noMobileTopPad>Product Screens and Flows</DemoStokeTitle>
                <DemoStokeTldrCopy>
                  A sampling of the core Antisyphon experiences&mdash;from catalog browsing to admin operations&mdash;built on top of
                  WordPress, WooCommerce, and LMS integrations.
                </DemoStokeTldrCopy>
              </section>

              <DemoStokeMethodList>
                {FLOW_BLOCKS.map(({ id, title, copy, images, reverse }, index) => (
                  <AnimatedSection
                    key={id}
                    ref={setAnimatedSectionRef(id)}
                    data-animate-id={id}
                    className={visibleSections[id] ? 'visible' : undefined}
                  >
                    <section id={id} className='story-section'>
                      <DemoStokeMethodCard>
                        <DemoStokeMethodRow $reverse={reverse ?? (index % 2 === 1)}>
                          <div className="text-animate">
                            <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                            <DemoStokeTldrCopy>{copy}</DemoStokeTldrCopy>
                          </div>
                          <div className="image-animate">
                            {images.map((image, imageIndex) => (
                              <DemoStokeTldrImage
                                key={image.src}
                                src={image.src}
                                alt={image.alt}
                                loading='lazy'
                                style={imageIndex > 0 ? { marginTop: '12px' } : undefined}
                              />
                            ))}
                          </div>
                        </DemoStokeMethodRow>
                      </DemoStokeMethodCard>
                    </section>
                  </AnimatedSection>
                ))}
              </DemoStokeMethodList>

              <br />
              <br />
            </div>
            <SidebarSectionTabs
              sections={sections}
              topTabsEl={topTabsEl}
              isActive={isActive}
              scrollOffsetAdjustment={8}
            />
          </DemoStokeContentGrid>
        </div>
      </BioBox>
    </div>
  );
};

export default ScreensContent;
