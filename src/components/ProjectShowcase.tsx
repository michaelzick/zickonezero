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
  subtitle?: string;
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
`;

const PageInner = styled.div`
  width: min(1200px, 100%);
  display: flex;
  flex-direction: column;
  gap: clamp(1.4em, 3vw, 2em);
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.2em, 3vw, 2.4em);
  align-items: center;
  padding: clamp(1.4em, 3vw, 2em);
  border-radius: 18px;
  background:
    radial-gradient(120% 120% at 10% 10%, rgba(115, 255, 0, 0.12), rgba(255, 255, 255, 0)),
    radial-gradient(90% 90% at 90% 10%, rgba(251, 146, 60, 0.18), rgba(255, 255, 255, 0)),
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(115, 255, 0, 0.04));
  box-shadow: 0 16px 34px -24px rgb(0 0 0 / 70%), inset 0 1px 0 rgba(255, 255, 255, 0.07);

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
  }
`;

const HeroImageFrame = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(115, 255, 0, 0.55);
  box-shadow: 0 18px 46px -28px rgb(0 0 0 / 80%);
  background: radial-gradient(110% 110% at 10% 10%, rgba(115, 255, 0, 0.08), rgba(255, 255, 255, 0));

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
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4.6vw, 3.1rem);
  letter-spacing: 0.01em;
  color: var(--color-hotGreen);
`;

const Summary = styled.p`
  margin: 0;
  font-size: clamp(1.05rem, 2.1vw, 1.2rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.86);
`;

const HeroLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 0.86em;
  color: var(--color-orange);

  &::before {
    content: '';
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    background: var(--color-hotGreen);
    box-shadow: 0 0 0 8px rgba(115, 255, 0, 0.12);
  }
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
    color: rgba(255, 255, 255, 0.9);

    &::before {
      content: '•';
      color: var(--color-hotGreen);
      font-size: 1.2em;
      line-height: 1;
      transform: translateY(-0.05em);
    }
  }
`;

const LinkRow = styled.div`
  margin-top: 0.5em;
  display: inline-flex;
  align-items: center;
  gap: 0.45em;

  a {
    color: ${THEME.colors.white};
    text-decoration: none;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    padding-bottom: 0.08em;
    border-bottom: 2px solid var(--color-hotGreen);
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: var(--color-hotGreen);
      border-color: var(--color-orange);
    }
  }
`;

const SectionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.2em, 3vw, 1.9em);
`;

const SectionKicker = styled.span`
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  font-size: 0.82em;
  color: var(--color-orange);
  margin-bottom: 0.35em;
`;

const SectionTitle = styled(DemoStokeTldrTitle)`
  color: var(--color-hotGreen);
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
                  <HeroLabel>Role</HeroLabel>
                  <RoleList>
                    {roleBullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </RoleList>
                </div>
                <LinkRow>
                  <HeroLabel>Project Link</HeroLabel>
                  <a href={projectLink.href} target='_blank' rel='noopener noreferrer'>
                    {projectLink.label || 'View Project'} <OpenInNewWindowIcon aria-hidden="true" />
                  </a>
                </LinkRow>
              </HeroContent>
            </HeroGrid>

            <SectionsBlock>
              <DemoStokeMethodList>
                {sections.map(({ title: sectionTitle, subtitle, body, image }, index) => (
                  <DemoStokeMethodCard key={sectionTitle}>
                    <DemoStokeMethodRow $reverse={index % 2 === 1}>
                      <div>
                        {subtitle ? <SectionKicker>{subtitle}</SectionKicker> : null}
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
