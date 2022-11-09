import { Footer } from '../../styles';

const FooterContent = () => (
  <Footer>Made with <a href='https://nextjs.org/' target='_blank'
    rel='noopener noreferrer' className='underline'>Next.js</a>{' '}
    & <a href='https://redux-toolkit.js.org/' target='_blank'
      rel='noopener noreferrer' className='underline'>Redux Toolkit</a>
  </Footer>
);

export default FooterContent;
