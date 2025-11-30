import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import {
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeMethodRow,
  DemoStokeTldrCopy,
  Wrapper
} from '../../styles';
import {
  PageShell,
  PageInner,
  HeroGrid,
  HeroImageFrame,
  HeroContent,
  Title,
  Summary,
  HeroLabel,
  RoleList,
  LinkRow,
  SectionsBlock,
  SectionTitle,
  ShowcaseImage,
  SubNavBar,
  SubNavThumb,
  SubNavTitle,
  SubNavLink,
  AnimatedSection
} from '../../styles/projectShowcases';
import { TopNavContent, FooterContent } from '.';
import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';
import FsLightbox from 'fslightbox-react';

type ShowcaseSection = {
  title: string;
  body: ReactNode;
  image: { src: string; alt: string; position?: string; };
};

type ProjectShowcaseProps = {
  title: string;
  summary?: string;
  heroImage: { src: string; alt: string; };
  subNavImage?: { src: string; alt: string; };
  roleBullets: string[];
  projectLink: { href: string; label?: string; };
  sections: ShowcaseSection[];
};

const ProjectShowcase = ({
  title,
  summary,
  heroImage,
  subNavImage,
  roleBullets,
  projectLink,
  sections
}: ProjectShowcaseProps) => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isSubNavVisible, setIsSubNavVisible] = useState(false);
  const [lightboxState, setLightboxState] = useState({ toggler: false, slide: 1 });
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<Record<number, boolean>>({});

  const handleHeroIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsSubNavVisible(!entry.isIntersecting);
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(handleHeroIntersection, {
      root: null,
      threshold: 0.35,
      rootMargin: '-40px 0px 0px 0px'
    });

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [handleHeroIntersection]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const idx = Number(entry.target.getAttribute('data-section-index'));
        if (entry.isIntersecting && !Number.isNaN(idx)) {
          setVisibleSections((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
        }
      });
    }, { threshold: 0.22 });

    sectionRefs.current.forEach((node) => node && observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown} isAtPage $isProjectPage
        onClick={() => dispatch(showMobileMenu(false))}>
        <PageShell>
          <PageInner>
            <SubNavBar
              aria-label="Project quick nav"
              aria-hidden={!isSubNavVisible}
              $isVisible={isSubNavVisible}>
              <SubNavThumb src={(subNavImage || heroImage).src} alt={(subNavImage || heroImage).alt} />
              <SubNavTitle>{title}</SubNavTitle>
              <SubNavLink href={projectLink.href} target='_blank' rel='noopener noreferrer'>
                {projectLink.label || 'View Project'} <OpenInNewWindowIcon aria-hidden="true" />
              </SubNavLink>
            </SubNavBar>

            <HeroGrid ref={heroRef}>
              <HeroImageFrame>
                <img src={heroImage.src} alt={heroImage.alt} />
              </HeroImageFrame>
              <HeroContent>
                <Title>{title}</Title>
                {summary ? (
                  <div>
                    <HeroLabel>Description</HeroLabel>
                    <Summary>{summary}</Summary>
                  </div>
                ) : null}
                <div>
                  <HeroLabel>My Roles</HeroLabel>
                  <RoleList>
                    {roleBullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </RoleList>
                </div>
                <LinkRow>
                  <HeroLabel>Project Link</HeroLabel>
                  <div>
                    <a href={projectLink.href} target='_blank' rel='noopener noreferrer'>
                      {projectLink.label || 'View Project'} <OpenInNewWindowIcon aria-hidden="true" />
                    </a>
                  </div>
                </LinkRow>
              </HeroContent>
            </HeroGrid>

            <SectionsBlock>
              <DemoStokeMethodList>
                {sections.map(({ title: sectionTitle, body, image }, index) => (
                  <AnimatedSection
                    key={sectionTitle}
                    ref={(el) => { sectionRefs.current[index] = el; }}
                    data-section-index={index}
                    className={visibleSections[index] ? 'visible' : undefined}
                  >
                    <DemoStokeMethodCard>
                      <DemoStokeMethodRow $reverse={index % 2 === 1}>
                        <div className="text-animate">
                          <SectionTitle as="h3">{sectionTitle}</SectionTitle>
                          <DemoStokeTldrCopy>{body}</DemoStokeTldrCopy>
                        </div>
                        <ShowcaseImage
                          className="image-animate"
                          src={image.src}
                          alt={image.alt}
                          loading='lazy'
                          $position={image.position}
                          role='button'
                          tabIndex={0}
                          onClick={() => setLightboxState(prev => ({ toggler: !prev.toggler, slide: index + 1 }))}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setLightboxState(prev => ({ toggler: !prev.toggler, slide: index + 1 }));
                            }
                          }}
                        />
                      </DemoStokeMethodRow>
                    </DemoStokeMethodCard>
                  </AnimatedSection>
                ))}
              </DemoStokeMethodList>
            </SectionsBlock>
          </PageInner>
        </PageShell>
      </Wrapper>
      <FsLightbox
        toggler={lightboxState.toggler}
        slide={lightboxState.slide}
        sources={sections.map(({ image }) => image.src)}
      />
      <FooterContent />
    </>
  );
};

export default ProjectShowcase;
