import BarFourContent from '../src/components/barfour/BarFourContent';
import Seo from '../src/components/Seo';

/**
 * Bar Four, the hidden club reached from the sign in the homepage alley. It
 * is kept out of the sitemap and search results (see
 * scripts/generate-sitemap.js) so it stays something to find.
 */
const BarFourPage = () => (
  <>
    <Seo
      title='Bar Four'
      description='A basement club under the ZICKONEZERO alley, with a playable Rackloose modular synth open in the booth.'
      path='/bar-four/'
      noIndex
    />
    <BarFourContent />
  </>
);

export default BarFourPage;
