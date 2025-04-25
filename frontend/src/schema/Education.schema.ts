import { z } from "zod";

export const educationShcema = z.object({
    education: z.string().min(3, {message: 'Education must be atleast 3 charcters long.'}),
    institute: z.string().min(3, {message: 'Institute must be atleast 3 charcters long.'}),
    graduateDate: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date < new Date();
      },{message: 'Please enter a valid past date'})
});


export type EducationFormData = z.infer<typeof educationShcema>;