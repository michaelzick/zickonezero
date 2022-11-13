import Link from 'next/link';

import { LinkBox, Button } from '../../styles';

const LinkBoxContent = () => (
  <LinkBox>
    <Link href='/about'>About</Link>
    <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub</a>
    <Button href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn</Button>
  </LinkBox>
);

export default LinkBoxContent;
