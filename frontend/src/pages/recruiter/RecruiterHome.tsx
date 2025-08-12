import Footer from "../../components/user/Footer"
import RecruiterHeader from "../../components/recruiter/RecruiterHeader"
import RecruiterImage from '../../assets/RecruiterHome.png'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../../store/store"
import { useState } from "react"
import PremiumModal from "../../components/common/PremiumModal"

const AdminHome = () => {
   
    const [showModal, setShowModal] = useState<boolean>(false)
    const recruiters = useSelector((state: RootState) => state.recruiters.recruiter);
    const navigate = useNavigate();

  return (
    <>
     <RecruiterHeader />
       <div className="bg-white min-h-screen flex flex-col items-center justify-center p-8 mt-1">

        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">

         {/* left section */}
          <div className="md:w-1/2">
           <img src={RecruiterImage} alt="Get Started" className="w-full max-w-md mx-auto"/>
         </div>

         {/* Right section */}
         <div className="md:w-1/2 text-center md:text-left">
         <h1 className="text-4xl font-bold text-gray-800">Find Top Talent with HireHub</h1>
         <p className="text-gray-600 mt-4">Connect with skilled professionals and streamline your hiring process. Start hiring today!</p>
         {!recruiters && <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg" onClick={() => navigate('/recruiter/register')}>Post a Job</button>}
         {recruiters && <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg" onClick={() => navigate('/recruiter/viewUsers')}>Browse Candidates</button>}

         </div>


        </div>
        {/* Premium Section */}
        <div className="max-w-4xl w-full mt-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl shadow-lg flex flex-col md:flex-row items-center p-8 gap-8">
          <div className="flex-1">
            {recruiters?.premium ? (
               <h2 className="text-2xl font-bold text-yellow-700 mb-2">Premium Active</h2>
             ) : (
               <h2 className="text-2xl font-bold text-yellow-700 mb-2">Upgrade to Premium</h2>
             )}
            <p className="text-gray-700 mb-4">
              Unlock exclusive features: priority job listings, direct recruiter messaging, and advanced analytics.
            </p>
            {!recruiters?.premium?.planId && (
             <button
               className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
               onClick={() => {if(recruiters) setShowModal(true); else navigate('/recruiter/login')}}
             >
               Buy Premium Now
             </button>
           )}
          </div>
          </div>
       </div>

       {showModal && (
      <PremiumModal 
      role={'recruiter'}
      onClose={() => {
        setShowModal(false);
        return false
      }}
       />
    )}

     <Footer />
     </>
  )
}

export default AdminHome
