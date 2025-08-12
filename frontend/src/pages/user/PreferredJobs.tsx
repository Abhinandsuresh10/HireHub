import { RootState } from "../../store/store";
import { getRoles, getTitles } from "../../api/recruiter/jobPost";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addPreferredRoles, addPreferredTypes } from "../../api/user/users";
import toast from "react-hot-toast";
import { addUser } from "../../store/slices/userDataSlice";

const PreferredJobs = ({ open = true, onClose }: { open?: boolean; onClose?: () => void }) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [addedRoles, setAddedRoles] = useState<string[]>([]);
  const [addedTitles, setAddedTitles] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [titles, setTitles] = useState<string[] | null>(null);

  const user = useSelector((state: RootState) => state.users.user);

  useEffect(() => {
    setAddedRoles(user.preferredJobRoles || []);
    setAddedTitles(user.preferredJobTypes || [])
  },[user]);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchRoles = async () => {
      const response = await getRoles();
      if (response.data) {
        setRoles(response.data.roles);
      }
    };
    fetchRoles();
    const fetchTitles = async () => {
      const response = await getTitles();
      if (response.data) {
        setTitles(response.data.types);
      }
    };
    fetchTitles();
  }, []);


  if (!open) return null;


  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };


  const toggleTitle = (title: string) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

 
 
  const handleAddRoles = async() => {
   const response = await addPreferredRoles(user._id, selectedRoles);
   if(response.data) {
    dispatch(addUser({user: response.data.user}))
    toast.success("PreferredJobRoles added successfully");
   }
    setAddedRoles((prev) => [
      ...prev,
      ...selectedRoles.filter((role) => !prev.includes(role)),
    ]);
    setSelectedRoles([]);
  };


  const handleAddTitles = async() => {
    const response = await addPreferredTypes(user._id, selectedTitles);
    if(response.data) {
      dispatch(addUser({user: response.data.user}))
      toast.success("PreferredJobTitles added successfully");
    }
    setAddedTitles((prev) => [
      ...prev,
      ...selectedTitles.filter((title) => !prev.includes(title)),
    ]);
    setSelectedTitles([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-2 md:mx-0 p-6 relative mt-10 mb-10 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Preferred Jobs</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 shadow-xl rounded-lg p-3 bg-gray-50">
            <h3 className="font-semibold mb-2">By Job Role</h3>
            <ul>
              {roles?.map((role) => (
                <li
                  key={role}
                  className="flex items-center justify-between p-2 cursor-pointer mt-3 px-3 py-1 shadow-sm bg-blue-50 text-blue-800 rounded text-sm"
                  onClick={() => toggleRole(role)}
                >
                  <span>{role}</span>
                  {selectedRoles.includes(role) && (
                    <FaCheck className="text-green-600" />
                  )}
                </li>
              ))}
            </ul>
            <button
              className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              onClick={handleAddRoles}
              disabled={selectedRoles.length === 0}
            >
              Add Selected
            </button>
            {addedRoles.length > 0 && (
              <div className="mt-4 shadow-2xl rounded p-2 bg-blue-50">
                <div className="flex flex-wrap gap-2">
                  {addedRoles.map((role) => (
                    <span
                      key={role}
                      className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 shadow-xl rounded-lg p-3 bg-gray-50">
            <h3 className="font-semibold mb-2">By Job Title</h3>
            <ul>
              {titles?.map((title) => (
                <li
                  key={title}
                  className="flex items-center justify-between p-2 cursor-pointer mt-3 px-3 py-1 shadow-sm bg-blue-50 text-blue-800 rounded text-sm"
                  onClick={() => toggleTitle(title)}
                >
                  <span>{title}</span>
                  {selectedTitles.includes(title) && (
                    <FaCheck className="text-green-600" />
                  )}
                </li>
              ))}
            </ul>
            <button
              className="mt-3 px-3 py-1 bg-green-500 text-white rounded text-sm"
              onClick={handleAddTitles}
              disabled={selectedTitles.length === 0}
            >
              Add Selected
            </button>
            {addedTitles.length > 0 && (
              <div className="mt-4 shadow-2xl rounded p-2 bg-green-50">
                <div className="flex flex-wrap gap-2">
                  {addedTitles.map((title) => (
                    <span
                      key={title}
                      className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferredJobs;