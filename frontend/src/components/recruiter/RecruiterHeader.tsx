import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/recruiterSlice";
import toast from "react-hot-toast";
import { removeRecruiter } from "../../store/slices/recruiterDataSlice";
import { MessagesSquare } from "lucide-react";
import { RootState } from "@/store/store";

const RecruiterHeader = () => {

    const boxRef = useRef(null);
  
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);

    const handleDropdownToggle = () => {
      setDropdownOpen(!dropdownOpen); 
    };
      
    const dispatch = useDispatch();
    const handleLogut = () => {
      const logoutPer = window.confirm('are you sure Logout ?');
      if(logoutPer) {
        toast.success('Logout success')
        dispatch(logout());
        dispatch(removeRecruiter());
      }
    }

  return (
<div className="bg-white shadow-md p-4 flex justify-between items-center w-full">
      <h1 className="font-extrabold text-3xl text-gray-900 tracking-wide uppercase transition-all duration-500 ease-in-out hover:text-blue-500">
        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text transition-all duration-500 ease-in-out hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-700">
          Hire<span className="text-black transition-all duration-500 ease-in-out hover:text-blue-500">Hub</span>
        </span>
      </h1>

        

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/recruiter/jobs">Manage Jobs</Link>
            <a href="#companies">Dashboard</a>
            <Link to='/recruiter/profile' className="text-gray-800 hover:text-blue-600">Profile</Link>
          </nav>

          {/* Login Button & Recruiter Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {!recruiter && <Link to='/recruiter/login' className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</Link> }
            {recruiter && (
              <div className="relative group">
                <button className="w-2 h-4 mr-6" onClick={() => navigate(`/recruiter/chat/recruiter/${recruiter._id}`)}>
                  <MessagesSquare/>
                </button>
              <button onClick={handleDropdownToggle} className="transition-all duration-500 ease-in-out hover:bg-gray-100 text-black px-4 py-2 rounded-lg"
              >{recruiter.email.split('@')[0]} ↓</button> 
              {dropdownOpen && (
              <div ref={boxRef} className="absolute right-0 group-hover:block bg-gray-100 shadow-lg rounded-md mt-1 w-40 z-50">
              <button 
                onClick={handleLogut}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:shadow-2xl"
              >
                Logout ←
                </button>
                </div>
              )}
              </div>
              )}
            {!recruiter && <Link to='/' className="text-gray-800 hover:text-blue-600 flex items-center gap-1"> | User</Link>}
            
          </div>

          {/* Mobile menu button */}

          <div className="md:hidden flex items-center space-x-4">
            {!recruiter && (
             <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</button>
            <Link to='/' className="text-gray-800 hover:text-blue-600 flex items-center gap-1"> | User</Link>
            </div>)}
            <button className="text-gray-800 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>

          {/* Mobile menu */}

          {menuOpen && (
              <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 md:hidden">
                  <Link to="/recruiter/jobs" className="text-gray-800 hover:text-blue-600">Manage Jobs</Link>
                  <a href="#companies" className="text-gray-800 hover:text-blue-600">Dashboard</a>
                  <Link to='/recruiter/profile' className="text-gray-800 hover:text-blue-600">Profile</Link>
                  <Link to='/recruiter/chat' className="text-gray-800 hover:text-blue-600">Chat</Link>
                  <button 
                onClick={handleLogut}
                className="block w-full bg-gray-300 rounded-lg text-left px-4 py-2 text-gray-800"
              >
                Logout ←
              </button>
              </div>
          )}
    
      </div>
  )
}

export default RecruiterHeader
