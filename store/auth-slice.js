import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  token: "",
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      // redux toolkit saves the dispatch argument as payload
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
    }
  }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;