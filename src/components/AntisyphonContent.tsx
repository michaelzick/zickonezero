import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import { BioBox, Wrapper } from '../../styles';
import { TopNavContent, FooterContent } from '.';

const AntisyphonContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <BioBox noBottomPadding direction='left'>
          <div className='biobox-inner'>
            <div className='product-screenshot'>
              <img src="/img/antisyphon/home.webp" alt="Antisyphon Home" width='1200' height='663' />
            </div>
            <div className='text-wrapper'>
              <h2 className='gets-mobile-margin'>Antisyphon Training</h2>
              <br />
              Initially, I was hired at Black Hills Information Security/Antisyphon Training as a software engineer.
              However, that role quickly evolved into conceptualizing our new website.
              <br /><br />
              I partnered with creative directors and design teams, as well as key stakeholders to create an intuitive
              experience for cybersecurity professionals.
            </div>
          </div>
        </BioBox>
        <BioBox direction='right' noBottomPadding>
          <div className='biobox-inner'>
            <div className='text-wrapper'>
              <h2>E-Commerce Evolution</h2>
              <br />
              Rather than creating just another static site that linked to third-party platforms, I envisioned an
              intuitive marketplace where users could seamlessly purchase any type of course through a shopping cart experience.
              <br /><br />
              This would allow us to offer a wide range of courses, from live events to on-demand training, all in one place.
              I also envisioned a system that would allow us to easily add new courses and manage existing ones.
            </div>
            <div className='product-screenshot'>
              <img src='/img/antisyphon/cart.webp' alt='Antisyphon Cart' width='1200' height='663' />
            </div>
          </div>
        </BioBox>

        <BioBox direction='left' noBottomPadding>
          <div className='biobox-inner'>
            <div className='product-screenshot'>
              <img src='/img/antisyphon/wireframe-home.webp' alt='Wireframe Home' width='664' height='2641' />
            </div>
            <div className='text-wrapper bottom'>
              <h2 className='gets-mobile-margin'>UX Design</h2>
              <br />
              Using Figma, I designed over 50 wireframes, refining them through multiple rounds of discussion, feedback, and iterations.
              Since Black Hills Information Security was developing comics, I wanted the site to be both fun and user-friendly, with
              course badges that resembled in-game achievements.
              <br /><br />
              Once the wireframes were finalized, we hired <a href="https://www.frieddesign.co/" target='_blank' rel='noopener noreferrer'>
                Fried Design</a>{' '}to craft a unique visual identity for the site, including achievement-style course badges.

              <br /><br />
              <div className='product-screenshot'>
                <img src='/img/antisyphon/course-catalog-full.webp' alt='Antisyphon Course Catalog' width='553' height='689' />
              </div>

              <br /><br />
              <div>
                <h2>Intuitive Dashboards</h2>
                <br />
                Starting with boilerplate WooCommerce and heavily customizing it, we built a seamless logged-in experience for user account management.
                <br /><br />
                This includes sections for Live and On-Demand courses, powered by API queries to track progress, generate certificates, and manage subscriptions.
                Since our third-party LMS identifies users by email address, we customized account management features to allow updates while clearly warning users of
                potential consequences.
                <br /><br />
                <div className='product-screenshot'>
                  <img src='/img/antisyphon/wireframe-live-courses.webp' alt='Wireframe Dashboard' width='989' height='1262' />
                </div>
              </div>
            </div>
          </div>
        </BioBox>

        <BioBox direction='right'>
          <div className='biobox-inner'>
            <div className='text-wrapper bottom'>
              <h2>Admin Experiences</h2>
              <br />
              In addition to the consumer-facing site, Antisyphon Training also serves as a full-featured WordPress CMS, which required its own UX considerations.
              While design played a smaller role here, our focus was on making content administration fast, intuitive, and reliable.
              <br /><br />
              Using powerful plugins like The Events Calendar, Events Tickets Plus, and Advanced Custom Fields, we customized the admin experience, reducing
              course and content creation time by approximately 85%. This was all synced with a PHP/MySQL backend to ensure seamless integration with the LMS
              and generate reports.
              <br /><br />
              Surfacing API messages, generating unique IDs, and allowing admins to edit orders were just a few of the key features, much of which we built
              from scratch.
            </div>
            <br />
            <div className='product-screenshot'>
              <img src='/img/antisyphon/dashboard-my-live-courses-prod.webp' alt='Dashboard Live Courses' width='1200' height='666' />
              <br /><br />
              <img src='/img/antisyphon/admin-course-edit.webp' alt='Admin Course Edit' width='1200' height='666' />
            </div>
            <br />
          </div>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default AntisyphonContent;
