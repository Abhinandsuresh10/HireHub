import { FaHome, FaUsers, FaBriefcase, FaExclamationTriangle, FaCog, FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-blue-900 text-white min-h-screen flex flex-col transition-all duration-300 md:w-16 lg:w-64">
      {/* Sidebar Items */}
      <nav className="flex-1 mt-14">
        <ul>
          <li className="mb-4">
            <Link to='/admin/adminDashboard' className="flex items-center justify-center lg:justify-start hover:bg-black px-4 py-2 rounded">
              <FaHome className="text-xl" />
              <span className="hidden lg:inline ml-3">Dashboard</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to='/admin/users' className="flex items-center justify-center lg:justify-start hover:bg-black px-4 py-2 rounded">
              <FaUsers className="text-xl" />
              <span className="hidden lg:inline ml-3">Users</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to='/admin/recruiters' className="flex items-center justify-center lg:justify-start hover:bg-black px-4 py-2 rounded">
              <FaBriefcase className="text-xl" />
              <span className="hidden lg:inline ml-3">Recruiters</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to='/admin/spam' className="flex items-center justify-center lg:justify-start hover:bg-black px-4 py-2 rounded">
              <FaExclamationTriangle className="text-xl" />
              <span className="hidden lg:inline ml-3">Reports</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link to='/admin/skills' className="flex items-center justify-center lg:justify-start hover:bg-black px-4 py-2 rounded">
              <FaLightbulb className="text-xl" />
              <span className="hidden lg:inline ml-3">Skills</span>
            </Link>
          </li>
          <li>
            <Link to='/setting' className="flex items-center justify-center lg:justify-start hover:bg-black px-4 py-2 rounded">
              <FaCog className="text-xl" />
              <span className="hidden lg:inline ml-3">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
