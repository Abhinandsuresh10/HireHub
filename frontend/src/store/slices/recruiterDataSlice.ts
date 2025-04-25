import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  recruiter: any | null; 
}

const storedRecruiter = localStorage.getItem("recruiter");

const initialState: AuthState = {
    recruiter: storedRecruiter ? JSON.parse(storedRecruiter) : null,
};


const recruiterDataSlice = createSlice({
  name: "recruiter",  
  initialState,
  reducers: {
    addRecruiter: (state, action: PayloadAction<{ recruiter: any }>) => {
      state.recruiter = action.payload.recruiter;

      localStorage.setItem("recruiter", JSON.stringify(action.payload.recruiter));
    },
    removeRecruiter: (state) => {
        state.recruiter = null;
        localStorage.removeItem("recruiter");
    },
  },
});

export const { addRecruiter , removeRecruiter } = recruiterDataSlice.actions;
export default recruiterDataSlice.reducer;
