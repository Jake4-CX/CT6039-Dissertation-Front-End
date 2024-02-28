import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type InitalState = {
  value: UserState
}

type UserState = {
  userData: undefined,
  tokenData: undefined
}

const initialState = {
  value: {
    tokenData: undefined,
    userData: undefined
  }
} as InitalState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<undefined | undefined>) => {
      state.value.userData = action.payload;
    },
    setTokens: (state, action: PayloadAction<undefined | undefined>) => {
      state.value.tokenData = action.payload;
    }
  },
});

export const { setUser, setTokens } = userSlice.actions;
export default userSlice.reducer;