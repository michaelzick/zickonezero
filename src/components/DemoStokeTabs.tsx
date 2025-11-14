import { forwardRef } from 'react';
import { HomeTabButton, DemoStokeTabsBar } from '../../styles';

type TabConfig = {
  key: string;
  label: string;
};

type DemoStokeTabsProps = {
  tabs: TabConfig[];
  activeTab: string;
  onTabClick: (tabKey: string) => void;
};

const DemoStokeTabs = forwardRef<HTMLDivElement, DemoStokeTabsProps>(({
  tabs,
  activeTab,
  onTabClick
}, ref) => {
  return (
    <DemoStokeTabsBar ref={ref} role='tablist' aria-label='Page sections'>
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
    </DemoStokeTabsBar>
  );
});

DemoStokeTabs.displayName = 'DemoStokeTabs';

export default DemoStokeTabs;
