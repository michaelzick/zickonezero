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
          onClick={() => setIsCaseStudiesOpen((prevState) => !prevState)}
          aria-expanded={isCaseStudiesOpen}>
          Case Studies
          <CaseStudiesChevron $isOpen={isCaseStudiesOpen} aria-hidden='true' />
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
      <li onClick={handleCloseMenu}>
        <a className='external-link' href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
          <OpenInNewWindowIcon aria-hidden='true' />
        </a>
      </li>
      <li onClick={handleCloseMenu}>
        <a className='external-link' href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
          <OpenInNewWindowIcon aria-hidden='true' />
        </a>
      </li>
    </LinkBoxMobile>
  );
};

export default LinkBoxMobileContent;
