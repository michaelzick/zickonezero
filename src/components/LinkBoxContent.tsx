import Link from 'next/link';
import { useState } from 'react';

import { NewTabSVG } from './svg/NewTab';
import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import {
  LinkBox,
  CaseStudiesDesktopWrapper,
  CaseStudiesTrigger,
  CaseStudiesDropdown,
  CaseStudiesChevron
} from '../../styles';

const LinkBoxContent = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTriggerClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <LinkBox>
      <Link href='/about'>About</Link>
      <CaseStudiesDesktopWrapper>
        <CaseStudiesTrigger
          type='button'
          onClick={handleTriggerClick}
          aria-haspopup='true'
          aria-expanded={isDropdownOpen}>
          Case Studies
          <CaseStudiesChevron $isOpen={isDropdownOpen} aria-hidden='true' />
        </CaseStudiesTrigger>
        <CaseStudiesDropdown
          $isOpen={isDropdownOpen}
          aria-hidden={!isDropdownOpen}>
          {CASE_STUDIES_LINKS.map(({ href, label }) => (
            <li key={href} onClick={handleLinkClick}>
              <Link href={href} tabIndex={isDropdownOpen ? 0 : -1}>{label}</Link>
            </li>
          ))}
        </CaseStudiesDropdown>
      </CaseStudiesDesktopWrapper>
      <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
        <NewTabSVG />
      </a>
      <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
        <NewTabSVG />
      </a>
    </LinkBox>
  );
};

export default LinkBoxContent;
