import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";
import { IJobRolesService } from "../../services/interface/IJobRolesService";
import { Request, Response } from 'express'



export class jobRolesController {
    public service: IJobRolesService;

    constructor(service: IJobRolesService) {
        this.service = service;
    }

    public addCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const category = req.body.category as string;
            await this.service.addCategory(category);
            res.status(HttpStatus.OK).json({ message: HttpResponse.CATEGORY_ADD_SUCCESS });
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public getCategory = async (Req: Request, res: Response): Promise<void> => {
        try {
            const jobRoles = await this.service.getCategory();
            res.status(HttpStatus.OK).json({ message: HttpResponse.CATEGORY_GET_SUCCESS, jobRoles })
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public addJobRoles = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.body.id as string;
            const role = req.body.role as string;
            await this.service.addJobRole(role, id);
            res.status(HttpStatus.OK).json({ message: HttpResponse.CATEGORY_GET_SUCCESS });
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public deleteCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            await this.service.deleteCategory(id);
            res.status(HttpStatus.OK).json({ message: HttpResponse.CATEGORY_DELETE_SUCCESS })
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }

    public deleteJobRoles = async (req: Request, res: Response): Promise<void> => {
        try {
           const id = req.body.id as string;
           const role = req.body.role as string;
           await this.service.deleteJobRoles(id, role);
           res.status(HttpStatus.OK).json({ message: HttpResponse.JOBROLES_DELETE_SUCCESS })
        } catch (error) {
            if (error instanceof Error && error.message === HttpResponse.CATEGORY_ALREADY_EXIST) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
    }
}