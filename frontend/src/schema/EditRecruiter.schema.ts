import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  industry: z.string().min(1, 'Industry is required'),
  hiringInfo: z.string().min(10, 'Hiring Information must be at least 10 charcters'),
  image: z.string().optional(), 
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
