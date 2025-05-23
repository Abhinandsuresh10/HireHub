import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  admin: any | null; 
  accessToken: string | null;
  isAuthenticated: boolean;
}

const storedUser = localStorage.getItem("admin");
const storedToken = localStorage.getItem("adminToken");

const initialState: AuthState = {
  admin: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken || null,
  isAuthenticated: !!storedToken, 
};


const adminAuthSlice = createSlice({
  name: "adminAuth", 
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ admin: any; accessToken: string }>) => {
      state.admin = action.payload.admin;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("admin", JSON.stringify(action.payload.admin));
      localStorage.setItem("adminToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
    },
  },
});

export const { loginSuccess, logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
