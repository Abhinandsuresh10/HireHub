import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/user/Footer";
import Header from "../../components/user/Header";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { addResume } from "../../api/user/users";
import toast from "react-hot-toast";
import { addUser } from "../../store/slices/userDataSlice";
import { Link, useNavigate } from "react-router-dom";
import WorkExperience from "./AddExperience";
import Education from "./Education";


const Profile = () => {
  const user = useSelector(state => state.users.user);
  const [resume , setResume] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResume = async() => {
    if(!resume) toast.error('please select a resume')
    const formData = new FormData();
    formData.append('resume', resume);
    const userId = user._id;
    try {
      
      const response = await addResume(formData, userId);
      if(response){
        dispatch(addUser({user: response.data.user}))
        toast.success(response.data.message);
        setResume(null)
      } else {
        toast.error('failed to upload resume')
      }
    } catch (error) {
      console.log(error)
    }
  }

    return (
        <>
     <Header />
      <div className="max-w-5xl mx-auto p-6">
        {/* Profile Header */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white shadow-xl rounded-xl p-6 flex flex-col items-center max-h-[460px]">
            {user.imageUrl ? (<img
              src={user.imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-gray-200"
            />) : (<FaUserCircle className="text-gray-500 w-22 h-28" />)}
            
            <h2 className="text-xl font-semibold">{user.name || ''}</h2>
            <p className="text-gray-500 text-sm">{user.jobTitle || ''}</p>
            <p className="text-gray-500 text-sm">{user.location || ''}</p>
            <p className="text-gray-500 text-sm">
              {user.email} 
            </p>
            <p className="text-gray-500 text-sm">
              {user.mobile}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600" onClick={() => navigate('/editProfile')}>
              Edit Profile
            </button>
            <div className="w-full px-4 py-2 mt-6 shadow-md h-auto rounded-lg flex justify-between items-center bg-white">
             <Link to='/myJobs' className="px-4 py-1.5 bg-gray-200 text-sm text-gray-700 rounded-lg">
               My Jobs
             </Link>
             <button className="px-4 py-1.5 bg-gray-200 text-sm text-gray-700 rounded-lg">
               Preferred Jobs
             </button>
           </div>

          </div>
  
          {/* Work Experience & Education */}
          <div className="md:col-span-2 bg-white shadow-xl rounded-xl p-6">
            <WorkExperience />
  
            <Education />
          </div>
        </div>
  
        {/* Skills Section */}
        <div className="mt-6 bg-white shadow-2xl rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["JavaScript", "MongoDB", "Node.js", "Express.js", "React.js"].map(
              (skill, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-lg"
                >
                  {skill}
                </span>
              )
            )}
            <button className="ml-2 text-blue-500">Add More +</button>
          </div>
        </div>
  
        {/* Resume & Portfolio */}
        <div className="mt-6 bg-white shadow-2xl rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Add Your Resume & Portfolio</h3>
          <p className="text-gray-600 text-sm">
            Showcase your skills and let jobs and companies find you.
          </p>
          <p className="text-gray-600 text-sm">Easily apply to jobs and get hired faster.</p>
          <p className="text-gray-600 text-sm">Get customized job suggestions.</p>
  
          <div className="mt-4">
            <a href="https://yourportfolio.com" className="text-blue-500">
              🔗 https://yourportfolio.com
            </a>
          </div>
  
          <div className="mt-4">
            {!resume  && (<> <label
               htmlFor="resume-upload"
               className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200"
             >
               Select Resume
             </label>
             <input
               id="resume-upload"
               type="file"
               accept=".pdf,application/pdf"
               className="hidden"
               onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setResume(file);
                }
              }} 
             /></>) }
            {resume && <button className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 transition duration-200" onClick={handleResume}>Upload Resume</button>}
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  };
  
  export default Profile;
  
