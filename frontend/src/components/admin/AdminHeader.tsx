import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/adminSlice";

interface AdiminHeaderProps {
    pageTitle: string;
}

const AdminHeader: React.FC<AdiminHeaderProps> = ({pageTitle}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  }
  const handleLogout = () => {
    dispatch(logout());
  }
  const admin = useSelector((state) => state.adminAuth.admin);
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
        {/* <h1 className="text-xl font-semibold">{pageTitle}</h1> */}
        <h1 className="text-xl font-semibold">  </h1>
         
        <div className="relative">
        <button 
          onClick={handleDropDown} 
          className="font-medium hidden sm:block focus:outline-none"
        >
          {admin?.name}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg">
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

    </header>
  )
}

export default AdminHeader
