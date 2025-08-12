import { IRecruiter } from "../../models/RecruiterSchema";
import { Iuser } from "../../models/UserSchema";
import { IRecruiterDashboardGraphData, IRecruiterDashboardUser } from "../../types/dashboard.types";


export interface IrecruiterRepositoryInterface {
    createRecruiter(recruiterData: IRecruiter): Promise<IRecruiter>;
    findByEmail(email: string): Promise<IRecruiter | null>;
    updateRecruiter(id: string, recruiterData: IRecruiter): Promise<IRecruiter | null>;
    findUserById(recruiterId: string): Promise<IRecruiter | null>;
    findUserDataById(userId: string): Promise<Iuser | null>;
    getUserWithDetails(userId: string): Promise<{} | null>;
    getDashboardMatrics(recruiterId: string): Promise<number[]>;
    getDashboardCompletedInterviews(recruiterId: string): Promise<IRecruiterDashboardUser[] | null>
    getDashboardGraphData(recruiterId: string): Promise<IRecruiterDashboardGraphData[] | null>;
    completePurchase(id: string, paymentId: string, price: number): Promise<IRecruiter | null>
    findAllRecruiter(company: string, industry: string, page: number, limit: number): Promise<{recruiters: IRecruiter[] | null; total: number}>;
    findRecruiterById(id: string): Promise<IRecruiter | null>
}