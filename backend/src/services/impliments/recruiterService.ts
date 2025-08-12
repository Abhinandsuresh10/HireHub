import { recruiterRepository } from "../../repositories/impliments/recruiterRepository";
import { IrecruiterRepositoryInterface } from "../../repositories/interface/IrecruiterRepository";
import { IRecruiterService } from "../interface/IrecruiterService";
import { generateAccessToken, generateRefreshToken } from '../../utils/jwToken';
import { comparePassword } from "../../utils/bcrypt.util";
import { OtpService } from '../impliments/otpService'
import { GoogleAuthService } from "./googleAuthService";
import { IRecruiter } from "../../models/RecruiterSchema";
import { HttpResponse } from "../../constants/response.message";
import { IRecruiterDashboardGraphData, IRecruiterDashboardUser } from "../../types/dashboard.types";
import { IInterviewRepository } from "../../repositories/interface/IinterviewRepository";
import { interviewRepository } from "../../repositories/impliments/interviewRepository";
import { IuserRepositoryInterface } from "../../repositories/interface/IuserRepositoryInterface";
import { userRepository } from "../../repositories/impliments/userRepository";
import { IInterview } from "../../models/InterviewSchema";
import { IuserProfile, UserProfileDetials } from "../../types/user.types";
import { Iuser } from "../../models/UserSchema";
import { IEducationRepository } from "../../repositories/interface/IEducationRepository";
import { educationRepository } from "../../repositories/impliments/educationRepository";
import { IExperienceRepository } from "../../repositories/interface/IexperienceRepository";
import { experienceRepository } from "../../repositories/impliments/experienceRepository";
import { IapplicationRepository } from "../../repositories/interface/IapplicationRepository";
import { applicationRepository } from "../../repositories/impliments/applicationRepository";

export class recruiterService implements IRecruiterService {
    private recruiterRepository: IrecruiterRepositoryInterface;
    private interviewRepository: IInterviewRepository;
    private usersRepository: IuserRepositoryInterface;
    private educationRepository: IEducationRepository;
    private experienceRepository: IExperienceRepository;
    private applicationRepository: IapplicationRepository;

    constructor(recruiterRepository: recruiterRepository, interviewRepository: interviewRepository, usersRepository: userRepository, educationRepository: educationRepository, experienceRepository: experienceRepository, applicationRepository: applicationRepository) {
        this.recruiterRepository = recruiterRepository;
        this.interviewRepository = interviewRepository;
        this.usersRepository = usersRepository;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
        this.applicationRepository = applicationRepository;
    }

