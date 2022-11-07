import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import worksReducer from './worksDataSlice';
import showMobileMenuReducer from './showMobileMenuSlice';

export const store = configureStore({
  reducer: {
    data: worksReducer,
    isMobileMenuShown: showMobileMenuReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
