import Link from 'next/link';
import { ReactElement } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import { PROJECT_LINKS } from './projectLinks';
import { CONTACT_LINKS } from './contactLinks';

import {
  Footer,
  FooterInner,
  FooterColumn,
  FooterColumnTitle,
  FooterColumnLinks,
  FooterBottom
} from '../../styles';

const FooterContent = (): ReactElement => (
  <Footer>
    <FooterInner>
      <FooterColumn>
        <FooterColumnTitle>Case Studies</FooterColumnTitle>
        <FooterColumnLinks>
          {CASE_STUDIES_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </FooterColumnLinks>
      </FooterColumn>

      <FooterColumn>
        <FooterColumnTitle>UX Design</FooterColumnTitle>
        <FooterColumnLinks>
          {PROJECT_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </FooterColumnLinks>
      </FooterColumn>

      <FooterColumn>
        <FooterColumnTitle>Links</FooterColumnTitle>
        <FooterColumnLinks>
          {CONTACT_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label} <OpenInNewWindowIcon aria-hidden="true" />
              </a>
            </li>
          ))}
        </FooterColumnLinks>
      </FooterColumn>
    </FooterInner>

    <FooterBottom>
      <span>Site designed and built by Michael Zick using React, Next.js, and Redux Toolkit.</span>
      <span>© 2025 ZICKONEZERO Creative</span>
    </FooterBottom>
  </Footer>
);

export default FooterContent;
