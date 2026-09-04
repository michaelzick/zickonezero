import { MouseEvent, useState } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import {
  showMobileMenu,
} from '../showMobileMenuSlice';
import {
  useAppDispatch,
} from '../hooks';
import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import { CONTACT_LINKS } from './contactLinks';
import { PROJECT_LINKS } from './projectLinks';
import { trackEvent } from '../lib/analytics';
import TrackedLink from './TrackedLink';
import {
  LinkBoxMobile,
  CaseStudiesAccordionButton,
  CaseStudiesAccordionList,
  CaseStudiesChevron
} from '../../styles';

type LinkBoxMobileContentProps = {
  isAnimating?: boolean;
};

const LinkBoxMobileContent = ({ isAnimating = true }: LinkBoxMobileContentProps) => {
  const dispatch = useAppDispatch();
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleCloseMenu = () => dispatch(showMobileMenu(false));
  const trackAccordionOpen = (label: string, expanded: boolean) => {
    if (expanded) return;
    trackEvent('nav_dropdown_open', {
      location: 'mobile_nav',
      label,
      page_path: window.location.pathname,
    });
  };

  return (
    <LinkBoxMobile
      $isAnimating={isAnimating}
      onClick={(event: MouseEvent<HTMLUListElement>) => event.stopPropagation()}>
      <li onClick={handleCloseMenu}>
        <TrackedLink href='/about' label='About' location='mobile_nav' section='primary' variant='mobile'>
          About
        </TrackedLink>
      </li>
      <li onClick={handleCloseMenu}>
        <TrackedLink href='/contact' label='Contact' location='mobile_nav' section='primary' variant='mobile'>
          Contact
        </TrackedLink>
      </li>
      <li className='case-studies-accordion'>
        <CaseStudiesAccordionButton
          type='button'
          onClick={() => {
            trackAccordionOpen('Case Studies', isCaseStudiesOpen);
            setIsCaseStudiesOpen((prevState) => !prevState);
            setIsProjectsOpen(false);
            setIsContactOpen(false);
          }}
          aria-expanded={isCaseStudiesOpen}>
          Case Studies
          <CaseStudiesChevron $isOpen={isCaseStudiesOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesAccordionButton>
        <CaseStudiesAccordionList $isOpen={isCaseStudiesOpen}>
          {CASE_STUDIES_LINKS.map(({ href, label, icon, iconAlt }) => (
            <li key={href} onClick={handleCloseMenu}>
              <TrackedLink href={href} label={label} location='mobile_nav' section='case_studies_accordion' variant='mobile'>
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </TrackedLink>
            </li>
          ))}
        </CaseStudiesAccordionList>
      </li>
      <li className='case-studies-accordion'>
        <CaseStudiesAccordionButton
          type='button'
          onClick={() => {
            trackAccordionOpen('UX Design', isProjectsOpen);
            setIsProjectsOpen((prevState) => !prevState);
            setIsCaseStudiesOpen(false);
            setIsContactOpen(false);
          }}
          aria-expanded={isProjectsOpen}>
          UX Design
          <CaseStudiesChevron $isOpen={isProjectsOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesAccordionButton>
        <CaseStudiesAccordionList $isOpen={isProjectsOpen}>
          {PROJECT_LINKS.map(({ href, label, icon, iconAlt }) => (
            <li key={href} onClick={handleCloseMenu}>
              <TrackedLink href={href} label={label} location='mobile_nav' section='ux_design_accordion' variant='mobile'>
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </TrackedLink>
            </li>
          ))}
        </CaseStudiesAccordionList>
      </li>
      <li className='contact-accordion'>
        <CaseStudiesAccordionButton
          type='button'
          onClick={() => {
            trackAccordionOpen('Links', isContactOpen);
            setIsContactOpen((prevState) => !prevState);
            setIsCaseStudiesOpen(false);
            setIsProjectsOpen(false);
          }}
          aria-expanded={isContactOpen}>
          Links
          <CaseStudiesChevron $isOpen={isContactOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesAccordionButton>
        <CaseStudiesAccordionList $isOpen={isContactOpen}>
          {CONTACT_LINKS.map(({ href, label, external }) => (
            <li key={href} onClick={handleCloseMenu}>
              <TrackedLink
                className={external ? 'external-link' : undefined}
                href={href}
                label={label}
                location='mobile_nav'
                section='links_accordion'
                variant='mobile'
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {label}{external ? <> <OpenInNewWindowIcon aria-hidden='true' /></> : null}
              </TrackedLink>
            </li>
          ))}
        </CaseStudiesAccordionList>
      </li>
    </LinkBoxMobile>
  );
};

export default LinkBoxMobileContent;
