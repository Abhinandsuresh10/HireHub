import { User2 } from "lucide-react";
import { Iuser } from "../../types/user.types"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import toast from "react-hot-toast";
import { checkDayVisitedComplete } from "../../api/recruiter/recriuters";
import { AxiosError } from "axios";
import { useState } from "react";
import PremiumModal from "../common/PremiumModal";

interface ViewUserCardProps {
  user: Iuser;
}


const ViewUserCard:React.FC<ViewUserCardProps> = ({ user }) => {
 const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);
 const [modal, setModal] = useState(false);

  // handling user full details page navigation...
  const navigate = useNavigate();
  const handleViewUser = async (id: string) => {
    try {
      const response = await checkDayVisitedComplete(recruiter._id);
       if(response.data){
         navigate(`/recruiter/viewUserDetails/${id}`);
       } 
      } catch (error) {
      if(error instanceof AxiosError) {
       if (error?.response?.status === 403) {
        setModal(true)
      toast.error(error.response.data?.error || "View limit reached.");
    } else {
      toast.error("Something went wrong while viewing job.");
      console.error(error); // Only log unexpected errors
    }
    }
   }

  }

  return (
    <>
<div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-5 w-full max-w-md mx-auto border border-gray-200">
  {/* Avatar */}
  <div className="flex-shrink-0">
    {user.imageUrl ? (
      <img
        src={user.imageUrl}
        alt={user.name}
        className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 shadow-sm">
        <User2 className="w-8 h-8 text-gray-400" />
      </div>
    )}
  </div>

  {/* User Info and Button */}
  <div className="flex flex-col justify-between flex-grow">
    <div className="space-y-0.5">
      <p className="text-base font-semibold text-gray-900">{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
      {user.location && (
        <p className="text-sm text-gray-600">📍 {user.location}</p>
      )}
    </div>

    <div className="mt-3">
      <button
        onClick={() => handleViewUser(user._id)}
        className="text-xs sm:text-sm px-4 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 shadow-sm transition-all"
      >
        View Profile
      </button>
    <div className="w-full flex justify-end">
      {user.premium && user.premium.planId && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            Premium
          </span>
         }
    </div>
    </div>
  </div>
</div>
{modal && (
      <PremiumModal 
      role={'recruiter'}
      onClose={() => {
        setModal(false);
        return false
      }}
       />
    )}
</>
  )
}

export default ViewUserCard
