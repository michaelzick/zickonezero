const TAB_THEME_VARIABLES = {
  '--color-darkGreen': '#0c4a6e',
  '--color-demostoke': '#00dff7',
  '--case-study-top-tab-bg': 'rgba(2, 8, 23, 0.78)',
  '--case-study-top-tab-border': 'rgba(255, 255, 255, 0.32)',
  '--case-study-top-tab-color': '#ffffff',
  '--section-tab-bg': 'transparent',
  '--section-tab-border': '#ffffff',
  '--section-tab-color': '#ffffff',
} as const;

export const ACTIVE_TAB_DECLARATION = 'var(--color-darkGreen)';
export const ACTIVE_TAB_TEXT_DECLARATION = '#fff';
export const DEMOSTOKE_TAB_DECLARATION = 'var(--color-demostoke)';

export const applyTabThemeVariables = () => {
  const rootStyle = document.documentElement.style;

  Object.entries(TAB_THEME_VARIABLES).forEach(([name, value]) => {
    rootStyle.setProperty(name, value);
  });
};

export const clearTabThemeVariables = () => {
  const rootStyle = document.documentElement.style;

  Object.keys(TAB_THEME_VARIABLES).forEach((name) => {
    rootStyle.removeProperty(name);
  });
};

const collectStyleRules = (ruleList: CSSRuleList): CSSStyleRule[] => {
  const styleRules: CSSStyleRule[] = [];

  Array.from(ruleList).forEach((rule) => {
    if (rule instanceof CSSStyleRule) {
      styleRules.push(rule);
      return;
    }

    if ('cssRules' in rule) {
      styleRules.push(...collectStyleRules(rule.cssRules));
    }
  });

  return styleRules;
};

export const getMatchingRuleValues = (element: HTMLElement, property: string) => {
  const values = new Set<string>();

  Array.from(document.styleSheets).forEach((sheet) => {
    let rules: CSSRuleList;

    try {
      rules = sheet.cssRules;
    } catch {
      return;
    }

    collectStyleRules(rules).forEach((rule) => {
      try {
        if (!element.matches(rule.selectorText)) {
          return;
        }
      } catch {
        return;
      }

      const value = rule.style.getPropertyValue(property).trim();
      if (value) {
        values.add(value);
      }
    });
  });

  return [...values];
};
