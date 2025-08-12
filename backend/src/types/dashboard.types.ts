export interface IDashobardStats {
    users: number,
    recruiters: number,
    listing: number,
    jobs: number,
    applications: number,
    interviews: number
}

export interface IRecruiterDashboardUser {
    _id?: string;
    applicationId?: string;
    name: string,
    imageUrl: string;
    date: Date;
    jobRole: string;
    status: string;
}

export interface IRecruiterDashboardGraphData {
    name: string;
    applicants: number;
    interviews: number;
}