export interface GroupedRatingResponse {
  data: CompanyRatingGroup[];
}

export interface CompanyRatingGroup {
  company: string;
  ratings: RatingDetail[];
}

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
