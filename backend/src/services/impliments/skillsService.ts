import { HttpResponse } from "../../constants/response.message";
import { ISkills } from "../../models/SkillsSchema";
import { ISkillsRepository } from "../../repositories/interface/ISkillsRepository";
import { ISkillsService } from "../interface/ISkillsService";



export class skillsService implements ISkillsService {
       private repository: ISkillsRepository;

       constructor(repository: ISkillsRepository) {
        this.repository = repository;
       }

       async addCategory(category: string): Promise<ISkills | null> {
              try {
               const Exists = await this.repository.findSkill(category);
               if(Exists) {
                  throw new Error(HttpResponse.CATEGORY_ALREADY_EXIST)
               }
               const response = await this.repository.createCategory(category);
               if(!response) {
                      throw new Error(HttpResponse.ERROR_ADD_CATEGORY)
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

       async getSkills(): Promise<ISkills[] | null> {
              try {
                const response = await this.repository.getAllSkills();
                return response;
              } catch (error) {
               if(error instanceof Error) {
                      throw error;
                  } else {
                      throw new Error(HttpResponse.UNKNOWN_ERROR)
                  }       
              }
       }

       async addSkills(id: string, skill: string): Promise<ISkills | null> {
           try {
            const response = await this.repository.findSkillById(id);
            if(!response) {
              return null;
            }
            const updated = await this.repository.addUniqueSkills(id, skill);
            return updated;
           } catch (error) {
            if(error instanceof Error) {
                   throw error;
               } else {
                   throw new Error(HttpResponse.UNKNOWN_ERROR)
               }  
           }
       }

       async deleteSkill(id: string, skill: string): Promise<void> {
           try {
              await this.repository.deleteSkills(id, skill);
              return;
           } catch (error) {
            if(error instanceof Error) {
                   throw error;
               } else {
                   throw new Error(HttpResponse.UNKNOWN_ERROR)
               } 
           }
       }

       async deleteCategory(id: string): Promise<void> {
           try {
              await this.repository.deleteCategories(id);
              return;
           } catch (error) {
              if(error instanceof Error) {
                     throw error;
                 } else {
                     throw new Error(HttpResponse.UNKNOWN_ERROR)
                 } 
           }
       }
}