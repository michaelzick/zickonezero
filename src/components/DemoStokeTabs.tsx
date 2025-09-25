import styled from 'styled-components';
import { THEME } from '../../styles/theme';
import { HomeTabButton } from '../../styles';

type TabConfig = {
  key: string;
  label: string;
};

type DemoStokeTabsProps = {
  tabs: TabConfig[];
  activeTab: string;
  onTabClick: (tabKey: string) => void;
};

// Create styled components directly in this file to ensure they work
const StyledTabsBar = styled.div`
  position: fixed;
  top: 5em;
  left: 0;
  right: 0;
  display: flex;
  gap: 0.6em;
  padding: 0.4em 1em 0.45em;
  z-index: 95;
  background: transparent;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    top: 4.9em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    top: 8.48em;
  }
`;

const DemoStokeTabs = ({ tabs, activeTab, onTabClick }: DemoStokeTabsProps) => {
  return (
    <StyledTabsBar role='tablist' aria-label='Page sections'>
      {tabs.map((tab) => (
        <HomeTabButton
          key={tab.key}
          type="button"
          aria-selected={activeTab === tab.key}
          role='tab'
          aria-controls={`${tab.key}-content`}
          tabIndex={activeTab === tab.key ? 0 : -1}
          data-active={activeTab === tab.key ? 'true' : 'false'}
          $isActive={activeTab === tab.key}
          onClick={() => onTabClick(tab.key)}
        >
          {tab.label}
        </HomeTabButton>
      ))}
    </StyledTabsBar>
  );
};

export default DemoStokeTabs;
