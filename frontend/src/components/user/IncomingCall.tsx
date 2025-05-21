import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socket";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";


const IncomingCall = () => {
  const [incomingCall, setIncomingCall] = useState<{ interviewId: string; callerId: string} | null>(null);
  const user = useSelector((state:RootState) => state.users.user);
  const navigate = useNavigate();

  useEffect(() => {
        socket.on("incoming_call", (data) => {
        console.log('this is working at the right area : ', data)
         if(user && data.receiverId === user._id) {
             setIncomingCall(data);
         }
    });
    return () => { socket.off("incoming_call") }
  },[user]);
 
const handleAcceptCall = () => {
    if (incomingCall) {
        socket.emit("join_room", incomingCall.interviewId);
        navigate(`/videoCall/${incomingCall.interviewId}`);
        setIncomingCall(null);
    }
}

const handleRejectCall = () => {
    setIncomingCall(null);
}
const location = useLocation();
if(!user || user.role !== "user" || location.pathname.startsWith("/recruiter") || location.pathname.startsWith('/admin')) return null;
if(!incomingCall) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded shadow-lg text-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            onClick={handleAcceptCall}>Accept</button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={handleRejectCall}>Reject</button>
        </div>
    </div>
  )
}

export default IncomingCall
