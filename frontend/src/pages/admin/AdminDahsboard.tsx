import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <AdminHeader pageTitle="Dashboard" />

        {/* Content Area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {/* Stats Cards */}
          <div className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-3xl font-bold mt-2">1,245</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-lg font-semibold">Active Recruiters</h3>
            <p className="text-3xl font-bold mt-2">320</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-lg font-semibold">Jobs Posted</h3>
            <p className="text-3xl font-bold mt-2">850</p>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 mt-6 shadow rounded-xl col-span-full flex-1 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <ul>
              <li className="border-b py-2">🔹 User "John Doe" registered</li>
              <li className="border-b py-2">🔹 Recruiter "TechCorp" posted a job</li>
              <li className="border-b py-2">🔹 User "Jane" applied for a job</li>
              <li className="py-2">🔹 2 reports submitted for review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
