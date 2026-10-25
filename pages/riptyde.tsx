import CaseStudyPage from '../src/components/caseStudy/CaseStudyPage';
import { RIPTYDE_CASE_STUDY } from '../src/components/riptyde/caseStudyData';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../src/lib/seo';

const TITLE = 'Riptyde UX Case Study';
const DESCRIPTION = RIPTYDE_CASE_STUDY.intro.summary;
const PATH = '/riptyde/';
const OG_IMAGE = RIPTYDE_CASE_STUDY.intro.image;

const RiptydePage = () => (
  <>
    <Seo
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      type='article'
      ogImage={OG_IMAGE.src}
      ogImageAlt={OG_IMAGE.alt}
      ogImageWidth={3456}
      ogImageHeight={1944}
      jsonLd={[
        creativeWorkJsonLd({ name: TITLE, description: DESCRIPTION, path: PATH, image: OG_IMAGE.src }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: TITLE, path: PATH },
        ]),
      ]}
    />
    <CaseStudyPage study={RIPTYDE_CASE_STUDY} />
  </>
);

export default RiptydePage;
