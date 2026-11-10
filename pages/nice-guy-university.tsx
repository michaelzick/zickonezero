import NiceGuyUniversityContent from '../src/components/NiceGuyUniversityContent';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, softwareApplicationJsonLd } from '../src/lib/seo';

const TITLE = 'Nice Guy University: Recovery Courses and Coaching for Men';
const DESCRIPTION =
  'Nice Guy University is a live course platform that turns Michael Zick’s one-on-one Nice Guy recovery coaching into self-paced courses men can start tonight.';
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
      ogImageAlt='Nice Guy University homepage with hero and calls to action'
      ogImageWidth={3456}
      ogImageHeight={1934}
      jsonLd={[
        softwareApplicationJsonLd({
          name: 'Nice Guy University',
          description: DESCRIPTION,
          path: PATH,
          appUrl: 'https://www.niceguyuniversity.com/',
          applicationCategory: 'EducationalApplication',
          operatingSystem: 'Web',
          image: OG_IMAGE,
        }),
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
