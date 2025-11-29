import { ReactNode, useEffect } from 'react';
import styled from 'styled-components';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import {
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeMethodRow,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
  DemoStokeTldrTitle,
  Wrapper
} from '../../styles';
import { THEME } from '../../styles/theme';
import { TopNavContent, FooterContent } from '.';
import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

type ShowcaseSection = {
  title: string;
  body: ReactNode;
  image: { src: string; alt: string; };
};

type ProjectShowcaseProps = {
  title: string;
  summary?: string;
  heroImage: { src: string; alt: string; };
  roleBullets: string[];
  projectLink: { href: string; label?: string; };
  sections: ShowcaseSection[];
};

const PageShell = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: clamp(1.6em, 4vw, 2.6em) clamp(1.2em, 3vw, 2.8em) clamp(2.4em, 5vw, 3.6em);
  color: ${THEME.colors.white};
  font-size: 25px;
`;

const PageInner = styled.div`
  max-width: 62em;
  display: flex;
  flex-direction: column;
  gap: clamp(1.4em, 3vw, 2em);
  text-align: left;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.2em, 3vw, 2.4em);
  align-items: center;
  padding: 0;
  border-radius: 0;
  border: none;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
  }
`;

const HeroImageFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid ${THEME.colors.white};
  box-shadow: 0 18px 46px -28px rgb(0 0 0 / 80%);
  background: transparent;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  text-align: left;
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: 1.7;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4.6vw, 3.1rem);
  letter-spacing: 0.01em;
  color: ${THEME.colors.hotRed};
`;

const Summary = styled.p`
  margin: 0;
  font-size: 1.2em;
  line-height: inherit;
  color: rgba(255, 255, 255, 0.86);
`;

const HeroLabel = styled.div`
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 0.86em;
  color: ${THEME.colors.orange};
`;

const RoleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.2em 0 0;
  display: grid;
  gap: 0.35em;

  li {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.5em;
    line-height: 1.5;
    color: ${THEME.colors.white};

    &::before {
      content: '•';
      color: ${THEME.colors.white};
      font-size: 1.2em;
      line-height: 1;
      transform: translateY(-0.05em);
    }
  }
`;

const LinkRow = styled.div`
  margin-top: 0.5em;

  a {
    color: ${THEME.colors.white};
    text-decoration: none;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    padding-bottom: 0.08em;
    border-bottom: 2px solid ${THEME.colors.white};
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.85);
      border-color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const SectionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.2em, 3vw, 1.9em);
  text-align: left;
`;

const SectionTitle = styled(DemoStokeTldrTitle)`
  color: ${THEME.colors.white};
  margin-bottom: 0.35em;
`;

const ProjectShowcase = ({
  title,
  summary,
  heroImage,
  roleBullets,
  projectLink,
  sections
}: ProjectShowcaseProps) => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown} isAtPage
        onClick={() => dispatch(showMobileMenu(false))}>
        <PageShell>
          <PageInner>
            <HeroGrid>
              <HeroImageFrame>
                <img src={heroImage.src} alt={heroImage.alt} />
              </HeroImageFrame>
              <HeroContent>
                <Title>{title}</Title>
                {summary ? <Summary>{summary}</Summary> : null}
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
                  <DemoStokeMethodCard key={sectionTitle}>
                    <DemoStokeMethodRow $reverse={index % 2 === 1}>
                      <div>
                        <SectionTitle as="h3">{sectionTitle}</SectionTitle>
                        <DemoStokeTldrCopy>{body}</DemoStokeTldrCopy>
                      </div>
                      <DemoStokeTldrImage src={image.src} alt={image.alt} loading='lazy' />
                    </DemoStokeMethodRow>
                  </DemoStokeMethodCard>
                ))}
              </DemoStokeMethodList>
            </SectionsBlock>
          </PageInner>
        </PageShell>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default ProjectShowcase;
