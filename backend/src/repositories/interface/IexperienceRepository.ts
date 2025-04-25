import { IExperience } from "../../models/ExperienceSchema";

export interface IExperienceRepository {
    createExperience(data: IExperience): Promise<IExperience | null>;
    findExperience(id: string): Promise<IExperience[] | null>;
    removeExperience(id: string): Promise<void>;
}