import { CalendarIcon, UserIcon, VideoIcon } from "lucide-react";
import { socket } from '../../utils/socket'
import { getInterviewsById } from "../../api/recruiter/interview";
import { useNavigate } from "react-router-dom";

interface Interview {
  _id: string;
  username: string;
  jobRole: string;
  interviewer: string;
  date: Date;
  time: string;
}


const InterviewCard = ({interview}: {interview: Interview}) => {
  const navigate = useNavigate();

  const handleStartMeet = (id: string) => {
    const fetchInterview = async() => {
    const response = await getInterviewsById(id);
    if(response.data) {
      socket.emit("call_user", {
        interviewId: interview._id,
        callerId: response.data.interview.recruiterId,
        receiverId: response.data.interview.userId
      });
      socket.emit("join_room", interview._id)
    }
   }
   fetchInterview();
   navigate(`/recruiter/videoCall/${interview._id}`);
  }
  return (
     <div className="p-5 shadow-xl rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {interview.username}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
            Interviewer: <span className="ml-1 font-medium">{interview.interviewer}</span>
          </p>
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium">
          {interview.jobRole}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center text-sm">
          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-600">
            {new Date(interview.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}{" "}
            at {interview.time}
          </span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:text-white hover:bg-indigo-500 transition-colors flex items-center"
          onClick={() => handleStartMeet(interview._id)}
          
        >
          <VideoIcon className="h-4 w-4 mr-1.5" />
          Start Meet
        </button>
      </div>
    </div>
  )
}

export default InterviewCard

