import { IEducation } from "../../models/EducationSchema";



export interface IEducationService {
    addEducation(userId: string, education: IEducation): Promise<IEducation | null>
    getEducation(userId: string): Promise<IEducation | null>;
    deleteEducation(id: string): Promise<void>;
}