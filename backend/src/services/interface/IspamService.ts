import { ISpam } from "../../models/SpamMessageSchema";
import { SpamReport } from "../../types/Spam.types";

export interface ISpamService {
    createSpam(data: ISpam):Promise<void>;
    getSpamReports(): Promise<SpamReport[] | null>
}