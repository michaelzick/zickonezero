/**
 * Builds a srcset from smaller copies saved beside an image as
 * `<name>-<width>w.webp` (made with sharp from the original), with the
 * original itself as the widest candidate.
 */
export const widthSrcSet = (src: string, copyWidths: readonly number[], naturalWidth: number): string => copyWidths
  .map((width) => `${src.replace(/\.webp$/, `-${width}w.webp`)} ${width}w`)
  .concat(`${src} ${naturalWidth}w`)
  .join(', ');

/** Each opening hero image has a copy at every one of these widths narrower than itself. */
export const HERO_COPY_WIDTHS: readonly number[] = [640, 960, 1440, 1920];

/**
 * The natural widths of the pages' opening hero images. Most are 2x desktop
 * captures over 3000px wide, so phones would otherwise download several
 * hundred kilobytes before their largest paint.
 */
export const HERO_IMAGE_WIDTHS: Readonly<Record<string, number>> = {
  '/img/antisyphon/home.webp': 3411,
  '/img/demostoke/case-study/ds-hero-surf.webp': 3456,
  '/img/fleet-ops/ds-fleet-ops-gear-edit.webp': 3456,
  '/img/nice-guy-university/ngu-home.webp': 3456,
  '/img/projects/12-step-meetings/12-step-meetings-hybrid.webp': 3456,
  '/img/projects/adam-chiappone/ac-home-cropped.webp': 3456,
  '/img/projects/bars-of-sand/bars-of-sand-hero.webp': 3456,
  '/img/projects/fyfs/fyfs-wave.webp': 1536,
  '/img/projects/riptyde/riptyde-hero.webp': 1284,
  '/img/projects/timefraim/timefraim-planner.webp': 3456,
};

/**
 * How wide an opening hero image renders: nearly the screen's width up to the
 * large-tablet breakpoint (1137px), then the hero's 61vw column, at most 995px.
 */
export const HERO_IMAGE_SIZES = '(max-width: 1137px) 94vw, (max-width: 1632px) 61vw, 995px';

/** An opening hero image's srcset and sizes, or neither for an image without copies. */
export const heroImageSources = (src: string): { srcSet?: string; sizes?: string } => {
  const naturalWidth = HERO_IMAGE_WIDTHS[src];
  if (!naturalWidth) return {};

  return {
    srcSet: widthSrcSet(src, HERO_COPY_WIDTHS.filter((width) => width < naturalWidth), naturalWidth),
    sizes: HERO_IMAGE_SIZES,
  };
};
