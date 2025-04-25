import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/userSlice";
import adminAuthReducer from './slices/adminSlice';
import recruiterAuthReducer from './slices/recruiterSlice'
import userDataReducer from './slices/userDataSlice'
import recruiterDataReducer from './slices/recruiterDataSlice'


export const store = configureStore({
    reducer: {
       auth: authReducer,
       adminAuth: adminAuthReducer,
       recruiterAuth: recruiterAuthReducer,
       users: userDataReducer,
       recruiters: recruiterDataReducer,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;