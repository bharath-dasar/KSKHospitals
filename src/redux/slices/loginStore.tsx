// src/redux/slices/loginStore.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  token: null,
  loginData: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.loginData = action.payload.loginData;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.loginData = null;
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
