import CaseStudyPage from '../src/components/caseStudy/CaseStudyPage';
import { RACKLOOSE_CASE_STUDY } from '../src/components/rackloose/caseStudyData';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, softwareApplicationJsonLd } from '../src/lib/seo';

const TITLE = 'Rackloose: Modular Synth in the Browser';
const DESCRIPTION = RACKLOOSE_CASE_STUDY.intro.summary;
const PATH = '/rackloose/';
const OG_IMAGE = RACKLOOSE_CASE_STUDY.intro.image;

const RackloosePage = () => (
  <>
    <Seo
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      type='article'
      ogImage={OG_IMAGE.src}
      ogImageAlt={OG_IMAGE.alt}
      ogImageWidth={3456}
      ogImageHeight={1934}
      jsonLd={[
        softwareApplicationJsonLd({
          name: 'Rackloose',
          description: DESCRIPTION,
          path: PATH,
          appUrl: 'https://www.rackloose.com/',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          image: OG_IMAGE.src,
        }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Rackloose', path: PATH },
        ]),
      ]}
    />
    <CaseStudyPage study={RACKLOOSE_CASE_STUDY} />
  </>
);

export default RackloosePage;
