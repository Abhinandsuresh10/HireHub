import { User2 } from "lucide-react"
import { IRecruiter } from "../../types/recruiter.types"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useState } from "react"
import PremiumModal from "../common/PremiumModal"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { viewedRecruiter } from "../../api/user/users"

interface Recruiter {
    recruiter: IRecruiter
}

const ViewRecruiterCard:React.FC<Recruiter> = ({recruiter}) => {

  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state: RootState) => state.users.user);

  const navigate = useNavigate();
  const handleRecruiterView = async (id: string) => {
     
      try {
         const response = await viewedRecruiter(user._id);
         if(response.data){
         navigate(`/viewAnyRecruiter/${id}`);
         } 
         } catch (error) {
           if(error instanceof AxiosError) {
            if (error?.response?.status === 403) {
           toast.error(error.response.data?.error || "View limit reached.");
           setShowModal(true)
         } else {
           toast.error("Something went wrong while viewing recruiter.");
           console.error(error); // Only log unexpected errors
         }
         }
        }
  }

  return (
 <div className="bg-white rounded-2xl min-h-30 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4 w-full max-w-md mx-auto border border-gray-200">
  {/* Avatar */}
  <div className="flex-shrink-0">
    {recruiter.imageUrl ? (
      <img
        src={recruiter.imageUrl}
        alt={recruiter.name}
        className="w-16 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 shadow-sm">
        <User2 className="w-8 h-8 text-gray-400" />
      </div>
    )}
  </div>

  {/* User Info and Button */}
  <div className="flex flex-col justify-between flex-grow h-full">
    {/* Text Info */}
    <div className="space-y-1">
      <p className="text-base font-medium text-gray-900 leading-none">{recruiter.name}</p>
      <p className="text-sm text-gray-500 leading-none">{recruiter.email}</p>
      {recruiter.industry && (
        <p className="text-sm text-gray-600 leading-none">📍 {recruiter.industry}</p>
      )}
    </div>

    {/* Button + Premium */}
    <div className="flex justify-between items-center mt-3">
      <button className="text-sm px-4 py-1 bg-black text-white rounded-full hover:bg-gray-800 transition-all" 
      onClick={() => handleRecruiterView(recruiter._id)}
      >
        View Profile
      </button>
      {recruiter.premium?.planId && (
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">
          Premium
        </span>
      )}
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



  )
}

export default ViewRecruiterCard
