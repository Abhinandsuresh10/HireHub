
import { useState, useEffect } from "react";
import Footer from "../../components/user/Footer";
import Header from "../../components/user/Header";
import toast from "react-hot-toast";
import UserJobCard from "../../components/user/UserJobCard";
import { getJobs } from "../../api/user/userJobs";
import { Search } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs(page, limit, search);
        if (!response.data) {
          toast.error("Error fetching jobs");
          return;
        }
        setJobs(response.data.data);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [page, search]);

  const handleApply = (id: number) => {
    setAppliedJobs([...appliedJobs, id]);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6">


           {/* Search */}
           <div className="p-4 flex flex-row justify-center items-center">
            <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs / company"
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl 
                       text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-200 transition-all duration-200 shadow-sm
                       placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Job Cards */}
        {jobs.length > 0 && (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-10 pb-6">
              {jobs.map((job) => (
                <UserJobCard key={job._id} job={job} handleApply={handleApply} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>Page {page}</span>
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${
                  page * 6 >= total ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page * 6 >= total}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* No Jobs Found */}
        {jobs.length === 0 && (
          <p className="p-10 text-center text-xl text-gray-600">No jobs found</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Jobs;

