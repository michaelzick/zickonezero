import { ReactElement } from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';

import { useThemePreference, ThemeOption } from '../theme/ThemeContext';
import {
  ThemeSwitcherWrapper,
  ThemeSwitcherTrigger,
  ThemeSwitcherValue,
  ThemeSwitcherContent,
  ThemeSwitcherViewport,
  ThemeSwitcherItem,
  ThemeSwitcherIndicator,
} from '../../styles';

type ThemeOptionMeta = {
  value: ThemeOption;
  label: string;
};

const OPTIONS: ThemeOptionMeta[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const ThemeSwitcher = (): ReactElement => {
  const { preference, setPreference } = useThemePreference();

  return (
    <ThemeSwitcherWrapper className="theme-switcher">
      <Select.Root value={preference} onValueChange={(value) => setPreference(value as ThemeOption)}>
        <ThemeSwitcherTrigger aria-label="Theme">
          <ThemeSwitcherValue />
        </ThemeSwitcherTrigger>
        <Select.Portal>
          <ThemeSwitcherContent sideOffset={6} align="start">
            <ThemeSwitcherViewport>
              {OPTIONS.map(({ value, label }) => (
                <ThemeSwitcherItem key={value} value={value}>
                  <Select.ItemText>{label}</Select.ItemText>
                  <ThemeSwitcherIndicator>
                    <CheckIcon />
                  </ThemeSwitcherIndicator>
                </ThemeSwitcherItem>
              ))}
            </ThemeSwitcherViewport>
          </ThemeSwitcherContent>
        </Select.Portal>
      </Select.Root>
    </ThemeSwitcherWrapper>
  );
};

export default ThemeSwitcher;
