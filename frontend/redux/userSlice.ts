
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "@/types/chat";

interface UserState {
  userData: UserData | null;
}

const initialState: UserState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserdata: (
      state,
      action: PayloadAction<UserData | null>
    ) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserdata } = userSlice.actions;

export default userSlice.reducer;