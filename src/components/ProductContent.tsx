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
        <BioBox direction='right' noBottomPadding>
          <div className='biobox-inner'>
            <div className='text-wrapper'>
              <h2>Antisyphon Training</h2>
              <br />
              Initially, I was hired at Black Hills Information Security—Antisyphon Training as a software engineer.
              However, that role quickly escalated to conceptualizing what would be our new website.
              <br /><br />
              Not content with just making another static site that linked out to third-party platforms,
              I envisioned an intuitive marketplace for users to buy any type of course through a shopping cart experience.
              {' '}<a href="https://www.antisyphontraining.com" target='_blank' rel='noopener noreferrer'>See the full site</a>.
            </div>
            <div className='product-screenshot'>
              <Image src='/img/antisyphon/cart.webp' alt='Antisyphon Cart' width='1200' height='664' />
            </div>
          </div>
        </BioBox>

        <BioBox direction='left'>
          <div className='biobox-inner'>
            <div className='product-screenshot'>
              <Image src='/img/antisyphon/wireframe-home.webp' alt='Wireframe Home' width='664' height='2641' />
              <br /><br /><br />
              <div>
                <h2>Intuitive Dashboards</h2>
                <br />
                Starting with boilerplate WooCommerce and customizing the **** out of it, we crafted a logged-in experience for user account maintenance.
                <br /><br />
                This involved creating sections for Live and On-Demand courses complete with API queries to retrieve completion data, serving certificates
                of completion, and allowing users to purchase, cancel, and renew Subscriptions.
                <br /><br />
                Of course, no user dashboard would be complete without a way for users to change their email, password, addresses, and see their purchase history.
                {' '}<a href="https://www.antisyphontraining.com" target='_blank' rel='noopener noreferrer'>See the full site</a>.
                <br /><br />
                <div className='product-screenshot'>
                  <Image src='/img/antisyphon/corporate-dashboard.webp' alt='Wireframe Dashboard' width='989' height='1435' />
                </div>
              </div>
            </div>
            <div className='text-wrapper'>
              <br /><br />
              <h2>UX Design</h2>
              <br />
              Using Figma, I began designing wireframes that would go through several rounds of discussion, feedback, and countless iterations.
              <br /><br />
              When the wireframes were complete, we hired <a href="https://www.frieddesign.co/" target='_blank' rel='noopener noreferrer'>Fried Design</a>
              {' '}to give our site a unique look complete with game-like course badges.
              <br />{' '}<a href="https://www.antisyphontraining.com" target='_blank' rel='noopener noreferrer'>See the full site</a>.
              <br /><br />
              <div className='product-screenshot'>
                <Image src='/img/antisyphon/wwhf-future-is.webp' alt='Wireframe THE FUTURE IS' width='553' height='2500' />
              </div>

              <br /><br />
              <div className='product-screenshot'>
                <Image src='/img/antisyphon/dashboard-saved-cc.webp' alt='Dashboard Saved Credit Cards' width='1200' height='664' />
              </div>

              <br /><br />
              <h2>Admin Experiences</h2>
              <br />
              In addition to the consumer-facing site, Antisyphon Training is also a full-featured WordPress CMS, which required its
              own UX considerations. While design played less of a role, we needed to make content administration fast, intuitive, and reliable.
              <br /><br />
              Using massive plugins like The Events Calendar, Events Tickets Plus, and Advanced Custom Fields, we customized and crafted an
              administrative experience that increased course and content creation by around 85%, all while syncing with a PHP/MySQL backend services
              layer to link everything correctly.
              <br /><br />
              Surfacing API errors, generating unique IDs, and allowing admins to edit orders were all part of the package.
              {' '}<a href="https://www.antisyphontraining.com" target='_blank' rel='noopener noreferrer'>See the full site</a>.
              <br /><br />
              <div className='product-screenshot'>
                <Image src='/img/antisyphon/admin-course-edit.webp' alt='Admin Course Edit' width='1000' height='553' />
              </div>
              <br />
            </div>
          </div>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default ProductContent;
