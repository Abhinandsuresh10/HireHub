import mongoose from "mongoose";
import { IEducation } from "../../models/EducationSchema";
import { IEducationRepository } from "../../repositories/interface/IEducationRepository";
import { IEducationService } from "../interface/IEducationService";
import { HttpResponse } from "../../constants/response.message";



export class educationService implements IEducationService {
      public educationRepository: IEducationRepository;

      constructor(educationRepository: IEducationRepository) {
        this.educationRepository = educationRepository;
      }

      async addEducation(userId: string, education: IEducation): Promise<IEducation | null> {
        try {
          education.userId = new mongoose.Types.ObjectId(userId);
          const exists = await this.educationRepository.findById(userId);
          if(exists) {
            return await this.educationRepository.findByIdAndUpdate(exists._id as string, education);
          }
          const response = await this.educationRepository.createEducation(education);
          if(!response) {
            throw new Error(HttpResponse.CANNOT_ADD_EDUCATION)
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
      
      async getEducation(userId: string): Promise<IEducation | null> {
        try {
          const response = await this.educationRepository.getEducation(userId);
          if(!response) {
            throw new Error(HttpResponse.CANNOT_GET_EDUCATION);
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

      async deleteEducation(id: string): Promise<void> {
        try {
          await this.educationRepository.findByIdDelete(id);
        } catch (error) {
           if(error instanceof Error) {
             throw error;
           } else {
              throw new Error(HttpResponse.UNKNOWN_ERROR)
           } 
        }
      }
}