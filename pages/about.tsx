import AboutContent from '../src/components/AboutContent';
import Seo from '../src/components/Seo';
import { profilePageJsonLd } from '../src/lib/seo';

const About = () => (
  <>
    <Seo
      title='About Michael Zick'
      description='Michael Zick is a results-oriented Product Engineer and UX designer with a background in DevOps, SEO, and e-commerce platforms.'
      path='/about/'
      type='profile'
      jsonLd={profilePageJsonLd()}
    />
    <AboutContent />
  </>
);

export default About;
