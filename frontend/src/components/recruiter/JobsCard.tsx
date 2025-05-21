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
    <div className="p-5 shadow-xl rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50 group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {job.company}
            </h3>
            <div className="flex flex-wrap gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>{job.jobType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{job.jobLocation}</span>
              </div>
            </div>
          </div>
        </div>
        <span className="px-2 py-1 text-xs rounded-lg bg-indigo-100 font-medium">
          {job.jobRole}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center text-sm">
          <Banknote className="h-4 w-4 text-green-600 mr-2" />
          <span className="text-gray-600">
            {job.minSalary}LPA - {job.maxSalary}LPA
          </span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => navigate(`/recruiter/editJob/${job._id}`)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:text-white hover:bg-indigo-500 transition-colors flex items-center"
        >
          <Pencil className="h-4 w-4 mr-1.5" />
          Edit
        </button>
        <button
          onClick={() => handleDeleteJob(job._id)}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:text-white hover:bg-red-600 transition-colors flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobsCard;
