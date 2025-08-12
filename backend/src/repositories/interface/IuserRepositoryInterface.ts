import { IInterview } from "../../models/InterviewSchema";
import { Iuser } from "../../models/UserSchema";
import { IRecruiterDashboardUser } from "../../types/dashboard.types";


export interface IuserRepositoryInterface {
    createUser(userData: Iuser): Promise<Iuser>;
    findByEmail(email: string): Promise<Iuser | null>;
    updateUser(id: string, userData: Iuser): Promise<Iuser | null>;
    findUserById(userId: string): Promise<Iuser | null>;
    updateSkills(userId: string, skills: []): Promise<Iuser | null>
    updatePreferredRoles(userId: string, roles: []): Promise<Iuser | null>
    updatePreferredTypes(userId: string, types: []): Promise<Iuser | null>
    getCompanies(): Promise<string[]>;
    completePurchase(id: string, paymentId: string, price: number): Promise<Iuser | null>;
    viewedJobs(userId: string): Promise<Iuser | null>;
    getCompletedUsersInterviewers(interviews: IInterview[]): Promise<IRecruiterDashboardUser[] | null>
    getAllUsers(page: number, limit: number, jobType: string, jobRole: string): Promise<{users: Iuser[]; total: number}>
}