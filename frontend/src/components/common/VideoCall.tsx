import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../utils/socket";

type WebRTCSignal =
  | { type: "offer"; offer: RTCSessionDescriptionInit }
  | { type: "answer"; answer: RTCSessionDescriptionInit }
  | { type: "candidate"; candidate: RTCIceCandidateInit };

const VideoCall = () => {
  const { id: roomId } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const navigate = useNavigate();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleSignal = async (data: WebRTCSignal) => {
      if (!peerConnection.current) return;
      if (data.type === "offer") {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('webrtc_signal', { roomId, data: { type: "answer", answer } });
      } else if (data.type === "answer") {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === "candidate") {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    socket.on("webrtc_signal", handleSignal);
    // after completeing prefferd job check the audio working or not...
    navigator.mediaDevices.getUserMedia({ video: true , audio: true}).then((stream) => {
      if (!isMounted) return;
     
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event: RTCTrackEvent) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          socket.emit("webrtc_signal", { roomId, data: { type: "candidate", candidate: event.candidate.toJSON() } });
        }
      };

      peerConnection.current.onnegotiationneeded = async () => {
        const offer = await peerConnection.current?.createOffer();
        if (offer) {
          await peerConnection.current?.setLocalDescription(offer);
          socket.emit("webrtc_signal", { roomId, data: { type: "offer", offer } });
        }
      };

      socket.emit("join_room", roomId);
    });

    const handleCallEnded = () => {
      cleanup();
      navigate(-1);
    };
    socket.on("call_ended", handleCallEnded);

    return () => {
      isMounted = false;
      socket.off("webrtc_signal", handleSignal);
      socket.off("call_ended", handleCallEnded);

      cleanup();
    };
  }, [roomId, navigate]);


  const cleanup = () => {
    if (peerConnection.current) {
      peerConnection.current.onicecandidate = null;
      peerConnection.current.onnegotiationneeded = null;
      peerConnection.current.ontrack = null;
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleEndCall = () => {
   cleanup();
   socket.emit("end_call", { roomId });
   navigate(-1);
  };

  useEffect(() => {
    socket.on("call_ended", () => {
      navigate(-1);
    });
    return () => { 
       socket.off("call_ended");
      }
  },[navigate]);

  return (
    <div className="relative h-screen w-full bg-gray-900 overflow-hidden">
 
      <div className="h-[calc(100%-80px)] w-full flex items-center justify-center p-4">
       
        <div className="h-full w-full max-w-6xl rounded-lg overflow-hidden bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            id="remoteVideo"
          />
        </div>

       
        <div className="absolute bottom-24 right-4 w-64 h-48 rounded-md overflow-hidden border-2 border-white shadow-xl bg-black">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            id="localVideo"
          />
          {isVideoOff && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <VideoOff className="text-gray-400 w-10 h-10" />
              </div>
            </div>
          )}
        </div>
      </div>

      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-800 bg-opacity-70 flex items-center justify-center gap-6">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`h-12 w-12 rounded-full flex items-center justify-center ${
            isMuted ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
          } text-white transition-colors`}
        >
          {isMuted ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`h-12 w-12 rounded-full flex items-center justify-center ${
            isVideoOff ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
          } text-white transition-colors`}
        >
          {isVideoOff ? (
            <VideoOff className="w-6 h-6" />
          ) : (
            <Video className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={handleEndCall}
          className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;