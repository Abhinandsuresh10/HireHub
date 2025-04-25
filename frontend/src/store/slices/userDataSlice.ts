import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null; 
}

const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};


const userDataSlice = createSlice({
  name: "user", 
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<{ user: any }>) => {
      state.user = action.payload.user;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    removeUser: (state) => {
        state.user = null;
        localStorage.removeItem("user");
    },
  },
});

export const { addUser , removeUser } = userDataSlice.actions;
export default userDataSlice.reducer;
