import { IJob } from "../../models/JobSchema";
import { IRecruiter } from "../../models/RecruiterSchema";

export interface IRecruiterService {
    register(recruiterData: IRecruiter): Promise<void>;
    loginRecruiter(email:string, password:string): Promise<{ recruiter: IRecruiter, accessToken: string, refreshToken: string }>;
    verifyOtp(email:string, otp:string, recruiterData: IRecruiter): Promise<void>;
    resentOtp(email:string):Promise<void>;
    forgotPassword(email: string): Promise<void>;
    verifyForgotOtp(email:string, otp:string):Promise<void>;
    setNewPassword(password: string, email:string):Promise<void>;
    googleLogin(recruiterToken: { recruiter: string }): Promise<object>;
    editRecruiter(recruiterData: IRecruiter , recruiterId: string): Promise<IRecruiter | null>;
}