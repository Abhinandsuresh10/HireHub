import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InterviewRescheduleSchema, RescheduleFormData } from "../../schema//ResheduleInterview.schema";
import { useState } from "react";
import toast from "react-hot-toast";
import { rescheduleInterview } from "../../api/recruiter/interview";


interface Interview {
    _id: string;
    username: string;
    jobRole: string;
    interviewer: string;
    interviewType: string;
    date: Date;
    time: string;
}

interface RescheduleModalProps {
    onClose: () => void;
    interview: Interview;
}


const ResheduleModal = ({ onClose, interview }: RescheduleModalProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<RescheduleFormData>({
        resolver: zodResolver(InterviewRescheduleSchema),
        defaultValues: {
            date: new Date(interview.date),
            time: interview.time.split(" ")[0],
            period: interview.time.includes("PM") ? "PM" : "AM"
        }
    });
    const [period, setPeriod] = useState<'AM' | 'PM'>(interview.time.includes('PM') ? 'PM' : 'AM');

    const onSubmit = async (data: RescheduleFormData) => {
        const finalTime = `${data.time} ${period}`;
    
        try {
              const res = await rescheduleInterview(interview._id, {
                date: data.date,
                time: finalTime,
              });

              toast.success(res.data.message);
            onClose();
        } catch (err) {
            toast.error("Failed to reschedule");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Reschedule Interview</h2>

                <div>
                    <label>Date</label>
                    <input type="date" {...register("date")} className="input-field" />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>

                <div>
                    <label>Time</label>
                    <div className="flex gap-3">
                        <input type="time" {...register("time")} className="input-field" />
                        <select {...register("period")} className="input-field">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                    {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-2 py-2 bg-red-400 rounded-lg text-white">Cancel</button>
                    <button type="submit" className="px-2 py-2 bg-blue-400 rounded-lg text-white">Update</button>
                </div>
            </form>
        </div>
    );
};

export default ResheduleModal;
