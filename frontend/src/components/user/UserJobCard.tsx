import { viewedJobs } from "../../api/user/users";
import { getAppliedJobApplication } from "../../api/user/userApplication";
import { RootState } from "../../store/store";
import { Building2, Briefcase, MapPin, Banknote } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import PremiumModal from "../common/PremiumModal";

interface UserJobCardProps {
  job: {
    _id: string;
    company: string;
    jobType: string;
    jobLocation: string;
    jobRole: string;
    minSalary: string | number;
    maxSalary: string | number;
    createdAt: string;
  };
  handleApply: (id: string) => void;
}

const UserJobCard: React.FC<UserJobCardProps> = ({ job, handleApply }) => {
  const navigate = useNavigate();
  const [applied, SetApplied] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false)

  const user = useSelector((state: RootState) => state.users.user);

     function formatPostedTime(createdAt: string): string {
       const postDate = new Date(createdAt);
       const now = new Date();
       const diffMs = now.getTime() - postDate.getTime();
       const diffMinutes = Math.floor(diffMs / (1000 * 60));
       const diffHours = Math.floor(diffMinutes / 60);
     
       if (diffMinutes < 1) return 'Just now';
       if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
       if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
     
       return postDate.toLocaleDateString("en-US", {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
       });
    }

  useEffect(() => {
    const fetchIsApplied = async () => {
      const response = await getAppliedJobApplication(user._id, job._id);
      if(response.data.application) {
        SetApplied(false);
      }
    }
    fetchIsApplied();
  }, [user, job]);

  const handleViewJob = async (job) => {
    try {
    const response = await viewedJobs(user._id);
    if(response.data){
    navigate(`/viewJob`, { state: { job } }) 
    } 
    } catch (error) {
      if(error instanceof AxiosError) {
       if (error?.response?.status === 403) {
      toast.error(error.response.data?.error || "View limit reached.");
      setShowModal(true)
    } else {
      toast.error("Something went wrong while viewing job.");
      console.error(error); // Only log unexpected errors
    }
    }
   }
  }

  if(!job) return (
    <div className="flex w-full h-full items-center justify-center">
      Loading...
    </div>
  )

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-indigo-100 transition-all duration-200 shadow-2xl">
      <div className="flex flex-col space-y-4">
        {/* Header Section */}
          <p className="text-xs text-gray-700">posted <span className="text-green-600">{formatPostedTime(job.createdAt)}</span></p>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-grow">
            <span className="text-lg font-semibold text-gray-900">{job.jobRole}</span>
            
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
            <h3 className="font-medium">{job.company}</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg w-fit">
            <Banknote className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {job.minSalary} ₹ - {job.maxSalary} ₹
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => handleViewJob(job)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors duration-200"
          >
            View
          </button>
          {applied ? "": (<button
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg shadow text-blue-600 font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Applied
          </button>)}

        </div>
      </div>
      {showModal && (
      <PremiumModal 
      role={'user'}
      onClose={() => {
        setShowModal(false);
        return false
      }}
       />
    )}
    </div>
  );
};

export default UserJobCard;
