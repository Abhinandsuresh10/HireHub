import { Loader, User2 } from "lucide-react";
import { addOfferLetter, getCompletedInterviews } from "../../api/recruiter/recriuters";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CardContent } from "../ui/card";
import toast from "react-hot-toast";
import { socket } from "../../utils/socket";

interface CompletedInterviewsProps {
    userId:string;
    onClose: () => void;
}

interface CompletedInterview {
    _id: string;
    name: string;
    imageUrl: string;
    jobRole: string;
    date: Date;
}

const Modal:React.FC<CompletedInterviewsProps> = ({onClose, userId}: { onClose:() => void, userId: string }) => {

  const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);

  const handleSubmit = async (e) => {
     const filename = e.target.files?.[0];
     const formData = new FormData();
     formData.append('offerLetter', filename);
     console.log('this is the one : ', formData)
     if(filename) {
       const response = await addOfferLetter(formData, userId)
       if(response.data) {
         
      onClose();
      const notification = {
      senderId: recruiter._id,
      offerLetter: response.data.offerLetter,
      content:`${recruiter.name}, have sented you offerLetter. please download`,
      userId: userId
    }
        socket.emit('shedule_interview', notification);
         toast.success('offer letter sented')
       }
     }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs flex flex-col items-center">
          <p className="text-black text-xs">Are you sure that you want to upload offer letter ?</p>
          <div className="flex justify-between items-center space-x-10">
          <button onClick={onClose} className="text-xs text-white px-2 py-1 m-2 bg-red-600 rounded-lg">close</button>
          <label htmlFor="offer-letter" className="text-xs max-w-40 text-white px-2 py-1 m-2 bg-green-600 rounded-lg cursor-pointer">select & submit</label>
          <input type='file' id='offer-letter' accept=".pdf" className="hidden" onChange={(e) => handleSubmit(e)}/>
          </div>
        </div>
      </div>
  )
}

const CompletedInterviewsModal:React.FC<CompletedInterviewsProps> = ({onClose}) => {
  const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);
  const [interviewers, setInterviewers] = useState<CompletedInterview[]>();
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>('')
  const [offerModal, setOfferModal] = useState(false);

  useEffect(() => {
  const getCompletedInterview = async() => {
    const response = await getCompletedInterviews(recruiter._id as string);
    if(response.data) {
        setInterviewers(response.data.interviewers)
    }
  }
  getCompletedInterview();
  },[recruiter]);

  const handlSubmit = (id: string) => {
    setSelectedInterviewId(id);
    setOfferModal(true)
  }

  if(!interviewers) {
    return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs flex flex-col items-center">
          <span className="animate-spin text-cyan-700 mb-2">
            <Loader size={20} />
          </span>
          <p className="text-gray-600 text-xs">Loading...</p>
        </div>
      </div>
    )
  }

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white shadow-2xl p-6 w-[90%] max-w-md max-h-[90vh] overflow-y-auto">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Completed Interviews</h2>
      <button
        onClick={onClose}
        className="text-sm text-red-600 hover:underline"
      >
        Close
      </button>
    </div>
    
    <div>
      <CardContent className="space-y-4">
        {interviewers.map((interview, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-xl border">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Interview Info */}
            <div className="flex-1">
              <p className="text-base font-medium">{interview.name}</p>
              <p className="text-sm text-gray-500">{interview.jobRole}</p>
              <p className="text-xs text-green-700 mt-2">
                Completed 
              </p>
            </div>
      
            {/* Right: Image and Button */}
            <div className="flex flex-col items-center justify-between gap-2">
              {interview.imageUrl ? (<img src={interview.imageUrl} alt="" className="w-10 h-10 rounded-full" />)
                  :
                  (<User2 className="w-10 h-10 bg-gray-200 rounded-full text-gray-700"/>)}
              <button className="text-xs px-2 py-1 text-white rounded-lg bg-blue-700" onClick={() => handlSubmit(interview._id)}>
                upload OfferLetter
              </button>
            </div>
      
          </div>
        </div>
         ))}

      </CardContent>
    </div>
  </div>
         {offerModal && <Modal onClose={() => setOfferModal(false)}  userId={selectedInterviewId}/>}
</div>

  )
}

export default CompletedInterviewsModal
