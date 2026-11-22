
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GeneratedArtifact, Message } from "@/types/chat";

interface MessageState {
  messages: Message[];
  artifacts: GeneratedArtifact[];
}

const initialState: MessageState = {
  messages: [],
  artifacts: []
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    addMessages: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setArtifacts: (state, action: PayloadAction<GeneratedArtifact[]>) => {
      state.artifacts = action.payload;
    },

  },
});

export const { setMessages, addMessages, setArtifacts } = messageSlice.actions;

export default messageSlice.reducer;