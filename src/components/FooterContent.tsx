import Link from 'next/link';

import { Footer } from '../../styles';

const FooterContent = () => (
  <Footer>
    <div>
      Site built with <a href='https://github.com/michaelzick/zickonezero' target='_blank'
        rel='noopener noreferrer' className='underline'>Next.js & Redux Toolkit</a>, & designed by Michael Zick.
    </div>

    <div className='footer-links'>
      <Link href='/'>Home</Link>
      <Link href='/about'>About</Link>
      <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub</a>
      <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn</a>
    </div>
  </Footer >
);

export default FooterContent;
