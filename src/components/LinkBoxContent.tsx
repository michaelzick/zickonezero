import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import { CONTACT_LINKS } from './contactLinks';
import { PROJECT_LINKS } from './projectLinks';
import { trackEvent } from '../lib/analytics';
import TrackedLink from './TrackedLink';
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
    if (!isCaseStudiesOpen) {
      trackEvent('nav_dropdown_open', {
        location: 'top_nav',
        label: 'Case Studies',
        page_path: window.location.pathname,
      });
    }
    setIsCaseStudiesOpen(true);
    setIsProjectsOpen(false);
    setIsContactOpen(false);
  };

  const openProjects = () => {
    clearHoverTimeout();
    if (!isProjectsOpen) {
      trackEvent('nav_dropdown_open', {
        location: 'top_nav',
        label: 'UX Design',
        page_path: window.location.pathname,
      });
    }
    setIsProjectsOpen(true);
    setIsCaseStudiesOpen(false);
    setIsContactOpen(false);
  };

  const openContact = () => {
    clearHoverTimeout();
    if (!isContactOpen) {
      trackEvent('nav_dropdown_open', {
        location: 'top_nav',
        label: 'Links',
        page_path: window.location.pathname,
      });
    }
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

  // Clear any pending hover-close timeout when the component unmounts.
  useEffect(() => () => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
  }, []);

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
      <TrackedLink href='/about' label='About' location='top_nav' section='primary'>
        About
      </TrackedLink>
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
              <TrackedLink
                href={href}
                label={label}
                location='top_nav'
                section='case_studies_dropdown'
                variant='desktop'
                tabIndex={isCaseStudiesOpen ? 0 : -1}
              >
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </TrackedLink>
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
              <TrackedLink
                href={href}
                label={label}
                location='top_nav'
                section='ux_design_dropdown'
                variant='desktop'
                tabIndex={isProjectsOpen ? 0 : -1}
              >
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </TrackedLink>
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
              <TrackedLink
                href={href}
                label={label}
                location='top_nav'
                section='links_dropdown'
                variant='desktop'
                target='_blank'
                rel='noopener noreferrer'
                tabIndex={isContactOpen ? 0 : -1}
              >
                {label} <OpenInNewWindowIcon aria-hidden='true' />
              </TrackedLink>
            </li>
          ))}
        </CaseStudiesDropdown>
      </CaseStudiesDesktopWrapper>
    </LinkBox>
  );
};

export default LinkBoxContent;
