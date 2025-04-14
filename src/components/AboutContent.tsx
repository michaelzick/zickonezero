import {
  useAppDispatch,
  useAppSelector
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import Link from 'next/link';

import { BioBox, Wrapper } from '../../styles';
import { TopNavContent, FooterContent } from '../components';

const AboutContent = () => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  return (
    <>
      <TopNavContent />
      <Wrapper isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <BioBox isAboutPage>
          <div className='biobox-inner'>
            <div className='text-wrapper'>
              Michael is a Product & Engineering Manager with a strong background in UX design, frontend development,
              DevOps, SEO, and e-commerce platforms. He has hired and led engineering teams to build products from 0 to 1
              under tight deadlines, aligning cross-functional stakeholders in highly ambiguous environments.
              <br /><br />
              He specializes in the WordPress and React ecosystems (including Next.js, Redux, and TypeScript).
              He also has experience with Python, PHP, and MySQL.
              <br /><br />
              With a CompTIA Security+ certification and over 18 years in IT, Michael brings deep technical
              expertise and leadership to every project. In addition to his technical background, he has guided
              individuals and teams to personal and professional success through coaching.
              <br /><br />
              Samples of his work can be found in the <span className='underline'><Link href='/'>main gallery</Link></span>,
              with code examples on <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'
                className='underline'>GitHub</a>, and a full list of qualifications on <a href='https://linkedin.com/in/michaelzick'
                  target='_blank' rel='noopener noreferrer' className='underline'>LinkedIn</a>.
            </div>
            <div className='headshot'>
              <img src='/img/headshot.webp' alt='headshot' width='350' height='392' />
            </div>
          </div>
        </BioBox>
      </Wrapper>
      <FooterContent />
    </>
  );
};

export default AboutContent;
