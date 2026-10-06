import Head from 'next/head';

import { useThemePreference } from './ThemeContext';
import { THEME_COLORS } from './themeConfig';

/** Keeps the browser chrome color in step with the city's time of day. */
const ThemeColorMeta = () => {
  const { resolved } = useThemePreference();

  return (
    <Head>
      <meta name='theme-color' key='theme-color' content={THEME_COLORS[resolved]} />
    </Head>
  );
};

export default ThemeColorMeta;
