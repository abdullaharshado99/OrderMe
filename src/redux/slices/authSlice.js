import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  onboarding: false,
  scanComplete: false,
  userData: {}
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    dispatchOnbording: (state, action) => {
      state.onboarding = action.payload
    },
    setScanComplete: (state, action) => {
      state.scanComplete = !!action.payload;
    },
    login: (state, action) => {
      state.isLoggedIn = true
    },
    logout: (state, action) => {
      state.isLoggedIn = false
    },
    setUserData: (state, action) => {
      state.userData = action.payload
    }
  },
});

export const {
  login, logout, dispatchOnbording, setUserData, setScanComplete
} = authSlice.actions;

export default authSlice.reducer;
