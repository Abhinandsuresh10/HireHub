import { Request, Response } from 'express'
import { IUserService } from '../../services/interface/IuserService';
import { Iuser } from '../../models/UserSchema';
import { hashPassword } from '../../utils/bcrypt.util';
import { HttpResponse } from '../../constants/response.message';
import cloudinary from '../../config/cloudinary';


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
          res.status(201).json({ message:  HttpResponse.OTP_SENT_EMAIL});
          return;
        } catch (error) {
          console.log(error)
          if (error instanceof Error && error.message === HttpResponse.USER_EXIST) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
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
          res.status(201).json({message: HttpResponse.USER_CREATION_SUCCESS});

        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message }); 
          } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
          }
        }
      }

      public resentOtp = async (req: Request, res:Response): Promise<void> => {
        try {
          const email = req.session.userData?.email;
          await this.service.resentOtp(email as string);
          res.status(200).json({message: HttpResponse.OTP_SENT_EMAIL})
        } catch (error) {
          if (error instanceof Error && error.message === HttpResponse.OTP_EXPIRED_OR_IVALID) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public login = async (req: Request, res: Response): Promise<void> => {
        try {
          const { email, password } = req.body;
          const { accessToken, refreshToken, user } = await this.service.loginUser(email, password);
          
          res.cookie('userRefreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800000,
            sameSite: 'strict',
        });
        

        res.status(200).json({
          accessToken,
          user
      });

        } catch (error) {
          if (error instanceof Error) {
            if (error.message === HttpResponse.USER_NOT_FOUND) {
                res.status(404).json({ error: HttpResponse.USER_NOT_FOUND });
                return;
            } else if (error.message === HttpResponse.INVALID_PASSWORD) {
                res.status(401).json({ error: HttpResponse.INVALID_PASSWORD });
                return;
            } else if (error.message === HttpResponse.USER_BLOCKED) {
                res.status(403).json({ error: HttpResponse.USER_BLOCKED });
                return;
             }
           }
          res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
      }

      public forgotPassword = async (req: Request, res:Response): Promise<void> => {
        try {
         const email = req.body.email;
         await this.service.forgotPassword(email as string);
         res.status(200).json({message: HttpResponse.OTP_SENT_EMAIL})
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public verifyForgotOtp = async (req: Request, res:Response): Promise<void> => {
        try {
         const email = req.body.email;
         const otp = req.body.otp;
         await this.service.verifyForgotOtp(email, otp);
         res.status(200).json({message: HttpResponse.OTP_VERIFIED})
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public setNewPassword = async (req: Request, res:Response): Promise<void> => {
        try {
         let password = req.body.password;
         const email = req.body.email
         password = password ? await hashPassword(password) : undefined;
         await this.service.setNewPassword(password, email);
         res.status(200).json({message: HttpResponse.PASSWORD_RESET_SUCCESS})
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      public googleLogin = async (req: Request, res:Response): Promise<void> => {
        try {
        const token = req.body;
        const data = await this.service.googleLogin(token);
        res.status(200).json({message: HttpResponse.USER_LOGIN_SUCCESS, data})
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      }

      

      public addResume = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                 res.status(400).json({ message: 'No file uploaded' });
            }
    
            const userId = req.query.userId as string;
            
            if (!userId) {
                 res.status(400).json({ message: 'User ID is required' });
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
          
          res.status(200).json({message: 'Resume added successfully', user})
        
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    };
    
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
       
       res.status(201).json({message: HttpResponse.USER_EDIT_SUCCESS, user})
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
    }
}
