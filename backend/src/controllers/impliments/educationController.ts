import { HttpResponse } from "../../constants/response.message";
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
            res.status(200).json({message: HttpResponse.EDUCATION_ADD_SUCCESS, education})
        } catch (error) {
         if (error instanceof Error) {
               res.status(400).json({ error: error.message }); 
         } else {
             res.status(500).json({ error: HttpResponse.SERVER_ERROR });
         }
        }
    }

    public getEducation = async(req: Request, res: Response): Promise<void> => {
        try {
          const userId = req.query.userId as string;
          const education = await this.service.getEducation(userId);
          res.status(200).json({message: HttpResponse.EDUCATION_GET_SUCCESS, education});  
        } catch (error) {
           if (error instanceof Error) {    
                res.status(400).json({ error: error.message }); 
          } else {
              res.status(500).json({ error: HttpResponse.SERVER_ERROR });
          }      
        }
    }

    public deleteEducaiton = async(req: Request, res: Response): Promise<void> => {
        try {
          const id = req.query.id as string;
          await this.service.deleteEducation(id);
          res.status(200).json({message: HttpResponse.EDUCATON_DELETE_SUCCESS});
        } catch (error) {
          if (error instanceof Error) {
                res.status(400).json({ error: error.message }); 
          } else {
              res.status(500).json({ error: HttpResponse.SERVER_ERROR });
          }   
        }
    }
}