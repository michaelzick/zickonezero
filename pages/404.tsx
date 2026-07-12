import styled from 'styled-components';

import { FooterContent, TopNavContent } from '../src/components';
import Seo from '../src/components/Seo';
import TrackedLink from '../src/components/TrackedLink';
import { Wrapper } from '../styles';
import { THEME } from '../styles/theme';

const NotFoundSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.1em;
  min-height: 60vh;
  padding: clamp(3em, 8vw, 6em) 1.5em;
  color: ${THEME.colors.white};

  h1 {
    margin: 0;
    font-family: Roboto, sans-serif;
    font-size: clamp(2.6em, 6vw, 4em);
    line-height: 1.1;
  }

  p {
    margin: 0;
    max-width: 34em;
    font-family: Roboto, sans-serif;
    font-size: 1.3em;
    line-height: 1.6;
  }

  .home-link {
    display: inline-flex;
    align-items: center;
    padding: 0.65em 1.4em;
    border-radius: ${THEME.radii.md};
    background-color: ${THEME.colors.hotYellow};
    color: ${THEME.colors.contrast};
    font-family: Roboto, sans-serif;
    font-weight: 700;
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      background-color: ${THEME.colors.darkGreen};
      color: #fff;
    }
  }
`;

const NotFoundPage = () => (
  <>
    <Seo title='Page Not Found' path='/404/' noIndex />
    <TopNavContent />
    <Wrapper>
      <NotFoundSection>
        <h1>Page not found</h1>
        <p>The page you are looking for moved or never existed. Let&rsquo;s get you back to the work.</p>
        <TrackedLink
          href='/'
          label='Back to home'
          location='not_found'
          section='cta'
          className='home-link'
        >
          Back to home
        </TrackedLink>
      </NotFoundSection>
    </Wrapper>
    <FooterContent />
  </>
);

export default NotFoundPage;
