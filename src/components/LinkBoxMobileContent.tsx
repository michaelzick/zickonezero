import Link from 'next/link';
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

  return (
    <LinkBoxMobile
      $isAnimating={isAnimating}
      onClick={(event: MouseEvent<HTMLUListElement>) => event.stopPropagation()}>
      <li onClick={handleCloseMenu}>
        <Link href='/about'>About</Link>
      </li>
      <li className='case-studies-accordion'>
        <CaseStudiesAccordionButton
          type='button'
          onClick={() => {
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
              <Link href={href}>
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </Link>
            </li>
          ))}
        </CaseStudiesAccordionList>
      </li>
      <li className='case-studies-accordion'>
        <CaseStudiesAccordionButton
          type='button'
          onClick={() => {
            setIsProjectsOpen((prevState) => !prevState);
            setIsCaseStudiesOpen(false);
            setIsContactOpen(false);
          }}
          aria-expanded={isProjectsOpen}>
          Projects
          <CaseStudiesChevron $isOpen={isProjectsOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesAccordionButton>
        <CaseStudiesAccordionList $isOpen={isProjectsOpen}>
          {PROJECT_LINKS.map(({ href, label, icon, iconAlt }) => (
            <li key={href} onClick={handleCloseMenu}>
              <Link href={href}>
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </Link>
            </li>
          ))}
        </CaseStudiesAccordionList>
      </li>
      <li className='contact-accordion'>
        <CaseStudiesAccordionButton
          type='button'
          onClick={() => {
            setIsContactOpen((prevState) => !prevState);
            setIsCaseStudiesOpen(false);
            setIsProjectsOpen(false);
          }}
          aria-expanded={isContactOpen}>
          Contact
          <CaseStudiesChevron $isOpen={isContactOpen} aria-hidden='true'>
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </CaseStudiesChevron>
        </CaseStudiesAccordionButton>
        <CaseStudiesAccordionList $isOpen={isContactOpen}>
          {CONTACT_LINKS.map(({ href, label }) => (
            <li key={href} onClick={handleCloseMenu}>
              <a className='external-link' href={href} target='_blank' rel='noopener noreferrer'>
                {label} <OpenInNewWindowIcon aria-hidden='true' />
              </a>
            </li>
          ))}
        </CaseStudiesAccordionList>
      </li>
    </LinkBoxMobile>
  );
};

export default LinkBoxMobileContent;
