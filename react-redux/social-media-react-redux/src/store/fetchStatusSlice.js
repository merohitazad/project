import { createSlice } from "@reduxjs/toolkit";

const fetchStatusSlice = createSlice({
  name: "fetchStatus",
  initialState: {
    currentlyFetching: true,
  },
  reducers: {
    markFetchingFinished: (state) => {
      state.currentlyFetching = false;
    },
  },
});

export const fetchStatusActions = fetchStatusSlice.actions;

export default fetchStatusSlice;
