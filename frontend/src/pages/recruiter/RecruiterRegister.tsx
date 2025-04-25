import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { schema } from '../../schema/Recruiter.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import registerImage from '../../assets/recruiter_register.webp';
import openEye from '../../assets/open_eyes.svg';
import closeEye from '../../assets/close_eyes.svg';
import { z } from 'zod';
import { HttpResponse } from '../../constants/response.message';
import toast from 'react-hot-toast';
import GoogleLoginBtn from '../../components/recruiter/GoogleLoginBtn';
import RecruiterAPI from '../../config/recruiterApi';

type FormData = z.infer<typeof schema>;

const RecruiterRegister = () => {

    const [step, setStep] = useState(1);
    const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const navigate = useNavigate();

    const handleNextStep = async () => {
        const isValid = await trigger(['FullName', 'Mobile', 'Email']); 
        if (!isValid) return;
        setStep(2);
    };

    const onSubmit = async (data: FormData) => {
        
        if (step === 1) {
            handleNextStep();
            return;
        }
        try {
            const payload = {
                name: data.FullName,
                mobile: data.Mobile,
                email: data.Email,
                company: data.Company,
                password: data.Password
            };

            const response = await RecruiterAPI.post('/register', payload);
            if (response.status === 201) {
                toast.success('OTP has been sented to you email');
                navigate('/recruiter/otp');
            } 
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                if(error.response?.status === 400) {
                    toast.error(HttpResponse.USER_EXIST);
                } else {
                    toast.error('Registration failed please try again.')
                }
            } else if (error instanceof Error) {
                console.log('General Error:', error.message);
            } else {
                console.log('Unknown Error:', error);
            }
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
   <div className="bg-white min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-2xl rounded-lg overflow-hidden">
                
                {/* Left section */}
                <div className="hidden md:block md:w-1/2">
                    <img src={registerImage} alt="login image" className='w-full h-full object-cover' />
                </div>

                {/* Right section */}
                <div className="md:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Recruiter Register</h2>
                    
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        {/* Full Name */}
                       {step === 1 && ( <><div>
                            <label className="block text-gray-700">Full Name</label>
                            <input
                                type="text"
                                {...register('FullName')}
                                placeholder="Enter your name"
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                            />
                            <p className="text-red-500 text-sm min-h-[20px]">{errors.FullName?.message}</p>
                        </div>

                        <div>
                            <label className="block text-gray-700">Mobile</label>
                            <input
                                type="text"
                                {...register('Mobile')}
                                placeholder="Enter your mobile"
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                            />
                            <p className="text-red-500 text-sm min-h-[20px]">{errors.Mobile?.message}</p>
                        </div>

                       
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('Email')}
                                placeholder="Enter your email"
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                            />
                            <p className="text-red-500 text-sm min-h-[20px]">{errors.Email?.message}</p>
                        </div> </>)}

                        {/* Password */}
                        {step === 2 && (<><div>
                            <label className="block text-gray-700">Company</label>
                            <input
                                type="text"
                                {...register('Company')}
                                placeholder="Enter your company"
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                            />
                            <p className="text-red-500 text-sm min-h-[20px]">{errors.Company?.message}</p>

                            <label className="block text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('Password')}
                                    placeholder="Enter your password"
                                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-600">
                                    <img src={showPassword ? openEye : closeEye} alt="Toggle Password" width="15" height="10" />
                                </button>
                            </div>
                            <p className="text-red-500 text-sm min-h-[20px]">{errors.Password?.message}</p>
                        </div>

                       
                        <div>
                            <label className="block text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword')}
                                    placeholder="Confirm your password"
                                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                                />
                                <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <img src={showConfirmPassword ? openEye : closeEye} alt="Toggle Confirm Password" width="15" height="10" />
                                </button>
                            </div>
                            <p className="text-red-500 text-sm min-h-[20px]">{errors.confirmPassword?.message}</p>
                        </div>
                        <p className='text-gray-400'>go back to <button type='button' onClick={() => setStep(e => e - 1)} className='text-black'> ← step 1</button></p> 
                        </>)}

                        {step === 2 && (<button type="submit" className="w-full bg-purple-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-600">
                            Register
                        </button>)}
                        {step === 1 && (
                            <button type="button" onClick={handleNextStep} className="w-full bg-purple-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-600">
                                step 2
                            </button>
                        )}

                        <p className="text-gray-700">Already have an account? <Link to="/recruiter/login" className="text-black">Login</Link></p>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 h-10">Or login with</p>
                        <GoogleLoginBtn />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default RecruiterRegister
