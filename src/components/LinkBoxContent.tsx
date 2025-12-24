import Link from 'next/link';
import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import { CONTACT_LINKS } from './contactLinks';
import { PROJECT_LINKS } from './projectLinks';
import {
  LinkBox,
  CaseStudiesDesktopWrapper,
  CaseStudiesTrigger,
  CaseStudiesDropdown,
  CaseStudiesChevron
} from '../../styles';

const LinkBoxContent = () => {
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const caseStudiesRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimeout = () => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
  };

  const openCaseStudies = () => {
    clearHoverTimeout();
    setIsCaseStudiesOpen(true);
    setIsProjectsOpen(false);
    setIsContactOpen(false);
  };

  const openProjects = () => {
    clearHoverTimeout();
    setIsProjectsOpen(true);
    setIsCaseStudiesOpen(false);
    setIsContactOpen(false);
  };

  const openContact = () => {
    clearHoverTimeout();
    setIsContactOpen(true);
    setIsCaseStudiesOpen(false);
    setIsProjectsOpen(false);
  };

  const closeAll = () => {
    clearHoverTimeout();
    setIsCaseStudiesOpen(false);
    setIsProjectsOpen(false);
    setIsContactOpen(false);
  };

  const scheduleCloseAll = () => {
    clearHoverTimeout();
    hoverCloseTimeout.current = setTimeout(closeAll, 120);
  };

  const handleLinkClick = () => {
    closeAll();
  };

  useEffect(() => {
    if (!isCaseStudiesOpen && !isProjectsOpen && !isContactOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedCase = caseStudiesRef.current?.contains(target);
      const clickedProjects = projectsRef.current?.contains(target);
      const clickedContact = contactRef.current?.contains(target);
      if (!clickedCase && !clickedProjects && !clickedContact) {
        setIsCaseStudiesOpen(false);
        setIsProjectsOpen(false);
        setIsContactOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isCaseStudiesOpen, isProjectsOpen, isContactOpen]);

  return (
    <LinkBox>
      <Link href='/about'>About</Link>
      <CaseStudiesDesktopWrapper
        ref={caseStudiesRef}
        onMouseEnter={openCaseStudies}
        onMouseLeave={scheduleCloseAll}
        onFocus={openCaseStudies}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          const current = caseStudiesRef.current;
          const next = event.relatedTarget as Node | null;
          if (!current) return;
          if (next && current.contains(next)) return;
          closeAll();
        }}
      >
        <CaseStudiesTrigger
          type='button'
          onClick={openCaseStudies}
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
          onMouseEnter={openCaseStudies}
          onMouseLeave={scheduleCloseAll}
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
      <CaseStudiesDesktopWrapper
        ref={projectsRef}
        onMouseEnter={openProjects}
        onMouseLeave={scheduleCloseAll}
        onFocus={openProjects}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          const current = projectsRef.current;
          const next = event.relatedTarget as Node | null;
          if (!current) return;
          if (next && current.contains(next)) return;
          closeAll();
        }}
      >
        <CaseStudiesTrigger
          type='button'
          onClick={openProjects}
          aria-haspopup='true'
          aria-expanded={isProjectsOpen}>
          UX Design
          <CaseStudiesChevron $isOpen={isProjectsOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesTrigger>
        <CaseStudiesDropdown
          onMouseEnter={openProjects}
          onMouseLeave={scheduleCloseAll}
          $isOpen={isProjectsOpen}
          aria-hidden={!isProjectsOpen}>
          {PROJECT_LINKS.map(({ href, label, icon, iconAlt }) => (
            <li key={href} onClick={handleLinkClick}>
              <Link href={href} tabIndex={isProjectsOpen ? 0 : -1}>
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </Link>
            </li>
          ))}
          </CaseStudiesDropdown>
      </CaseStudiesDesktopWrapper>
      <CaseStudiesDesktopWrapper
        ref={contactRef}
        onMouseEnter={openContact}
        onMouseLeave={scheduleCloseAll}
        onFocus={openContact}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          const current = contactRef.current;
          const next = event.relatedTarget as Node | null;
          if (!current) return;
          if (next && current.contains(next)) return;
          closeAll();
        }}
      >
        <CaseStudiesTrigger
          type='button'
          onClick={openContact}
          aria-haspopup='true'
          aria-expanded={isContactOpen}>
          Links
          <CaseStudiesChevron $isOpen={isContactOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesTrigger>
        <CaseStudiesDropdown
          onMouseEnter={openContact}
          onMouseLeave={scheduleCloseAll}
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
