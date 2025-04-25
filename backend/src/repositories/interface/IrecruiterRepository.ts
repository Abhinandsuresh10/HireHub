import { IRecruiter } from "../../models/RecruiterSchema";


export interface IrecruiterRepositoryInterface {
    createRecruiter(recruiterData: IRecruiter): Promise<IRecruiter>;
    findByEmail(email: string): Promise<IRecruiter | null>;
    updateRecruiter(id: string, recruiterData: IRecruiter): Promise<IRecruiter | null>;
    findUserById(recruiterId: string): Promise<IRecruiter | null>;
}