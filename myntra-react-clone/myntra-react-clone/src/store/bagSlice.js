import { createSlice } from "@reduxjs/toolkit";

const bagSlice = createSlice({
  name: "bag",
  initialState: [],
  reducers: {
    initialBagItems: (state, action) => {
      console.log(action);
      return action.payload ?? [];
    },
    addBagItems: (state, action) => {
      state.push(action.payload);
      console.log(action.payload);
    },
    removeFromBag: (state, action) => {
      return state.filter((itemId) => itemId !== action.payload);
    },
  },
});

export const bagActions = bagSlice.actions;

export default bagSlice;
