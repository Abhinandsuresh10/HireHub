import { useEffect, useState } from "react";
import { IJob } from "../../types/job.type";
import { fetchJobById } from "../../api/recruiter/jobPost";
import { BadgeCheck, Briefcase, Calendar, Loader, MapPin, X } from "lucide-react";

interface JobCardProps {
  jobId: string;
  onClose:() =>  void;
}

const JobCard: React.FC<JobCardProps> = ({jobId, onClose}) => {
  const [job, setJob] = useState<IJob | null>(null);

  useEffect(() => {
  const fetchJob = async() => {
  const response = await fetchJobById(jobId);
  if(response.data) {
    setJob(response.data.job)
  }
  }
  fetchJob();
  },[jobId]);



  if(!job) {
    return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs flex flex-col items-center">
          <span className="animate-spin text-cyan-700 mb-2">
            <Loader size={20} />
          </span>
          <p className="text-gray-600 text-xs">Loading job details...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30 bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-xs sm:max-w-md md:max-w-lg relative
        max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="mb-2 flex items-center gap-2">
          <Briefcase className="text-cyan-700" size={20} />
          <div>
            <h2 className="text-lg font-bold text-gray-800 break-words">{job.jobRole}</h2>
            <p className="text-gray-500 text-xs">{job.company}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <BadgeCheck size={18} className="text-green-600" />
            <span className="font-medium">{job.jobType}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <MapPin size={18} className="text-cyan-700" />
            <span>{job.jobLocation}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <span className="font-medium">Salary:</span>
            <span>
              ₹{job.minSalary}L - ₹{job.maxSalary}L
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Calendar size={18} className="text-blue-600" />
            <span>
              Deadline:{" "}
              {new Date(job.deadline).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-0.5 text-sm">Job Description</h3>
          <p className="text-gray-700 text-xs break-words">{job.jobDescription}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-0.5 text-sm">Responsibilities</h3>
          <ul className="list-disc list-inside text-gray-700 text-xs space-y-0.5">
            {job.responsibilities.map((item, idx) => (
              <li key={idx} className="text-black px-1.5 py-0.5 rounded text-[10px] font-medium">{item}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-0.5 text-sm">Skills Required</h3>
          <div className="flex flex-wrap gap-1">
            {job.skills.map((item, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-1">
          <h3 className="font-semibold text-gray-800 mb-0.5 text-sm">Qualification</h3>
          <span className="text-black text-xs">{job.qualification}</span>

        </div>
      </div>
    </div>
  )
}

export default JobCard
