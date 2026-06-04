import { createSlice } from "@reduxjs/toolkit";

const postListSlice = createSlice({
  name: "postList",
  initialState: [],
  reducers: {
    addInitialPosts: (state, action) => {
      return action.payload;
    },
    deletePost: (state, action) => {
      return state.filter((post) => post.id !== action.payload);
    },
    addPost: (state, action) => {
      return [action.payload, ...state];
    },
  },
});

export const postListActions = postListSlice.actions;

export default postListSlice;
