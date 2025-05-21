import { Request, Response } from 'express'
import { IRecruiterService } from '../../services/interface/IrecruiterService';
import { IRecruiter } from '../../models/RecruiterSchema';
import { hashPassword } from '../../utils/bcrypt.util';
import { HttpResponse } from '../../constants/response.message';
import cloudinary from '../../config/cloudinary';
import { HttpStatus } from '../../constants/status.constants';
import axios from 'axios';


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
          
          res.cookie('recruiterRefreshToken', refreshToken, {
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

}