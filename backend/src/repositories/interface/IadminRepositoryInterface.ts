import { Iadmin } from "../../models/AdminSchema";
import { IRecruiter } from "../../models/RecruiterSchema";
import { Iuser } from "../../models/UserSchema";
import { IDashobardStats } from "../../types/dashboard.types";



export interface IadminRepositoryInterface {
    createAdmin(adminData: Iadmin): Promise<Iadmin>;
    findByEmail(email: string): Promise<Iadmin | null>;
    findAllUsers(page: number, limit: number, search: string): Promise<{users:Iuser []; total: number}>;
    findAllRecruiters(page: number, limit: number, search: string): Promise<{recruiters:IRecruiter []; total: number}>;
    findById(id: string): Promise<Iuser | null>;
    findRecruiterById(id: string): Promise<IRecruiter | null>;
    updateUser(id: string, updateData: Partial<Iuser>): Promise<Iuser | null>;
    updateRecruiter(id: string, updateData: Partial<IRecruiter>): Promise<IRecruiter | null>;
    userBlockUnblock(id: string, status: boolean): Promise<Iuser | null>;
    recruiterBlockUnblock(id: string, status: boolean): Promise<IRecruiter | null>;
    getDashboardStats(): Promise<IDashobardStats | null>
    getDashboardBars(): Promise<{applications: number[]; interviews: number[]}>
    getDashboardLineData(): Promise<{lineData: number[]}>;
}