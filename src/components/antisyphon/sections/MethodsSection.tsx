import {
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeMethodRow,
  DemoStokeTldrCopy,
  DemoStokeTldrTitle,
} from '../../../../styles';
import { AnimatedSection, CaseStudySectionTitle } from '../../../../styles/projectShowcases';
import { MethodImageButton, MethodImageFrame, MethodImages } from '../../../../styles/antisyphon';
import { METHOD_SECTIONS } from '../caseStudyData';
import { SetAnimatedSectionRef, VisibleSections } from '../../showcaseTypes';

type MethodsSectionProps = {
  setAnimatedSectionRef: SetAnimatedSectionRef;
  visibleSections: VisibleSections;
  openMethodLightbox: (index: number) => void;
};

const methodImageOffsets = METHOD_SECTIONS.reduce<number[]>((offsets, _section, index) => {
  const previous = offsets[index - 1] ?? 0;
  const priorCount = index > 0 ? METHOD_SECTIONS[index - 1]?.images.length ?? 0 : 0;
  offsets[index] = index === 0 ? 0 : previous + priorCount;
  return offsets;
}, []);

const MethodsSection = ({ setAnimatedSectionRef, visibleSections, openMethodLightbox }: MethodsSectionProps) => (
  <section id='section-methodology' className='story-section'>
    <CaseStudySectionTitle as='h2'>Methods / The UX Process</CaseStudySectionTitle>
    <DemoStokeMethodList>
      {METHOD_SECTIONS.map(({ title, bullets, images }, index) => (
        <AnimatedSection
          key={title}
          ref={setAnimatedSectionRef(`method-${index}`)}
          data-animate-id={`method-${index}`}
          className={visibleSections[`method-${index}`] ? 'visible' : undefined}
        >
          <DemoStokeMethodCard>
            <DemoStokeMethodRow $reverse={index % 2 === 1}>
              <div className='text-animate'>
                <DemoStokeTldrTitle>{title}</DemoStokeTldrTitle>
                <DemoStokeTldrCopy>
                  <ul className='plain-lines'>
                    {bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </DemoStokeTldrCopy>
              </div>
              <MethodImages className='image-animate'>
                {images.map((image, imageIndex) => {
                  const globalIndex = (methodImageOffsets[index] ?? 0) + imageIndex;
                  return (
                    <MethodImageButton key={image.src} type='button' onClick={() => openMethodLightbox(globalIndex)} aria-label={`Open image: ${image.alt}`}>
                      <MethodImageFrame>
                        <img src={image.src} alt={image.alt} loading='lazy' />
                      </MethodImageFrame>
                    </MethodImageButton>
                  );
                })}
              </MethodImages>
            </DemoStokeMethodRow>
          </DemoStokeMethodCard>
        </AnimatedSection>
      ))}
    </DemoStokeMethodList>
  </section>
);

export default MethodsSection;
