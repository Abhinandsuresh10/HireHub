import { useSelector } from "react-redux"
import RecruiterHeader from "../../components/recruiter/RecruiterHeader"
import Footer from "../../components/user/Footer"
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";


const RecruiterProfile = () => {

  const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);
  const navigate = useNavigate();
  return (
    <>
    <RecruiterHeader />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Recruiter Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Recruiter Info */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
          {recruiter.imageUrl ? (
           <img
              className="w-24 h-24 rounded-full object-cover"
              src={recruiter.imageUrl}
             alt="Recruiter Avatar"
             />
           ) : (
            <FaUserCircle className="text-gray-500 w-24 h-24" />
          )}
          <h3 className="mt-4 text-lg font-semibold">{recruiter.name}</h3>
            <p className="text-gray-500"> @{recruiter.company}</p>
          </div>

          <div className="mt-4 text-sm">
            <p><span className="font-semibold">Email:</span> {recruiter.email} </p>
            <p><span className="font-semibold">Phone:</span> {recruiter.mobile}</p>
          </div>
        </div>

        {/* Right Side - Company & Hiring Info */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Company Details</h4>
          <p className="text-gray-700"><span className="font-semibold">Company:</span> {recruiter.company}</p>
          <p className="text-gray-700"><span className="font-semibold">Industry:</span> {recruiter.industry} </p>

          <div className="mt-4">
            <h4 className="font-semibold">Hiring Information</h4>
            <p className="text-gray-600 text-sm">{recruiter.hiringInfo}</p>
          </div>

          <div className="mt-6 flex space-x-3">
            <button onClick={() => navigate('/recruiter/editProfile')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
  </>
  )
}

export default RecruiterProfile
