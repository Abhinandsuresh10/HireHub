import { useEffect, useState } from "react";
import RecruiterHeader from "../../components/recruiter/RecruiterHeader";
import Footer from "../../components/user/Footer";
import { Link } from "react-router-dom";
import JobsCard from "../../components/recruiter/JobsCard";
import { deleteJob, getJobs } from "../../api/recruiter/jobPost";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "../../store/store";
import { getAplied } from "../../api/user/userApplication";
import ApplicantCard from "../../components/recruiter/ApplicantCard";
import { getInterviews } from "../../api/recruiter/interview";
import InterviewCard from "../../components/recruiter/InterviewCard";


interface Interview {
  _id: string;
  username: string;
  jobRole: string;
  interviewer: string;
  date: Date;
  time: string;
}

const RecruiterManageJobs = () => {
  const [activeTab, setActiveTab] = useState("postJob");
  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [appliedPage, setAppliedPage] = useState(1);
  const [appliedTotal, setAppliedTotal] = useState(1);
  const [interviewPage, setInterviewPage] = useState(1);
  const [interviewTotal, setInterviewTotal] = useState(1);
  const [applicants, setApplicant] = useState([]);
  const [interviews, setInterview] = useState([])

  const limit = 6;
  const recruiter = useSelector((state:RootState) => state.recruiters.recruiter);
  
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

  useEffect(() => {
  
  const fetchApplied = async() => {
    try {
    const response = await getAplied(recruiter._id, appliedPage, limit);
    if(response.data) {
      setAppliedTotal(response.total);
      setApplicant(response.data);
    }
    } catch (error) {
      console.log(error);
    }
  }
  fetchApplied();
  },[recruiter, appliedPage])

  useEffect(() => {
    
    const fetchInterviews = async () => {
    const response = await getInterviews(recruiter._id, interviewPage, limit);
    
    if(response.data) {
      setInterviewTotal(response.total)
      setInterview(response.data);
    }
    }
    fetchInterviews()
  },[recruiter, interviewPage])

 
  const handleDeleteJob = async (id: string) => {
    try {
      const response = await deleteJob(id);
      if(response) {
        setJobs((jobs) => jobs.filter((job) => job._id !== id));
        toast.success(response.data.Message)
      }
    } catch (error) {
      console.log(error);
    }
  }


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
                   <ApplicantCard applicant={applicant} />
                ))}
              </div>
              {applicants.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${appliedPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setAppliedPage((prev) => Math.max(prev - 1, 1))}
                disabled={appliedPage === 1}
              >
                Prev
              </button>
              <span>Page {appliedPage}</span>
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${appliedPage * limit >= appliedTotal ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setAppliedPage((prev) => prev + 1)}
                disabled={appliedPage * limit >= appliedTotal}
              >
                Next
              </button>
            </div>
          )}

          {/* No Jobs Found Message */}
          {applicants.length === 0 && <p className="text-xl mt-4">No applicants found</p>}
            </>
          )}

          {activeTab === "interviews" && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Scheduled Interviews</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview:Interview) => (
                  <InterviewCard interview={interview} />
                ))}
              </div>
              {interviews.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${interviewPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setInterviewPage((prev) => Math.max(prev - 1, 1))}
                disabled={interviewPage === 1}
              >
                Prev
              </button>
              <span>Page {interviewPage}</span>
              <button
                className={`bg-black text-white rounded-lg px-4 py-2 ${interviewPage * limit >= interviewTotal ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setAppliedPage((prev) => prev + 1)}
                disabled={interviewPage * limit >= interviewTotal}
              >
                Next
              </button>
            </div>
          )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecruiterManageJobs;
