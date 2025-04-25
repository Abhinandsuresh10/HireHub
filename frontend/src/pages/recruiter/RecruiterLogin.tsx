import { useEffect, useState } from 'react'
import LoginImage from '../../assets/recruiter_login.webp'
import openEye from '../../assets/open_eyes.svg'
import closeEye from '../../assets/close_eyes.svg'
import { Link, useNavigate } from 'react-router-dom'
import { schema , resetSchmea} from '../../schema/Login.schema'
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/slices/recruiterSlice'
import GoogleLoginBtn from '../../components/recruiter/GoogleLoginBtn'
import RecruiterAPI from '../../config/recruiterApi'
import { addRecruiter } from '../../store/slices/recruiterDataSlice'

type FormData = z.infer<typeof schema>;
type ResetFormData = z.infer<typeof resetSchmea>;

const RecruiterLogin = () => {
 const [step, setStep] = useState(1);
 const [forgotEmail, setForgotEmail] = useState('');
 const [otpInput, setOtpInput] = useState('');

 const { register , handleSubmit, formState: { errors } } = useForm<FormData>({
     resolver: zodResolver(schema)
 });

 const { register: registerReset, handleSubmit:handleResetPassword, formState: {errors: resetErrors}, reset: resetResentForm} = useForm<ResetFormData>({
    resolver: zodResolver(resetSchmea),
 })
 
 const navigate = useNavigate();
 const dispatch = useDispatch();

  useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = 'If you reload, may the datas will be lost. Do you want to proceed?'
      }
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
      }
    },[])

 const onSubmit = async (data: FormData) => {
   try {
       const payload = {
           email: data.Email,
           password: data.Password
       };

       const response = await RecruiterAPI.post('/login', payload);
    
       if (response) {
        dispatch(loginSuccess({ accessToken: response.data.accessToken }))
        dispatch(addRecruiter({ recruiter: response.data.recruiter }))
        toast.success('Recruiter Loggin success')
           navigate('/recruiter/');
       }
   } catch (error: unknown) {
       if (axios.isAxiosError(error)) {
           const errorMessage = error.response?.data?.error || 'Something went wrong';
           toast.error(errorMessage);
           console.log('Axios Error:', error.response?.data || error.message);
       } else if (error instanceof Error) {
           toast.error(error.message);
           console.log('General Error:', error.message);
       } else {
           toast.error('An unknown error occurred');
           console.log('Unknown Error:', error);
       }
   }
};

const onResetSubmit = async(data: ResetFormData) => {
    const password = data.NewPassword;
    try {
        const response = await RecruiterAPI.post('/setNewPassword',{password: password, email: forgotEmail});
        if(response.data) {
            setStep(1)
            toast.success(response.data?.message)
        }
        
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Something went wrong';
            toast.error(errorMessage);
            console.log('Axios Error:', error.response?.data || error.message);
        } else if (error instanceof Error) {
            toast.error(error.message);
            console.log('General Error:', error.message);
        } else {
            toast.error('An unknown error occurred');
            console.log('Unknown Error:', error);
        }
    }
}

const handleForgot = async() => {
   try {
    const response = await RecruiterAPI.post('/forgotPassword', {email: forgotEmail});
    if(response.data) {
        setStep(3);
        toast.success(response.data?.message);
    }
   } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Something went wrong';
        toast.error(errorMessage);
        console.log('Axios Error:', error.response?.data || error.message);
    } else if (error instanceof Error) {
        toast.error(error.message);
        console.log('General Error:', error.message);
    } else {
        toast.error('An unknown error occurred');
        console.log('Unknown Error:', error);
    }
   }
}

