import Link from 'next/link';

import { LinkBox, NewTabGlyph } from '../../styles';

const LinkBoxContent = () => (
  <LinkBox>
    <Link href='/about'>About</Link>
    <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
      <NewTabGlyph src='img/icons8-new-tab-50.png' alt='new tab icon' />
    </a>
    <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
      <NewTabGlyph src='img/icons8-new-tab-50.png' alt='new tab icon' />
    </a>
  </LinkBox>
);

export default LinkBoxContent;
