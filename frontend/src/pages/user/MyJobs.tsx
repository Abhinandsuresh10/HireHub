import { useEffect, useState } from 'react';
import { Briefcase, Clock, Bookmark, CheckCircle, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import { fetchAppliedJobs } from '../../api/user/userApplication';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchUsersInterviews } from '../../api/recruiter/interview';

type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

interface Job {
  jobId: number;
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

type TabType = 'applied' | 'interview' | 'saved';

interface JobsData {
  applied: AppliedJob[];
  interview: InterviewJob[];
  saved: SavedJob[];
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
      const response = await fetchAppliedJobs(user._id, page, limit);
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
    interview: [
      {
        jobId: 3,
        title: 'Senior React Developer',
        company: 'WebSolutions',
        location: 'New York, NY',
        salary: '$110,000 - $140,000',
        status: 'Interview Scheduled',
        interviewDate: '2023-06-02',
        interviewTime: '10:00 AM',
        type: 'Full-time'
      }
    ],
    saved: [
      {
        jobId: 4,
        title: 'Product Manager',
        company: 'InnovateInc',
        location: 'Chicago, IL',
        salary: '$100,000 - $130,000',
        savedDate: '2023-05-10',
        type: 'Full-time'
      },
      {
        jobId: 5,
        title: 'Backend Engineer',
        company: 'DataSystems',
        location: 'Remote',
        salary: '$95,000 - $125,000',
        savedDate: '2023-05-20',
        type: 'Full-time'
      }
    ]
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

  const renderJobCard = (job: AppliedJob | InterviewJob | SavedJob) => {
    return (
      <div key={job.jobId} className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
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
          {!('status' in job) && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Saved
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
        
        {activeTab === 'saved' && 'savedDate' in job && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Bookmark className="h-4 w-4 mr-1" />
            Saved on {new Date(job.savedDate).toLocaleDateString()}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
          <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
            View Details
          </button>
          {activeTab === 'saved' && (
            <button className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md">
              Apply Now
            </button>
          )}
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
            <span>Interviews ({jobsData.interview.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'saved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bookmark className="h-5 w-5" />
            <span>Saved ({jobsData.saved.length})</span>
          </button>
        </div>
        
        <div>
          {activeTab === 'applied' && jobsData.applied.map(job => renderJobCard(job))}
          {activeTab === 'interview' && jobsData.interview.map(job => renderJobCard(job))}
          {activeTab === 'saved' && jobsData.saved.map(job => renderJobCard(job))}
          
          {jobsData[activeTab].length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {activeTab === 'applied' && <Briefcase className="h-8 w-8 text-gray-400" />}
                {activeTab === 'interview' && <CheckCircle className="h-8 w-8 text-gray-400" />}
                {activeTab === 'saved' && <Bookmark className="h-8 w-8 text-gray-400" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No {activeTab} jobs
              </h3>
              <p className="text-gray-500">
                {activeTab === 'applied' && 'You haven\'t applied to any jobs yet.'}
                {activeTab === 'interview' && 'You don\'t have any upcoming interviews.'}
                {activeTab === 'saved' && 'You haven\'t saved any jobs yet.'}
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