import { HttpResponse } from "../../constants/response.message";
import { Iadmin } from "../../models/AdminSchema";
import { IRecruiter } from "../../models/RecruiterSchema";
import { Iuser } from "../../models/UserSchema";
import { adminRepository } from "../../repositories/impliments/adminRepository";
import { IadminRepositoryInterface } from "../../repositories/interface/IadminRepositoryInterface";
import { comparePassword } from "../../utils/bcrypt.util";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwToken";
import { IAdminService } from "../interface/IadminService";

export class adminService implements IAdminService {
    private adminRepository: IadminRepositoryInterface;

    constructor(adminRepository: adminRepository) {
        this.adminRepository = adminRepository
     }
     

     async register(adminData: Iadmin): Promise<void> {
         try {
            const user = await this.adminRepository.findByEmail(adminData.email)
            if(!user) {
                await this.adminRepository.createAdmin(adminData);
            } else {
                throw new Error(HttpResponse.ADMIN_ALREADY_EXIST);
            }
         } catch (error) {
            console.error(error); 
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR);
            }
         }
     }

     async loginUser(email: string, password: string) {
          try {
            
            const admin = await this.adminRepository.findByEmail(email);

            if(!admin) {
                const error = new Error(HttpResponse.ADMIN_NOT_FOUND);
                Object.assign(error, { statusCode: 404 });
                throw error;
            }

            const isPasswordValid = await comparePassword(password, admin.password as string);
            if(!isPasswordValid) {
                const error = new Error(HttpResponse.INVALID_PASSWORD);
                Object.assign(error, { statusCode: 401 });
                throw error;
            }

            const accessToken = generateAccessToken(admin._id as string);
            const refreshToken = generateRefreshToken(admin._id as string);
            
            return { admin, accessToken, refreshToken };
            
          } catch (error) {
            if (error instanceof Error) {
                console.error(error);
                throw new Error(error.message);
            } else {
                console.error(HttpResponse.UNKNOWN_ERROR, error);
                throw error;
            }
          }
     }

    async getUsers(page: number, limit: number, search: string): Promise<{users: Iuser []; total: number}>  {
        try {
        
            const { users , total } = await this.adminRepository.findAllUsers(page, limit, search);
            if(!users) {
                throw new Error(HttpResponse.UNABLE_FETCH_USERS)
            }
            return {users , total};

        } catch (error) {
            if(error instanceof Error) {
                console.log(error);
                throw new Error(error.message);
            } else {
                console.log(HttpResponse.UNKNOWN_ERROR, error);
                throw error;
            }
        }
    }

    async getRecruiters(page: number, limit: number, search: string): Promise<{recruiters:IRecruiter [], total: number}> {
        try {
          const { recruiters , total} = await this.adminRepository.findAllRecruiters(page, limit, search);
          if(!recruiters) {
              throw new Error(HttpResponse.UNABLE_FETCH_RECRUITERS)
          }
          return { recruiters, total};

        } catch (error) {
            if(error instanceof Error) {
                console.log(error);
                throw new Error(error.message);
            } else {
                console.log(HttpResponse.UNKNOWN_ERROR, error);
                throw error;
            }
        }
    }

    async userBlockUnblock(id: string, status: boolean): Promise<Iuser | null> {
        try {
          const user = await this.adminRepository.userBlockUnblock(id, status);
          if(!user) {
            throw new Error(HttpResponse.FAIL_UPDATE_USER_STATUS);
          }
          return user;
        } catch (error) {
          console.error(error);
          throw error instanceof Error ? error : new Error(HttpResponse.UNKNOWN_ERROR);
        }
      }

      async recruiterBlockUnblock(id: string, status: boolean): Promise<IRecruiter| null> {
           try {
            const recruiter = await this.adminRepository.recruiterBlockUnblock(id, status);
            if(!recruiter) {
              throw new Error(HttpResponse.FAIL_UPDATE_RECRUITER_STATUS);
              }
          return recruiter;
           } catch (error) {
            console.error(error);
            throw error instanceof Error ? error : new Error(HttpResponse.UNKNOWN_ERROR);
         }
      }

}

    
