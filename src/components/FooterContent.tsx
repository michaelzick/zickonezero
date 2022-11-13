import Link from 'next/link';

import { Footer, NewTabGlyph } from '../../styles';

const FooterContent = () => (
  <Footer>
    <div>
      Site built with Next.js & Redux Toolkit. Designed by Michael Zick.
    </div>

    <div className='footer-links'>
      <Link href='/'>Home</Link>
      <Link href='/about'>About</Link>
      <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
        <NewTabGlyph src='img/icons8-new-tab-50.png' alt='new tab icon' />
      </a>
      <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
        <NewTabGlyph src='img/icons8-new-tab-50.png' alt='new tab icon' />
      </a>
    </div>
  </Footer >
);

export default FooterContent;
