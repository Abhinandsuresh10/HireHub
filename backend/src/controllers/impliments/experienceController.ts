import { HttpResponse } from "../../constants/response.message";
import { Request, Response } from "express";
import { IExperienceService } from '../../services/interface/IexperienceService'
import { IExperience } from "../../models/ExperienceSchema";

export class experienceController {
    private service: IExperienceService;

    constructor(service: IExperienceService) {
        this.service = service;
    }

    public addExperience = async(req: Request, res: Response): Promise<void> => {
        try {
            const experience = req.body as IExperience
            const userId = req.query.userId as string;
            const response = await this.service.addExperience(userId , experience);
            res.status(200).json({message: HttpResponse.EXPEREIENCE_ADD_SUCCESS, response})
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message }); 
            } else {
                res.status(500).json({ error: HttpResponse.SERVER_ERROR });
            } 
        }
    }

    public getExperience = async(req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.query.userId as string;
            const experiences = await this.service.getExperience(userId);
            res.status(200).json({message: HttpResponse.EXPEREIENCE_GET_SUCCESS, experiences})
        } catch (error) {
          if (error instanceof Error) {
              res.status(400).json({ error: error.message }); 
          } else {
              res.status(500).json({ error: HttpResponse.SERVER_ERROR });
          }   
        }
    }

    public deleteExperience = async(req: Request, res: Response): Promise<void> => {
        try {
           const id = req.query.id as string;
           await this.service.deleteExperience(id);
           res.status(200).json({message: HttpResponse.EXPEREIENCE_DELETE_SUCCESS}) 
        } catch (error) {
          if (error instanceof Error) {
              res.status(400).json({ error: error.message }); 
          } else {
              res.status(500).json({ error: HttpResponse.SERVER_ERROR });
          }   
        }
    }
}