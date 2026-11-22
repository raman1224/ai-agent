

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Conversation } from "@/types/chat";

interface ConversationState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
}

interface UpdateConversationTitle {
  title: string;
  conversationId: string;
}

const initialState: ConversationState = {
  conversations: [],
  selectedConversation: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,

  reducers: {
    setConversations: (
      state,
      action: PayloadAction<Conversation[]>
    ) => {
      state.conversations = action.payload;
    },

    addConversation: (
      state,
      action: PayloadAction<Conversation>
    ) => {
      state.conversations.unshift(action.payload);
    },

    setSelectedConversation: (
      state,
      action: PayloadAction<Conversation | null>
    ) => {
      state.selectedConversation = action.payload;
    },

    setConvTitle: (
      state,
      action: PayloadAction<UpdateConversationTitle>
    ) => {
      const { title, conversationId } = action.payload;

      state.conversations = state.conversations.map((conv) =>
        conv._id === conversationId
          ? { ...conv, title }
          : conv
      );

      if (
        state.selectedConversation?._id === conversationId
      ) {
        state.selectedConversation.title = title;
      }
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  setConvTitle,
} = conversationSlice.actions;

export default conversationSlice.reducer;
