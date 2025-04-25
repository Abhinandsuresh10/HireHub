import { Request, Response, NextFunction } from "express";

export interface IexperienceController {
    addExperience(req: Request, res: Response,): Promise<void>;
    getExperience(req: Request, res: Response): Promise<void>;
    deleteExperience(req: Request, res: Response): Promise<void>;
} 