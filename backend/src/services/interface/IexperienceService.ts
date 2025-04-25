import { IExperience } from "../../models/ExperienceSchema";


export interface IExperienceService {
    addExperience(userId: string, experience: IExperience): Promise<IExperience | null>
    getExperience(userId: string): Promise<IExperience[] | null>;
    deleteExperience(id: string): Promise<void>;
}