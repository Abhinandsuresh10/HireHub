import Rating, { IRating } from "../../models/RatingSchema";
import { GroupedRatingResponse } from "../../types/rating.types";
import { IRatingRepository } from "../interface/IRatingRepository";
import { BaseRepository } from "./baseRepository";




export class ratingRepository extends BaseRepository<IRating> implements IRatingRepository {
      constructor() {
        super(Rating)
      }

      async addRating(userId: string, stars: number, comment: string, company: string): Promise<IRating | null> {
          try {
          const rating = new Rating({
            userId,
            stars,
            comment,
            company
          });

          rating.save();
          return rating;
          } catch (error) {
          console.log(error);
          throw new Error('Error on adding stars')
          }
      }

     async getRatings(): Promise<GroupedRatingResponse | null> {
          try {
           const grouped = await Rating.aggregate([
            {
              $addFields: {
                userIdObj: { $toObjectId: '$userId' }
              }
            },
            { 
              $lookup: {
                from: 'users',
                localField: 'userIdObj',
                foreignField: '_id',
                as: 'user'
            }
          }, {
            $unwind: '$user'
          },
          {
            $group: {
              _id: '$company',
              ratings: {
                $push: {
                  _id: '$_id',
                  stars: '$stars',
                  comment: '$comment',
                  createdAt: '$createdAt',
                  user: {
                     _id: '$user._id',
                     name: '$user.name',
                     imageUrl: '$user.imageUrl'
                  }
                }
              }
            }
          }, {
            $project: {
              company: '$_id',
              ratings: 1,
              _id: 0
            }
          }
           ]);
           
          return { data: grouped };
          } catch (error) {
          console.log(error);
          throw new Error('Error on getting stars')
          }
      }
      
}