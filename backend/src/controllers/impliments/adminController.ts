import { HttpResponse } from "../../constants/response.message";
import { Iadmin } from "../../models/AdminSchema";
import { IAdminService } from "../../services/interface/IadminService";
import { hashPassword } from "../../utils/bcrypt.util";
import { Request, Response } from 'express'



export class adminController {
    private service: IAdminService;

    constructor(service: IAdminService) {
       this.service = service;
    }

    public register = async (req: Request, res: Response): Promise<void> => {
        try {
          const user = req.body as Iadmin;
          user.password = await hashPassword(user.password);
          await this.service.register(user);

          res.status(201).json({ message: HttpResponse.SUCCESS_REGISTER });
          return;
        } catch (error: unknown) {
          if (error instanceof Error && error.message === HttpResponse.ADMIN_ALREADY_EXIST) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      };

    public login = async (req:Request, res:Response):Promise<void> => {
         try {
          const email = req.body.Email;
          const password = req.body.Password;
          
          const { accessToken, refreshToken, admin } = await this.service.loginUser(email, password);
          
          res.cookie('adminRefreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE) || 604800000,
            sameSite: 'strict',
        });
        

        res.status(200).json({
          accessToken,
          admin
      });
         } catch (error: unknown) {
          if (error instanceof Error) {
            if (error.message === HttpResponse.ADMIN_NOT_FOUND) {
                res.status(404).json({ error: HttpResponse.ADMIN_NOT_FOUND });
                return;
            } else if (error.message === HttpResponse.INVALID_PASSWORD) {
                res.status(401).json({ error: HttpResponse.INVALID_PASSWORD});
                return;
             } 
           }
          res.status(500).json({ error: HttpResponse.SERVER_ERROR });
         }
    }

    public getUsers = async (req:Request, res:Response):Promise<void> => {
         try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 5;
          const search = req.query.search as string || '';

          const { users, total } = await this.service.getUsers(page, limit, search);
          res.status(200).json({message: HttpResponse.USER_FETCH_SUCCESS, users, total});

         } catch (error) {
          if(error instanceof Error) {
            if(error.message === HttpResponse.UNABLE_FETCH_USERS) {
              res.status(400).json({message: HttpResponse.UNABLE_FETCH_USERS})
            }
          }
          res.status(500).json({error: HttpResponse.SERVER_ERROR})
         }
    }


    public getRecruiters = async (req:Request, res:Response):Promise<void> => {
      try {
       
       const page = parseInt(req.query.page as string) || 1;
       const limit = parseInt(req.query.limit as string) || 5;
       const search = req.query.search as string || '';

       const { recruiters , total} = await this.service.getRecruiters(page, limit, search);
       res.status(200).json({message: HttpResponse.RECRUITER_FETCH_SUCCESS, recruiters, total});

      } catch (error) {
       if(error instanceof Error) {
         if(error.message === HttpResponse.UNABLE_FETCH_RECRUITERS) {
           res.status(400).json({message: HttpResponse.UNABLE_FETCH_RECRUITERS})
         }
       }
       res.status(500).json({error: HttpResponse.SERVER_ERROR})
      }
 }

    public userBlockUnblock = async (req: Request, res: Response): Promise<void> => {
      try {
        const { id, status } = req.body;
  
        if (!id || typeof status !== "boolean") {
          res.status(400).json({ message: HttpResponse.INVALID_REQUEST_DATA });
          return;
        }
  
        const updatedUser = await this.service.userBlockUnblock(id, status);
        res.status(200).json({
          message: HttpResponse.USER_STATUS_UPDATE_SUCCESS,
          user: updatedUser,
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === HttpResponse.USER_NOT_FOUND) {
            res.status(404).json({ message: HttpResponse.USER_NOT_FOUND });
            return;
          } else if (error.message === HttpResponse.USER_STATUS_UPDATE_FAIL) {
            res.status(400).json({ message: HttpResponse.USER_STATUS_UPDATE_FAIL });
            return;
          }
        }
        res.status(500).json({ error: HttpResponse.SERVER_ERROR });
      }
    };

    public recruiterBlockUnblock = async (req: Request, res: Response): Promise<void> => {
      try {
        const { id, status } = req.body;
  
        if (!id || typeof status !== "boolean") {
          res.status(400).json({ message: HttpResponse.INVALID_REQUEST_DATA });
          return;
        }
  
        const updatedRecruiters = await this.service.recruiterBlockUnblock(id, status);
        res.status(200).json({
          message: HttpResponse.RECRUITER_STATUS_UPDATE_SUCCESS,
          recruiter: updatedRecruiters,
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === HttpResponse.RECRUITER_NOT_FOUND) {
            res.status(404).json({ message: HttpResponse.RECRUITER_NOT_FOUND });
            return;
          } else if (error.message === HttpResponse.RECRUITER_STATUS_UPDATE_FAIL) {
            res.status(400).json({ message: HttpResponse.RECRUITER_STATUS_UPDATE_SUCCESS });
            return;
          }
        }
        res.status(500).json({ error: HttpResponse.SERVER_ERROR });
      }
    };
}