import { type SidebarSectionConfig } from '../SidebarSectionTabs';
import { type CaseStudyData } from './types';

// The same section nav as Nice Guy University's case study.
export const CASE_STUDY_SECTIONS: SidebarSectionConfig[] = [
  { id: 'hero-spacer', label: 'Intro Spacer', hidden: true },
  { id: 'section-the-what', label: 'The What' },
  { id: 'section-the-how', label: 'The How' },
  { id: 'section-the-who', label: 'The Who' },
  { id: 'section-methodology', label: 'Methods' }
];

export const CASE_STUDY_BOTTOM_SECTION_ID = CASE_STUDY_SECTIONS[CASE_STUDY_SECTIONS.length - 1]?.id;

export const screenSections = (study: CaseStudyData): SidebarSectionConfig[] => [
  { id: 'screens-introduction', label: 'Intro', hidden: true },
  ...study.screens.blocks.map(({ id, title, navLabel }) => ({ id, label: navLabel ?? title }))
];
