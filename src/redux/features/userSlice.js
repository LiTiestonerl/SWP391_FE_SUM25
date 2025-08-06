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
    // ✅ BƯỚC 1: Thêm reducer mới để lưu ID của coach đã được chọn
    setSelectedCoach: (state, action) => {
      // Chỉ cập nhật nếu user đã đăng nhập (state không phải là null)
      if (state) {
        // Gán trực tiếp ID từ payload vào state của user
        // Redux Toolkit sử dụng Immer bên dưới nên ta có thể "mutate" state như thế này
        state.selectedCoachId = action.payload;
      }
    },
  },
});

// ✅ BƯỚC 2: Export action mới ra
export const { 
  login, 
  logout, 
  updateAvatar, 
  updateMembership, 
  setSelectedCoach // Thêm action mới vào đây
} = userSlice.actions;

export default userSlice.reducer;