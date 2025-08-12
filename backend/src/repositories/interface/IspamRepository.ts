import { IRecruiter } from "../../models/RecruiterSchema";
import { ISpam } from "../../models/SpamMessageSchema";
import { Iuser } from "../../models/UserSchema";
import { SpamReport } from "../../types/Spam.types";



export interface ISpamRepository {
    createSpam(data: ISpam): Promise<void>;
    getSpams(page: number, limit: number): Promise<{reports: SpamReport[]; total: number}>
    getSpamUser(id: string): Promise<Iuser | null>
    getSpamRecruiter(id: string): Promise<IRecruiter | null>
}