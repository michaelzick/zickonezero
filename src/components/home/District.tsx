import type { ReactNode, Ref } from 'react';

import { DistrictSection, DistrictSign } from '../../../styles/district';
import type { DistrictTone } from '../../types';

type Props = {
  tone: DistrictTone;
  /** The district's number on its sign, from 1. */
  number: number;
  title: string;
  headingId: string;
  /** The decorative Japanese street name. */
  japanese: string;
  /** The tally on the sign, such as 3 "Case files". */
  readout: { count: number; unit: string };
  sectionRef?: Ref<HTMLElement>;
  children: ReactNode;
};

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * A homepage district: a neon street sign over its grid of gigs. The h2 is the
 * real heading; the number, the kicker with its Japanese street name, and the
 * readout are decoration that assistive tech skips.
 */
const District = ({ tone, number, title, headingId, japanese, readout, sectionRef, children }: Props) => (
  <DistrictSection ref={sectionRef} $tone={tone} data-district={tone}>
    <DistrictSign>
      <p className='district-no' aria-hidden='true'>{pad(number)}</p>
      <p className='district-kicker' aria-hidden='true'>
        District {pad(number)}
        <span lang='ja'>{japanese}</span>
      </p>
      <h2 id={headingId}>{title}</h2>
      <p className='district-readout' aria-hidden='true'>
        <b>{pad(readout.count)}</b>
        {readout.unit}
      </p>
    </DistrictSign>
    {children}
  </DistrictSection>
);

export default District;
