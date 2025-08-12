export interface IRecruiter {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
    company: string;
    hiringInfo?: string;
    industry?: string;
    premium?: {
        planId?: string,
        startsAt: Date,
        date?: Date
    }
}