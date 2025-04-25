import React, { useEffect, useState } from 'react';
import { Save, User, Upload, Building2, Phone, Factory, Users } from 'lucide-react';
import Footer from '../../components/user/Footer';
import RecruiterHeader from '../../components/recruiter/RecruiterHeader';
import { editProfileSchema, EditProfileFormData } from '../../schema/EditRecruiter.schema';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { editRecruiter } from '../../api/recruiter/recriuters';
import { addRecruiter } from '../../store/slices/recruiterDataSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const recruiter = useSelector((state: RootState) => state.recruiters.recruiter);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: '',
    company: '',
    mobile: '',
    industry: '',
    hiringInfo: '',
    image: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EditProfileFormData, string>>>({});

    useEffect(() => {
      if (recruiter) {
        setFormData({
          name: recruiter.name || '',
          company: recruiter.company || '',
          mobile: recruiter.mobile || '',
          industry: recruiter.industry || '',
          hiringInfo: recruiter.hiringInfo || '',
          image: '',
        });
      }
    }, [recruiter]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        const validation = editProfileSchema.safeParse(formData);
        if (!validation.success) {
          const fieldErrors: Partial<Record<keyof EditProfileFormData, string>> = {};
          validation.error.errors.forEach(err => {
            const fieldName = err.path[0] as keyof EditProfileFormData;
            fieldErrors[fieldName] = err.message;
          });
          setErrors(fieldErrors);
          return;
        }
    
        setErrors({});
       
        const response = await editRecruiter(recruiter._id, formData);
        if (response) {
          dispatch(addRecruiter({ recruiter: response.data.recruiter }));
          navigate('/recruiter/profile');
          toast.success(response.data.message);
        }
  };

  return (
    <>
    <RecruiterHeader />
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Edit Profile</h2>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative group">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
                {formData.image ? (
                  <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload profile picture"
              />
            </div>
            <p className="text-sm text-gray-500">Click to upload profile picture</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Company Name"
                />
              </div>
                {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
                {errors.mobile && <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Factory className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Technology, Healthcare, etc."
                />
              </div>
                {errors.industry && <p className="text-sm text-red-500 mt-1">{errors.industry}</p>}
            </div>

            <div>
              <label htmlFor="hiringInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Hiring Information
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="hiringInfo"
                  name="hiringInfo"
                  value={formData.hiringInfo}
                  onChange={handleChange}
                  rows={4}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Describe your hiring needs and requirements..."
                />
              </div>
                {errors.hiringInfo && <p className="text-sm text-red-500 mt-1">{errors.hiringInfo}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default EditProfile;