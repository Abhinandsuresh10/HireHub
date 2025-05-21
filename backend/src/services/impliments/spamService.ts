import { HttpResponse } from "../../constants/response.message";
import { ISpam } from "../../models/SpamMessageSchema";
import { ISpamRepository } from "../../repositories/interface/IspamRepository";
import { SpamReport } from "../../types/Spam.types";
import { ISpamService } from "../interface/IspamService";



export class spamService implements ISpamService {
       private repository: ISpamRepository;

       constructor(repository: ISpamRepository) {
        this.repository = repository;
       }

       async createSpam(data: ISpam): Promise<void> {
           try {
            await this.repository.createSpam(data);
           } catch (error) {
             if(error instanceof Error) {
                 throw error;
             } else {
                 throw new Error(HttpResponse.UNKNOWN_ERROR)
             }  
           }
       }

       async getSpamReports(): Promise<SpamReport[] | null> {
           try {
            return this.repository.getSpams();
           } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }              
           }
       }
}