import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InterviewSchema, interviewFormData } from "../../schema/Interview.schema";
import { sheduleInterview } from "../../api/recruiter/interview";
import toast from "react-hot-toast";
import { fetchJobById } from "../../api/recruiter/jobPost";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";


const socket:Socket = io("http://localhost:5000");

interface InterviewFormProps {
  application: any;
  onClose: () => void;
}

const InterviewForm = ({ application, onClose }: InterviewFormProps) => {
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<interviewFormData>({
    resolver: zodResolver(InterviewSchema),
  });

  const [timePeriod, setTimePeriod] = useState<'AM' | 'PM'>('AM');
  const [jobRole, setJobRole] = useState('');
  const recruiter = useSelector((state: RootState) => state.recruiterAuth.recruiter)

  useEffect(() => {
    const fetchJob = async () => {
      const response = await fetchJobById(application.jobId);
      if (response.data) {
        setJobRole(response.data.job.jobRole);
        setValue("jobRole", response.data.job.jobRole);
      }
    };
    fetchJob();
  }, [application, setValue]);

  const navigate = useNavigate();

  const onSubmit = async (data: interviewFormData) => {
    const formData = {
      ...data,
      time: `${data.time} ${timePeriod}`,
    };
    const response = await sheduleInterview(formData, application);
    
    const dateFormatted = new Date(data.date).toLocaleDateString();
    const notification = {
      senderId: recruiter._id,
      content:`Your interview has been scheduled on ${dateFormatted} at ${data.time} ${timePeriod} with ${recruiter.company}, by ${recruiter.name}.`,
      userId: application.userId
    }
    socket.emit('shedule_interview', notification);
    
    if (response.data) {
      toast.success(response.data.message);
      navigate(-1);
      onClose();
    }

  };

  return (
    <form
      className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Schedule Interview</h2>
        <p className="text-indigo-100 text-sm mt-1">
          Fill in the details to schedule a new interview
        </p>
      </div>
      <div className="p-6 space-y-5">
        <div>
          <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1.5">
            Job Role <span className="text-red-500">*</span>
          </label>
          <input
            id="jobRole"
            {...register("jobRole")}
            defaultValue={jobRole}
            onChange={e => {
              setJobRole(e.target.value);
              setValue("jobRole", e.target.value);
            }}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="e.g. Senior Software Engineer"
          />
          {errors.jobRole && (
            <p className="text-red-500 text-xs mt-1.5">{errors.jobRole.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="interviewer" className="block text-sm font-medium text-gray-700 mb-1.5">
            Interviewer <span className="text-red-500">*</span>
          </label>
          <input
            id="interviewer"
            {...register("interviewer")}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="e.g. John Smith"
          />
          {errors.interviewer && (
            <p className="text-red-500 text-xs mt-1.5">{errors.interviewer.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Interview Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              {...register("date")}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1.5">{errors.date.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1.5">
              Start Time <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="time"
                  id="time"
                  {...register("time")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                {errors.time && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.time.message}</p>
                )}
              </div>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as 'AM' | 'PM')}
                className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full h-full space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 mt-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            Schedule
          </button>
        </div>
      </div>
    </form>
  );
};

export default InterviewForm;