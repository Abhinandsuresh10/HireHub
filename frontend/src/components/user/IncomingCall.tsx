import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socket";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Phone, PhoneOff, User } from "lucide-react";


const IncomingCall = () => {
  const [incomingCall, setIncomingCall] = useState<{ interviewId: string; callerId: string} | null>(null);
  const [timer, setTimer] = useState(30);
  const user = useSelector((state:RootState) => state.users.user);
  const navigate = useNavigate();

  useEffect(() => {
        socket.on("incoming_call", (data) => {
         if(user && data.receiverId === user._id) {
             setIncomingCall(data);
             setTimer(30);
         }
    });
    return () => { socket.off("incoming_call") }
  },[user]);

   useEffect(() => {
    if (!incomingCall) return;
    if (timer === 0) {
      handleRejectCall();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingCall, timer]);
 
const handleAcceptCall = () => {
    if (incomingCall) {
        socket.emit("join_room", incomingCall.interviewId);
        navigate(`/videoCall/${incomingCall.interviewId}`);
        setIncomingCall(null);
        setTimer(30);
    }
}

const handleRejectCall = () => {
    setIncomingCall(null);
    setTimer(30);
}
const location = useLocation();
if(!user || user.role !== "user" || location.pathname.startsWith("/recruiter") || location.pathname.startsWith('/admin')) return null;
if(!incomingCall) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center w-[90vw] max-w-sm">
        <div className="mb-4 flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-4 mb-2">
            <User className="w-10 h-10 text-blue-500" />
          </div>
          <div className="text-lg font-semibold mb-1">Incoming Call</div>
           <div className="text-sm text-gray-500">Auto-decline in {timer} seconds</div>
        </div>
        <div className="flex gap-6 mt-4">
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition"
            onClick={handleAcceptCall}
          >
            <Phone className="w-5 h-5" /> Accept
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition"
            onClick={handleRejectCall}
          >
            <PhoneOff className="w-5 h-5" /> Decline
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncomingCall
