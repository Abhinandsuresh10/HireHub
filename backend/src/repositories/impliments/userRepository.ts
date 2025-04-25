import User, { Iuser} from "../../models/UserSchema";
import { IuserRepositoryInterface } from "../interface/IuserRepositoryInterface";
import { BaseRepository } from "./baseRepository";

export class userRepository extends BaseRepository<Iuser> implements IuserRepositoryInterface{
     constructor() {
        super(User);
     }

     async createUser(userData: Iuser): Promise<Iuser> {
        try {
          return await this.create(userData);
        } catch (error) {
          console.error("Error creating user", error);
          throw new Error("Error creating user");
        }
     }

     async findByEmail(email: string): Promise<Iuser | null> {
         try {
          return await this.findOne({email});
         } catch (error) {
           console.log('Error on finding email', error);
           throw new Error('Error finding email');
         }
     }

     async updateUser(id: string, userData: Iuser): Promise<Iuser | null> {
       try {
        return await this.update(id, userData);
       } catch (error) {
           console.log('Error on updating user', error);
           throw new Error('Error on updating user');
       }
     }

     async findUserById(userId: string): Promise<Iuser | null> {
         try {
          return await this.findByIds(userId)
         } catch (error: any) {
          console.log(error.message);
          throw new Error('Error on updating user');
         }
     }


}