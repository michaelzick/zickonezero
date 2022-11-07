import {
  createSlice,
} from '@reduxjs/toolkit';
import type { RootState } from './store';

import type { ShowMobileMenuType } from './types';

const initialState: ShowMobileMenuType = {
  isMobileMenuShown: false
};

export const showMobileMenuSlice = createSlice({
  name: 'toggleMobileMenu',
  initialState,
  reducers: {
    showMobileMenu: (state, action) => {
      state.isMobileMenuShown = action.payload;
    },
  },
});

export const { showMobileMenu } = showMobileMenuSlice.actions;

export const getMobileMenuState = (state: RootState) => state.isMobileMenuShown;

export default showMobileMenuSlice.reducer;
