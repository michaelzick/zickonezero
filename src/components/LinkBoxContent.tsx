import { LinkBox } from '../../styles';
import { scrollMethod } from '../helpers';

const LinkBoxContent = () => (
  <LinkBox>
    <a href='https://github.com/michaelzick' target='_blank' rel='noreferrer'>GitHub</a>
    <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noreferrer'>LinkedIn</a>
    <a href='' onClick={(ev) => {
      ev.preventDefault();
      const element = document.getElementById('about');
      scrollMethod(ev, element);
    }}>About</a>
  </LinkBox>
);

export default LinkBoxContent;
