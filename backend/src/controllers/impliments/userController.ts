import { Request, Response } from 'express'
import { IUserService } from '../../services/interface/IuserService';
import { Iuser } from '../../models/UserSchema';
import { hashPassword } from '../../utils/bcrypt.util';
import { HttpResponse } from '../../constants/response.message';
import cloudinary from '../../config/cloudinary';
import { HttpStatus } from '../../constants/status.constants';
import { razorpay } from '../../config/razorpay';


export class userController {
     private service: IUserService;

     constructor(service: IUserService) {
        this.service = service;
     }

     public register = async (req: Request, res: Response): Promise<void> => {
        try {
          const user = req.body as Iuser;
          user.password = user.password ? await hashPassword(user.password) : undefined;
          await this.service.register(user);

          req.session.userData = {
            name: user.name,
            email: user.email,
            password: user.password ?? "", 
            mobile: user.mobile ?? "", 
        };
          res.status(HttpStatus.CREATED).json({ message:  HttpResponse.OTP_SENT_EMAIL});
          return;
        } catch (error) {
          console.log(error)
          if (error instanceof Error && error.message === HttpResponse.USER_EXIST) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      };

      public verifyOTP = async (req: Request, res:Response): Promise<void> => {
        try {
          const otp = req.body.otp;
          const userData = req.session.userData;
          const email = userData?.email as string;
          
          await this.service.verifyOtp(email, otp, userData as Iuser)
          delete req.session.userData;
          res.status(HttpStatus.CREATED).json({message: HttpResponse.USER_CREATION_SUCCESS});

        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public resentOtp = async (req: Request, res:Response): Promise<void> => {
        try {
          const email = req.session.userData?.email;
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
          const { accessToken, refreshToken, user } = await this.service.loginUser(email, password);
          
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800000,
            sameSite: 'strict',
        });
        

        res.status(HttpStatus.OK).json({
          accessToken,
          user
      });

        } catch (error) {
          if (error instanceof Error) {
            if (error.message === HttpResponse.USER_NOT_FOUND) {
                res.status(HttpStatus.NOT_FOUND).json({ error: HttpResponse.USER_NOT_FOUND });
                return;
            } else if (error.message === HttpResponse.INVALID_PASSWORD) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: HttpResponse.INVALID_PASSWORD });
                return;
            } else if (error.message === HttpResponse.USER_BLOCKED) {
                res.status(HttpStatus.FORBIDDEN).json({ error: HttpResponse.USER_BLOCKED });
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
        res.status(HttpStatus.OK).json({message: HttpResponse.USER_LOGIN_SUCCESS, data})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      

      public addResume = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                 res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
            }
    
            const userId = req.query.userId as string;
            
            if (!userId) {
                 res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
            }

            const publicId = `resume_${userId}`

            const result = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  {
                      folder: process.env.RESUME_FOLDER,
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

          
          const ResumeUrl =  (result as any)?.secure_url;
          const user = await this.service.addResumeUrl(userId, ResumeUrl);
          
          res.status(HttpStatus.OK).json({message: 'Resume added successfully', user})
        
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
    };

    public addCoverLetter = async(req: Request, res: Response): Promise<void> => {
            try {
            if (!req.file) {
                 res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
            }
    
            const userId = req.query.userId as string;
            
            if (!userId) {
                 res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
            }

            const publicId = `coverLetter_${userId}`

            const result = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                  {
                      folder: process.env.COVERLETTER_FOLDER,
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

          
          const coverLetter =  (result as any)?.secure_url;
          const user = await this.service.addCoverLetter(userId, coverLetter);
          
          res.status(HttpStatus.OK).json({message: 'CoverLetter added successfully', user})
        
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
    }
    
    public editUser = async(req: Request, res: Response) => {
      try {
        const userId = req.query.userId as string;
        const base64String = req.body.image; 

        let userUrl = '';

        if(base64String) {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const publicId = `user_${userId}`
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
              {
                  folder: "HireBub/userImages",
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

      
       userUrl = (result as any)?.secure_url;
    }
      const userData = {
        name: req.body.name,
        mobile: req.body.mobile,
        jobTitle: req.body.jobTitle,
        location: req.body.location,
        imageUrl: userUrl
      }
       const user = await this.service.editUser(userData as Iuser, userId);
       
       res.status(HttpStatus.CREATED).json({message: HttpResponse.USER_EDIT_SUCCESS, user})
      } catch (error) {
        if (error instanceof Error) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
      } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
      }
      }
    }

    public addSkills = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.query.userId as string;
        const skills = req.body;
        const user = await this.service.addSkill(userId, skills);
        res.status(HttpStatus.OK).json({message: HttpResponse.SKILLS_ADD_SUCCESS, user});
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
    }

    public addPreferredRoles = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.params.id as string;
        const roles = req.body;
        const user = await this.service.addPreferredRoles(userId, roles);
        res.status(HttpStatus.OK).json({message: HttpResponse.USER_EDIT_SUCCESS, user});
      } catch (error) {
         if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
    }

