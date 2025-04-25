import { z } from "zod";

export const schema = z.object({
    Email: z.string().email('Invalid email format'),
    Password: z.string().min(6, 'password must be atleast 6 charcters')
});
