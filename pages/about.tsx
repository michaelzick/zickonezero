import {
  useAppDispatch
} from '../src/hooks';
import {
  showMobileMenu,
} from '../src/showMobileMenuSlice';

import Image from 'next/image';
import Link from 'next/link';

import { BioBox } from '../styles';
import { NavContent } from '../src/components';

const About = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <NavContent />

      <div className='wrapper' onClick={() => dispatch(showMobileMenu(false))}>
        <BioBox>
          <div className='biobox-inner'>
            <div className='text-wrapper'>
              <h2>Hi, I{"'"}m Michael.</h2>
              <br />
              I{"'"}m a frontend engineer, coach, and cybersecurity enthusiast based in Los Angeles, CA.
              <br /><br />
              I specialize in the React ecosystem, JavaScript, and server configurations including Docker. I also have experience with Python and PHP.
              <br /><br />
              I have the CompTIA Security+ certification and over 16 years in IT. Additionally, I{"'"}ve led groups and individuals to personal and career success through coaching.
              <br /><br />
              You can see some samples of the projects I{"'"}ve built in the <span className='underline'><Link href='/'>main gallery</Link></span>, code samples at{' '}
              <a href='https://github.com/michaelzick' target='_blank' rel='noreferrer' className='underline'>GitHub</a>, and a full qualification on{' '}
              <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noreferrer' className='underline'>LinkedIn</a>.
            </div>
            <div className='headshot'>
              <Image src='/img/headshot.jpeg' alt='headshot' width='350' height='392' />
            </div>
          </div>
        </BioBox>
      </div>
    </>
  );
};

export default About;
