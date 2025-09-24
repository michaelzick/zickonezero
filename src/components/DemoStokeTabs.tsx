import styled from 'styled-components';
import { THEME } from '../../styles/theme';

type TabConfig = {
  key: string;
  label: string;
};

type DemoStokeTabsProps = {
  tabs: TabConfig[];
  activeTab: string;
  onTabClick: (tabKey: string) => void;
};

type StyledTabButtonProps = {
  $isActive: boolean;
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

const StyledTabButton = styled.button.attrs<StyledTabButtonProps>(({ $isActive }: StyledTabButtonProps) => ({
  'data-active': $isActive ? 'true' : 'false',
})) <StyledTabButtonProps>`
  all: unset;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75em 1em 0.65em;
  border-radius: 10px;
  font-family: Roboto, sans-serif;
  font-size: 1.05em;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  background-color: ${(props: StyledTabButtonProps) => props.$isActive ? THEME.colors.hotYellow : THEME.colors.darkGreen};
  color: ${(props: StyledTabButtonProps) => props.$isActive ? THEME.colors.contrast : THEME.colors.white};
  box-shadow: ${(props: StyledTabButtonProps) => props.$isActive ? '0 8px 20px rgba(0, 0, 0, 0.25)' : '0 8px 20px rgba(0, 0, 0, 0.15)'};

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotYellow};
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const DemoStokeTabs = ({ tabs, activeTab, onTabClick }: DemoStokeTabsProps) => {
  return (
    <StyledTabsBar role='tablist' aria-label='Page sections'>
      {tabs.map((tab) => (
        <StyledTabButton
          key={tab.key}
          type="button"
          aria-selected={activeTab === tab.key}
          role='tab'
          aria-controls={`${tab.key}-content`}
          tabIndex={activeTab === tab.key ? 0 : -1}
          $isActive={activeTab === tab.key}
          onClick={() => onTabClick(tab.key)}
        >
          {tab.label}
        </StyledTabButton>
      ))}
    </StyledTabsBar>
  );
};

export default DemoStokeTabs;
