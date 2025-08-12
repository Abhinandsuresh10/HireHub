import { z } from "zod";

export const InterviewRescheduleSchema = z.object({
  date: z.coerce.date({ required_error: 'Date is required' }),
  time: z.string().min(1, 'Time is required.'),
  period: z.enum(['AM', 'PM'])
}).refine(({ date, time, period }) => {
  const [hours, minutes] = time.split(':').map(Number);
  let hrs = hours;

  // Convert to 24-hour
  if (period === 'PM' && hours < 12) hrs += 12;
  if (period === 'AM' && hours === 12) hrs = 0;

  const selected = new Date(date);
  selected.setHours(hrs, minutes);

  return selected > new Date();
}, {
  message: 'Interview must be scheduled in the future',
  path: ['time']
});

export type RescheduleFormData = z.infer<typeof InterviewRescheduleSchema>;
