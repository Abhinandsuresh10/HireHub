import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";
import { IEducation } from "../../models/EducationSchema";
import { IEducationService } from "../../services/interface/IEducationService";
import { Request, Response } from "express";


export class educationController {
    public service: IEducationService;

    constructor(service: IEducationService) {
        this.service = service;
    }

    public addEducation = async(req: Request, res: Response): Promise<void> => {
        try {
            const educations = req.body as IEducation;
            const userId = req.query.userId as string;
            const education = await this.service.addEducation(userId, educations);
            res.status(HttpStatus.OK).json({message: HttpResponse.EDUCATION_ADD_SUCCESS, education})
        } catch (error) {
         if (error instanceof Error) {
               res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
         } else {
             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
         }
        }
    }

    public getEducation = async(req: Request, res: Response): Promise<void> => {
        try {
          const userId = req.query.userId as string;
          const education = await this.service.getEducation(userId);
          res.status(HttpStatus.OK).json({message: HttpResponse.EDUCATION_GET_SUCCESS, education});  
        } catch (error) {
           if (error instanceof Error) {    
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          }      
        }
    }

    public deleteEducaiton = async(req: Request, res: Response): Promise<void> => {
        try {
          const id = req.query.id as string;
          await this.service.deleteEducation(id);
          res.status(HttpStatus.OK).json({message: HttpResponse.EDUCATON_DELETE_SUCCESS});
        } catch (error) {
          if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          }   
        }
    }
}