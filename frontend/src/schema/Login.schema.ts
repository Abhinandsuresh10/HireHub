import { z } from "zod";

export const schema = z.object({
    Email: z.string().email('Invalid email format'),
    Password: z.string().min(6, 'password must be atleast 6 charcters')
});

export const resetSchmea = z.object({
    NewPassword: z.string().min(6, 'New password must be at least 6 characters'),
    ConfirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.NewPassword === data.ConfirmPassword , {
    message: 'Password do not match',
    path: ['ConfirmPassword'],
})