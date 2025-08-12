import { HttpResponse } from '../../constants/response.message';
import { HttpStatus } from '../../constants/status.constants';
import { IRatingService } from '../../services/interface/IRatingService'
import { Request, Response } from 'express';



export class ratingController {
    private service: IRatingService;

    constructor(service: IRatingService) {
        this.service = service;
    }

    public addRating = async(req: Request, res: Response): Promise<void> => {
        try {
          const { stars, comment, company } = req.body;
          const id = req.query.id as string;
          const rating = await this.service.addRating(id, stars, comment, company);
          res.status(HttpStatus.OK).json({message: HttpResponse.RATING_ADD_SUCCESS, rating});  
        } catch (error) {
           if (error instanceof Error) {
               res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
           } else {
               res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
           }   
        }
    }

    public getRating = async(req: Request, res: Response): Promise<void> => {
        try {
           const ratings = await this.service.getRatings();
           res.status(HttpStatus.OK).json({ message: HttpResponse.RATING_GET_SUCCESS, ratings}) 
        } catch (error) {
          if(error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
          } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR })
          }
        }
    }
}