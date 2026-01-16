import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(sessionStorage.getItem('willbank_user')) || null,
    isAuthenticated: !!sessionStorage.getItem('willbank_user')
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      sessionStorage.setItem('willbank_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('willbank_user');
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;