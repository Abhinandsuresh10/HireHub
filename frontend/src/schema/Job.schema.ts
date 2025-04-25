import { z } from 'zod';

export const jobSchema = z.object({
  jobRole: z.string().min(1, 'Job Role is required'),
  jobType: z.string().min(1, 'Job Type is required'),
  jobLocation: z.string().min(1, 'Job Location is required'),
  minSalary: z.coerce.number().min(1, 'Minimum Salary is required'),
  maxSalary: z.coerce.number().min(1, 'Maximum Salary is required'),
  jobDescription: z.string().min(10, 'Job Description must be at least 10 characters long'),
  responsibilities: z.array(z.string().min(1, "Responsibility cannot be empty")),
  skills: z.array(z.string().min(1, "Skill cannot be empty")),
  qualification: z.string().min(1, 'Qualification is required'),
  deadline: z.coerce.date({ required_error: 'Deadline is required' }).refine(
    (date) => date > new Date(), 
    { message: 'Deadline must be a future date' }
  ),
});
