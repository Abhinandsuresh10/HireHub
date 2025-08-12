import { CalendarIcon, UserIcon, VideoIcon, BadgeCheck } from "lucide-react";
import { socket } from '../../utils/socket'
import { getInterview, getInterviewsById } from "../../api/recruiter/interview";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ResheduleModal from "./ResheduleModal";

interface Interview {
  _id: string;
  username: string;
  jobRole: string;
  interviewer: string;
  interviewType: string;
  date: Date;
  time: string;
}


const InterviewCard = ({ interview }: { interview: Interview }) => {

  const navigate = useNavigate();
  const [resheduleModal, setReshedulModal] = useState(false);
  const [interviews, setInterview] = useState(interview)

  // work from this part...

  useEffect(() => {
    const fetchInterview = async () => {
      const response = await getInterview(interviews._id);
      if (response.data) {
        setInterview(response.data.interview)
      }
    }
    fetchInterview()
  }, [resheduleModal, interviews._id])

  // to reshedule the current interview...
  const handleReshedule = async () => {
    setReshedulModal(true)
  }

  const handleStartMeet = (id: string) => {
    const fetchInterview = async () => {
      const response = await getInterviewsById(id);
      if (response.data) {
        socket.emit("call_user", {
          interviewId: interviews._id,
          callerId: response.data.interviews.recruiterId,
          receiverId: response.data.interviews.userId
        });
        socket.emit("join_room", interviews._id)
      }
    }
    fetchInterview();
    navigate(`/recruiter/videoCall/${interviews._id}`);
  }
  return (
    <div className="p-5 shadow-xl rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {interviews.username}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
            Interviewer: <span className="ml-1 font-medium">{interviews.interviewer}</span>
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
            {new Date(interviews.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}{" "}
            at {interviews.time}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <div className="mt-4 flex space-x-2">
          <button
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:text-white hover:bg-indigo-500 transition-colors flex items-center"
            onClick={() => handleStartMeet(interviews._id)}

          >
            <VideoIcon className="h-4 w-4 mr-1.5" />
            Start Meet
          </button>
          <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-500 text-indigo-50 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center"
            onClick={handleReshedule}>
            Reshedule
          </button>
        </div>
        <div className="mt-4 flex space-x-2">
          {interviews.interviewType &&
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <span className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-500 text-white transition-colors flex items-center">
                <BadgeCheck className="h-4 w-4 mr-1.5" />
                {interviews.interviewType} Round</span>
            </p>
          }
        </div>


      </div>
      {resheduleModal && <ResheduleModal onClose={() => setReshedulModal(false)} interview={interviews} />}
    </div>
  )
}

export default InterviewCard


