import { useState, useEffect } from 'react';
import otpImage from '../../assets/otp_image_3.jpg';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecruiterAPI from '../../config/recruiterApi';

const RecruiterOtp = () => {
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(30); 
  const [canResend, setCanResend] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'If you reload, the OTP timer will reset. Do you want to proceed?'
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  },[])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSubmit = async () => {
    if (input.length !== 4) {
      toast.error('Enter a valid 4-digit OTP');
      return;
    }
  
    try {
      const response = await RecruiterAPI.post('/verifyOTP', { otp: input });
  
      if (response.status === 201) {
        toast.success(response.data?.message || 'OTP Verified Successfully');
        navigate('/recruiter/login');
      } else {
        toast.error(response.data?.message || 'Invalid OTP');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.error || 'Invalid OTP'); 
      } else {
        toast.error('Something went wrong');
      }
    }
  };
  

  const handleResend = async () => {
    const response = await RecruiterAPI.post('/resentOtp');
    if (response.status === 200) {
      toast.success(response.data?.message);
      setTimer(30); 
      setCanResend(false); 
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${otpImage})` }}
    >
      {/* OTP Box */}
      <div className="w-full max-w-md bg-white shadow-2xl rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter OTP</h2>
        <p className="text-gray-600 mb-6">Enter the 4-digit OTP sent to your email.</p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            maxLength={4}
            className="w-full h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 tracking-widest"
          />
        </div>

        <button
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <p className="text-gray-600 mt-4">
          Didn't receive OTP?
          {canResend ? (
            <button className="text-blue-600 hover:underline ml-1" onClick={handleResend}>
              Resend OTP
            </button>
          ) : (
            <span className="text-gray-400 ml-1">Resend OTP in {timer}s</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default RecruiterOtp;


