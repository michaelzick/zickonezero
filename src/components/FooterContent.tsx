import Link from 'next/link';

import { NewTabSVG } from './svg/NewTab';
import { Footer, CommandLine } from '../../styles';
import { ReactElement } from 'react';

const FooterContent = (): ReactElement => (
  <Footer>
    <CommandLine>
      Site designed and built by Michael Zick using React, Next.js, and Redux Toolkit.
    </CommandLine>

    <div className='footer-links'>
      <Link href='/'>Home</Link>
      <Link href='/about'>About</Link>
      <Link href='/demostoke'>DemoStoke</Link>
      <Link href='/antisyphon-training'>Antisyphon</Link>
      <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
        <NewTabSVG />
      </a>
      <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
        <NewTabSVG />
      </a>
    </div>
  </Footer >
);

export default FooterContent;
