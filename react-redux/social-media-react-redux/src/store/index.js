import { configureStore } from "@reduxjs/toolkit";
import postListSlice from "./postListSlice";
import fetchStatusSlice from "./fetchStatusSlice";

const socialMediaStore = configureStore({
  reducer: {
    postList: postListSlice.reducer,
    fetchStatus: fetchStatusSlice.reducer,
  },
});

export default socialMediaStore;
