import { IEducation } from "../../models/EducationSchema";


export interface IEducationRepository {
    createEducation(education: IEducation): Promise<IEducation | null>
    getEducation(userId: string): Promise<IEducation | null>;
    findById(id: string): Promise<IEducation | null>
    findByIdAndUpdate(id: string, data: IEducation): Promise<IEducation | null>;
    findByIdDelete(id: string): Promise<void>;
}