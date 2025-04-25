import { z } from 'zod';

export const schema = z.object({
    FullName: z.string().min(1, 'Full Name is required'),
    Mobile: z.string()
        .regex(/^[0-9]{10}$/, 'Mobile must be 10 digits')
        .min(10, 'Mobile must be 10 digits'),
    Email: z.string().email('Invalid email format'),
    Company: z.string().min(4, 'Company is required'),
    Password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.Password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
