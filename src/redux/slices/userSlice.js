import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoggedIn: false,
  },
  reducers: {
    dispatchUser: (state, action) => {
      state.user = {
        ...state.user, // Keep existing user data including tokens
        ...action.payload, // Override with new data
      };

      // Save access token to App Groups for Share Extension
      // Check multiple possible locations for the access token
      const accessToken =
        state.user?.token ||
        action.payload?.accessToken ||
        action.payload?.user?.accessToken;
      console.log(state.user, "state.user");
      console.log(
        "Redux: Saving access token to App Groups:",
        accessToken ? "Found" : "Not found",
      );
      console.log(
        "Redux: Token source - state.user?.accessToken------:",
        !!state.user?.accessToken,
      );
      console.log(
        "Redux: Token source - action.payload?.accessToken:",
        !!action.payload?.accessToken,
      );
      console.log(
        "Redux: Token source - action.payload?.user?.accessToken:",
        !!action.payload?.user?.accessToken,
      );
    },
    dispatchUserReset: (state) => {
      state.user = null;
    },
    dispatchUserLogin: (state) => {
      state.isLoggedIn = true;
    },
    dispatchUserLogout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const {
  dispatchUser,
  dispatchUserReset,
  dispatchUserLogin,
  dispatchUserLogout,
} = userSlice.actions;

export default userSlice.reducer;
