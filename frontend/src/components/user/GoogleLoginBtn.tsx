import { GoogleLogin } from "@react-oauth/google";
import UserAPI from "../../config/userApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/userSlice";
import { addUser } from "../../store/slices/userDataSlice";


const GoogleLoginBtn = () => {

    const dispatch = useDispatch();
    
    const handleSuccess = async (response: any) => {
        
        if (!response.credential) {
            toast.error("No credentials received");
            return;
        }
        
        
      try {
        const Gresponse = await UserAPI.post('/googleLogin', {user: response.credential});
        if(Gresponse.data) {
          dispatch(loginSuccess({accessToken: Gresponse.data.data.accessToken}))
          dispatch(addUser({user: Gresponse.data.data.user}))
          toast.success('Google login success')
        } 
      } catch (error) {
        if(error instanceof Error) {
          toast.error('User is blocked')
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
