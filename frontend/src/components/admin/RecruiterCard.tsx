import React from 'react';
import { UserCircle2, Shield, ShieldOff, UserCog } from 'lucide-react';

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

const RecruiterCard: React.FC<RecruiterCardProps> = ({ item, handleBlockUnblock }) => {
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
    </div>
  );
};

export default RecruiterCard;