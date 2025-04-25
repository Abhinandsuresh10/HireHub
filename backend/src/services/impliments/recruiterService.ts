import { recruiterRepository } from "../../repositories/impliments/recruiterRepository";
import { IrecruiterRepositoryInterface } from "../../repositories/interface/IrecruiterRepository";
import { IRecruiterService } from "../interface/IrecruiterService";
import { generateAccessToken, generateRefreshToken } from '../../utils/jwToken';
import { comparePassword } from "../../utils/bcrypt.util";
import { OtpService } from '../impliments/otpService'
import { GoogleAuthService } from "./googleAuthService";
import { IRecruiter } from "../../models/RecruiterSchema";
import { HttpResponse } from "../../constants/response.message";

export class recruiterService implements IRecruiterService {
    private recruiterRepository: IrecruiterRepositoryInterface;

    constructor(recruiterRepository: recruiterRepository) {
        this.recruiterRepository = recruiterRepository
     }
     
    async register(recruiterData: IRecruiter): Promise<void> {
    
       const findEmail = await this.recruiterRepository.findByEmail(recruiterData.email);
        if(findEmail) {
           throw new Error(HttpResponse.RECRUITER_ALREADY_EXIST); 
          }

          await OtpService.generateOTP(recruiterData.email, 'recruiter');
    }

    async verifyOtp(email: string, otp: string, recruiterData: IRecruiter): Promise<void> {
        try {
            
            await OtpService.verifyOTP(email, otp, "recruiter");
            await this.recruiterRepository.createRecruiter(recruiterData)
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
            await OtpService.generateOTP(email, 'recruiter');
        } catch (error) {
            console.error(error); 
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR);
            }
        }
    }

    async loginRecruiter(email: string, password: string) {
        try {

            const recruiter = await this.recruiterRepository.findByEmail(email);
            
            if(!recruiter) {
                const error = new Error(HttpResponse.RECRUITER_NOT_FOUND);
                Object.assign(error, { statusCode: 404 });
                throw error;
            }

            const isPasswordValid = await comparePassword(password, recruiter.password as string);
            if(!isPasswordValid) {
                const error = new Error(HttpResponse.INVALID_PASSWORD);
                Object.assign(error, { statusCode: 401 });
                throw error;
            }

            if(recruiter.isBlocked === true) {
                throw new Error(HttpResponse.RECRUITER_BLOCK)
            }

            const accessToken = generateAccessToken(recruiter._id as string);
            const refreshToken = generateRefreshToken(recruiter._id as string);

            return { recruiter, accessToken, refreshToken };

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
          const recruiter = await this.recruiterRepository.findByEmail(email);
          if(!recruiter) {
            throw new Error(HttpResponse.RECRUITER_NOT_FOUND);
          }
          await OtpService.generateOTP(email, 'recruiter');
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
            await OtpService.verifyOTP(email, otp, "recruiter");
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
            const recruiterData = await this.recruiterRepository.findByEmail(email);
            if(!recruiterData) {
                throw new Error(HttpResponse.USER_NOT_FOUND)
            }
            recruiterData.password = password;
            const id = recruiterData._id ;
            await this.recruiterRepository.updateRecruiter(id as string, recruiterData);
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

    async googleLogin(recruiterToken: { recruiter: string }) {
        try {
            const token = recruiterToken.recruiter;
            const googleRecruiter = await GoogleAuthService.verifyGoogleToken(token);
            if(!googleRecruiter) {
                throw new Error(HttpResponse.GOOGLE_AUTH_FAIL)
            }
            let recruiter = await this.recruiterRepository.findByEmail(googleRecruiter.email as string);
            if(!recruiter) {
                recruiter = await this.recruiterRepository.createRecruiter(googleRecruiter as IRecruiter)
             }
             if(recruiter.isBlocked) {
                throw new Error(HttpResponse.RECRUITER_BLOCK);
             }
             const accessToken = generateAccessToken(recruiter._id as string);
             const refreshToken = generateRefreshToken(recruiter._id as string);

             return { recruiter, accessToken, refreshToken };
             
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

    async editRecruiter(recruiterData: IRecruiter, recruiterId: string): Promise<IRecruiter | null> {
           try {

            const recruiter = await this.recruiterRepository.findUserById(recruiterId);
            if(!recruiter) {
                throw new Error(HttpResponse.RECRUITER_NOT_FOUND)
            }

            if(recruiterData.name) recruiter.name = recruiterData.name as string;
            if(recruiterData.mobile) recruiter.mobile = recruiterData.mobile as string;
            if(recruiterData.company) recruiter.company = recruiterData.company as string;
            if(recruiterData.industry) recruiter.industry = recruiterData.industry as string;
            if(recruiterData.hiringInfo) recruiter.hiringInfo = recruiterData.hiringInfo as string;
            if(recruiterData.imageUrl) recruiter.imageUrl = recruiterData.imageUrl as string;
            
            return await this.recruiterRepository.updateRecruiter(recruiterId, recruiter);
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
}

    
