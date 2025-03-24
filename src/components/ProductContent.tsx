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
        <BioBox direction='right'>
          <div className='biobox-inner'>
            <div className='text-wrapper'>
              <h2>Antisyphon Training</h2>
              <br />
              Initially, I was hired at Antisyphon Training as a software engineer. However, that role quickly escalated to conceptualizing what would be our new website.
              <br /><br />
              Not content with just making another static site that linked out to third-party platforms, I envisioned an intuitive marketplace for users to buy any type of course through a shopping cart experience.
            </div>
            <div className='product-screenshot'>
              <Image src='/img/antisyphon/home.webp' alt='headshot' width='1000' height='553' />
            </div>
          </div>
        </BioBox>

        <BioBox direction='left'>
          <div className='biobox-inner'>
            <div className='product-screenshot'>
              <Image src='/img/antisyphon/home.webp' alt='headshot' width='1000' height='553' />
            </div>
            <div className='text-wrapper'>
              <h2>UX Design</h2>
              <br />
              Initially, I was hired at Antisyphon Training as a software engineer. However, that role quickly escalated to conceptualizing what would be our new website.
              <br /><br />
              Not content with just making another static site that linked out to third-party platforms, I envisioned an intuitive marketplace for users to buy any type of course through a shopping cart experience.
            </div>
          </div>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default ProductContent;
