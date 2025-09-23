import Link from 'next/link';

import { WorksData } from '../types';
import { Thumb } from '../../styles';
import { NewTabSVG } from './svg/NewTab';
import { ReactElement } from 'react';

type AdditionalThumbProps = {
  index: number,
  onThumbClick: Function;
  link?: string;
  linkOut?: boolean;
};

const Thumbnail = (props: WorksData & AdditionalThumbProps): ReactElement => {
  const { imgs, group, link, linkOut, thumb, header, desc, index, onThumbClick } = props;

  return (
    <Thumb onClick={() => onThumbClick(index)}>
      {imgs && link ?
        <Link href={link || `/${group}`}
          target={linkOut ? '_blank' : '_self'} rel={linkOut ? 'noopener noreferrer' : undefined}>
          <img src={thumb} width='240' height='240' alt={group} className='thumb' />
        </Link> :
        <img src={thumb} width='240' height='240' alt={group} className='thumb' />}

      <h3>{header}</h3>

      <p>
        {desc}
        {linkOut ? (
          <span className='external-link-icon' aria-hidden='true'>
            <NewTabSVG />
          </span>
        ) : null}
      </p>
    </Thumb>
  );
};

export default Thumbnail;
