import { IRecruiter } from "../../models/RecruiterSchema";
import { Iuser } from "../../models/UserSchema";


export interface IrecruiterRepositoryInterface {
    createRecruiter(recruiterData: IRecruiter): Promise<IRecruiter>;
    findByEmail(email: string): Promise<IRecruiter | null>;
    updateRecruiter(id: string, recruiterData: IRecruiter): Promise<IRecruiter | null>;
    findUserById(recruiterId: string): Promise<IRecruiter | null>;
    findUserDataById(userId: string): Promise<Iuser | null>;
    getUserWithDetails(userId: string): Promise<{} | null>;
}