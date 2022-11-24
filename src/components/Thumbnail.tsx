import Image from 'next/image';

import { WorksData } from '../types';
import { Thumb } from '../../styles';

type AdditionalThumbProps = {
  index: number,
  onThumbClick: Function;
};

const Thumbnail = (props: WorksData & AdditionalThumbProps) => {
  const { imgs, group, thumb, header, desc, index, onThumbClick } = props;

  return (
    <Thumb onClick={() => onThumbClick(index)}>
      {imgs && <Image src={thumb} width='240' height='240' alt={group} className='thumb' />}

      <h3>{header}</h3>

      <p>{desc}</p>
    </Thumb>
  );
};

export default Thumbnail;
