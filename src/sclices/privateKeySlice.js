import { createSlice } from "@reduxjs/toolkit";

export const keySlice = createSlice({
  name: "keys",
  initialState: {
    keyInfo: localStorage.getItem("key") ? JSON.parse(localStorage.getItem("key")) : null,
  },
  reducers: {
    keys: (state, action) => {
      state.keyInfo = action.payload;
    },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { keys } = keySlice.actions;

export default keySlice.reducer;
