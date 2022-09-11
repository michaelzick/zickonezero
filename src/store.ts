import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import worksReducer from './worksDataSlice';

export const store = configureStore({
  reducer: {
    data: worksReducer
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
