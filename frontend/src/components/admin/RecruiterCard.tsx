import React, { useEffect, useState } from 'react';
import { UserCircle2, Shield, ShieldOff, UserCog, X, User2 } from 'lucide-react';
import { IRecruiter } from '../../types/recruiter.types';
import { getSingleRecruiter } from '../../api/user/users';
import { getFeedbacks } from '../../api/common/feedback';

interface RecruiterCardProps {
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

interface RecruiterModalProps {
  onClose: () => Promise<void>;
  id: string;
}

interface Feeback {
  id: string;
  role: string;
  comment: string;
}



const RecruiterModal: React.FC<RecruiterModalProps> = ({ onClose, id }) => {

  const [recruiter, setRecruiter] = useState<IRecruiter>();
  const [feedbacks, setFeedbacks] = useState<Feeback[]>()

  useEffect(() => {
    const fetchRecruiter = async() => {
      const response = await getSingleRecruiter(id);
      if(response.data) {
          setRecruiter(response.data.recruiter)
      }
    }
    fetchRecruiter()
  }, [id]);

    useEffect(() => {
       const fetchFeedbacks = async() => {
        const response = await getFeedbacks(id, 'recruiter');
        if(response.data) {
          setFeedbacks(response.data.feedbacks);
        }
       }
       fetchFeedbacks()
    }, [id]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6 overflow-y-auto">
  <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative p-6">
    {/* Close Button */}
    <button
      className="absolute top-3 right-3 text-gray-600 hover:text-black transition"
      onClick={onClose}
    >
      <X size={20} />
    </button>

    {/* Recruiter Image */}
    <div className="flex justify-center mb-4">
      {recruiter?.imageUrl ? <img
        src={recruiter?.imageUrl}
        alt="Recruiter"
        className="w-24 h-24 rounded-full object-cover shadow-md"
      /> : <User2 className='w-24 h-24 rounded-full object-cover shadow-md bg-gray-300' />
      }
    </div>

    {/* Recruiter Details */}
    <div className="text-center text-sm space-y-2">
      <p className="font-semibold text-lg text-gray-800">{recruiter?.name}</p>
      <p className="text-gray-600">{recruiter?.email}</p>
      <p className="text-gray-700">{recruiter?.industry}</p>
      <p className="text-gray-700 whitespace-pre-wrap">{recruiter?.hiringInfo}</p>
      <p className="text-gray-700">{recruiter?.company}</p>
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

const RecruiterCard: React.FC<RecruiterCardProps> = ({ item, handleBlockUnblock }) => {
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState<string>('');

  const handleOpenModal = (id: string) => {
    setId(id)
    setShowModal(true)
  }

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
        {/* Recruiter Avatar Section */}
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

        {/* Recruiter Info Section */}
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
            onClick={() => handleOpenModal(item._id)}
          >
            <UserCog className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => handleBlockUnblock(item._id, item.isBlocked)}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
              item.isBlocked
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
      {showModal &&
       <RecruiterModal onClose={async() => { setShowModal(false); return;}} id={id}/>
      }
    </div>
  );
};

export default RecruiterCard;