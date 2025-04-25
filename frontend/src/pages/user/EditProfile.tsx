import { useEffect, useState } from 'react';
import { Save, User, Upload } from 'lucide-react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { editUser } from '../../api/user/users';
import { addUser } from '../../store/slices/userDataSlice';
import { useNavigate } from 'react-router-dom';
import { editProfileSchema, EditProfileFormData } from '../../schema/EditUser.schema';
import { RootState } from '../../store/store';

const EditProfile = () => {
  const user = useSelector((state: RootState) => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EditProfileFormData>({
    name: '',
    mobile: '',
    location: '',
    jobTitle: '',
    image: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EditProfileFormData, string>>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        mobile: user.mobile || '',
        location: user.location || '',
        jobTitle: user.jobTitle || '',
        image: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const response = await editUser(user._id, formData);
    if (response) {
      dispatch(addUser({ user: response.data.user }));
      navigate('/profile');
      toast.success(response.data.message);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
                {formData.image ? (
                  <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : user.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <User className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
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
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="+1 (555) 000-0000"
              />
              {errors.mobile && <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>}
            </div>

            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Senior Developer"
              />
              {errors.jobTitle && <p className="text-sm text-red-500 mt-1">{errors.jobTitle}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="New York, USA"
              />
              {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
