import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import {
  DemoStokeTldrCopy
} from '../../../../styles';
import { CaseStudySectionTitle } from '../../../../styles/projectShowcases';

const LinksSection = () => (
  <section id='section-links' className='story-section'>
    <CaseStudySectionTitle as='h2'>Links</CaseStudySectionTitle>
    <DemoStokeTldrCopy>
      <a href='https://www.antisyphontraining.com/' target='_blank' rel='noopener noreferrer'>
        AntisyphonTraining.com <OpenInNewWindowIcon aria-hidden='true' />
      </a>
    </DemoStokeTldrCopy>
  </section>
);

export default LinksSection;
