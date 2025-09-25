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

const DemoStokeTabs = ({ tabs, activeTab, onTabClick }: DemoStokeTabsProps) => {
  return (
    <DemoStokeTabsBar role='tablist' aria-label='Page sections'>
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
};

export default DemoStokeTabs;