    public addPreferredTypes = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.params.id as string;
        const types = req.body;
        const user = await this.service.addPreferredTypes(userId, types);
        res.status(HttpStatus.OK).json({message: HttpResponse.USER_EDIT_SUCCESS, user});
      } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
    }

    public getCompanies = async(req: Request, res: Response): Promise<void> => {
      try {
        const companies = await this.service.getCompanies();
        res.status(HttpStatus.OK).json({message: HttpResponse.GET_COMPANIES_SUCESS, companies});
      } catch (error) {
         if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
    }

    public createPurchase = async(req: Request, res: Response): Promise<void> => {
      try {
        const amount = parseInt(req.body.amount as string);

        const options = {
          amount,
          currency: "INR",
          receipt: "receipt_order_" + Date.now(),
        }
        const order = await razorpay.orders.create(options);
        console.log(order,' : this is order')
        res.status(HttpStatus.OK).json({message: HttpResponse.PREMIUM_PURCHASE_SUCCESS, order})
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
    }

    public completePurchase = async(req: Request, res: Response): Promise<void> => {
      try {
        const id = req.body.id as string;
        const paymentId = req.body.paymentId as string;
        const price = parseInt(req.query.price as string);

        const user = await this.service.completePurchase(id, paymentId, price);
        res.status(HttpStatus.OK).json({message: HttpResponse.PREMIUM_PURCHASE_SUCCESS, user})
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
      }
    }

    public viewedJobs = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.query.id as string;
        const user = await this.service.viewedJobs(userId);
        res.status(HttpStatus.OK).json({message: HttpResponse.USER_FETCH_SUCCESS, user});
        
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

     public viewedRecruiter = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.query.id as string;
        const user = await this.service.viewedRecruiter(userId);
        res.status(HttpStatus.OK).json({message: HttpResponse.USER_FETCH_SUCCESS, user});
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

     public verifyOfferLetterPassword = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.query.userId as string;
        const password = req.body.password as string;

        await this.service.verifyOfferLetterPassword(userId, password);

        res.status(HttpStatus.OK).json({ message: HttpResponse.OFFERLETTER_PASSWORD_VERIFIED })
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }  
      }
     }

     public getAllRecruiters = async(req: Request, res: Response): Promise<void> => {
      try {
        const company = req.query.company as string;
        const industry = req.query.industry as string;
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
    
        const { mappedRecruiters, total} = await this.service.getAllRecruiters(company, industry, page, limit);
        const recruiters = mappedRecruiters;
        res.status(HttpStatus.OK).json({ message: HttpResponse.RECRUITER_FETCH_SUCCESS, recruiters, total})
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
     }

     public getSingleRecruiter = async(req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.query;
        
        const recruiter = await this.service.getSingleRecruiter(id as string);

        res.status(HttpStatus.OK).json({ message: HttpResponse.RECRUITER_FETCH_SUCCESS, recruiter})
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
     }
}
