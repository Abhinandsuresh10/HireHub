import Footer from '../../components/user/Footer'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserAndDetails } from '../../api/recruiter/recriuters';
import { acceptApplication, getApplication, rejectApplication, declineMail } from '../../api/user/userApplication';
import { AlertCircle } from 'lucide-react';
import RecruiterAPI from '../../config/recruiterApi';
import RecruiterHeader from '../../components/recruiter/RecruiterHeader';
import InterviewForm from '../../components/recruiter/InterviewFrom';
import toast from 'react-hot-toast';

// Simple Modal Component
const Modal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const DeclineModal = ({ onClose , reason, onSubmit , setReason }: { onClose: () => void, reason: string, onSubmit:(reason: string) => void, setReason: (value: string) => void }) => {
  const [error, setError] = useState(false)
  const handleSubmit = () => {
     if(reason.length > 10) {
       setError(false);
       onSubmit(reason)
      }
     else setError(true);
  }
  
  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
    
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
    >
      &times;
    </button>

    {/* Title */}
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Reason for Declining</h2>

    {/* Input Area */}
    <div className="mb-4">
      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
        Enter your reason
      </label>
      <textarea
        id="reason"
        rows={4}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        placeholder="Please provide a reason for declining..."
        value={reason}
        onChange={e => setReason(e.target.value)}
      />
      {error && <p className='text-sm text-red-600'>Description must be atleast 10 character long.</p>}
    </div>

    {/* Submit Button */}
    <button
      onClick={handleSubmit}
      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
    >
      Submit
    </button>
  </div>
</div>

  )
}

interface EducationData {
  level: string;
  institution: string;
  graduationYear: string;
}

interface ExperienceData {
  title: string;
  company: string;
  duration: string;
  achievements: string;
}

interface Applicant {
  _id: string;
  jobId: string;
  name: string;
  email: string;
  mobile: string;
  jobTitle: string;
  location: string;
  status: string;
  imageUrl: string;
  skills: string[];
  resumeUrl?: string;
  education: EducationData;
  experience: ExperienceData[];
}

interface JobApplication {
  _id: string;
  userId: string;
  jobId: string;
  recruiterId: string;
  status: string;
  round?: number;
  appliedAt: string;
  __v: number;
}

const ViewUserProfile = () => {
  const { id } = useParams();
  const { appId } = useParams();
  const { jobId } = useParams();

  const [declineModal, setDeclineModal] = useState(false);
  const [reason, setReason] = useState("");
  
  const [applicant, setApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchUserAndDetails(id as string);

        if (response.data) {
          setApplicant(response.data.userData);

        } else {
          setError('No user data found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);
  const navigate = useNavigate();

  const handleAccept = async () => {
    try {
      const response = await acceptApplication(appId as string);
      if (response.data) {
        setStatus("ShortListed")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // to decline by modal and sent email to the applicant...
  const handleDeclineSubmit = async () => {
    if(!reason.trim()) return;
    const toastId = toast.loading("Submitting, please wait...");
    const response = await declineMail(reason, applicant?.name as string, applicant?.email as string, application?.jobId as string);
    if(response.data) {
      toast.success("Declined successfully!", { id: toastId });
      handleDecline()
    }
    setDeclineModal(false);
    setReason("");
  }

  // after handleDeclineSubmit this function will be called and change the state also ui and db...
  const handleDecline = async () => {
    try {
      const response = await rejectApplication(appId as string);
      if (response.data) {
        setStatus("Rejected")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [status, setStatus] = useState({});

  const [application, setApplication] = useState<JobApplication>();
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getApplication(appId as string);
        if (response.data) {
          setStatus(response.data.applicantion.status);
          setApplication(response.data.applicantion);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchApplication();
  }, [appId, showInterviewModal, status])


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (fileUrl: string) => {
    try {
      const response = await RecruiterAPI.post(
        `/downloadPdf`,
        { fileUrl },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'resume.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match?.[1]) {
          fileName = match[1];
        }
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume');
    }
  };

  // Modal state

  if (loading) {
    return (
      <>
        <RecruiterHeader />
        <div className="max-w-2xl mx-auto my-6 p-6 bg-white rounded-xl shadow-2xl">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <RecruiterHeader />
        <div className="max-w-2xl mx-auto my-6 p-6 bg-white rounded-xl shadow-2xl">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!applicant) {
    return (
      <>
        <RecruiterHeader />
        <div className="max-w-2xl mx-auto my-6 p-6 bg-white rounded-xl shadow-2xl">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">User not found</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <RecruiterHeader />
      <div className="max-w-2xl mx-auto my-6 p-6 bg-white rounded-xl shadow-2xl">
        {/* Profile Header with Image */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={applicant.imageUrl}
              alt={applicant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150';
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{applicant.name}</h1>
                <p className="text-gray-600">{applicant.jobTitle}</p>
              </div>
            </div>

            {/* Contact Info under name */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{applicant.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="text-gray-900">{applicant.mobile}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-gray-900">{applicant.location}</p>
              </div>
              <button
                onClick={() => navigate(`/spam/user/${applicant._id}/${jobId}`)}
                className="flex items-center text-red-600 hover:text-red-700 mt-1">
                <AlertCircle className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Work Experience</h2>
          {applicant.experience.map((exp, index) => (
            <div key={index} className="mb-6 pl-4 border-l-2 border-blue-200">
              <h3 className="font-medium text-gray-800">
                {exp.title} <span className="text-blue-600">@{exp.company}</span>
              </h3>
              <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
              <p className="text-gray-700">{exp.achievements}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Education</h2>
          <div className="pl-4 border-l-2 border-blue-200">
            <h3 className="font-medium text-gray-800">{applicant.education?.level}</h3>
            <p className="text-sm text-gray-500 mb-1">{applicant.education?.institution}</p>
            <p className="text-sm text-gray-500">{applicant.education?.graduationYear}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {applicant.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          {status === 'Pending' && (<div className="flex gap-3">
            <button onClick={handleAccept} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex-1 min-w-[100px]">
              Accept
            </button>
            <button onClick={() => setDeclineModal(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex-1 min-w-[100px]">
              Decline
            </button>
          </div>)}
          {applicant.resumeUrl && (
            <>
              <button
                onClick={() => handleDownload(applicant.resumeUrl as string)}
                className="px-4 py-2 bg-sky-800 hover:bg-sky-950 text-white rounded-lg font-medium transition-colors flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2"
              >
                <span>Download Resume</span>
              </button>
              {application?.status !== "Rejected" && application?.round && application.round < 3 && (
                <button
                  onClick={() => setShowInterviewModal(true)}
                  className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2'
                >
                  Schedule Interview
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <Modal open={showInterviewModal} onClose={() => setShowInterviewModal(false)}>
        <InterviewForm application={application} onClose={() => setShowInterviewModal(false)} />
      </Modal>
      {declineModal && <DeclineModal onClose={() => setDeclineModal(false)} onSubmit={handleDeclineSubmit} reason={reason} setReason={setReason}/>}
      <Footer />
    </>
  )
}

export default ViewUserProfile