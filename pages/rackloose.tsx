import CaseStudyPage from '../src/components/caseStudy/CaseStudyPage';
import { RACKLOOSE_CASE_STUDY } from '../src/components/rackloose/caseStudyData';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const TITLE = 'Rackloose UX Case Study';
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
        creativeWorkJsonLd({ name: TITLE, description: DESCRIPTION, path: PATH, image: OG_IMAGE.src }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: TITLE, path: PATH },
        ]),
      ]}
    />
    <CaseStudyPage study={RACKLOOSE_CASE_STUDY} />
  </>
);

export default RackloosePage;
