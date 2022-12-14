import {
  createSlice,
} from '@reduxjs/toolkit';
import type { RootState } from './store';

import type { WorksDataType } from '../src/types';

const initialState: WorksDataType = {
  worksDataReversed: []
};

export const worksDataSlice = createSlice({
  name: 'data',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions.
  // In this example, 'increment', 'decrement' and 'incrementByAmount' are actions. They can be triggered from outside this slice, anywhere in the app.
  // So for example, if we make a dispatch to the 'increment' action here from the index page, it will get triggered and change the value of the state from 0 to 1.
  reducers: {
    setPageData: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers.
      // It doesn't actually mutate the state because it uses the Immer library, which detects changes to a "draft state" and produces a brand new immutable state based off those changes
      state.worksDataReversed = action.payload;
    },
  },
});
// Here we are just exporting the actions from this slice, so that we can call them anywhere in our app.
export const { setPageData } = worksDataSlice.actions;

// calling the above actions would be useless if we could not access the data in the state. So, we use something called a selector which allows us to select a value from the state.
export const selectData = (state: RootState) => state.data;

// exporting the reducer here, as we need to add this to the store
export default worksDataSlice.reducer;
