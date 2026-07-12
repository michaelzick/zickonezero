import { NiceGuyUniversityContent } from '../src/components';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const TITLE = 'Nice Guy University UX Case Study';
const DESCRIPTION =
  'Nice Guy University is a platform that turns the Nice Guy recovery coaching I do one-on-one into self-paced courses men can start tonight.';
const PATH = '/nice-guy-university/';
const OG_IMAGE = '/img/nice-guy-university/ngu-home.webp';

const NiceGuyUniversity = () => (
  <>
    <Seo
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      type='article'
      ogImage={OG_IMAGE}
      jsonLd={[
        creativeWorkJsonLd({ name: TITLE, description: DESCRIPTION, path: PATH, image: OG_IMAGE }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: TITLE, path: PATH },
        ]),
      ]}
    />
    <NiceGuyUniversityContent />
  </>
);

export default NiceGuyUniversity;
