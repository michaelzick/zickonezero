import Link from 'next/link';
import { ReactElement } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import { Footer, CommandLine } from '../../styles';

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
      <a className='external-link' href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
        <OpenInNewWindowIcon aria-hidden='true' />
      </a>
      <a className='external-link' href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
        <OpenInNewWindowIcon aria-hidden='true' />
      </a>
    </div>
  </Footer >
);

export default FooterContent;
