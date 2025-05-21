import {  BriefcaseIcon, CalendarIcon, EyeIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"


const ApplicantCard = ({applicant}) => {
  const navigate = useNavigate();
  return (
  <div
    key={applicant.id}
    className="p-5 shadow-xl rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50 group"
  >
    
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {applicant.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{applicant.email}</p>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${
        applicant.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
        applicant.status === 'Hired' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        {applicant.status}
      </span>
    </div>
  
    <div className="mt-3 space-y-1.5">
      <div className="flex items-center text-sm">
        <BriefcaseIcon className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-600">Applied for: <span className="font-medium">{applicant.job}</span></span>
      </div>
      <div className="flex items-center text-sm">
        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-gray-600">{new Date(applicant.appliedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</span>
      </div>
    </div>
  
    <div className="mt-4 flex space-x-2">
      <button onClick={() => navigate(`/recruiter/userProfile/${applicant.userId}/${applicant.id}`)} className="px-3 py-1.5 text-sm font-medium rounded-lg  bg-indigo-50 text-indigo-600 hover:text-white hover:bg-indigo-500 transition-colors flex items-center">
        <EyeIcon className="h-4 w-4 mr-1.5" />
        View Profile
      </button>
      {applicant.status === "ShortListed" &&  (<button className="px-3 py-1.5 text-sm font-medium rounded-lg  bg-indigo-50 text-emerald-600 hover:text-white hover:bg-emerald-800 transition-colors">
        Message
      </button>)}
    </div>
  </div>
  )
}

export default ApplicantCard
