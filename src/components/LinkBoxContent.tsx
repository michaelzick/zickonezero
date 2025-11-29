import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import { CONTACT_LINKS } from './contactLinks';
import {
  LinkBox,
  CaseStudiesDesktopWrapper,
  CaseStudiesTrigger,
  CaseStudiesDropdown,
  CaseStudiesChevron
} from '../../styles';

const LinkBoxContent = () => {
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const caseStudiesRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const handleCaseTriggerClick = () => {
    setIsCaseStudiesOpen((prevState) => !prevState);
    setIsContactOpen(false);
  };

  const handleContactTriggerClick = () => {
    setIsContactOpen((prevState) => !prevState);
    setIsCaseStudiesOpen(false);
  };

  const handleLinkClick = () => {
    setIsCaseStudiesOpen(false);
    setIsContactOpen(false);
  };

  useEffect(() => {
    if (!isCaseStudiesOpen && !isContactOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedCase = caseStudiesRef.current?.contains(target);
      const clickedContact = contactRef.current?.contains(target);
      if (!clickedCase && !clickedContact) {
        setIsCaseStudiesOpen(false);
        setIsContactOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isCaseStudiesOpen, isContactOpen]);

  return (
    <LinkBox>
      <Link href='/about'>About</Link>
      <CaseStudiesDesktopWrapper ref={caseStudiesRef}>
        <CaseStudiesTrigger
          type='button'
          onClick={handleCaseTriggerClick}
          aria-haspopup='true'
          aria-expanded={isCaseStudiesOpen}>
          Case Studies
          <CaseStudiesChevron $isOpen={isCaseStudiesOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesTrigger>
        <CaseStudiesDropdown
          $isOpen={isCaseStudiesOpen}
          aria-hidden={!isCaseStudiesOpen}>
          {CASE_STUDIES_LINKS.map(({ href, label, icon, iconAlt }) => (
            <li key={href} onClick={handleLinkClick}>
              <Link href={href} tabIndex={isCaseStudiesOpen ? 0 : -1}>
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </Link>
            </li>
          ))}
        </CaseStudiesDropdown>
      </CaseStudiesDesktopWrapper>
      <CaseStudiesDesktopWrapper ref={contactRef}>
        <CaseStudiesTrigger
          type='button'
          onClick={handleContactTriggerClick}
          aria-haspopup='true'
          aria-expanded={isContactOpen}>
          Contact
          <CaseStudiesChevron $isOpen={isContactOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesTrigger>
        <CaseStudiesDropdown
          $isOpen={isContactOpen}
          aria-hidden={!isContactOpen}>
          {CONTACT_LINKS.map(({ href, label }) => (
            <li key={href} onClick={handleLinkClick}>
              <a href={href} target='_blank' rel='noopener noreferrer' tabIndex={isContactOpen ? 0 : -1}>
                {label} <OpenInNewWindowIcon aria-hidden='true' />
              </a>
            </li>
          ))}
        </CaseStudiesDropdown>
      </CaseStudiesDesktopWrapper>
    </LinkBox>
  );
};

export default LinkBoxContent;
