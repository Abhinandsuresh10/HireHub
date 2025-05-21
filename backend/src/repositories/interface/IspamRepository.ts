import { ISpam } from "../../models/SpamMessageSchema";
import { SpamReport } from "../../types/Spam.types";



export interface ISpamRepository {
    createSpam(data: ISpam): Promise<void>;
    getSpams(): Promise<SpamReport[] | null>
}