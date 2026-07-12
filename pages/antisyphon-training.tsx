import { AntisyphonContent } from '../src/components';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const TITLE = 'Antisyphon Training UX Case Study';
const DESCRIPTION =
  'Antisyphon Training is a cohesive marketplace experience for live, on-demand, and pay-what-you-can security education.';
const PATH = '/antisyphon-training/';
const OG_IMAGE = '/img/antisyphon/home.webp';

const Antisyphon = () => (
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
    <AntisyphonContent />
  </>
);

export default Antisyphon;
