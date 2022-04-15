import { createSlice } from "@reduxjs/toolkit";

const initialModeState = { mode: "dark" };

const modeSlice = createSlice({
  name: "mode",
  initialState: initialModeState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const modeActions = modeSlice.actions;

export default modeSlice.reducer;
