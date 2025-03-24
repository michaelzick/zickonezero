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
              <Image src='/img/antisyphon/wireframe-home.webp' alt='headshot' width='553' height='2200' />
              <br />
              <br />
              <h2>Admin Experiences</h2>
              <br />
              In addition to consumer-facing aspects, Antisyphon Training was also a full-featured WordPress CMS, which required its own UX considerations. While design played less of a role, we needed to make content administration fast, intuitive, and reliable.
              <br /><br />
              Using my years of experience as a frontend developer, I knew that simple is better, but simple isn{"'"}t always easy. Crafting a site that{"'"}s easy to use would require research and intuition.
              <br /><br />
              <div className='product-screenshot'>
                <Image src='/img/antisyphon/corporate-dashboard.webp' alt='headshot' width='989' height='1435' />
              </div>
            </div>
            <div className='text-wrapper'>
              <h2>UX Design</h2>
              <br />
              Using Figma, I began designing wireframes that would go through several rounds of discussion, feedback, and countless iterations.
              <br /><br />
              Using my years of experience as a frontend developer, I knew that simple is better, but simple isn{"'"}t always easy. Crafting a site that{"'"}s easy to use would require research and intuition.
              <br /><br />
              <div className='product-screenshot'>
                <Image src='/img/antisyphon/wwhf-future-is.webp' alt='headshot' width='553' height='2500' />
              </div>
            </div>
          </div>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default ProductContent;
