import { THEME } from '../styles/theme';

describe('city layering', () => {
  it('keeps every layer at or above z-index 0', () => {
    // A fixed GPU layer at a negative z-index made WebKit split each page into
    // three page-sized layers, enough to crash an iPhone tab.
    expect(Math.min(...Object.values(THEME.z))).toBeGreaterThanOrEqual(0);
  });

  it('stacks the page above the weather and the weather above the sky', () => {
    expect(THEME.z.content).toBeGreaterThan(THEME.z.weather);
    expect(THEME.z.weather).toBeGreaterThan(THEME.z.sky);
  });
});
