import { IRating } from "../../models/RatingSchema";
import { GroupedRatingResponse } from "../../types/rating.types";



export interface IRatingRepository {
    addRating(userId: string, stars: number, comment: string, company: string): Promise<IRating | null>
    getRatings(): Promise<GroupedRatingResponse | null>;
}