import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import conversationReducer from "./conversationSlice";
import messageReducer from "./messageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    message: messageReducer,
  },
});

// Automatically infer the complete Redux state type
export type RootState = ReturnType<typeof store.getState>;

// Automatically infer the dispatch type
export type AppDispatch = typeof store.dispatch;