    async register(recruiterData: IRecruiter): Promise<void> {

        const findEmail = await this.recruiterRepository.findByEmail(recruiterData.email);
        if (findEmail) {
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

            const recruiterDetails = await this.recruiterRepository.findByEmail(email);

            if (!recruiterDetails) {
                const error = new Error(HttpResponse.RECRUITER_NOT_FOUND);
                Object.assign(error, { statusCode: 404 });
                throw error;
            }

            const isPasswordValid = await comparePassword(password, recruiterDetails.password as string);
            if (!isPasswordValid) {
                const error = new Error(HttpResponse.INVALID_PASSWORD);
                Object.assign(error, { statusCode: 401 });
                throw error;
            }

            if (recruiterDetails.isBlocked === true) {
                throw new Error(HttpResponse.RECRUITER_BLOCK)
            }

            const recruiter = recruiterDetails && {
                _id: recruiterDetails._id,
                name: recruiterDetails.name,
                email: recruiterDetails.email,
                role: recruiterDetails.role,
                isGoogleAuth: recruiterDetails.isGoogleAuth,
                isBlocked: recruiterDetails.isBlocked,
                imageUrl: recruiterDetails.imageUrl,
                mobile: recruiterDetails.mobile,
                company: recruiterDetails.company,
                industry: recruiterDetails.industry,
                hiringInfo: recruiterDetails.hiringInfo,
                premium: recruiterDetails.premium,
                addedJobs: recruiterDetails.addedJobs,
                viewUserProfile: recruiterDetails.viewUserProfile,
                createdAt: recruiterDetails.createdAt,
                updatedAt: recruiterDetails.updatedAt,
            };


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
            if (!recruiter) {
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

    async verifyForgotOtp(email: string, otp: string) {
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
            if (!recruiterData) {
                throw new Error(HttpResponse.USER_NOT_FOUND)
            }
            recruiterData.password = password;
            const id = recruiterData._id;
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
            if (!googleRecruiter) {
                throw new Error(HttpResponse.GOOGLE_AUTH_FAIL)
            }
            let recruiterDetails = await this.recruiterRepository.findByEmail(googleRecruiter.email as string);
            if (!recruiterDetails) {
                recruiterDetails = await this.recruiterRepository.createRecruiter(googleRecruiter as IRecruiter)
            }
            if (recruiterDetails.isBlocked) {
                throw new Error(HttpResponse.RECRUITER_BLOCK);
            }

                const recruiter = recruiterDetails && {
                _id: recruiterDetails._id,
                name: recruiterDetails.name,
                email: recruiterDetails.email,
                role: recruiterDetails.role,
                isGoogleAuth: recruiterDetails.isGoogleAuth,
                isBlocked: recruiterDetails.isBlocked,
                imageUrl: recruiterDetails.imageUrl,
                mobile: recruiterDetails.mobile,
                company: recruiterDetails.company,
                industry: recruiterDetails.industry,
                hiringInfo: recruiterDetails.hiringInfo,
                premium: recruiterDetails.premium,
                addedJobs: recruiterDetails.addedJobs,
                viewUserProfile: recruiterDetails.viewUserProfile,
                createdAt: recruiterDetails.createdAt,
                updatedAt: recruiterDetails.updatedAt,
            };

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
            if (!recruiter) {
                throw new Error(HttpResponse.RECRUITER_NOT_FOUND)
            }

            if (recruiterData.name) recruiter.name = recruiterData.name as string;
            if (recruiterData.mobile) recruiter.mobile = recruiterData.mobile as string;
            if (recruiterData.company) recruiter.company = recruiterData.company as string;
            if (recruiterData.industry) recruiter.industry = recruiterData.industry as string;
            if (recruiterData.hiringInfo) recruiter.hiringInfo = recruiterData.hiringInfo as string;
            if (recruiterData.imageUrl) recruiter.imageUrl = recruiterData.imageUrl as string;

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

    async getUserDetails(userId: string): Promise<{} | null> {
        try {
            const user = await this.recruiterRepository.findUserDataById(userId);
            if (!user) {
                throw new Error(HttpResponse.USER_NOT_FOUND);
            }
            return await this.recruiterRepository.getUserWithDetails(userId);
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

    async getDashboardMatrics(recruiterId: string): Promise<number[]> {
        try {
            return this.recruiterRepository.getDashboardMatrics(recruiterId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                console.error(HttpResponse.UNKNOWN_ERROR, error);
                throw error;
            }
        }
    }

    async getDashboardCompletedInterviews(recruiterId: string): Promise<IRecruiterDashboardUser[] | null> {
        try {
            return await this.recruiterRepository.getDashboardCompletedInterviews(recruiterId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                console.error(HttpResponse.UNKNOWN_ERROR, error);
                throw error;
            }
        }
    }

    async getDashboardGraphData(recruiterId: string): Promise<IRecruiterDashboardGraphData[] | null> {
        try {
            return await this.recruiterRepository.getDashboardGraphData(recruiterId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                console.error(HttpResponse.UNKNOWN_ERROR, error);
                throw error;
            }
        }
    }

    async completePurchase(id: string, paymentId: string, price: number): Promise<IRecruiter | null> {
        try {
            const user = this.recruiterRepository.findUserById(id);
            if (!user) {
                throw new Error(HttpResponse.USER_NOT_FOUND);
            }

            return await this.recruiterRepository.completePurchase(id, paymentId, price);
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

    async getCompletedInterviews(recruiterId: string, page: number, limit: number): Promise<{interviewers: IRecruiterDashboardUser[] | null; total: number}> {
        try {

            const { interviews, total } = await this.interviewRepository.getCompletedInterviews(recruiterId, page, limit);
            if (!interviews) throw new Error(HttpResponse.INTERVIEW_GET_FAIL);
            const  interviewers = await this.usersRepository.getCompletedUsersInterviewers(interviews);
            return { interviewers, total };

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

    async getAllUsers(page: number, limit: number, jobType: string, jobRole: string): Promise<{ filteredUsers: UserProfileDetials[], total: number }> {
        try {
            const { users, total } = await this.usersRepository.getAllUsers(page, limit, jobType, jobRole);

            if (!users) {
                throw new Error(HttpResponse.USER_NOT_FOUND);
            }

            const filteredUsers: UserProfileDetials[] = users.map((user: Iuser) => ({
                _id: (user._id as string)?.toString(),
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                isBlocked: user.isBlocked,
                imageUrl: user.imageUrl,
                location: user.location,
                jobTitle: user.jobTitle,
                skills: user.skills,
                premium: user.premium,
                preferredJobRoles: user.preferredJobRoles,
                preferredJobTypes: user.preferredJobTypes,
                resumeUrl: user.resumeUrl,
                coverLetter: user.coverLetter,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));

            return { filteredUsers, total };

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

    async getAnyUserDetails(id: string): Promise<IuserProfile | null> {
        try {
            const user = await this.usersRepository.findUserById(id);
            if (!user) {
                throw new Error(HttpResponse.USER_NOT_FOUND);
            };
            const education = await this.educationRepository.getEducation(id);
            const experience = await this.experienceRepository.findExperience(id);

            const userProfile: IuserProfile = {
                _id: (user._id as string)?.toString(),
                name: user.name,
                email: user.email,
                mobile: user.mobile || "",
                location: user.location || "",
                imageUrl: user.imageUrl || "",
                skills: user.skills || [],
                resumeUrl: user.resumeUrl,
                coverLetter: user.coverLetter,
            };

            if (education) {
                userProfile.education = {
                    education: education.education,
                    institute: education.institute,
                    graduateDate: education.graduateDate
                }
            }

            if (experience) {
                userProfile.experience = experience.map((exp: any) => {
                    const formatDate = (date: Date) => {
                        const d = new Date(date);
                        const month = d.toLocaleString('default', { month: 'short' });
                        const year = d.getFullYear();
                        return `${month} ${year}`;
                    };

                    const start = exp.startDate ? formatDate(exp.startDate) : 'Unknown';
                    const end = exp.endDate ? formatDate(exp.endDate) : 'Present';

                    return {
                        title: exp.title,
                        company: exp.company,
                        jobTitle: exp.jobTitle,
                        duration: `${start} - ${end}`,
                        achievements: exp.achievements
                    };
                });
            }

            return userProfile;

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

    // to check the daily user visit of recruiter...
    async checkDayVisitedComplete(id: string): Promise<IRecruiter | null> {
        try {
            const DAILY_VIEW_LIMIT = 10;
            const recruiter = await this.recruiterRepository.findUserById(id);
            const today = new Date().toISOString().split('T')[0];

            if (!recruiter) throw new Error(HttpResponse.RECRUITER_NOT_FOUND);

            if (!recruiter.premium?.planId) {
                const lastViewDate = recruiter.viewUserProfile?.date?.toISOString().split('T')[0];

                if (lastViewDate === today) {
                    if (recruiter.viewUserProfile?.count >= DAILY_VIEW_LIMIT) {
                        throw new Error("Daily user view limit reached. Upgrade to premium.");
                    } else {
                        recruiter.viewUserProfile.count += 1;
                    }
                } else {
                    recruiter.viewUserProfile = { date: new Date(), count: 1 };
                }

                await recruiter.save();
            }

            return recruiter;

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

    // to check the daily job add of recruiter count...
    async checkDayAddJobComplete(id: string): Promise<IRecruiter | null> {
        try {
            const DAILY_VIEW_LIMIT = 10;
            const recruiter = await this.recruiterRepository.findUserById(id);
            const today = new Date().toISOString().split('T')[0];

            if (!recruiter) throw new Error(HttpResponse.RECRUITER_NOT_FOUND);

            if (!recruiter.premium?.planId) {
                const lastViewDate = recruiter.addedJobs?.date?.toISOString().split('T')[0];

                if (lastViewDate === today) {
                    if (recruiter.addedJobs?.count >= DAILY_VIEW_LIMIT) {
                        throw new Error("Daily add job limit reached. Upgrade to premium.");
                    } else {
                        recruiter.addedJobs.count += 1;
                    }
                } else {
                    recruiter.addedJobs = { date: new Date(), count: 1 };
                }

                await recruiter.save();
            }

            return recruiter;
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


