import { NextFunction, Request, Response } from "express";


export interface IapplicationController {
    applyJob(req:Request, res:Response, next:NextFunction): void;
    isApplied(req: Request, res: Response): Promise<void>;
}