import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import styled from 'styled-components';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import Link from 'next/link';

import {
  DemoStokeMiniCardModal,
  DemoStokeMiniCardModalClose,
  DemoStokeMiniCardModalCopy,
  DemoStokeMiniCardModalOverlay,
  DemoStokeMiniCardModalTitle,
  Wrapper
} from '../../styles';
import { AnimatedSection } from '../../styles/projectShowcases';
import { THEME } from '../../styles/theme';
import { TopNavContent, FooterContent } from '../components';

const AboutHero = styled.section`
  position: relative;
  min-height: calc(100svh - 5em);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  background: url('/img/illustrated-mt-hood-selfie.webp') center center / cover no-repeat;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(2, 8, 23, 0.34);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    min-height: calc(100svh - 5.2em);
    background-position: 62% center;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    min-height: calc(100svh - 8.7em);
    background-position: 68% center;
  }
`;

const AboutFixedCta = styled.button`
  position: absolute;
  right: clamp(0.85rem, 3vw, 2.1rem);
  bottom: clamp(0.85rem, 3vw, 1.8rem);
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: min(18rem, calc(100% - 1.7rem));
  margin: 0;
  padding: 0.65em 1.2em;
  border-radius: ${THEME.radii.md};
  border: 2px solid ${THEME.colors.hotYellow};
  background-color: ${THEME.colors.hotYellow};
  color: ${THEME.colors.contrast};
  font-family: Roboto, sans-serif;
  font-size: 1.1em;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 8px 18px -10px rgb(0 0 0 / 45%);
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${THEME.colors.darkGreen};
    border-color: ${THEME.colors.darkGreen};
    color: #fff;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotRed};
    outline-offset: 4px;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    max-width: min(17rem, calc(100% - 1.6rem));
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    right: clamp(0.6rem, 3vw, 1rem);
    bottom: clamp(0.6rem, 3vw, 1rem);
    max-width: min(15rem, calc(100% - 1.2rem));
    padding: 0.72em 1em;
    font-size: 0.98em;
  }
`;

const AboutModalCopy = styled(DemoStokeMiniCardModalCopy)`
  text-align: left;
  font-size: 2em;
  line-height: 1.6;
  max-height: calc(88vh - 5.5em);

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    font-size: 1.6em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 1.28em;
  }
`;

const AboutModal = styled(DemoStokeMiniCardModal)`
  width: min(960px, 96vw);
`;

const AboutModalTitle = styled(DemoStokeMiniCardModalTitle)`
  font-size: clamp(2.5em, 4.6vw, 3em);
  margin-bottom: 0.55em;
`;

const AboutContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const openAboutModal = useCallback(() => {
    setIsAboutModalOpen(true);
  }, []);

  const closeAboutModal = useCallback(() => {
    setIsAboutModalOpen(false);
  }, []);

  const handleAboutModalClick = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const node = aboutSectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAboutModalOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAboutModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAboutModalOpen, closeAboutModal]);

  return (
    <>
      <TopNavContent />
      <Wrapper
        isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}
      >
        <AnimatedSection
          ref={aboutSectionRef}
          data-animate-id='about-hero'
          className={isVisible ? 'visible' : undefined}
        >
          <AboutHero aria-label='About page hero'>
            <AboutFixedCta type='button' onClick={openAboutModal}>
              About Michael
            </AboutFixedCta>
          </AboutHero>
        </AnimatedSection>

        {isAboutModalOpen && (
          <DemoStokeMiniCardModalOverlay onClick={closeAboutModal} role='presentation'>
            <AboutModal
              role='dialog'
              aria-modal='true'
              aria-label='About Michael'
              onClick={handleAboutModalClick}
            >
              <DemoStokeMiniCardModalClose type='button' onClick={closeAboutModal} aria-label='Close dialog'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </DemoStokeMiniCardModalClose>
              <AboutModalTitle>About Michael</AboutModalTitle>
              <AboutModalCopy>
                <p>
                  Michael is a results-oriented Product Leader with a background in UX design, frontend development,
                  DevOps, SEO, and e-commerce platforms.
                </p>
                <p>
                  He has hired and led engineering teams to build high-engagement products from 0 to 1 under tight
                  deadlines, while aligning cross-functional stakeholders in highly ambiguous environments.
                </p>
                <p>
                  From concept to launch, Michael thrives on solving complex problems with elegant, user-centered solutions.
                </p>
                <p>
                  Samples of his work can be found in the <Link href='/'>main gallery</Link>, with code examples on{' '}
                  <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub</a>, and a
                  full list of qualifications on <a href='https://linkedin.com/in/michaelzick'
                    target='_blank' rel='noopener noreferrer'>LinkedIn</a>.
                </p>
              </AboutModalCopy>
            </AboutModal>
          </DemoStokeMiniCardModalOverlay>
        )}
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default AboutContent;
