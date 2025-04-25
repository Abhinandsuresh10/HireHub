import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  recruiter: any | null; 
  accessToken: string | null;
  isAuthenticated: boolean;
}

const storedRecruiter = localStorage.getItem("recruiter");
const storedToken = localStorage.getItem("recruiterToken");

const initialState: AuthState = {
  recruiter: storedRecruiter ? JSON.parse(storedRecruiter) : null,
  accessToken: storedToken || null,
  isAuthenticated: !!storedToken, 
};


const recruiterAuthSlice = createSlice({
  name: "recruiterAuth", 
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      localStorage.setItem("recruiterToken", action.payload.accessToken);
    },
    logout: (state) => {
      state.recruiter = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("recruiter");
      localStorage.removeItem("recruiterToken");
    },
  },
});

export const { loginSuccess, logout } = recruiterAuthSlice.actions;
export default recruiterAuthSlice.reducer;
