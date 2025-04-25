import Footer from "../../components/user/Footer"
import RecruiterHeader from "../../components/recruiter/RecruiterHeader"
import RecruiterImage from '../../assets/RecruiterHome.png'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const AdminHome = () => {

    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

  return (
    <>
     <RecruiterHeader />
       <div className="bg-white min-h-screen flex flex-col items-center justify-center p-8 mt-1">

        {/* Search-bar */}
        {/* <div className="w-full max-w-lg mb-8 flex items-center space-x-2">
            <input type="text" placeholder="Search for jobs" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"/>
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg">Search</button>
        </div> */}


        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">

         {/* left section */}
          <div className="md:w-1/2">
           <img src={RecruiterImage} alt="Get Started" className="w-full max-w-md mx-auto"/>
         </div>

         {/* Right section */}
         <div className="md:w-1/2 text-center md:text-left">
         <h1 className="text-4xl font-bold text-gray-800">Find Top Talent with HireHub</h1>
         <p className="text-gray-600 mt-4">Connect with skilled professionals and streamline your hiring process. Start hiring today!</p>
         {!user && <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg" onClick={() => navigate('/recruiter/register')}>Post a Job</button>}
         {user && <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">Browse Candidates</button>}

         </div>

        </div>
       </div>

     <Footer />
     </>
  )
}

export default AdminHome
