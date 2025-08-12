import RatingAPI from "../../config/ratingApi";
import { handleAxiosError } from "../../utils/HandleError"


export const addRating = async (id: string, comment: string, stars: number, company: string) => {
     try {
        const response = await RatingAPI.post(`/rating?id=${id}`, { stars, comment, company});
        return response;
     } catch (error) {
        throw handleAxiosError(error);
     }
}

export const getComments = async () => {
   try {
     const response = await RatingAPI.get('/rating');
     return response;
   } catch (error) {
     throw handleAxiosError(error); 
   }
}