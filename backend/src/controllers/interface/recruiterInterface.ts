import { NextFunction, Request, Response } from "express";


export interface IrecruiterAuthController {
    register(req:Request, res:Response, next:NextFunction): void;
    login(req:Request, res:Response, next:NextFunction): Promise<void>;
    verifyOTP(req:Request, res:Response, next:NextFunction): Promise<void>;
    resentOtp(req:Request, res:Response, next:NextFunction): Promise<void>;
    forgotPassword(req:Request, res:Response, next:NextFunction): Promise<void>;
    verifyForgotOtp(req:Request, res:Response, next:NextFunction): Promise<void>;
    setNewPassword(req:Request, res:Response, next:NextFunction): Promise<void>;
    googleLogin(req:Request, res:Response, next:NextFunction): Promise<void>;
    editRecruiter(req:Request , res:Response, next:NextFunction): Promise<void>;
}