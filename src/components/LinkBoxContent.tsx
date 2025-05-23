import Link from 'next/link';

import { NewTabSVG } from './svg/NewTab';
import { LinkBox } from '../../styles';

const LinkBoxContent = () => (
  <LinkBox>
    <Link href='/about'>About</Link>
    <Link href='/demostoke'>DemoStoke</Link>
    <Link href='/antisyphon-training'>Antisyphon</Link>
    <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
      <NewTabSVG />
    </a>
    <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
      <NewTabSVG />
    </a>
  </LinkBox>
);

export default LinkBoxContent;
