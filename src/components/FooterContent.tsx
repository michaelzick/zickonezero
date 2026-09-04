import { ReactElement } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import { PROJECT_LINKS } from './projectLinks';
import { CONTACT_LINKS } from './contactLinks';
import TrackedLink from './TrackedLink';

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
              <TrackedLink href={href} label={label} location='footer' section='case_studies'>
                {label}
              </TrackedLink>
            </li>
          ))}
        </FooterColumnLinks>
      </FooterColumn>

      <FooterColumn>
        <FooterColumnTitle>UX Design</FooterColumnTitle>
        <FooterColumnLinks>
          {PROJECT_LINKS.map(({ href, label }) => (
            <li key={href}>
              <TrackedLink href={href} label={label} location='footer' section='ux_design'>
                {label}
              </TrackedLink>
            </li>
          ))}
        </FooterColumnLinks>
      </FooterColumn>

      <FooterColumn>
        <FooterColumnTitle>Links</FooterColumnTitle>
        <FooterColumnLinks>
          {CONTACT_LINKS.map(({ href, label, external }) => (
            <li key={href}>
              <TrackedLink
                href={href}
                label={label}
                location='footer'
                section='links'
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {label}{external ? <> <OpenInNewWindowIcon aria-hidden="true" /></> : null}
              </TrackedLink>
            </li>
          ))}
        </FooterColumnLinks>
      </FooterColumn>
    </FooterInner>

    <FooterBottom>
      <span>Site designed and built by Michael Zick.</span>
      <span>© 2025 ZICKONEZERO Creative</span>
    </FooterBottom>
  </Footer>
);

export default FooterContent;
