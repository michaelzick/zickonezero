import { CSSProperties, ReactElement, useRef } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import { DistrictTone, WorksData } from '../types';
import { GigCard } from '../../styles/district';
import usePointerTilt from '../hooks/usePointerTilt';
import { trackEvent } from '../lib/analytics';
import TrackedLink from './TrackedLink';

type AdditionalThumbProps = {
  index: number,
  onThumbClick: Function;
  link?: string;
  linkOut?: boolean;
  /** The district's neon; without one the card takes the city accent. */
  tone?: DistrictTone;
  /** The status chip, such as "Live". */
  status?: string;
  /** The card's number within its district, shown as GIG // 07. */
  gigNumber?: number;
  /** The card's place in its grid's boot-in stagger, from 0. */
  order?: number;
  /** True when clicking the card opens its screenshots in the lightbox. */
  opensGallery?: boolean;
};

/**
 * A gig card: a notched glass panel with a scanlined thumbnail. Linked cards
 * link their image, title, and description; gallery cards open the lightbox
 * from a click anywhere on the card or from their View gallery button.
 */
const Thumbnail = (props: WorksData & AdditionalThumbProps): ReactElement => {
  const {
    imgs, group, link, linkOut, thumb, header, desc, index, onThumbClick,
    tone, status, gigNumber, order = 0, opensGallery = false,
  } = props;
  const cardRef = useRef<HTMLDivElement | null>(null);
  usePointerTilt(cardRef);

  const href = link || `/${group}`;
  const target = linkOut ? '_blank' : '_self';
  const rel = linkOut ? 'noopener noreferrer' : undefined;

  const handleThumbClick = () => {
    trackEvent('project_card_click', {
      location: 'project_grid',
      project_group: group,
      project_title: header,
      card_index: index,
      link_url: href,
      link_external: Boolean(linkOut),
      page_path: window.location.pathname,
    });
    onThumbClick(index, linkOut);
  };

  const image = <img src={thumb} width='240' height='240' alt={header} loading='lazy' decoding='async' />;

  return (
    <GigCard
      ref={cardRef}
      className='gig'
      $tone={tone}
      data-gallery={opensGallery ? '' : undefined}
      style={{ '--gig-i': order } as CSSProperties}
      onClick={handleThumbClick}
    >
      <div className='gig-media' style={{ '--thumb': `url("${thumb}")` } as CSSProperties}>
        {imgs && link ? (
          <TrackedLink
            href={href}
            label={header}
            location='project_grid'
            section='thumbnail_image'
            target={target}
            rel={rel}
          >
            {image}
          </TrackedLink>
        ) : image}
        <span className='gig-scan' aria-hidden='true' />
        {gigNumber !== undefined && (
          <span className='gig-tag' aria-hidden='true'>Gig // {String(gigNumber).padStart(2, '0')}</span>
        )}
        {status && <span className='gig-status' aria-hidden='true'>{status}</span>}
      </div>

      <h3>
        {link ? (
          <TrackedLink
            href={href}
            label={header}
            location='project_grid'
            section='thumbnail_title'
            target={target}
            rel={rel}
          >
            {header}
          </TrackedLink>
        ) : header}
      </h3>

      <p>
        {link ? (
          <TrackedLink
            href={href}
            label={header}
            location='project_grid'
            section='thumbnail_description'
            target={target}
            rel={rel}
          >
            {desc}
          </TrackedLink>
        ) : desc}
        {linkOut ? (
          <span className='external-link-icon' aria-hidden='true'>
            <OpenInNewWindowIcon />
          </span>
        ) : null}
      </p>

      {/* The click bubbles to the card, which tracks it and opens the lightbox. */}
      {opensGallery && (
        <button type='button' className='gig-gallery'>
          View gallery<span className='vh'> for {header}</span>
        </button>
      )}
    </GigCard>
  );
};

export default Thumbnail;
