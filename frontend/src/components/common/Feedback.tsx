import { addFeedback } from "../../api/common/feedback";
import { RootState } from "../../store/store";
import { X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface feedback {
    onClose: () => void;
    id: string;
}

const Feedback:React.FC<feedback> = ({ onClose , id}) => {
   const navigate = useNavigate();

   const user = useSelector((state: RootState) => state.users.user);
   const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);

   const [comment, setComment] = useState('');

   let role: string;

   if(user) {
    id = user._id
    role = 'user'
   } else if (recruiter) {
    id = recruiter._id;
    role = 'recruiter'
   }

   const handleSubmit = async() => {
     const response = await addFeedback(id, role, comment);
     console.log(response)
     if(response.data) {
       navigate(-1); 
     }
   }

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
  <div className="bg-white w-80 p-6 rounded-xl shadow-2xl flex flex-col gap-4 relative">
    
    {/* Close Button */}
    <button onClick={() => { onClose(); navigate(-1)}} className="absolute top-2 right-2 text-gray-500 hover:text-black">
      <X className="w-5 h-5" />
    </button>
    
    {/* Heading */}
    <h1 className="text-lg font-semibold text-center">We'd love your feedback!</h1>
    
    {/* Feedback Input */}
    <div className="flex flex-col gap-2">
      <label htmlFor="comment" className="text-sm font-medium">Your Comment</label>
      <input
      onChange={(e) => setComment(e.target.value)}
        type="text"
        id="comment"
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type here..."
      />
    </div>

    {/* Star Rating (static) */}
    {/* <div className="text-center text-xl">⭐⭐⭐</div> */}

    {/* Submit Button (optional) */}
    <button className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-all"
    onClick={handleSubmit}>
      Submit
    </button>
  </div>
</div>

  )
}

export default Feedback

