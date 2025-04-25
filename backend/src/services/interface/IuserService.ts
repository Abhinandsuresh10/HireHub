import { Iuser } from "../../models/UserSchema";

export interface IUserService {
    register(userData: Iuser): Promise<void>;
    loginUser(email:string, password:string): Promise<{ user: Iuser, accessToken: string, refreshToken: string }>;
    verifyOtp(email:string, otp:string, userData: Iuser): Promise<void>;
    resentOtp(email:string):Promise<void>;
    forgotPassword(email: string): Promise<void>;
    verifyForgotOtp(email:string, otp:string):Promise<void>;
    setNewPassword(password: string, email:string):Promise<void>;
    googleLogin(userToken: { user: string }): Promise<object>;
    addResumeUrl(userId: string, resumeUrl: string): Promise<Iuser | null>;
    editUser(userData: Iuser , userId: string): Promise<Iuser | null>;
}