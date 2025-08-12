import { IRecruiter } from "../../models/RecruiterSchema";
import { IRecruiterDashboardGraphData, IRecruiterDashboardUser } from "../../types/dashboard.types";
import { RecruiterLoginDetails } from "../../types/recruiter.types";
import { IuserProfile, UserProfileDetials } from "../../types/user.types";

export interface IRecruiterService {
    register(recruiterData: IRecruiter): Promise<void>;
    loginRecruiter(email:string, password:string): Promise<{ recruiter: RecruiterLoginDetails, accessToken: string, refreshToken: string }>;
    verifyOtp(email:string, otp:string, recruiterData: IRecruiter): Promise<void>;
    resentOtp(email:string):Promise<void>;
    forgotPassword(email: string): Promise<void>;
    verifyForgotOtp(email:string, otp:string):Promise<void>;
    setNewPassword(password: string, email:string):Promise<void>;
    googleLogin(recruiterToken: { recruiter: string }): Promise<object>;
    editRecruiter(recruiterData: IRecruiter , recruiterId: string): Promise<IRecruiter | null>;
    getUserDetails(userId: string): Promise<{} | null>;
    getDashboardMatrics(recruiterId: string): Promise<number[]>;
    getDashboardCompletedInterviews(recruiterId: string): Promise<IRecruiterDashboardUser[] | null>;
    getDashboardGraphData(recruiterId: string): Promise<IRecruiterDashboardGraphData[] | null>;
    completePurchase(id: string, paymentId: string, price: number): Promise<IRecruiter | null>
    getCompletedInterviews(recruiterId: string, page: number, limit: number): Promise<{interviewers: IRecruiterDashboardUser[] | null; total: number}>
    getAllUsers(page: number, limit: number, jobType: string, jobRole: string): Promise<{filteredUsers: UserProfileDetials[]; total: number}>
    getAnyUserDetails(id: string): Promise<IuserProfile | null>
    checkDayVisitedComplete(id: string): Promise<IRecruiter | null>;
    checkDayAddJobComplete(id: string): Promise<IRecruiter | null>;
    
}