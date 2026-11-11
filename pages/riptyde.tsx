import CaseStudyPage from '../src/components/caseStudy/CaseStudyPage';
import { RIPTYDE_CASE_STUDY } from '../src/components/riptyde/caseStudyData';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd, softwareApplicationJsonLd } from '../src/lib/seo';

const TITLE = 'Riptyde: Surf Forecast App for iOS and the Web';
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
        softwareApplicationJsonLd({
          name: 'Riptyde',
          description: DESCRIPTION,
          path: PATH,
          appUrl: 'https://riptyde.app/',
          downloadUrl: 'https://apps.apple.com/us/app/riptyde/id6793336480',
          applicationCategory: 'SportsApplication',
          operatingSystem: 'iOS, Web',
          image: OG_IMAGE.src,
        }),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Riptyde', path: PATH },
        ]),
      ]}
    />
    <CaseStudyPage study={RIPTYDE_CASE_STUDY} />
  </>
);

export default RiptydePage;
