import { Iuser } from "../../models/UserSchema";
import { userRepository } from "../../repositories/impliments/userRepository";
import { IuserRepositoryInterface } from "../../repositories/interface/IuserRepositoryInterface";
import { IUserService } from "../interface/IuserService";
import { generateAccessToken, generateRefreshToken } from '../../utils/jwToken';
import { hashPassword, comparePassword } from "../../utils/bcrypt.util";
import { OtpService } from '../impliments/otpService'
import { GoogleAuthService } from "./googleAuthService";
import { HttpResponse } from "../../constants/response.message";
import { IrecruiterRepositoryInterface } from "../../repositories/interface/IrecruiterRepository";
import { recruiterRepository } from "../../repositories/impliments/recruiterRepository";
import { IRecruiter } from "../../models/RecruiterSchema";
import { IRecruiterForUser } from "../../types/recruiter.types";
import { UserLoginDetials } from "../../types/user.types";

export class userService implements IUserService {
  private userRepository: IuserRepositoryInterface;
  private recruiterRepository: IrecruiterRepositoryInterface;

  constructor(userRepository: userRepository, recruiterRepository: recruiterRepository) {
    this.userRepository = userRepository;
    this.recruiterRepository = recruiterRepository;
  }

  async register(userData: Iuser): Promise<void> {

    const findEmail = await this.userRepository.findByEmail(userData.email);
    if (findEmail) {
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

      const userDetails = await this.userRepository.findByEmail(email);

      if (!userDetails) {
        const error = new Error(HttpResponse.USER_NOT_FOUND);
        Object.assign(error, { statusCode: 404 });
        throw error;
      }

      const isPasswordValid = await comparePassword(password, userDetails.password as string);
      if (!isPasswordValid) {
        const error = new Error(HttpResponse.INVALID_PASSWORD);
        Object.assign(error, { statusCode: 401 });
        throw error;
      }

      if (userDetails.isBlocked === true) {
        throw new Error(HttpResponse.USER_BLOCKED)
      }

      const user = userDetails && {
        _id: userDetails._id,
        name: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
        isBlocked: userDetails.isBlocked,
        imageUrl: userDetails.imageUrl,
        role: userDetails.role,
        location: userDetails.location,
        jobTitle: userDetails.jobTitle,
        skills: userDetails.skills,
        premium: userDetails.premium,
        viewedJobs: userDetails.viewedJobs,
        viewedRecruiters: userDetails.viewedRecruiters,
        preferredJobRoles: userDetails.preferredJobRoles,
        preferredJobTypes: userDetails.preferredJobTypes,
        resumeUrl: userDetails.resumeUrl,
        coverLetter: userDetails.coverLetter,
        createdAt: userDetails.createdAt,
        updatedAt: userDetails.updatedAt,
      } as UserLoginDetials;



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
      if (!user) {
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

  async verifyForgotOtp(email: string, otp: string) {
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
      if (!userData) {
        throw new Error(HttpResponse.USER_NOT_FOUND)
      }
      userData.password = password;
      const id = userData._id;
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
      if (!googleUser) {
        throw new Error(HttpResponse.GOOGLE_AUTH_FAIL)
      }
      let userDetails = await this.userRepository.findByEmail(googleUser.email as string);
      if (!userDetails) {
        userDetails = await this.userRepository.createUser(googleUser as Iuser)
      }
      if (userDetails.isBlocked) {
        throw new Error(HttpResponse.USER_BLOCKED);
      }
      const accessToken = generateAccessToken(userDetails._id as string);
      const refreshToken = generateRefreshToken(userDetails._id as string);

      const user = userDetails && {
        _id: userDetails._id,
        name: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
        isBlocked: userDetails.isBlocked,
        imageUrl: userDetails.imageUrl,
        role: userDetails.role,
        location: userDetails.location,
        jobTitle: userDetails.jobTitle,
        skills: userDetails.skills,
        premium: userDetails.premium,
        viewedJobs: userDetails.viewedJobs,
        viewedRecruiters: userDetails.viewedRecruiters,
        preferredJobRoles: userDetails.preferredJobRoles,
        preferredJobTypes: userDetails.preferredJobTypes,
        resumeUrl: userDetails.resumeUrl,
        coverLetter: userDetails.coverLetter,
        createdAt: userDetails.createdAt,
        updatedAt: userDetails.updatedAt,
      } as UserLoginDetials;

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
      if (!user) {
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

  async addCoverLetter(userId: string, coverLetter: string): Promise<Iuser | null> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error(HttpResponse.USER_NOT_FOUND);
      }
      user.coverLetter = coverLetter as string;
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

  async editUser(userData: Iuser, userId: string): Promise<Iuser | null> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error(HttpResponse.USER_NOT_FOUND)
      }

      if (userData.name) user.name = userData.name as string;
      if (userData.mobile) user.mobile = userData.mobile as string;
      if (userData.jobTitle) user.jobTitle = userData.jobTitle as string;
      if (userData.location) user.location = userData.location as string;
      if (userData.imageUrl) user.imageUrl = userData.imageUrl as string;

      return await this.userRepository.updateUser(userId, user);
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async addSkill(userId: string, skills: []): Promise<Iuser | null> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error(HttpResponse.USER_NOT_FOUND);
      }
      return await this.userRepository.updateSkills(userId, skills);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addPreferredRoles(userId: string, roles: []): Promise<Iuser | null> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error(HttpResponse.USER_NOT_FOUND);
      }
      return await this.userRepository.updatePreferredRoles(userId, roles);
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async addPreferredTypes(userId: string, types: []): Promise<Iuser | null> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error(HttpResponse.USER_NOT_FOUND);
      }
      return await this.userRepository.updatePreferredTypes(userId, types);
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async getCompanies(): Promise<string[]> {
    try {
      return await this.userRepository.getCompanies();
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async completePurchase(id: string, paymentId: string, price: number): Promise<Iuser | null> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) {
        throw new Error(HttpResponse.USER_NOT_FOUND);
      }

      const updatedUser = await this.userRepository.completePurchase(id, paymentId, price);
      return updatedUser;
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

  async viewedJobs(userId: string): Promise<Iuser | null> {
    try {
      const DAILY_VIEW_LIMIT = 10;
      const user = await this.userRepository.viewedJobs(userId);
      const today = new Date().toISOString().split('T')[0];

      if (!user) throw new Error("User not found");

      if (!user.premium?.planId) {
        const lastViewDate = user.viewedJobs?.date?.toISOString().split('T')[0];

        if (lastViewDate === today) {
          if (user.viewedJobs?.count >= DAILY_VIEW_LIMIT) {
            throw new Error("Daily job view limit reached. Upgrade to premium.");
          } else {
            user.viewedJobs.count += 1;
          }
        } else {
          user.viewedJobs = { date: new Date(), count: 1 };
        }

        await user.save();
      }

      return user;

    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async viewedRecruiter(userId: string): Promise<Iuser | null> {
    try {
      const DAILY_VIEW_LIMIT = 10;
      const user = await this.userRepository.viewedJobs(userId);
      const today = new Date().toISOString().split('T')[0];

      if (!user) throw new Error("User not found");

      if (!user.premium?.planId) {
        const lastViewDate = user.viewedRecruiters?.date?.toISOString().split('T')[0];

        if (lastViewDate === today) {
          if (user.viewedRecruiters?.count >= DAILY_VIEW_LIMIT) {
            throw new Error("Daily recruiter view limit reached. Upgrade to premium.");
          } else {
            user.viewedRecruiters.count += 1;
          }
        } else {
          user.viewedRecruiters = { date: new Date(), count: 1 };
        }

        await user.save();
      }

      return user;
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async verifyOfferLetterPassword(userId: string, password: string): Promise<void> {
    try {

      const user = await this.userRepository.findUserById(userId);
      if (!user) throw new Error(HttpResponse.USER_NOT_FOUND);

      const isPasswordValid = await comparePassword(password, user.password as string);
      if (!isPasswordValid) {
        const error = new Error(HttpResponse.INVALID_PASSWORD);
        Object.assign(error, { statusCode: 401 });
        throw error;
      }

    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async getAllRecruiters(company: string, industry: string, page: number, limit: number): Promise<{ mappedRecruiters: IRecruiterForUser[]; total: number }> {
    try {
      const { recruiters, total } = await this.recruiterRepository.findAllRecruiter(company, industry, page, limit);
      if (!recruiters) {
        throw new Error(HttpResponse.RECRUITER_NOT_FOUND);
      };
      const mappedRecruiters: IRecruiterForUser[] = recruiters.map((item) => ({
        _id: (item._id as string)?.toString(),
        name: item.name,
        email: item.email,
        imageUrl: item.imageUrl || "",
        company: item.company || "",
        hiringInfo: item.hiringInfo || "",
        industry: item.industry || "",
        premium: item.premium || {}
      }))

      return { mappedRecruiters, total };
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async getSingleRecruiter(id: string): Promise<IRecruiterForUser | null> {
    try {
      const recruiter = await this.recruiterRepository.findRecruiterById(id);
      if (!recruiter) {
        throw Error(HttpResponse.RECRUITER_NOT_FOUND)
      }
      const updatedRecruiter: IRecruiterForUser = {
        _id: (recruiter._id as string).toString(),
        name: recruiter.name,
        email: recruiter.email,
        imageUrl: recruiter.imageUrl || "",
        company: recruiter.company || "",
        hiringInfo: recruiter.hiringInfo || "",
        industry: recruiter.industry || "",
        premium: recruiter.premium || {}

      }
      return updatedRecruiter;
    } catch (error: any) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

}


