import { configureStore } from "@reduxjs/toolkit";
import itemsListSlice from "./itemsSlice";

const todoStore = configureStore({
  reducer: {
    itemsList: itemsListSlice.reducer,
  },
});

export default todoStore;
