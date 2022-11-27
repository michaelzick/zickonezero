import Link from 'next/link';

import { NewTabSVG } from './svg/NewTab';
import { Footer } from '../../styles';
import { ReactElement } from 'react';

const FooterContent = (): ReactElement => (
  <Footer>
    <div>
      Site built with Next.js & Redux Toolkit. Designed by Michael Zick.
    </div>

    <div className='footer-links'>
      <Link href='/'>Home</Link>
      <Link href='/about'>About</Link>
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
