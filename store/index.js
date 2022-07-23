import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth-slice";
import modeReducer from "./mode-slice";
import projectReducer from "./project-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mode: modeReducer,
    project: projectReducer
  },
});

export default store;
