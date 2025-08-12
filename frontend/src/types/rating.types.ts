export interface RatingDetail {
  _id: string;
  stars: number;
  comment: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    imageUrl: string;
  };
}

export interface CompanyRatingGroup {
  company: string;
  ratings: RatingDetail[];
}
