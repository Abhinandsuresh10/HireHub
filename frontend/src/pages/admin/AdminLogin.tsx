import { Link, useNavigate } from "react-router-dom";
import { schema } from "../../schema/AdminLogin.schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import AdminAPI from "../../config/adminApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/adminSlice";

type FormData = z.infer<typeof schema>;

const AdminLogin = () => {

     const { register , handleSubmit, formState: { errors } } = useForm<FormData>({
         resolver: zodResolver(schema)
     });
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const onsubmit = async (data: FormData) => {

        try {
            const response = await AdminAPI.post('/login', data);
            
            if(response.data) {
              dispatch(loginSuccess({ admin: response.data.admin, accessToken: response.data.accessToken }))
              navigate('/admin/adminDashboard')
              toast.success('Admin login success');
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

  return (
  <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">Admin Login</h2>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-4">
            <label className="block text-black mb-2">Email</label>
            <input {...register('Email')} type="email" className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-sm p-3">{errors.Email?.message}</p>
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2">Password</label>
            <input {...register('Password')} type="password" className="w-full p-2 border border-gray-300 rounded" />
            <p className="text-red-500 text-sm p-3">{errors.Password?.message}</p>
          </div>
          <p className="p-2 text-gray-400">Don't have an account ? <Link to='/admin/adminRegister' className="text-black"> ← register</Link></p>
          <button type='submit' className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
