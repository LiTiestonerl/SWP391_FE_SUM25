import { createSlice } from '@reduxjs/toolkit'

const initialState = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
reducers: {
  login: (state, action) => {
    return action.payload;
  },
  logout: () => {
    localStorage.removeItem("Token");
    return initialState;
  },
  updateAvatar: (state, action) => {
    if (state) {
      state.avatar = action.payload;
    }
  },
},
});

// Export actions
export const { login, logout, updateAvatar } = userSlice.actions;

export default userSlice.reducer;