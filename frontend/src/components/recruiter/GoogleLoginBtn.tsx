import { GoogleLogin } from "@react-oauth/google";
import RecruiterApi from "../../config/recruiterApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/recruiterSlice";
import { addRecruiter } from "../../store/slices/recruiterDataSlice";


const GoogleLoginBtn = () => {

    const dispatch = useDispatch();
    
    const handleSuccess = async (response: any) => {
        
        if (!response.credential) {
            toast.error("No credentials received");
            return;
        }
        
        
      try {
        const Gresponse = await RecruiterApi.post('/googleLogin', {recruiter: response.credential});
        if(Gresponse.data) {
          dispatch(loginSuccess({ accessToken: Gresponse.data.data.accessToken}))
          dispatch(addRecruiter({recruiter: Gresponse.data.data.recruiter}))
          toast.success('Google login success')
        }
      } catch (error) {
        if(error instanceof Error) {
          toast.error('Recruiter is blocked')
        }
      }

    }

    const handleFailure = () => {
         toast.error('Google login failed')
    }

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
  )
}

export default GoogleLoginBtn
