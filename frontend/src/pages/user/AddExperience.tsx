import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { addExperience, deleteExperience, getExperience } from '../../api/user/experience';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import toast from 'react-hot-toast';
import { experienceSchema } from '../../schema/Experience.schema';

interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  achievements: string;
}

const WorkExperience = () =>  {
  const user = useSelector((state: RootState) => state.users.user);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Experience>({
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    achievements: ''
  });

  useEffect(() => {
  const fetchExperience = async () => {
     const response = await getExperience(user._id as string);
     setExperiences(response)
  }
  fetchExperience();
  },[user])

  const [errors, setErrors] = useState<Partial<Record<keyof Experience, string>>>({});

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
  
    const result = experienceSchema.safeParse(formData);
  
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof Experience, string>> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as keyof Experience] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
  
    try {
      const response = await addExperience(user._id as string, result.data);
      toast.success(response?.data.message);
  
      if(response?.data) {
        setExperiences([...experiences, response.data.response]);
      }
  
      setIsAdding(false);
      setFormData({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        achievements: ''
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleDelete = async(id: string) => {
    try {
      const response = await deleteExperience(id);
      toast.success(response);
      setExperiences(state => state.filter(exp => exp._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Work Experience</h3>

      <div className="max-h-[300px] overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      
      {experiences.map((exp) => (
        <div key={exp._id} className="mb-4 p-4 bg-gray-50 shadow rounded-lg relative">
          <button 
            onClick={() => handleDelete(exp._id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
          <p className="text-gray-600 text-sm">Job Title: {exp.jobTitle}</p>
          <p className="text-gray-600 text-sm">Company: {exp.company}</p>
          <p className="text-gray-600 text-sm">Duration: {new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}</p>
          <p className="text-gray-600 text-sm">Achievements: {exp.achievements}</p>
        </div>
      ))}

      {isAdding ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <input
              type="text"
              placeholder="Job Title"
              className="w-full p-2 border rounded"
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
            />
            {errors.jobTitle && <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Company"
              className="w-full p-2 border rounded"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              placeholder="Start Date"
              className="p-2 border rounded"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            <input
              type="date"
              placeholder="End Date"
              className="p-2 border rounded"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
          <div>
            <textarea
              placeholder="Achievements"
              className="w-full p-2 border rounded"
              value={formData.achievements}
              onChange={(e) => setFormData({...formData, achievements: e.target.value})}            />
            {errors.achievements && <p className="text-red-500 text-sm mt-1">{errors.achievements}</p>}
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
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-3 text-blue-500 flex items-center gap-1 hover:text-blue-600"
        >
          <Plus size={16} /> Add Experience
        </button>
      )}
      </div>
    </div>
  );
}


export default WorkExperience;