import { useEffect, useState } from 'react';
import { Briefcase, Clock, CheckCircle, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import { fetchAppliedJobs } from '../../api/user/userApplication';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchUsersInterviews } from '../../api/recruiter/interview';
import { useNavigate } from 'react-router-dom';
import { fetchJobById } from '../../api/recruiter/jobPost';

type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

interface Job {
  _id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: JobType;
}

interface AppliedJob extends Job {
  status: 'Under Review' | 'Application Sent' | 'Rejected';
  appliedDate: string;
}

interface InterviewJob extends Job {
  status: 'Interview Scheduled' | 'Interview Completed' | 'Offer Received';
  interviewDate: string;
  interviewTime: string;
}

interface SavedJob extends Job {
  savedDate: string;
}

type TabType = 'applied' | 'interview' ;

interface JobsData {
  applied: AppliedJob[];
  interview: InterviewJob[];
}

const JobApplicationTracker = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [interviewPage, setInterviewPage] = useState(1);
  const [interviewTotal, setInterviewTotal] = useState(0);


  const user = useSelector((state: RootState) => state.users.user);
  
  useEffect(() => { 
    const fetchApplied = async () => {
      const response = await fetchAppliedJobs(user._id, page, limit); // this function has issue in the ui need to fix before hosting ...
      if (response) {
        setJobsData((prev) => ({
          ...prev,
          applied: response.data.appliedJobs.data
        }));
        setTotal(response.data.appliedJobs.total);
      }
    } 
    fetchApplied();
  }, [user, page, limit]);

  useEffect(() => {
    const fetchInterviews = async () => {
      const response = await fetchUsersInterviews(user._id, interviewPage, limit);
      if(response) {
        setJobsData((prev) => ({
          ...prev,
          interview: response.data
        }));
        setInterviewTotal(response.total);
      }
    }
    fetchInterviews();
  },[user, interviewPage, limit])

  const [activeTab, setActiveTab] = useState<TabType>('applied');
  const [jobsData, setJobsData] = useState<JobsData>({
    applied: [],
    interview: []
  });

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const handleInterviewPreviousPage = () => {
    if(interviewPage > 1) {
      setInterviewPage(interviewPage - 1)
    }
  }

  const handleNextInterviewPage = () => {
    if(interviewPage * limit < interviewTotal) {
      setInterviewPage(interviewPage + 1)
    }
  }
  
  const navigate = useNavigate();
  const renderJobCard = (job: AppliedJob | InterviewJob | SavedJob) => {
    let key: string = '';
    if(activeTab === 'applied') {
       key = job.jobId.toString();
    } else if (activeTab === 'interview') {
      key = job._id
    }

    const handleNavigate = async () => {
      const response = await fetchJobById(job.jobId);
      if(response.data) {
        const job = response.data.job;
        navigate(`/viewJob`, { state: { job } })
      }
    }


    return (
      <div key={key} className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
          {'status' in job && (
            
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              job.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
              job.status === 'Application Sent' ? 'bg-gray-100 text-gray-800' :
              job.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-800' :
              'bg-green-100 text-green-800'
            }`}>
              {job.status}
            </span>
          
          
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            
             {job.salary} {activeTab === 'interview' ? 'LPA' : ''}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Briefcase className="h-4 w-4 mr-1" />
            {job.type}
          </div>
          
        </div>
        
        {activeTab === 'applied' && 'appliedDate' in job && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            Applied on {new Date(job.appliedDate).toLocaleDateString()}
          </div>
        )}

        
        {activeTab === 'interview' && 'interviewDate' in job && (
          <div className="mt-4">
            <div className="flex items-center text-sm text-purple-600 font-medium">
              <Calendar className="h-4 w-4 mr-1" />
              Interview scheduled for {new Date(job.interviewDate).toLocaleDateString()} at {job.interviewTime}
            </div>
          </div>
        )}
        
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
        <button className='px-3 py-1 rounded-full text-xs font-medium  bg-black text-white' onClick={handleNavigate}>
              view Job
        </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Job Applications</h1>
        
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'applied'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span>Applied ({total})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'interview'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Interviews ({interviewTotal})</span>
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors 'bg-green-600 text-white`}
          >
          </button>
        </div>
        
        <div>
          {activeTab === 'applied' && jobsData.applied.map(job => renderJobCard(job))}
          {activeTab === 'interview' && jobsData.interview.map(job => renderJobCard(job))}
          
          {jobsData[activeTab].length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {activeTab === 'applied' && <Briefcase className="h-8 w-8 text-gray-400" />}
                {activeTab === 'interview' && <CheckCircle className="h-8 w-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No {activeTab} jobs
              </h3>
              <p className="text-gray-500">
                {activeTab === 'applied' && 'You haven\'t applied to any jobs yet.'}
                {activeTab === 'interview' && 'You don\'t have any upcoming interviews.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - Only show for applied tab */}
        {activeTab === 'applied' && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={`flex items-center px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page * limit >= total}
              className={`flex items-center px-4 py-2 rounded-lg ${page * limit >= total ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        )}

        {/* Pagination - for interview tab */}
        {activeTab === 'interview' && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleInterviewPreviousPage}
              disabled={interviewPage === 1}
              className={`flex items-center px-4 py-2 rounded-lg ${interviewPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            <span className="text-gray-600">
              Page {interviewPage} of {Math.ceil(interviewTotal / limit)}
            </span>
            <button
              onClick={handleNextInterviewPage}
              disabled={interviewPage * limit >= interviewTotal}
              className={`flex items-center px-4 py-2 rounded-lg ${interviewPage * limit >= interviewTotal ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default JobApplicationTracker;