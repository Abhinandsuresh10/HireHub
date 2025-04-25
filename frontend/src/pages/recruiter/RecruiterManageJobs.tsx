import { useEffect, useState } from "react";
import RecruiterHeader from "../../components/recruiter/RecruiterHeader";
import Footer from "../../components/user/Footer";
import { Link } from "react-router-dom";
import JobsCard from "../../components/recruiter/jobsCard";
import { deleteJob, getJobs } from "../../api/recruiter/jobPost";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const RecruiterManageJobs = () => {
  const [activeTab, setActiveTab] = useState("postJob");
  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);

  const limit = 6;
  const recruiter = useSelector(state => state.recruiterAuth.recruiter);
  useEffect(() => {
  const fetchJobs = async() => {
    try {
      const response = await getJobs(recruiter._id, page, limit);
      if(response.data) {
        setTotal(response.data.total);
        setJobs(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  fetchJobs();
  },[recruiter, page]);


  const handleDeleteJob = async (id: string) => {
    try {
      const response = await deleteJob(id);
      if(response) {
        setJobs((jobs) => jobs.filter((job) => job._id !== id));
        console.log(response.data.Message)
        toast.success(response.data.Message)
      }
    } catch (error) {
      console.log(error);
    }
  }


  const applicants = [
    { id: 1, name: "John Doe", email: "john@example.com", job: "React Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", job: "Fullstack Developer" },
  ];

  const interviews = [
    { id: 1, candidate: "John Doe", job: "React Developer", date: "2025-04-01", time: "10:00 AM" },
    { id: 2, candidate: "Jane Smith", job: "Fullstack Developer", date: "2025-04-02", time: "2:00 PM" },
  ];

  return (
    <>
      <RecruiterHeader />
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab("postJob")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "postJob"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Job
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "applications"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab("interviews")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "interviews"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Interviews
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === "postJob" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Posted Jobs</h2>
              <Link to='/recruiter/postJob'
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Add Job
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {jobs.map((job) => (
                  <JobsCard handleDeleteJob={handleDeleteJob} job={job} /> 
               ))}
              </div>

              {jobs.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span>Page {page}</span>
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${page * limit >= total ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page * limit >= total}
              >
                Next
              </button>
            </div>
          )}

          {/* No Jobs Found Message */}
          {jobs.length === 0 && <p className="text-xl mt-4">No jobs found</p>}

            </>
          )}

          {activeTab === "applications" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Applications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
                  >
                    <p className="font-semibold text-lg text-gray-800">{applicant.name}</p>
                    <p className="text-sm text-gray-500">{applicant.email}</p>
                    <p className="text-sm text-gray-500">Applied for: {applicant.job}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "interviews" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Scheduled Interviews</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
                  >
                    <p className="font-semibold text-lg text-gray-800">{interview.candidate}</p>
                    <p className="text-sm text-gray-500">Job: {interview.job}</p>
                    <p className="text-sm text-gray-500">Date: {interview.date}</p>
                    <p className="text-sm text-gray-500">Time: {interview.time}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecruiterManageJobs;
