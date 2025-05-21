import { Iuser } from "../../models/UserSchema";
import { userRepository } from "../../repositories/impliments/userRepository";
import { IuserRepositoryInterface } from "../../repositories/interface/IuserRepositoryInterface";
import { IUserService } from "../interface/IuserService";
import { generateAccessToken, generateRefreshToken } from '../../utils/jwToken';
import { hashPassword, comparePassword } from "../../utils/bcrypt.util";
import { OtpService } from '../impliments/otpService'
import { GoogleAuthService } from "./googleAuthService";
import { HttpResponse } from "../../constants/response.message";

export class userService implements IUserService {
    private userRepository: IuserRepositoryInterface;

    constructor(userRepository: userRepository) {
        this.userRepository = userRepository
     }
     
    async register(userData: Iuser): Promise<void> {
    
       const findEmail = await this.userRepository.findByEmail(userData.email);
        if(findEmail) {
           throw new Error(HttpResponse.USER_EXIST); 
          }

          await OtpService.generateOTP(userData.email, 'user');
    }

    async verifyOtp(email: string, otp: string, userData: Iuser): Promise<void> {
        try {
            
            await OtpService.verifyOTP(email, otp, "user");
            await this.userRepository.createUser(userData)
            return;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR);
            }
        }
    }

    async resentOtp(email: string) {
        try {
            await OtpService.generateOTP(email, 'user');
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

            const user = await this.userRepository.findByEmail(email);
            
            if(!user) {
                const error = new Error(HttpResponse.USER_NOT_FOUND);
                Object.assign(error, { statusCode: 404 });
                throw error;
            }

            const isPasswordValid = await comparePassword(password, user.password as string);
            if(!isPasswordValid) {
                const error = new Error(HttpResponse.INVALID_PASSWORD);
                Object.assign(error, { statusCode: 401 });
                throw error;
            }

            if(user.isBlocked === true) {
                throw new Error(HttpResponse.USER_BLOCKED)
            }

            const accessToken = generateAccessToken(user._id as string);
            const refreshToken = generateRefreshToken(user._id as string);

            return { user, accessToken, refreshToken };

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

    async forgotPassword(email: string) {
      try {
          const user = await this.userRepository.findByEmail(email);
          if(!user) {
            throw new Error(HttpResponse.USER_NOT_FOUND);
          }
          await OtpService.generateOTP(email, 'user');
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

    async verifyForgotOtp(email: string, otp:string) {
        try {
            await OtpService.verifyOTP(email, otp, "user");
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

    async setNewPassword(password: string, email: string) {
        try {
            const userData = await this.userRepository.findByEmail(email);
            if(!userData) {
                throw new Error(HttpResponse.USER_NOT_FOUND)
            }
            userData.password = password;
            const id = userData._id ;
            await this.userRepository.updateUser(id as string, userData);
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

    async googleLogin(userToken: { user: string }) {
        try {
            const token = userToken.user;
            const googleUser = await GoogleAuthService.verifyGoogleToken(token);
            if(!googleUser) {
                throw new Error(HttpResponse.GOOGLE_AUTH_FAIL)
            }
            let user = await this.userRepository.findByEmail(googleUser.email as string);
            if(!user) {
                user = await this.userRepository.createUser(googleUser as Iuser)
             }
             if(user.isBlocked) {
                throw new Error(HttpResponse.USER_BLOCKED);
             }
             const accessToken = generateAccessToken(user._id as string);
             const refreshToken = generateRefreshToken(user._id as string);

             return { user, accessToken, refreshToken };
             
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

    async addResumeUrl(userId: string, resumeUrl: string): Promise<Iuser | null> {
        try {
            const user = await this.userRepository.findUserById(userId);
            if(!user) {
                throw new Error(HttpResponse.USER_NOT_FOUND);
            }
            user.resumeUrl = resumeUrl as string;
            
           return await this.userRepository.updateUser(userId as string, user);
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

    async editUser(userData: Iuser, userId: string): Promise<Iuser | null > {
        try {
          const user = await this.userRepository.findUserById(userId);
          if(!user) {
            throw new Error(HttpResponse.USER_NOT_FOUND)
          }
          
          if(userData.name) user.name = userData.name as string;
          if(userData.mobile) user.mobile = userData.mobile as string;
          if(userData.jobTitle) user.jobTitle = userData.jobTitle as string;
          if(userData.location) user.location = userData.location as string;
          if(userData.imageUrl) user.imageUrl = userData.imageUrl as string;

         return await this.userRepository.updateUser(userId, user);
        } catch (error: any) {
             console.log(error.message);
            throw new Error(error.message);
        }
      }

      async addSkill(userId: string, skills: []): Promise<Iuser | null> {
          try {
            const user = await this.userRepository.findUserById(userId);
            if(!user) {
                throw new Error(HttpResponse.USER_NOT_FOUND);
            }
            return await this.userRepository.updateSkills(userId, skills);
          } catch (error: any) {
            throw new Error(error.message);
          }
      }

}

    
