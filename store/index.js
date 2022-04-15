import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth-slice";
import modeReducer from "./mode-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mode: modeReducer,
  },
});

export default store;
