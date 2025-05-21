import { z } from "zod";

export const InterviewSchema = z.object({
    jobRole: z.string().min(1, 'JobRole is required'),
    interviewer: z.string().min(1, 'Interviewer is Required'),
    date: z.coerce.date({ required_error: 'Deadline is required' }).refine(
    (date) => date > new Date(), 
    { message: 'date must be a future date' }
    ),
    time: z.string().min(1, 'Time is required.')
  });
  
  export type interviewFormData = z.infer<typeof InterviewSchema>;