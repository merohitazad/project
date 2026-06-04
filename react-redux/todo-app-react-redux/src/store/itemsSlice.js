import { createSlice } from "@reduxjs/toolkit";

const itemsListSlice = createSlice({
  name: "todoItems",
  initialState: [],
  reducers: {
    addNewItem: (state, action) => {
      return [
        {
          id: action.payload.id,
          name: action.payload.todoName,
          dueDate: action.payload.dueDate,
        },
        ...state,
      ];
    },
    deleteItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const itemsListActions = itemsListSlice.actions;

export default itemsListSlice;
