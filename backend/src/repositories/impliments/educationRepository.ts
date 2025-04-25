import Education, { IEducation } from "../../models/EducationSchema";
import { IEducationRepository } from "../interface/IEducationRepository";
import { BaseRepository } from "./baseRepository";


export class educationRepository extends BaseRepository<IEducation> implements IEducationRepository {
    constructor(){
        super(Education)
    }

    async createEducation(education: IEducation): Promise<IEducation | null> {
        try {
            return await this.create(education); 
        } catch (error) {
            console.log(error);
            throw new Error('Error on adding education')
        }
    }

    async getEducation(userId: string): Promise<IEducation | null> {
        try {
            return await this.findOne({userId});
        } catch (error) {
            console.log(error);
            throw new Error('Error on getting education')
        }
    }

    async findById(userId: string): Promise<IEducation | null> {
        try {
            return await this.findOne({userId})
        } catch (error) {
            console.log(error);
            throw new Error('Error on editing education')
        }
    }

    async findByIdAndUpdate(id: string, data: IEducation): Promise<IEducation | null> {
        try {
            return await this.update(id, data)
        } catch (error) {
            console.log(error);
            throw new Error('Error on editing education')
        }
    }

    async findByIdDelete(id: string): Promise<void> {
        try {
            return await this.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on deleting education')
        }
    }
    
}