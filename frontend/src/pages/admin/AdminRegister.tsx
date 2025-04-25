import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { schema } from "../../schema/AdminRegister.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { HttpResponse } from "../../constants/response.message";
import AdminAPI from "../../config/adminApi";

type FormData = z.infer<typeof schema>;

const AdminRegister = () => {

   const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
            resolver: zodResolver(schema)
        });

   const handleNextStep = async () => {
       const isValid = await trigger(['FullName', 'Mobile', 'Email']); 
       if (!isValid) return;
       setStep(2);
   };
   const navigate = useNavigate();
   const onsubmit = async (data:FormData) => {
    try {
        const payload = {
            name: data.FullName,
            email: data.Email,
            mobile: data.Mobile,
            password: data.Password
        }

        const response = await AdminAPI.post('/register', payload);
        if(response.data) {
            navigate('/admin/adminLogin')
            toast.success(response.data?.message);
        }
    } catch (error) {
        if (isAxiosError(error)) {
            if(error.response?.status === 400) {
                toast.error(HttpResponse.ALREADY_EXISTS);
            } else {
                toast.error('Registration failed please try again.')
            }
        } else if (error instanceof Error) {
            console.log('General Error:', error.message);
        } else {
            console.log('Unknown Error:', error);
        }
    }
   }

  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Admin Registration</h2>
        <form onSubmit={handleSubmit(onsubmit)}>
            {step === 1 && (<>
          <div className="mb-4">
            <label className="block text-black mb-2" >Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" {...register('FullName')}/>
            <p className="p-1 text-sm text-red-500">{errors.FullName?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2" >Email</label>
            <input type="email" className="w-full p-2 border border-gray-300 rounded" {...register('Email')}/>
            <p className="p-1 text-sm text-red-500">{errors.Email?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2" >Mobile</label>
            <input type="tel" className="w-full p-2 border border-gray-300 rounded" {...register('Mobile')}/>
            <p className="p-1 text-sm text-red-500">{errors.Mobile?.message}</p>
          </div>
          <p className="p-2 text-gray-400">Already have an account ? <Link to='/admin/adminLogin' className="text-black"> ← Login</Link></p>
          </>)}
          {step === 2 && (<>
          <div className="mb-4">
            <label className="block text-black mb-2" >Password</label>
            <input type="password" className="w-full p-2 border border-gray-300 rounded" {...register('Password')}/>
            <p className="p-1 text-sm text-red-500">{errors.Password?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Confirm Password</label>
            <input type="password" className="w-full p-2 border border-gray-300 rounded"  {...register('confirmPassword')}/>
            <p className="p-1 text-sm text-red-500">{errors.confirmPassword?.message}</p>
          </div>
          <p className="p-2 text-gray-400">step 1 ? <button onClick={() => setStep(e => e - 1)} className="text-black"> ← Go back</button></p>
          </>)}
          {step === 1 && (<button type='button' onClick={handleNextStep}  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
            step 2
          </button>)}
          {step === 2 && (<button type='submit' className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
            Register
          </button>)}
        </form>
      </div>
    </div>
  )
}

export default AdminRegister
