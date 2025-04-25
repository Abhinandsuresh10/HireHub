import Experience, { IExperience } from "../../models/ExperienceSchema";
import { IExperienceRepository } from "../interface/IexperienceRepository";
import { BaseRepository } from "./baseRepository";



export class experienceRepository extends BaseRepository<IExperience> implements IExperienceRepository {
    constructor() {
     super(Experience)
    }

    async createExperience(data: IExperience): Promise<IExperience | null> {
        try {
         return await this.create(data); 
        } catch (error) {
          console.log(error);
          throw new Error('Error on adding experience')
        }
    }

    async findExperience(id: string): Promise<IExperience[] | null> {
        try {
            const experiences = await this.findDatasById({userId: id});
            return experiences;
        } catch (error) {
            console.log(error);
            throw new Error('Error on getting experience')
        }
    }

    async removeExperience(id: string): Promise<void> {
        try {
            await this.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on deleting experience')
        }
    }
}