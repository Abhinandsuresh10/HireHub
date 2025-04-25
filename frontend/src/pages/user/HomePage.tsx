import Footer from "../../components/user/Footer"
import Header from "../../components/user/Header"
import GetStarted from '../../assets/get-started-image.webp'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from "react"



const HomePage = () => {
  const [search, setSearch] = useState('')
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
     <>
     <Header />
       <div className="bg-white min-h-screen flex flex-col items-center justify-center p-8 mt-1">

        {/* Search-bar */}
        <div className="w-full max-w-lg mb-8 flex items-center space-x-2">
            <input type="text" placeholder="Search for jobs"  onChange={(e) => setSearch(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"/>
            
        </div>


        {search.length > 0 && (
           <div className="w-screen h-screen p-6">

            {/* search job card */}

         {/* <div className="w-full flex justify-center">
           <div
             key={1}
             className="w-[900px] sm:w-[550px] md:w-[550px] lg:w-[550px] xl:w-[600px] flex flex-col items-start p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
           >
             <div className="flex items-center gap-4 mb-4">
               <FaBuilding className="w-8 h-8 text-gray-500" />
               <div>
                 <p className="font-semibold text-lg text-gray-800">Flipkart</p>
                 <p className="text-sm text-gray-500">Developer - Kerala</p>
                 <p className="text-sm text-gray-500">Padipppi</p>
               </div>
             </div>
             <p className="text-sm font-medium px-2 py-1 bg-green-200 rounded text-gray-700">
               Salary: 10,000 - 30,000
             </p>
           </div>
         </div> */}
            </div>
          )}
       
       

        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
         
         {/* Left section */}
         <div className="md:w-1/2 text-center md:text-left">
         <h1 className="text-4xl font-bold text-gray-800">Find Your Dream Job with HireHub</h1>
         <p className="text-gray-600 mt-4">Connect with top recruiters and land your next opportunity effortlessly. Start your journey today!</p>
         {!user && <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg" onClick={() => navigate('/register')}>Get Started</button>}
         {user && <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">Find Job</button>}
         </div>


         {/* Right section */}
          <div className="md:w-1/2">
           <img src={GetStarted} alt="Get Started" className="w-full max-w-md mx-auto"/>
         </div>

        </div>
       </div>

     <Footer />
     </>
  )
}

export default HomePage
