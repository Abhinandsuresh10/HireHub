import { HttpResponse } from "../../constants/response.message";
import { IRating } from "../../models/RatingSchema";
import { ratingRepository } from "../../repositories/impliments/ratingRepository";
import { IRatingRepository } from "../../repositories/interface/IRatingRepository";
import { GroupedRatingResponse } from "../../types/rating.types";
import { IRatingService } from "../interface/IRatingService";


export class RatingService implements IRatingService {
    private RatingRepository: IRatingRepository;

    constructor(RatingRepository: ratingRepository) {
         this.RatingRepository = RatingRepository;
    }

    async addRating(id: string, stars: number, comment: string, company: string): Promise<IRating | null> {
        try {
         const userId = id as string;
         return await this.RatingRepository.addRating(userId, stars, comment, company);   
        } catch (error) {
          if (error instanceof Error) {
               throw error;
           } else {
               throw new Error(HttpResponse.UNKNOWN_ERROR);
           }   
        }
    }

    async getRatings(): Promise<GroupedRatingResponse | null> {
        try {
          return await this.RatingRepository.getRatings();  
        } catch (error) {
         if (error instanceof Error) {
             throw error;
         } else {
             throw new Error(HttpResponse.UNKNOWN_ERROR);
         }       
        }
    }

}