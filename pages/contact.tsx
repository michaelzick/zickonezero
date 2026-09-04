import ContactContent from '../src/components/ContactContent';
import Seo from '../src/components/Seo';
import { breadcrumbJsonLd } from '../src/lib/seo';

const PATH = '/contact/';
const TITLE = 'Contact';
const DESCRIPTION = 'Get in touch with Michael Zick / ZICKONEZERO Creative about product, UX, and engineering work.';

const ContactPage = () => (
  <>
    <Seo
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      jsonLd={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: TITLE, path: PATH },
      ])}
    />
    <ContactContent />
  </>
);

export default ContactPage;
