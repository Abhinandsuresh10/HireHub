import { NextFunction, Request, Response } from "express";


export interface IadminAuthController {
    register(req:Request, res:Response, next:NextFunction): void;
    login(req:Request, res:Response, next:NextFunction): void;
    getUsers(req:Request, res:Response, next:NextFunction): void;
    getRecruiters(req:Request, res:Response, next:NextFunction): void;
    userBlockUnblock(req:Request, res:Response, next:NextFunction): void;
    recruiterBlockUnblock(req:Request, res:Response, next:NextFunction): void;
    postJob(req:Request, res:Response, next:NextFunction): void;
}