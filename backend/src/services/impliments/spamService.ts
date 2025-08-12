import { HttpResponse } from "../../constants/response.message";
import { IRecruiter } from "../../models/RecruiterSchema";
import { ISpam } from "../../models/SpamMessageSchema";
import { Iuser } from "../../models/UserSchema";
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

       async getSpamReports(page: number, limit: number): Promise<{reports: SpamReport[]; total: number}> {
           try {
            const { reports, total } = await this.repository.getSpams(page, limit);
            return { reports, total };
           } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }              
           }
       }

       async getSpammer(id: string, role: string): Promise<Iuser | IRecruiter | null> {
           try {
            if(role === 'user') {
                return await this.repository.getSpamUser(id);
            } else if (role === 'recruiter') {
                return await this.repository.getSpamRecruiter(id);
            }
            return null;
           } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            } 
           }
       }
}