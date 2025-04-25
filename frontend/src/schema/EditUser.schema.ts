import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  location: z.string().min(1, 'Location is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  image: z.string().optional(), 
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
