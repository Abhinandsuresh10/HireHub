import { getRoles } from "../../api/recruiter/jobPost";
import { useEffect, useState } from "react";


const PreferredJobs = ({ open = true, onClose }: { open?: boolean; onClose?: () => void }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [title, setTitle] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchRoles = async() => {
        const response = await getRoles();
        if(response.data) {
            setRoles(response.data.roles)
        }
    }
    fetchRoles();
  }, [])

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-2 md:mx-0 p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Preferred Jobs</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left: Preferred Jobs by Role */}
          <div className="flex-1 shadow-xl rounded-lg p-3 bg-gray-50">
            <h3 className="font-semibold mb-2">By Job Role</h3>
            <ul>
              {roles?.map((role) => (
                <li
                  key={role}
                  className={`p-2 rounded cursor-pointer ${selectedRole === role ? "bg-blue-100" : "hover:bg-gray-200"}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </li>
              ))}
            </ul>
            <button className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm">Add Role</button>
          </div>
          {/* Right: Preferred Jobs by Title */}
          <div className="flex-1 shadow-xl rounded-lg p-3 bg-gray-50">
            <h3 className="font-semibold mb-2">By Job Title</h3>
            <ul>
              {title?.map((title) => (
                <li
                  key={title}
                  className={`p-2 rounded cursor-pointer ${selectedTitle === title ? "bg-green-100" : "hover:bg-gray-200"}`}
                  onClick={() => setSelectedTitle(title)}
                >
                  {title}
                </li>
              ))}
            </ul>
            <button className="mt-3 px-3 py-1 bg-green-500 text-white rounded text-sm">Add Title</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferredJobs;