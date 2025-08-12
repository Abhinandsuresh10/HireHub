export interface IJob {
    _id: string;
    recruiterId: string;
    jobRole: string;
    jobType: string;
    jobLocation: string;
    minSalary: number;
    maxSalary: number;
    jobDescription: string;
    responsibilities: string[];
    skills: string[];
    qualification: string;
    deadline: Date;
    company: string;
}