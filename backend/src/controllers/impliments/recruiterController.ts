import { Request, Response } from 'express'
import { IRecruiterService } from '../../services/interface/IrecruiterService';
import { IRecruiter } from '../../models/RecruiterSchema';
import { hashPassword } from '../../utils/bcrypt.util';
import { HttpResponse } from '../../constants/response.message';
import cloudinary from '../../config/cloudinary';
import { HttpStatus } from '../../constants/status.constants';
import axios from 'axios';
import { razorpay } from '../../config/razorpay';


export class recruiterController {
     private service: IRecruiterService;

     constructor(service: IRecruiterService) {
        this.service = service;
     }

     public register = async (req: Request, res: Response): Promise<void> => {
        try {
          const recruiter = req.body as IRecruiter;
          recruiter.password = recruiter.password ? await hashPassword(recruiter.password) : undefined;
          await this.service.register(recruiter);

          req.session.recruiterData = {
            name: recruiter.name,
            email: recruiter.email,
            password: recruiter.password ?? "", 
            company: recruiter.company ?? "",
            mobile: recruiter.mobile ?? "", 
        };
          res.status(HttpStatus.CREATED).json({ message: HttpResponse.OTP_SENT_EMAIL });
          return;
        } catch (error) {
          console.log(error)
          if (error instanceof Error && error.message === HttpResponse.RECRUITER_ALREADY_EXIST) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      };

      public verifyOTP = async (req: Request, res:Response): Promise<void> => {
        try {
          const otp = req.body.otp;
          const recruiterData = req.session.recruiterData;
          const email = recruiterData?.email as string;
          
          await this.service.verifyOtp(email, otp, recruiterData as IRecruiter)
          delete req.session.recruiterData;
          res.status(HttpStatus.CREATED).json({message: HttpResponse.RECRUITER_CREATE_SUCCESS});

        } catch (error) {
          if (error instanceof Error && error.message === HttpResponse.OTP_EXPIRED_OR_IVALID) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public resentOtp = async (req: Request, res:Response): Promise<void> => {
        try {
          const email = req.session.recruiterData?.email;
          await this.service.resentOtp(email as string);
          res.status(HttpStatus.OK).json({message: HttpResponse.OTP_SENT_EMAIL})
        } catch (error) {
          if (error instanceof Error && error.message === HttpResponse.OTP_EXPIRED_OR_IVALID) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public login = async (req: Request, res: Response): Promise<void> => {
        try {
          const { email, password } = req.body;
          const { accessToken, refreshToken, recruiter } = await this.service.loginRecruiter(email, password);
          
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800000,
            sameSite: 'strict',
        });
        

        res.status(HttpStatus.OK).json({
          accessToken,
          recruiter
      });

        } catch (error) {
          if (error instanceof Error) {
            if (error.message === HttpResponse.RECRUITER_NOT_FOUND) {
                res.status(HttpStatus.NOT_FOUND).json({ error: HttpResponse.RECRUITER_NOT_FOUND });
                return;
            } else if (error.message === HttpResponse.INVALID_PASSWORD ) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: HttpResponse.INVALID_PASSWORD });
                return;
            } else if (error.message === HttpResponse.RECRUITER_BLOCK) {
                res.status(HttpStatus.FORBIDDEN).json({ error: HttpResponse.RECRUITER_BLOCK });
                return;
             }
           }
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }

      public forgotPassword = async (req: Request, res:Response): Promise<void> => {
        try {
         const email = req.body.email;
         await this.service.forgotPassword(email as string);
         res.status(HttpStatus.OK).json({message: HttpResponse.OTP_SENT_EMAIL})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public verifyForgotOtp = async (req: Request, res:Response): Promise<void> => {
        try {
         const email = req.body.email;
         const otp = req.body.otp;
         await this.service.verifyForgotOtp(email, otp);
         res.status(HttpStatus.OK).json({message: HttpResponse.OTP_VERIFIED})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public setNewPassword = async (req: Request, res:Response): Promise<void> => {
        try {
         let password = req.body.password;
         const email = req.body.email
         password = password ? await hashPassword(password) : undefined;
         await this.service.setNewPassword(password, email);
         res.status(HttpStatus.OK).json({message: HttpResponse.PASSWORD_RESET_SUCCESS})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public googleLogin = async (req: Request, res:Response): Promise<void> => {
        try {
        const token = req.body;
        const data = await this.service.googleLogin(token);
        res.status(HttpStatus.OK).json({message: HttpResponse.RECRUITER_LOGIN_SUCCESS, data})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public editRecruiter = async (req: Request, res: Response): Promise<void> => {
        try {
                  const recruiterId = req.query.recruiterId as string;
                  const base64String = req.body.image; 
          
                  let recruiterUrl = '';
          
                  if(base64String) {
                  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
                  const buffer = Buffer.from(base64Data, 'base64');
          
                  const publicId = `recruiter_${recruiterId}`
                  const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "HireBub/recruiterImages",
                            resource_type: "image",
                            public_id: publicId,
                            overwrite: true,
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
          
                    uploadStream.end(buffer);
                });
          
                
                 recruiterUrl = (result as any)?.secure_url;
              }
                const recruiterData = {
                  name: req.body.name,
                  company: req.body.company,
                  mobile: req.body.mobile,
                  industry: req.body.industry,
                  hiringInfo: req.body.hiringInfo,
                  imageUrl: recruiterUrl
                }
                 const recruiter = await this.service.editRecruiter(recruiterData as IRecruiter, recruiterId);
                 
                 res.status(HttpStatus.CREATED).json({message: HttpResponse.RECRUITER_EDIT_SUCCESS, recruiter})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public getUserDetails = async(req: Request, res: Response): Promise<void> => {
        try {
          const userId = req.query.userId as string;
          const userData = await this.service.getUserDetails(userId);
          res.status(HttpStatus.CREATED).json({message: HttpResponse.USER_FETCH_SUCCESS, userData})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public downloadPdf = async(req: Request, res: Response): Promise<void> => {
        try {

         const fileUrl = req.body.fileUrl as string;

         if(!fileUrl) {
          res.status(HttpStatus.BAD_REQUEST).json({message: HttpResponse.USER_NOT_FOUND})
         }
         console.log(fileUrl)
         const response = await axios.get(fileUrl, { responseType: 'stream' });
  
         console.log(response)
         const fileName = fileUrl.split('/').pop()?.split('?')[0] || 'resume.pdf';
     
         res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
         res.setHeader('Content-Type', 'application/pdf');
     
         response.data.pipe(res);
        //  res.status(HttpStatus.OK).json({message: HttpResponse.DOWNLOAD_SUCCESS})
        } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
        }
      }

      public getDashboardMatrics = async(req: Request, res: Response): Promise<void> => {
        try {
          const recruiterId = req.query.id as string;
          const matrics = await this.service.getDashboardMatrics(recruiterId);
          res.status(HttpStatus.OK).json({ message: HttpResponse.RECRUITER_DASHBOARD_GET_SUCCESS, matrics}) 
        } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
        }
      }

      public getDashboardCompletedInterviews = async(req: Request, res: Response): Promise<void> => {
        try {
        const recruiterId = req.query.id as string;
        const recentInterviews = await this.service.getDashboardCompletedInterviews(recruiterId);
        res.status(HttpStatus.OK).json({ message: HttpResponse.RECRUITER_DASHBOARD_GET_SUCCESS, recentInterviews })  
        } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
        }
      }

      public getDashboardGraphData = async(req: Request, res: Response): Promise<void> => {
        try {
         const receiverId = req.query.id as string;
         const months = await this.service.getDashboardGraphData(receiverId);
         res.status(HttpStatus.OK).json({ message: HttpResponse.RECRUITER_DASHBOARD_GET_SUCCESS, months});
        } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
        }
      }

      public createPremiumPurchase = async(req: Request, res: Response): Promise<void> => {
        try {
          const amount = parseInt(req.body.amount as string);
          
          const options = {
            amount,
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
          }
          const order = await razorpay.orders.create(options);
          res.status(HttpStatus.OK).json({message: HttpResponse.PREMIUM_PURCHASE_SUCCESS, order})
        } catch (error) {
           if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public completePremiumPurchase = async(req: Request, res: Response): Promise<void> => {
      try {
        const id = req.body.id as string;
        const paymentId = req.body.paymentId as string;
        const price = parseInt(req.body.price as string);

        const recruiter = await this.service.completePurchase(id, paymentId, price);
        res.status(HttpStatus.OK).json({message: HttpResponse.PREMIUM_PURCHASE_SUCCESS, recruiter})
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
      }
    }

    public getCompletedInterviews = async(req: Request, res: Response): Promise<void> => {
      try {
        const recruiterId = req.query.id as string;
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        
        const { interviewers, total} = await this.service.getCompletedInterviews(recruiterId, page, limit);
        res.status(HttpStatus.OK).json({ message: HttpResponse.RECRUITER_DASHBOARD_GET_SUCCESS, interviewers , total})  
      } catch (error) {
         if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
      }
    }

    public addOfferLetter = async(req: Request, res: Response): Promise<void> => {
      try {
        
        if (!req.file) {
           res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
        }

        const userId = req.query.userId as string;
        
        if (!userId) {
             res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
        }


       const publicId = `offerLetter_${userId}`
       
           const result = await new Promise((resolve, reject) => {
             const uploadStream = cloudinary.uploader.upload_stream(
                 {
                     folder: process.env.OFFERLETTER_FOLDER,
                     resource_type: "raw",
                     public_id: publicId,
                     format: "pdf",
                     overwrite: true,
                     flags: 'attachment',
                 },
                 (error, result) => {
                     if (error) {
                         reject(error);
                     } else {
                         resolve(result);
                     }
                 }
             );
  
             uploadStream.end(req.file?.buffer);
         });

         
         const offerLetter =  (result as any)?.secure_url;

         res.status(HttpStatus.OK).json({ message: HttpResponse.OFFERLETTER_POST_SUCCESS, offerLetter})

      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
    }

    public viewedUserProfiles = async(req: Request, res: Response): Promise<void> => {
      try {
        // do this after making user showing page in recruiter side.. 
        res.status(HttpStatus.OK).json({ message: HttpResponse.RECRUITER_FETCH_SUCCESS})
      } catch (error) {
       if (error instanceof Error) {
           res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
           res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       } 
      }
    }

    public getUsers = async(req: Request, res: Response): Promise<void> => {
      try {
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        const jobType = req.query.jobType as string;
        const jobRole = req.query.jobRole as string;
        const { filteredUsers, total} = await this.service.getAllUsers(page, limit, jobType, jobRole);
        res.status(HttpStatus.OK).json({ message: HttpResponse.USER_FETCH_SUCCESS, filteredUsers, total});
      } catch (error) {
       if (error instanceof Error) {
           res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
           res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       }  
      }
    }


    public getAnyUserDetails = async(req: Request, res: Response): Promise<void> => {
      try {
        const  id  = req.params.id as string;
        const user = await this.service.getAnyUserDetails(id);
        res.status(HttpStatus.OK).json({ message: HttpResponse.USER_FETCH_SUCCESS, user})
      } catch (error) {
       if (error instanceof Error) {
           res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
           res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       }  
      }
    }

    public checkDayVisitedComplete = async(req: Request, res: Response): Promise<void> => {
      try {
        const id = req.params.id as string;
        const viewUserProfile = await this.service.checkDayVisitedComplete(id);
        res.status(HttpStatus.OK).json({ message: HttpResponse.DAILY_VISIT_COUNT_GET_FAIL, viewUserProfile})
      } catch (error) {
      if (error instanceof Error) {
         if (error.message.includes("limit")) {
           res.status(HttpStatus.FORBIDDEN).json({ error: error.message });
         } else {
           res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
       } else {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       } 
      }
    }

    public checkDayAddJobComplete = async(req: Request, res: Response): Promise<void> => {
      try {
        const id = req.params.id as string;
        const addedJobs = await this.service.checkDayAddJobComplete(id);
        res.status(HttpStatus.OK).json({ message: HttpResponse.DAILY_ADD_JOB_COUNT_GET_FAIL, addedJobs})
      } catch (error) {
        if (error instanceof Error) {
         if (error.message.includes("limit")) {
           res.status(HttpStatus.FORBIDDEN).json({ error: error.message });
         } else {
           res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
       } else {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       } 
      }
    }

}