const handleOtpForgot = async () => {
    if(otpInput.length < 4) {
        toast.error('4 digits is required');
        return;
    }
    try {
        const response = await RecruiterAPI.post('/verifyForgotOtp', {email: forgotEmail,otp: otpInput});
        if(response.data) {
            setStep(4);
            toast.success(response.data?.message);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Something went wrong';
            toast.error(errorMessage);
            console.log('Axios Error:', error.response?.data || error.message);
        } else if (error instanceof Error) {
            toast.error(error.message);
            console.log('General Error:', error.message);
        } else {
            toast.error('An unknown error occurred');
            console.log('Unknown Error:', error);
        }
    }
}

 const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-8">
       <div className="w-full h-[540px] max-w-4xl flex flex-col md:flex-row bg-white shadow-2xl rounded-lg overflow-hidden">

    {/* Left section */}
     { step === 1 && ( <div className="md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Recruiter Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
             <div>
                <label htmlFor="" className="block text-gray-700">Email</label>
                <input 
                type="email" 
                {...register('Email')}
                placeholder="Enter your email" 
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"/>
                <p className="text-red-500 text-sm min-h-[20px]">{errors.Email?.message}</p>
             </div>

             <div>
                <label htmlFor="" className="block text-gray-700">Password</label>
                <div className="relative">
                <input 
                type={showPassword ? "text" : "password"}
                {...register('Password')}
                placeholder="Enter your password" 
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"/>
                <button type='button' className='absolute inset-y-0 right-3 flex items-center text-gray-600' onClick={() => setShowPassword(!showPassword)}>
                   <img src={showPassword ? openEye : closeEye} alt="" width='15' height='10'/>
                </button>
              </div>
                <p className="text-red-500 text-sm min-h-[20px]">{errors.Password?.message}</p>
             </div>

            <div className="flex justify-between items-center">
                <a href="#" className="text-blue-600 text-sm hover:underline" onClick={() => setStep(e => e + 1)}>forgot password</a>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700">
                Login
            </button>

            <p className='text-gray-700'>Don't have an account ?<Link to='/recruiter/register' className='text-black'> register</Link></p>

        </form>

         <div className="mt-6 text-center">
            <p className="text-gray-600 h-10">Or login with</p>
            
            <GoogleLoginBtn />
         </div>
     </div> )}

     { step === 2 && ( <div className="md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">forgot password</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
             <div>
                <label htmlFor="" className="block text-gray-700">Email</label>
                <input
                onChange={(e) => setForgotEmail(e.target.value)}
                type="email" 
                placeholder="Enter your email" 
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white" required/>
                <p className="text-red-500 text-sm min-h-[20px]"></p>
             </div>

            <button type="button" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700" onClick={handleForgot}>
                sent
            </button>
            <p className='text-gray-700'>Go back to <button className='text-black' onClick={() => setStep(e => e - 1)}> ← Login </button></p>
        </form>
     </div> )}

        {step === 3 && (<div className="md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter OTP</h2>
        <p className="text-gray-600 mb-6">Enter the 4-digit OTP sent to your email.</p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <input
            onChange={(e) => setOtpInput(e.target.value)}
            type="text"
            maxLength={4}
            className="w-full h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 tracking-widest"
          />
        </div>

        <button type='button'
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition"
         onClick={handleOtpForgot}
        >
          Submit
        </button>
        <p className='text-gray-700 mt-2'>Go back to <button className='text-black' onClick={() => setStep(e => e - 1)}> ← sentEmail </button></p>
        </div>)}

        { step === 4 && ( <div className="md:w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Set new Password</h2>

        <form className="space-y-4" onSubmit={handleResetPassword(onResetSubmit)}>

             <div>
                <label htmlFor="" className="block text-gray-700">New Password</label>
                <div className="relative">
                <input 
                type={showPassword ? "text" : "password"}
                {...registerReset('NewPassword')}
                placeholder="Enter your password" 
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"/>
                <button type='button' className='absolute inset-y-0 right-3 flex items-center text-gray-600' onClick={() => setShowPassword(!showPassword)}>
                   <img src={showPassword ? openEye : closeEye} alt="" width='15' height='10'/>
                </button>
              </div>
                <p className="text-red-500 text-sm min-h-[20px]">{resetErrors.NewPassword?.message}</p>
             </div>

             <div>
                <label htmlFor="" className="block text-gray-700">Confirm Password</label>
                <div className="relative">
                <input 
                type={showPassword ? "text" : "password"}
                {...registerReset('ConfirmPassword')}
                placeholder="Confirm your password" 
                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"/>
                <button type='button' className='absolute inset-y-0 right-3 flex items-center text-gray-600' onClick={() => setShowPassword(!showPassword)}>
                   <img src={showPassword ? openEye : closeEye} alt="" width='15' height='10'/>
                </button>
              </div>
                <p className="text-red-500 text-sm min-h-[20px]">{resetErrors.ConfirmPassword?.message}</p>
             </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700">
                Confirm
            </button>

        </form>

     </div> )}

        {/* Right section */}
        <div className="hidden md:block md:w-1/2">
            <img src={LoginImage} alt="login image" className='w-full h-full object-cover'/>
        </div>

       </div>
    </div>
  )
}

export default RecruiterLogin


