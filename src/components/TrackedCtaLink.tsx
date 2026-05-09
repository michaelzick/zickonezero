import type { MouseEvent, ReactNode } from 'react';

import { trackEvent } from '../lib/analytics';
import TrackedLink from './TrackedLink';

type TrackedCtaLinkProps = {
  href: string;
  location: string;
  label: string;
  eventName?: string;
  className?: string;
  target?: string;
  rel?: string;
  section?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const resolveEventName = (href: string, label: string, eventName?: string) => {
  if (eventName) return eventName;
  if (/project|portfolio|case study/i.test(label)) return 'project_click';
  if (/contact|book|schedule|request|demo/i.test(label)) return 'cta_click';
  if (/^https?:\/\//i.test(href)) return 'external_project_click';
  return 'cta_click';
};

const TrackedCtaLink = ({
  href,
  location,
  label,
  eventName,
  className,
  target,
  rel,
  section = 'cta',
  children,
  onClick,
}: TrackedCtaLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(resolveEventName(href, label, eventName), {
      location,
      label,
      href,
      page_path: window.location.pathname,
    });
    onClick?.(event);
  };

  return (
    <TrackedLink
      href={href}
      label={label}
      location={location}
      section={section}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </TrackedLink>
  );
};

export default TrackedCtaLink;
