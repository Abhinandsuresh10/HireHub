import { IExperienceService } from "../interface/IexperienceService";
import { IExperienceRepository } from '../../repositories/interface/IexperienceRepository'
import { IExperience } from "../../models/ExperienceSchema";
import { HttpResponse } from "../../constants/response.message";
import mongoose from "mongoose";

export class experienceService implements IExperienceService {
    private experienceRepository: IExperienceRepository;

    constructor(experienceRepository: IExperienceRepository) {
        this.experienceRepository = experienceRepository
    }

    async addExperience(userId: string, experience: IExperience): Promise<IExperience | null> {
        try {
          experience.userId = new mongoose.Types.ObjectId(userId);
          const response = await this.experienceRepository.createExperience(experience);
          if(!response) {
            throw new Error(HttpResponse.CANNOT_ADD_EXPERIENCE)
          }
          return response;
        } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getExperience(userId: string): Promise<IExperience[] | null> {
        try {
          const experiences = await this.experienceRepository.findExperience(userId);
          if(!experiences) {
            throw new Error(HttpResponse.CANNOT_GET_EXPERIENCE)
          }
          return experiences;  
        } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            } 
        }
    }

    async deleteExperience(id: string): Promise<void> {
        try {
            await this.experienceRepository.removeExperience(id);
        } catch (error) {
           if(error instanceof Error) {
               throw error;
           } else {
               throw new Error(HttpResponse.UNKNOWN_ERROR)
           } 
        }
    }
}