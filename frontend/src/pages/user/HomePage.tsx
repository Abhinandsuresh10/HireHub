import Footer from "../../components/user/Footer"
import Header from "../../components/user/Header"
import GetStarted from '../../assets/get-started-image.webp'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../../store/store"
import { useState } from "react"
import PremiumModal from "../../components/common/PremiumModal"

const HomePage = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-8 mt-1">
        {/* Hero Section */}
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
          {/* Left section */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find Your Dream Job with <span className="text-blue-600">HireHub</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Connect with top recruiters and land your next opportunity effortlessly. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
              {!user && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </button>
              )}
              {user && (
                <div className="space-x-2">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
                  onClick={() => navigate('/jobs')}
                >
                  Find Job
                </button>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow" onClick={() => navigate('/viewRecruiters')}>Top Recruiters</button>
                 </div>
              )}
            </div>
          </div>
          {/* Right section */}
          <div className="md:w-1/2">
            <img src={GetStarted} alt="Get Started" className="w-full max-w-md mx-auto rounded-xl hover:shadow-lg transition" />
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Personalized Job Matches</h3>
            <p className="text-gray-600">Get job recommendations tailored to your skills and interests.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Direct Recruiter Chat</h3>
            <p className="text-gray-600">Connect instantly with recruiters and get noticed faster.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Track Your Applications</h3>
            <p className="text-gray-600">Easily manage and track all your job applications in one place.</p>
          </div>
        </div>

        {/* Premium Section */}
        <div className="max-w-4xl w-full mt-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl shadow-lg flex flex-col md:flex-row items-center p-8 gap-8">
          <div className="flex-1">
            
            {user?.premium ? (
               <h2 className="text-2xl font-bold text-yellow-700 mb-2">Premium Active</h2>
             ) : (
               <h2 className="text-2xl font-bold text-yellow-700 mb-2">Upgrade to Premium</h2>
             )}
            <p className="text-gray-700 mb-4">
              Unlock exclusive features: priority job listings, direct recruiter messaging, and advanced analytics.
            </p>
            {!user?.premium?.planId && (
             <button
               className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
               onClick={() => {if(user) setShowModal(true); else navigate('/login')}}
             >
               Buy Premium Now
             </button>
           )}
              
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Premium"
              className="w-32 h-32"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl w-full mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">10,000+</div>
            <div className="text-gray-600">Jobs Posted</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">5,000+</div>
            <div className="text-gray-600">Active Recruiters</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">50,000+</div>
            <div className="text-gray-600">Job Seekers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl w-full mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-16 h-16 rounded-full mb-4" />
              <p className="text-gray-700 italic">"HireHub helped me land my dream job in just two weeks!"</p>
              <div className="mt-2 font-semibold text-blue-700">Rahul S.</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-16 h-16 rounded-full mb-4" />
              <p className="text-gray-700 italic">"The premium features are totally worth it. Highly recommended!"</p>
              <div className="mt-2 font-semibold text-blue-700">Priya M.</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" className="w-16 h-16 rounded-full mb-4" />
              <p className="text-gray-700 italic">"Easy to use and great support from the HireHub team."</p>
              <div className="mt-2 font-semibold text-blue-700">Amit K.</div>
            </div>
          </div>
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

      <Footer />
    </>
  )
}

export default HomePage