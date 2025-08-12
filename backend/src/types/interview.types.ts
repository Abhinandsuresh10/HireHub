export interface InterviewType {
    applicationId?: string;
    jobId?: string;
    userId?: string;
    recruiterId?: string;
    jobRole: string;
    interviewer: string;
    interviewType: string;
    round?: string;
    date: Date;
    time: string;
}