import NightMarketContent from '../src/components/nightmarket/NightMarketContent';
import Seo from '../src/components/Seo';

/**
 * The hidden Night Market, reached from the sign in the homepage alley. It is
 * kept out of the sitemap and search results (see scripts/generate-sitemap.js)
 * so it stays something to find.
 */
const NightMarketPage = () => (
  <>
    <Seo
      title='Night Market'
      description='An after-hours stall in the ZICKONEZERO city, with a playable Rackloose modular synth on the counter.'
      path='/night-market/'
      noIndex
    />
    <NightMarketContent />
  </>
);

export default NightMarketPage;
