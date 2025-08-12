import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";
import { Request, Response } from 'express'
import { IPremiumService } from "../../services/interface/IPremiumService";



export class premiumController {
    public service: IPremiumService;

    constructor(service: IPremiumService) {
        this.service = service;
    }

    public addPremium = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body.formData;
            await this.service.addPremium(data);
            res.status(HttpStatus.CREATED).json({ message: HttpResponse.PREMIUM_CREATE_SUCCESS });
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public getPremiums = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string);
            const limit = parseInt(req.query.limit as string);

            const { premiums, total } = await this.service.getPremiums(page, limit);
            res.status(HttpStatus.OK).json({ message: HttpResponse.PREMIUM_GET_SUCCESS, premiums, total });
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public patchPremium = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.body.id as string;
            await this.service.patchPremium(id);
            res.status(HttpStatus.OK).json({ message: HttpResponse.PREMIUM_UPDATE_SUCCESS });
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public deletePremium = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            await this.service.deletePremium(id);
            res.status(HttpStatus.OK).json({ message: HttpResponse.PREMIUM_DELETE_SUCCESS });
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public getApremium = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const premium = await this.service.getApremium(id);
            res.status(HttpStatus.OK).json({ message: HttpResponse.PREMIUM_GET_SUCCESS, premium });
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public updatePremium = async (req: Request, res: Response): Promise<void> => {
        try {
           const id = req.body.id as string;
           const data = req.body.formData;
           
           await this.service.updatePremium(id, data);
           
           res.status(HttpStatus.OK).json({ message: HttpResponse.PREMIUM_UPDATE_SUCCESS })
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public getAllPremiums = async (req: Request, res: Response): Promise<void> => {
        try {
            const role = req.query.role as string;
            const premiums = await this.service.getAllPremiums(role);
            res.status(HttpStatus.OK).json({ message: HttpResponse.PREMIUM_GET_SUCCESS, premiums })
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            } 
        }
    }
}