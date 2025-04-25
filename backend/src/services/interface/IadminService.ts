import { Iadmin } from "../../models/AdminSchema";
import { IRecruiter } from "../../models/RecruiterSchema";
import { Iuser } from "../../models/UserSchema";


export interface IAdminService {
    register(adminData: Iadmin): Promise<void>;
    loginUser(email: string, password: string):Promise<{ admin: Iadmin, accessToken: string, refreshToken: string }>; 
    getUsers(page: number, limit: number, search: string):Promise<{users:Iuser [], total: number}>;
    getRecruiters(page: number, limit: number, search: string):Promise<{recruiters:IRecruiter [], total: number}>;
    userBlockUnblock(id: string, status: boolean):Promise<Iuser | null>;
    recruiterBlockUnblock(id: string, status: boolean):Promise<IRecruiter | null>;
}