import { UpdateQuery } from "mongoose";
import Admin, { Iadmin } from "../../models/AdminSchema";
import Recruiter, { IRecruiter } from "../../models/RecruiterSchema";
import User, { Iuser } from "../../models/UserSchema";
import { IadminRepositoryInterface } from "../interface/IadminRepositoryInterface";
import { BaseRepository } from "./baseRepository";

export class adminRepository extends BaseRepository<Iadmin> implements IadminRepositoryInterface{

   private userRepository: BaseRepository<Iuser>
   private recruiterRepository: BaseRepository<IRecruiter>;

     constructor() {
        super(Admin);
        this.userRepository = new BaseRepository<Iuser>(User);
        this.recruiterRepository = new BaseRepository<IRecruiter>(Recruiter);
     }

     async createAdmin(adminData: Iadmin): Promise<Iadmin> {
        try {
          return await this.create(adminData);
        } catch (error) {
          console.error("Error creating user", error);
          throw new Error("Error creating user");
        }
     }

     async findByEmail(email: string): Promise<Iadmin | null> {
        try {
            return await this.findOne({email});
        } catch (error) {
            console.error("Error finding user", error);
            throw new Error("Error finding user");
        }
     }

     async findAllUsers(page: number, limit: number, search: string): Promise<{users:Iuser[]; total: number}> {
      try {
         const { data , total } =  await this.userRepository.findAll(page, limit, search);
         const users = data;
         return { users , total }
      } catch (error) {
          console.log('Error finding users', error);
          throw new Error('Error finding users')
      }
     }

     async findAllRecruiters(page: number, limit: number, search: string): Promise<{recruiters:IRecruiter[]; total:number}> {
      try {
         const { data , total} = await this.recruiterRepository.findAll(page, limit, search);
         const recruiters = data;
         return { recruiters, total};
      } catch (error) {
         console.log('Error finding recruiters', error);
         throw new Error('Error finding recruiters');
      }
     }

     async findById(id: string): Promise<Iuser | null> {
         try {
            return await this.userRepository.findOne({_id: id})
         } catch (error) {
            console.log('Error finding users', error);
            throw new Error('Error finding users')
         }
     }

     async findRecruiterById(id: string): Promise<IRecruiter | null> {
      try {
         return await this.recruiterRepository.findOne({_id: id})
      } catch (error) {
         console.log('Error finding recruiter', error);
         throw new Error('Error finding recruiter')
      }
  }

     async updateUser(id: string, updateData: UpdateQuery<Iuser>): Promise<Iuser | null> {
      try {
        return await this.userRepository.update(id, updateData);
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Error updating user");
      }
    }

    async updateRecruiter(id: string, updateData: UpdateQuery<IRecruiter>): Promise<IRecruiter | null> {
      try {
        return await this.recruiterRepository.update(id, updateData);
      } catch (error) {
        console.error("Error updating recruiter:", error);
        throw new Error("Error updating recruiter");
      }
    }

    async userBlockUnblock(id: string, status: boolean): Promise<Iuser | null> {
      try {
        const user = await this.findById(id);
        if (!user) {
          throw new Error("User not found");
        }
        user.isBlocked = !status;
        return await this.updateUser(id, user);
        
      } catch (error) {
        console.error(`Error in userBlockUnblock (id: ${id}, status: ${status}):`, error);
        throw new Error(`Failed to block/unblock user: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    async recruiterBlockUnblock(id: string, status: boolean): Promise<IRecruiter | null> {
        try {
         const recruiter = await this.findRecruiterById(id);
         console.log(recruiter);
        if (!recruiter) {
          throw new Error("Recruiter not found");
        }
        recruiter.isBlocked = !status;
        return await this.updateRecruiter(id, recruiter);

        } catch (error) {
         console.error(`Error in recruiterBlockUnblock (id: ${id}, status: ${status}):`, error);
        throw new Error(`Failed to block/unblock recruiter: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}