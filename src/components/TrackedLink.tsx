import Link from 'next/link';
import type { AriaAttributes, MouseEvent, ReactNode } from 'react';

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
  /** Marks the link for the page being viewed. */
  ariaCurrent?: AriaAttributes['aria-current'];
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
  ariaCurrent,
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
      <Link
        href={href}
        className={className}
        tabIndex={tabIndex}
        aria-current={ariaCurrent}
        onClick={handleClick}
      >
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
      aria-current={ariaCurrent}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default TrackedLink;
