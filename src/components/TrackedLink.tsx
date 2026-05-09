import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

import { trackLinkClick } from '../lib/analytics';

type TrackedLinkProps = {
  href: string;
  label: string;
  location: string;
  section?: string;
  variant?: 'desktop' | 'mobile';
  className?: string;
  target?: string;
  rel?: string;
  tabIndex?: number;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const TrackedLink = ({
  href,
  label,
  location,
  section,
  variant,
  className,
  target,
  rel,
  tabIndex,
  children,
  onClick,
}: TrackedLinkProps) => {
  const isInternal = href.startsWith('/') && !href.startsWith('//');
  const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackLinkClick({
      location,
      label,
      href,
      section,
      variant,
      pagePath: window.location.pathname,
    });
    onClick?.(event);
  };

  if (isInternal && (!target || target === '_self')) {
    return (
      <Link href={href} className={className} tabIndex={tabIndex} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel={resolvedRel}
      className={className}
      tabIndex={tabIndex}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default TrackedLink;
