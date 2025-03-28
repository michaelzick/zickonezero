import Image from 'next/image';
import Link from 'next/link';

import { WorksData } from '../types';
import { Thumb } from '../../styles';
import { ReactElement } from 'react';

type AdditionalThumbProps = {
  index: number,
  squareLinkOut?: boolean,
  onThumbClick: Function;
};

const Thumbnail = (props: WorksData & AdditionalThumbProps): ReactElement => {
  const { imgs, group, thumb, header, desc, index, onThumbClick, squareLinkOut } = props;

  return (
    <Thumb onClick={() => onThumbClick(index, squareLinkOut)}>
      {imgs && squareLinkOut ?
        <Link href='/product-and-engineering'>
          <Image src={thumb} width='240' height='240' alt={group} className='thumb' />
        </Link> :
        <Image src={thumb} width='240' height='240' alt={group} className='thumb' />}

      <h3>{header}</h3>

      <p>{desc}</p>
    </Thumb>
  );
};

export default Thumbnail;
