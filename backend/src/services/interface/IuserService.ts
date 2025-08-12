import { Iuser } from "../../models/UserSchema";
import { IRecruiterForUser } from "../../types/recruiter.types";
import { UserLoginDetials } from "../../types/user.types";

export interface IUserService {
    register(userData: Iuser): Promise<void>;
    loginUser(email:string, password:string): Promise<{ user: UserLoginDetials, accessToken: string, refreshToken: string }>;
    verifyOtp(email:string, otp:string, userData: Iuser): Promise<void>;
    resentOtp(email:string):Promise<void>;
    forgotPassword(email: string): Promise<void>;
    verifyForgotOtp(email:string, otp:string):Promise<void>;
    setNewPassword(password: string, email:string):Promise<void>;
    googleLogin(userToken: { user: string }): Promise<object>;
    addResumeUrl(userId: string, resumeUrl: string): Promise<Iuser | null>;
    addCoverLetter(userId: string, coverLetter: string): Promise<Iuser | null>
    editUser(userData: Iuser , userId: string): Promise<Iuser | null>;
    addSkill(userId: string, skills: []): Promise<Iuser | null>
    addPreferredRoles(userId: string, roles: []): Promise<Iuser | null>
    addPreferredTypes(userId: string, types: []): Promise<Iuser | null>
    getCompanies(): Promise<string[]>;
    completePurchase(id: string, paymentId: string, price: number): Promise<Iuser | null>
    viewedJobs(userId: string): Promise<Iuser | null>;
    viewedRecruiter(userId: string): Promise<Iuser | null>;
    verifyOfferLetterPassword(userId: string, password: string): Promise<void>;
    getAllRecruiters(company: string, industry: string, page: number, limit: number): Promise<{mappedRecruiters: IRecruiterForUser[] | null; total: number}>;
    getSingleRecruiter(id: string): Promise<IRecruiterForUser | null>
}