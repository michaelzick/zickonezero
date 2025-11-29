import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleTriggerClick = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (!isDropdownOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <LinkBox>
      <Link href='/about'>About</Link>
      <CaseStudiesDesktopWrapper ref={dropdownRef}>
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
          {CASE_STUDIES_LINKS.map(({ href, label, icon, iconAlt }) => (
            <li key={href} onClick={handleLinkClick}>
              <Link href={href} tabIndex={isDropdownOpen ? 0 : -1}>
                {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                {label}
              </Link>
            </li>
          ))}
        </CaseStudiesDropdown>
      </CaseStudiesDesktopWrapper>
      <a className='external-link' href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
        <OpenInNewWindowIcon aria-hidden='true' />
      </a>
      <a className='external-link' href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
        <OpenInNewWindowIcon aria-hidden='true' />
      </a>
    </LinkBox>
  );
};

export default LinkBoxContent;
