import Link from 'next/link';
import { ReactElement } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import { WorksData } from '../types';
import { Thumb } from '../../styles';

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

      <h3>{link ? <Link href={link || `/${group}`} target={linkOut ? '_blank' : '_self'} rel={linkOut ? 'noopener noreferrer' : undefined}>
        {header}</Link> : header}
      </h3>

      <p>
        {link ? <Link href={link || `/${group}`} target={linkOut ? '_blank' : '_self'} rel={linkOut ? 'noopener noreferrer' : undefined}>
          {desc}</Link> : desc}
        {linkOut ? (
          <span className='external-link-icon' aria-hidden='true'>
            <OpenInNewWindowIcon />
          </span>
        ) : null}
      </p>
    </Thumb>
  );
};

export default Thumbnail;
