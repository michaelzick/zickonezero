import { DemoStokeContent } from '../src/components';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const TITLE = 'DemoStoke UX Case Study';
const DESCRIPTION =
  'DemoStoke is a unified marketplace that helps riders and shops discover, book, and manage demo and rental gear in one place.';
const PATH = '/demostoke/';
const OG_IMAGE = '/img/demostoke/case-study/ds-hero-surf.webp';

const DemoStoke = () => (
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
    <DemoStokeContent />
  </>
);

export default DemoStoke;
