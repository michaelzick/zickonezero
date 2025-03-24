import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import Image from 'next/image';
import Link from 'next/link';

import { BioBox, Wrapper } from '../../styles';
import { TopNavContent, FooterContent } from '../components';

const ProductContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <BioBox>
          <div className='biobox-inner'>
            <div className='text-wrapper'>
              <h2>Antisyphon Training</h2>
              <br />
              I{"'"}m a Product & Engineering Manager, UX designer, frontend engineer, coach, and cybersecurity enthusiast.
              <br /><br />
              I specialize in the WordPress and React ecosystems (Next.js, Redux, TypeScript), JavaScript, and server configurations including Docker and Digital Ocean.
              I also have experience with Python, PHP, and UI/UX design.
              <br /><br />
              I have the CompTIA Security+ certification and over 18 years in IT. Additionally, I{"'"}ve led groups and individuals to
              personal and career success through coaching.
              <br /><br />
              You can see some samples of the projects I{"'"}ve built in the <span className='underline'><Link href='/'>main gallery</Link></span>,
              code samples at <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer' className='underline'>GitHub</a>,
              and a full qualification on <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'
                className='underline'>LinkedIn</a>.
            </div>
            <div className='product-screenshot'>
              <Image src='/img/antisyphon/home.webp' alt='headshot' width='1000' height='553' />
            </div>
          </div>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default ProductContent;
