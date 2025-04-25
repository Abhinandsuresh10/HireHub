import React from 'react';
import { Building2, Briefcase, MapPin, Banknote, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobsCardProps {
  job: {
    _id: string;
    company: string;
    jobType: string;
    jobLocation: string;
    jobRole: string;
    minSalary: string | number;
    maxSalary: string | number;
  };
  handleDeleteJob: (id: string) => void;
}

const JobsCard: React.FC<JobsCardProps> = ({ job, handleDeleteJob }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-indigo-100 transition-all duration-200 shadow-2xl" >
      <div className="flex flex-col space-y-4">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900">{job.company}</h3>
            <div className="mt-2 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm">{job.jobType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{job.jobLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role & Salary Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-medium">{job.jobRole}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg w-fit">
            <Banknote className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {job.minSalary}LPA - {job.maxSalary}LPA
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex gap-3 pt-2">
          <button 
          onClick={() => navigate(`/recruiter/editJob/${job._id}`)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:text-white hover:bg-indigo-500 transition-colors duration-200">
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDeleteJob(job._id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:text-white font-medium hover:bg-red-500 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsCard;
