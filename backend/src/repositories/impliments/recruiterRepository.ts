import { IJob } from "../../models/JobSchema";
import Recruiter, { IRecruiter} from "../../models/RecruiterSchema";
import { IrecruiterRepositoryInterface } from "../interface/IrecruiterRepository";
import { BaseRepository } from "./baseRepository";

export class recruiterRepository extends BaseRepository<IRecruiter> implements IrecruiterRepositoryInterface{
     constructor() {
        super(Recruiter);
     }

     async createRecruiter(recruiterData: IRecruiter): Promise<IRecruiter> {
        try {
          return await this.create(recruiterData);
        } catch (error) {
          console.error("Error creating recruiter", error);
          throw new Error("Error creating recruiter");
        }
     }

     async findByEmail(email: string): Promise<IRecruiter | null> {
         try {
          return await this.findOne({email});
         } catch (error) {
           console.log('Error on finding email', error);
           throw new Error('Error finding email');
         }
     }

     async updateRecruiter(id: string, recruiterData: IRecruiter): Promise<IRecruiter | null> {
       try {
        return await this.update(id, recruiterData);
       } catch (error) {
           console.log('Error on updating recruiter', error);
           throw new Error('Error on updating recruiter');
       }
     }

    async findUserById(recruiterId: string): Promise<IRecruiter | null> {
        try {
         return await this.findByIds(recruiterId)
        } catch (error: any) {
         console.log(error.message);
         throw new Error('Error on updating user');
        }
    }

}