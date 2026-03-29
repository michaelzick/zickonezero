import { DemoStokeTldrCopy } from '../../../../styles';
import { CaseStudySectionTitle } from '../../../../styles/projectShowcases';

const ContextSection = () => (
  <section className='story-section'>
    <CaseStudySectionTitle as='h2'>Context</CaseStudySectionTitle>
    <DemoStokeTldrCopy>
      These product views stay tied to the same live course, on-demand, checkout, and operations patterns documented in the
      Antisyphon UX case study. The desktop shell now mirrors the showcase pages, but the underlying screen content and
      lightbox interactions remain unchanged.
    </DemoStokeTldrCopy>
  </section>
);

export default ContextSection;
