import { IRecruiter } from "../../models/RecruiterSchema";
import { ISpam } from "../../models/SpamMessageSchema";
import { Iuser } from "../../models/UserSchema";
import { SpamReport } from "../../types/Spam.types";

export interface ISpamService {
    createSpam(data: ISpam):Promise<void>;
    getSpamReports(page: number, limit: number): Promise<{reports: SpamReport[]; total: number}>
    getSpammer(id: string, role: string): Promise<Iuser | IRecruiter | null>;
}