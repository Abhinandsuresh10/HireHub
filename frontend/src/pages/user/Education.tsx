import React, { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { addEducation, deleteEducation, getEducation} from '../../api/user/education';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { educationShcema, EducationFormData } from '../../schema/Education.schema';

interface Education {
  education: string;
  institute: string;
  graduateDate: string;
}

export default function Education() {
  const user = useSelector((state: RootState) => state.users.user);
  const [education, setEducation] = useState<Education | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EducationFormData>({
    education: '',
    institute: '',
    graduateDate: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EducationFormData, string>>>({});

  useEffect(() => { 
    const fetchEducation = async() => {
      const response = await getEducation(user._id);
      if(response) {
        setEducation(response);
        setIsEditing(false);
      }
    }
   fetchEducation();
  },[user])
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
  
    const validation = educationShcema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof EducationFormData, string>> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as keyof EducationFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
  
    setErrors({});
  
    try {
      const response = await addEducation(user._id, formData);
      if (response?.data) {
        setEducation(response?.data.education);
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async() => {
    if(!education) return;
    await deleteEducation(education._id);
    setEducation(null);
    setFormData({
      education: '',
      institute: '',
      graduateDate: ''
    });
  };

  if (isEditing) {
    return (
      <div className="mt-6 pt-4">
        <h3 className="text-lg font-semibold mb-4">Education</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Education Level (e.g., BSc Computer Science)"
              className="w-full p-2 border rounded"
              value={formData.education}
              onChange={(e) => {
                setFormData({...formData, education: e.target.value});
                setErrors(prev => ({ ...prev, education: undefined }));
              }}
            />
          {errors.education && <p className="text-sm text-red-500">{errors.education}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Institution"
              className="w-full p-2 border rounded"
              value={formData.institute}
              onChange={(e) => {
               setFormData({...formData, institute: e.target.value});
               setErrors(prev => ({ ...prev, institute: undefined }));
              }}
            />
            {errors.institute && <p className="text-sm text-red-500">{errors.institute}</p>}
          </div>
          <div>
            <input
              type="date"
              placeholder="Year of Graduation"
              className="w-full p-2 border rounded"
              value={formData.graduateDate ? new Date(formData.graduateDate).toISOString().split('T')[0] : ''}
              onChange={(e) => { 
                setFormData({...formData, graduateDate: e.target.value}); 
                setErrors(prev => ({ ...prev, graduateDate: undefined }));
              }}
            />
            {errors.graduateDate && <p className="text-sm text-red-500">{errors.graduateDate}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData(education || {
                  education: '',
                  institute: '',
                  graduateDate: ''
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-4">
      <h3 className="text-lg font-semibold mb-4">Education</h3>
      {education ? (
        <div className="p-4 shadow rounded-lg relative bg-gray-50 hover:bg-gray-100 transition-colors">
          <button 
            onClick={handleDelete}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
          <p className="text-gray-600 text-sm">
            Education Level: {education.education}
          </p>
          <p className="text-gray-600 text-sm">
            Institution: {education.institute}
          </p>
          <p className="text-gray-600 text-sm">
            Year of Graduation: {new Date(education.graduateDate).toLocaleDateString()}
          </p>
          <button
            onClick={() => {
              setFormData(education);
              setIsEditing(true);
            }}
            className="mt-3 text-blue-500 flex items-center gap-1 hover:text-blue-600"
          >
            <Pencil size={16} /> Edit Education
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 flex items-center gap-1 hover:text-blue-600"
        >
          Add Education
        </button>
      )}
    </div>
  );
}