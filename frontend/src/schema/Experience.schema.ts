import { z } from "zod";

export const experienceSchema = z.object({
    jobTitle: z.string().min(1, 'JobTitle is required'),
    company: z.string().min(1, 'Company is Required'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    achievements: z.string().min(10, 'acheivements must be at least 10 character long.'), 
  }).refine(data => data.startDate <= data.endDate, {
    message: "Start date must be before end date",
    path: ['endDate'], 
  });;
  
  export type experienceFormData = z.infer<typeof experienceSchema>;