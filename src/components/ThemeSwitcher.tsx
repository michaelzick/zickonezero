import { ReactElement } from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import styled from 'styled-components';

import { useThemePreference, ThemeOption } from '../theme/ThemeContext';
import { THEME } from '../../styles/theme';

type ThemeOptionMeta = {
  value: ThemeOption;
  label: string;
};

const OPTIONS: ThemeOptionMeta[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const Trigger = styled(Select.Trigger)`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35em;
  min-width: 0;
  padding: 0 0.75em;
  border-radius: 6px;
  border: 1px solid ${THEME.colors.grey};
  color: ${THEME.colors.white};
  background-color: transparent;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;

  &:hover,
  &[data-state='open'] {
    border-color: ${THEME.colors.hotRed};
    color: ${THEME.colors.hotRed};
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotRed};
    outline-offset: 2px;
  }
`;

const Value = styled(Select.Value)`
  flex: 0 1 auto;
  text-transform: capitalize;
`;

const Icon = styled(Select.Icon)`
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
`;

const Content = styled(Select.Content)`
  overflow: hidden;
  background-color: ${THEME.colors.darkest};
  color: ${THEME.colors.white};
  border-radius: 10px;
  border: 1px solid ${THEME.colors.grey};
  box-shadow: 0 18px 45px rgba(5, 5, 15, 0.35);
  z-index: 400;
`;

const Viewport = styled(Select.Viewport)`
  padding: 0.25em 0;
`;

const Item = styled(Select.Item)`
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.45em 1.1em;
  font-size: 1em;
  cursor: pointer;
  user-select: none;
  color: ${THEME.colors.white};
  transition: background-color 0.2s ease, color 0.2s ease;

  &[data-highlighted] {
    outline: none;
    background-color: ${THEME.colors.hotRed};
    color: ${THEME.colors.contrast};
  }
`;

const Indicator = styled(Select.ItemIndicator)`
  margin-left: auto;
  display: inline-flex;
  color: inherit;
`;

const SwitcherWrapper = styled.div`
  display: inline-flex;
`;

const ThemeSwitcher = (): ReactElement => {
  const { preference, setPreference } = useThemePreference();

  return (
    <SwitcherWrapper className="theme-switcher">
      <Select.Root value={preference} onValueChange={(value) => setPreference(value as ThemeOption)}>
        <Trigger aria-label="Theme">
          <Value />
          <Icon>
            <ChevronDownIcon />
          </Icon>
        </Trigger>
        <Select.Portal>
          <Content sideOffset={6} align="start">
            <Viewport>
              {OPTIONS.map(({ value, label }) => (
                <Item key={value} value={value}>
                  <Select.ItemText>{label}</Select.ItemText>
                  <Indicator>
                    <CheckIcon />
                  </Indicator>
                </Item>
              ))}
            </Viewport>
          </Content>
        </Select.Portal>
      </Select.Root>
    </SwitcherWrapper>
  );
};

export default ThemeSwitcher;
