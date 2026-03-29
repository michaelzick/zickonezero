import { configureStore } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactElement, PropsWithChildren } from 'react';

import worksReducer from '../worksDataSlice';
import showMobileMenuReducer from '../showMobileMenuSlice';
import type { RootState } from '../store';
import { AppThemeProvider } from '../theme/ThemeContext';

export const createTestStore = (preloadedState?: RootState) => {
  return configureStore({
    reducer: {
      data: worksReducer,
      isMobileMenuShown: showMobileMenuReducer,
    },
    preloadedState,
  });
};

type ExtendedRenderOptions = Omit<RenderOptions, 'queries'> & {
  preloadedState?: RootState;
};

export const renderWithProviders = (
  ui: ReactElement,
  { preloadedState, ...renderOptions }: ExtendedRenderOptions = {}
) => {
  const store = createTestStore(preloadedState);

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <AppThemeProvider>{children}</AppThemeProvider>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
