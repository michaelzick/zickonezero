import Image from 'next/image';

import { WorksData } from '../types';
import { Thumb } from '../../styles';
import { ReactElement } from 'react';

type AdditionalThumbProps = {
  index: number,
  returnVoid?: boolean,
  onThumbClick: Function;
};

const Thumbnail = (props: WorksData & AdditionalThumbProps): ReactElement => {
  const { imgs, group, thumb, header, desc, index, onThumbClick, returnVoid } = props;

  return (
    <Thumb onClick={() => onThumbClick(index, returnVoid)}>
      {imgs && returnVoid ?
        <a href='https://www.antisyphontraining.com' target='_blank' rel='noreferrer'>
          <Image src={thumb} width='240' height='240' alt={group} className='thumb' />
        </a> :
        <Image src={thumb} width='240' height='240' alt={group} className='thumb' />}

      <h3>{header}</h3>

      <p>{desc}</p>
    </Thumb>
  );
};

export default Thumbnail;
