import React, { useEffect, useState } from 'react';
import { UserCircle2, Shield, ShieldOff, UserCog, X, User2 } from 'lucide-react';
import { fetchUserAndDetails } from '../../api/recruiter/recriuters';
// import Loader from '../ui/Loader';
import { getFeedbacks } from '../../api/common/feedback';

interface UserCardProps {
  item: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    isBlocked: boolean;
    imageUrl?: string;
  };
  handleBlockUnblock: (id: string, isBlocked: boolean) => void;
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

interface Feeback {
  id: string;
  role: string;
  comment: string;
}

interface UserModalProps {
  id: string;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserModalProps> = ({ onClose, id }) => {
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feeback[]>();


  useEffect(() => {
     const fetchFeedbacks = async() => {
      const response = await getFeedbacks(id, 'user');
      if(response.data) {
        setFeedbacks(response.data.feedbacks);
      }
     }
     fetchFeedbacks()
  }, [id]);

 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchUserAndDetails(id as string);

        if (response.data) {
          setApplicant(response.data.userData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, [id]);

  const [applicant, setApplicant] = useState<Applicant | null>(null);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto my-6 p-6 bg-white rounded-xl shadow-2xl">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
          {/* <Loader /> */}
        </div>
      </div>
    )
  }

  if (!applicant) {
    return (
      <>
        <div className="max-w-2xl mx-auto my-6 p-6 bg-white rounded-xl shadow-2xl">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">User not found</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        {/* Header: Profile */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            {applicant.imageUrl ?

              <img src={applicant.imageUrl}
                alt={applicant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150';
                }}
              /> : <User2 className='w-full h-full flex items-center justify-center bg-gray-300' />

            }
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{applicant.name}</h1>
            <p className="text-gray-600 mb-2">{applicant.jobTitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Work Experience</h2>
          {applicant.experience.map((exp, index) => (
            <div key={index} className="mb-6 pl-4 border-l-2 border-blue-200">
              <h3 className="font-medium text-gray-800">
                {exp.title} <span className="text-blue-600">@{exp.company}</span>
              </h3>
              <p className="text-sm text-gray-500 mb-1">{exp.duration}</p>
              <p className="text-gray-700">{exp.achievements}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Education</h2>
          <div className="pl-4 border-l-2 border-blue-200">
            <h3 className="font-medium text-gray-800">{applicant.education?.level}</h3>
            <p className="text-sm text-gray-500 mb-1">{applicant.education?.institution}</p>
            <p className="text-sm text-gray-500">{applicant.education?.graduationYear}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Skills</h2>
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

         {/* feedbacks */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Feedbacks</h2>
          <div className="flex flex-wrap gap-2">
            {feedbacks && feedbacks.map((fb, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white border-l-2 border-b-2 text-yellow-700 rounded-full text-sm font-medium"
              >
                {fb.comment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}

const UserCard: React.FC<UserCardProps> = ({ item, handleBlockUnblock }) => {
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* User Avatar Section */}
        <div className="relative">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
              <UserCircle2 className="w-10 h-10 text-indigo-400" />
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${item.isBlocked ? 'bg-red-500' : 'bg-green-500'} border-2 border-white`} />
        </div>

        {/* User Info Section */}
        <div className="flex-grow space-y-0.5 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.email}</p>
          <p className="text-xs text-gray-400">
            Joined {formatDate(item.createdAt)}
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors duration-200"
            onClick={() => { setShowModal(true); setUserId(item._id) }}
          >
            <UserCog className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => handleBlockUnblock(item._id, item.isBlocked)}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${item.isBlocked
                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
          >
            {item.isBlocked ? (
              <>
                <Shield className="w-4 h-4" />
                <span>Unblock</span>
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4" />
                <span>Block</span>
              </>
            )}
          </button>
        </div>
      </div>
      {showModal && <UserDetailsModal onClose={() => setShowModal(false)} id={userId} />}
    </div>
  );
};

export default UserCard;