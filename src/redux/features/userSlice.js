import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      return initialState;
    },
    updateAvatar: (state, action) => {
      if (state) {
        state.avatar = action.payload;
      }
    },
    // ✅ THÊM reducer để cập nhật thông tin membership
    updateMembership: (state, action) => {
      if (!state) return state;
      return {
        ...state,
        membership: {
          ...(state.membership || {}),
          ...action.payload,
        },
      };
    },
  },
});

// Export actions
export const { login, logout, updateAvatar, updateMembership } = userSlice.actions;

export default userSlice.reducer;