import DemoStokeContent from '../src/components/DemoStokeContent';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, softwareApplicationJsonLd } from '../src/lib/seo';

const TITLE = 'DemoStoke: Gear Rental Marketplace for Riders and Shops';
const DESCRIPTION =
  'DemoStoke is a two-sided gear rental marketplace: riders find demo and rental gear nearby, and shops run their rentals in Fleet Ops.';
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
      ogImageAlt='DemoStoke homepage hero showing a surfer riding through a wave'
      ogImageWidth={3456}
      ogImageHeight={1944}
      jsonLd={[
        softwareApplicationJsonLd({
          name: 'DemoStoke',
          description: DESCRIPTION,
          path: PATH,
          appUrl: 'https://www.demostoke.com/',
          applicationCategory: 'SportsApplication',
          operatingSystem: 'Web',
          image: OG_IMAGE,
        }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'DemoStoke', path: PATH },
        ]),
      ]}
    />
    <DemoStokeContent />
  </>
);

export default DemoStoke;
