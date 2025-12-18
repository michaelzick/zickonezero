import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import { useEffect, useRef, useState } from 'react';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import Link from 'next/link';

import { BioBox, Wrapper } from '../../styles';
import { AnimatedSection } from '../../styles/projectShowcases';
import { TopNavContent, FooterContent } from '../components';

const AboutContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const aboutSectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <BioBox isAboutPage>
          <AnimatedSection
            ref={aboutSectionRef}
            data-animate-id='about-hero'
            className={isVisible ? 'visible' : undefined}
          >
            <div className='biobox-inner'>
              <div className='text-wrapper bottom text-animate'>
                Michael is a results-oriented Product Leader with a background in UX design, frontend development,
                DevOps, SEO, and e-commerce platforms.
                <br /><br />
                He has hired and led engineering teams to build high-engagement products from 0 to 1
                under tight deadlines, while aligning cross-functional stakeholders in highly ambiguous environments.
                <br /><br />
                From concept to launch, Michael thrives on solving complex problems with elegant, user-centered solutions.
                <br /><br />
                Samples of his work can be found in the <span className='underline'><Link href='/'>main gallery</Link></span>,
                with code examples on <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>
                  GitHub</a>, and a full list of qualifications on <a href='https://linkedin.com/in/michaelzick'
                    target='_blank' rel='noopener noreferrer'>LinkedIn</a>.
              </div>
              <div className='headshot image-animate'>
                <img src='/img/mt-hood-selfie-resized.jpg' alt='Mt. Hood Selfie' width='350' height='392' />
              </div>
            </div>
          </AnimatedSection>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default AboutContent;
