import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    increment: (state) => {
      return state + 1;
    },
    decrement: (state) => {
      return state - 1;
    },
    plus: (state, action) => {
      return state + Number(action.payload);
    },
    minus: (state, action) => {
      return state - Number(action.payload);
    },
  },
});

export const counterActions = counterSlice.actions;
export default counterSlice;
