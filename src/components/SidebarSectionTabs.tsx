import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { useSize } from '@radix-ui/react-use-size';

import {
  SectionTabsWrapper,
  SectionTabButton,
  SectionTabsMobileWrapper,
  SectionTabsMobileInner,
  SectionTabsMobileButton
} from '../../styles';

const DETECTION_BUFFER = 20;
const DEFAULT_STICKY_TOP = 160;

export type SidebarSectionConfig = {
  id: string;
  label: string;
  hidden?: boolean;
};

type SidebarSectionTabsProps = {
  sections: SidebarSectionConfig[];
  topTabsEl: HTMLDivElement | null;
  isActive: boolean;
  lockToBottomSectionId?: string;
  fallbackStickyTop?: number;
  scrollOffsetAdjustment?: number;
  isFixed?: boolean;
  mobileTopAdjustment?: number;
};

type SectionTabsHookParams = SidebarSectionTabsProps & {
  extraOffset?: number;
};

type SectionTabsHookResult = {
  stickyTop: number;
  activeSection: string;
  handleTabClick: (sectionId: string) => void;
};

const useSectionTabs = ({
  sections,
  topTabsEl,
  isActive,
  lockToBottomSectionId,
  extraOffset = 0,
  fallbackStickyTop = DEFAULT_STICKY_TOP,
  scrollOffsetAdjustment = 0
}: SectionTabsHookParams): SectionTabsHookResult => {
  const [stickyTop, setStickyTop] = useState(fallbackStickyTop);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const topTabsSize = useSize(topTabsEl);

  const getResolvedStickyTop = useCallback(() => {
    if (!topTabsEl) {
      return fallbackStickyTop;
    }

    const computedStyle = window.getComputedStyle(topTabsEl);
    const topValue = parseFloat(computedStyle.top) || 0;
    return topValue + topTabsEl.offsetHeight;
  }, [topTabsEl, fallbackStickyTop]);

  const getTotalOffset = useCallback(() => {
    return getResolvedStickyTop() + extraOffset + scrollOffsetAdjustment;
  }, [getResolvedStickyTop, extraOffset, scrollOffsetAdjustment]);

  const updateStickyTop = useCallback(() => {
    setStickyTop(getResolvedStickyTop());
  }, [getResolvedStickyTop]);

  useEffect(() => {
    updateStickyTop();
  }, [updateStickyTop, topTabsSize?.height, fallbackStickyTop]);

  useEffect(() => {
    const handleResize = () => updateStickyTop();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateStickyTop]);

  const scrollToSection = useCallback((sectionId: string, behavior: ScrollBehavior = 'smooth') => {
    const sectionEl = document.getElementById(sectionId);
    if (!sectionEl) {
      return;
    }

    const totalOffset = getTotalOffset();
    const liveTop = sectionEl.getBoundingClientRect().top + window.scrollY;
    const targetPosition = liveTop - totalOffset;

    window.scrollTo({
      top: targetPosition,
      behavior
    });
  }, [getTotalOffset]);

  useEffect(() => {
    if (!isActive || !sections.length) {
      setActiveSection(sections[0]?.id ?? '');
      return;
    }

    const updateActiveSection = () => {
      const detectionOffset = getTotalOffset() + DETECTION_BUFFER;
      let currentSection = sections[0]?.id ?? '';

      sections.forEach(({ id }) => {
        const sectionEl = document.getElementById(id);
        if (!sectionEl) {
          return;
        }

        const { top } = sectionEl.getBoundingClientRect();
        if (top - detectionOffset <= 0) {
          currentSection = id;
        }
      });

      if (lockToBottomSectionId) {
        const doc = document.documentElement;
        const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= doc.scrollHeight - 2;

        if (isAtBottom) {
          currentSection = lockToBottomSectionId;
        }
      }

      setActiveSection((prev) => (prev === currentSection ? prev : currentSection));
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [isActive, sections, getTotalOffset, lockToBottomSectionId]);

  const handleTabClick = useCallback((sectionId: string) => {
    const clickedAt = performance.now();
    scrollToSection(sectionId, 'smooth');

    const rerunAfterLoad = () => {
      if (performance.now() - clickedAt > 1200) return;
      requestAnimationFrame(() => scrollToSection(sectionId, 'smooth'));
    };

    if (document.readyState !== 'complete') {
      window.addEventListener('load', rerunAfterLoad, { once: true });
    }

    const pendingImages = Array.from(
      document.querySelectorAll('.demostoke-inner img, .antisyphon-image, .product-screenshot img')
    ).filter((img): img is HTMLImageElement => img instanceof HTMLImageElement && !img.complete);

    if (pendingImages.length) {
      pendingImages.forEach((img) => img.addEventListener('load', rerunAfterLoad, { once: true }));
      // Fallback in case images load via lazy observers shortly after scroll starts.
      setTimeout(rerunAfterLoad, 450);
    }
  }, [scrollToSection]);

  return { stickyTop, activeSection, handleTabClick };
};

const SidebarSectionTabs = (props: SidebarSectionTabsProps) => {
  const {
    sections
  } = props;

  const { stickyTop, activeSection, handleTabClick } = useSectionTabs(props);
  const visibleSections = sections.filter(({ hidden }) => !hidden);

  if (!visibleSections.length) {
    return null;
  }

  return (
    <SectionTabsWrapper
      role='navigation'
      aria-label='Page sections'
      style={{ '--sidebar-tabs-top': `${stickyTop}px` } as CSSProperties}
    >
      {visibleSections.map(({ id, label }) => (
        <SectionTabButton
          key={id}
          type='button'
          $isActive={activeSection === id}
          aria-current={activeSection === id ? 'true' : undefined}
          onClick={() => handleTabClick(id)}
        >
          {label}
        </SectionTabButton>
      ))}
    </SectionTabsWrapper>
  );
};

export const SidebarSectionTabsMobile = (props: SidebarSectionTabsProps) => {
  const { sections, isFixed, mobileTopAdjustment = 0 } = props;
  const visibleSections = sections.filter(({ hidden }) => !hidden);
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);
  const wrapperSize = useSize(wrapperEl);
  const mobileExtraOffset = (wrapperSize?.height ?? wrapperEl?.offsetHeight ?? 0) + 10;
  const handleWrapperRef = useCallback((node: HTMLDivElement | null) => {
    setWrapperEl(node);
  }, []);
  const { stickyTop, activeSection, handleTabClick } = useSectionTabs({
    ...props,
    extraOffset: mobileExtraOffset
  });

  if (!visibleSections.length) {
    return null;
  }

  return (
    <SectionTabsMobileWrapper
      ref={handleWrapperRef}
      role='navigation'
      aria-label='Page sections'
      $isFixed={isFixed}
      style={{ '--mobile-tabs-top': `${stickyTop + mobileTopAdjustment}px` } as CSSProperties}
    >
      <SectionTabsMobileInner>
        {visibleSections.map(({ id, label }) => (
          <SectionTabsMobileButton
            key={id}
            type='button'
            $isActive={activeSection === id}
            aria-current={activeSection === id ? 'true' : undefined}
            onClick={() => handleTabClick(id)}
          >
            {label}
          </SectionTabsMobileButton>
        ))}
      </SectionTabsMobileInner>
    </SectionTabsMobileWrapper>
  );
};

export default SidebarSectionTabs;
