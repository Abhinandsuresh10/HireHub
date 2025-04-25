import { useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserCard from '../../components/admin/UserCard';
import AdminAPI from '../../config/adminApi';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await AdminAPI.get(`/getUsers?page=${page}&limit=5&search=${search}`);
      if(!response.data) {
        toast.error('Error on fetching users')
      }
      setUsers(response.data.users);
      setTotal(response.data.total);
    }
   fetchUsers();
  },[page, search]);

  const handleBlockUnblock = async (id: string, status: boolean) => {
    try {
      const response = await AdminAPI.patch('/userBlockUnblock', { id, status });
      if (response && response.data) {
        toast.success(`User ${response.data.user.isBlocked ? 'Blocked' : 'Unblocked'} Successfully`);
      }
      setUsers((prev) => {
        const updatedUsers = prev.map((user) =>
          user._id === id ? { ...user, isBlocked: response.data.user.isBlocked } : user
        );
        return updatedUsers;
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto bg-gray-100">
        <AdminHeader pageTitle="Dashboard" />

        {/* Search */}
        <div className="p-4 ml-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl 
                       text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-200 transition-all duration-200 shadow-sm
                       placeholder:text-gray-400"
            />
          </div>
        </div>

        {users.length > 0 && (
          <>
            {/* Content Area */}
            <div className="p-6 space-y-4">
              {users.map((item, idx) => (
                <UserCard key={idx} item={item} handleBlockUnblock={handleBlockUnblock} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <button 
                className={`bg-black text-white rounded-lg px-4 py-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
                disabled={page === 1}
              >
                Prev
              </button>
              <span>Page {page}</span>
              <button 
                className={`bg-black text-white rounded-lg px-4 py-2 ${page * 5 >= total ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setPage((prev) => prev + 1)} 
                disabled={page * 5 >= total}
              >
                Next
              </button>
            </div>
          </>
        )}
       
        {users.length === 0 && <p className='p-10 ml-6 text-xl'>users not found</p>}
      </div>
    </div>
  );
};

export default Users;