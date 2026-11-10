import AntisyphonContent from '../src/components/AntisyphonContent';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, softwareApplicationJsonLd } from '../src/lib/seo';

const TITLE = 'Antisyphon Training: Cybersecurity Training Marketplace';
const DESCRIPTION =
  'Antisyphon Training sells live, on-demand, and pay-what-you-can cybersecurity courses. Michael Zick designed its UX, built its front end, and led its development team.';
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
      ogImageAlt='Antisyphon Training homepage with course cards'
      ogImageWidth={3411}
      ogImageHeight={1789}
      jsonLd={[
        softwareApplicationJsonLd({
          name: 'Antisyphon Training',
          description: DESCRIPTION,
          path: PATH,
          appUrl: 'https://www.antisyphontraining.com/',
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web',
          image: OG_IMAGE,
          clientProduct: true,
        }),
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
