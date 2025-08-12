import { z } from "zod";

// Function to convert 12-hour time + AM/PM to 24-hour format
function convertTo24Hour(time: string, period: 'AM' | 'PM') {
  const [hour, minute] = time.split(":").map(Number);
  let hrs = hour;

  if (period === "PM" && hour !== 12) hrs += 12;
  if (period === "AM" && hour === 12) hrs = 0;

  return `${hrs.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

export const InterviewSchema = z
  .object({
    jobRole: z.string().min(1, "JobRole is required"),
    interviewer: z.string().min(1, "Interviewer is Required"),
    interviewType: z.string(),
    date: z.coerce.date({ required_error: "Date is required" }),
    time: z.string().min(1, "Time is required."),
    timePeriod: z.enum(["AM", "PM"]),
  })
  .refine(({ date, time, timePeriod }) => {
    const convertedTime = convertTo24Hour(time, timePeriod);
    const isoDate = date.toISOString().split("T")[0];
    const fullDateTime = new Date(`${isoDate}T${convertedTime}`);

    return fullDateTime > new Date();
  }, {
    message: "Interview must be scheduled in the future",
    path: ["time"],
  });

export type interviewFormData = z.infer<typeof InterviewSchema>;
