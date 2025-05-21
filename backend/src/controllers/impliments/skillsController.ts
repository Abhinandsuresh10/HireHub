import { Request, Response } from "express";
import { HttpResponse } from "../../constants/response.message";
import { ISkillsService } from "../../services/interface/ISkillsService";
import { HttpStatus } from "../../constants/status.constants";


export class skillsController {
    public service: ISkillsService;

    constructor(service: ISkillsService) {
        this.service = service;
    }

   public addCategory = async(req: Request, res: Response): Promise<void> => {
    try {
       const category = req.body.category as string;
       const response = await this.service.addCategory(category);
       res.status(HttpStatus.OK).json({message: HttpResponse.CATEGORY_ADD_SUCCESS , response})
    } catch (error) {
      if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
      } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
      }
    }
   }

   public getSkills = async(req: Request, res: Response): Promise<void> => {
    try {
        const skills = await this.service.getSkills();
        res.status(HttpStatus.OK).json({message: HttpResponse.SKILLS_GET_SUCCESS, skills});
    } catch (error) {
      if (error instanceof Error) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
      } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
      }
    }
   }

   public addSkill = async(req: Request, res: Response): Promise<void> => {
    try {
       const skill = req.body.skill as string;
       const id = req.query.categoryId as string;
       const skills = await this.service.addSkills(id, skill);
       res.status(HttpStatus.CREATED).json({message: HttpResponse.SKILLS_ADD_SUCCESS, skills})
    } catch (error) {
       if (error instanceof Error) {
           res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
           res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       }  
     }
   }

   public deleteSkill = async(req: Request, res: Response): Promise<void> => {
    try {
        const skill = req.body.skill as string;
        const id = req.query.categoryId as string;
        await this.service.deleteSkill(id, skill);
        res.status(HttpStatus.CREATED).json({message: 'success'})
    } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
     }
   }

   public deleteCategory = async(req: Request, res: Response): Promise<void> => {
      try {
        const id = req.query.categoryId as string;
        await this.service.deleteCategory(id);
        res.status(HttpStatus.CREATED).json({message: 'category delete success'})
      } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      }
   }
}