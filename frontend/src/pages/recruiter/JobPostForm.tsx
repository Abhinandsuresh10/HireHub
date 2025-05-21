import { useState } from "react";
import Footer from "../../components/user/Footer";
import RecruiterHeader from "../../components/recruiter/RecruiterHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "../../schema/Job.schema";
import { z } from "zod";
import { SentJobData } from "../../api/recruiter/jobPost";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";

type FormData = z.infer<typeof jobSchema>

const JobPostForm = () => {
  const [responsibilities, setResponsibilities] = useState([""]);
  const [skills, setSkills] = useState([""]);

  const {register, handleSubmit, formState: { errors}, reset} = useForm<FormData>({
    resolver: zodResolver(jobSchema) 
  });
  const navigate = useNavigate();
  const recruiter = useSelector((state:RootState) => state.recruiterAuth.recruiter);
  const onsubmit = async (data: FormData) => {
    try {
      const response = await SentJobData(data, recruiter._id as string, recruiter.company);
      if(response.data) {
        toast.success(response.data.message)
        reset();
        setResponsibilities([""]);
        setSkills([""]);
        navigate('/recruiter/jobs')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addField = (setState: React.Dispatch<React.SetStateAction<string[]>>, values: string[]) => {
    if(values[values.length - 1].length > 0) setState((prev) => [...prev, ""]);
  };

  const handleFieldChange = (
    index: number,
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDeleteField = (
    index: number,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.length === 0 ? [""] : updated; 
    });
  };

  return (
    <>
      <RecruiterHeader />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8 mb-8">
        <form action="" onSubmit={handleSubmit(onsubmit)}>
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Add Job Post</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="flex flex-col">
           <label className="text-sm font-medium text-gray-700">Job Role</label>
           <input {...register('jobRole')} type="text" placeholder="Job Role" className="input-field mt-1" />
           <p className="w-full h-5 text-sm text-red-500">{errors.jobRole?.message}</p>
         </div>
         
         <div className="flex flex-col">
           <label className="text-sm font-medium text-gray-700">Job Type</label>
           <input {...register('jobType')} type="text" placeholder="Job Type" className="input-field mt-1" />
           <p className="w-full h-5 text-sm text-red-500">{errors.jobType?.message}</p>
         </div>
      
         <div className="flex flex-col">
           <label className="text-sm font-medium text-gray-700">Job Location</label>
           <input {...register('jobLocation')} type="text" placeholder="Job Location" className="input-field mt-1" />
           <p className="w-full h-5 text-sm text-red-500">{errors.jobLocation?.message}</p>
         </div>
      
         <div className="flex gap-4">
           <div className="flex flex-col w-full">
             <label className="text-sm font-medium text-gray-700">Min Salary (LPA) </label>
             <input type="number" {...register('minSalary')} placeholder="Min Salary" step="any" className="input-field mt-1" />
             <p className="w-full h-5 text-sm text-red-500">{errors.minSalary?.message}</p>
           </div>
           
           <div className="flex flex-col w-full">
             <label className="text-sm font-medium text-gray-700">Max Salary (LPA) </label>
             <input type="number" {...register('maxSalary')} placeholder="Max Salary" step="any" className="input-field mt-1" />
             <p className="w-full h-5 text-sm text-red-500">{errors.maxSalary?.message}</p>
           </div>
         </div>
           </div>
           <div className="flex flex-col mt-5">
             <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
               Description
             </label>
             <textarea
               id="description"
               {...register('jobDescription')}
               placeholder="Job Description"
               className="input-field w-full h-32">
               </textarea>
               <p className="w-full h-5 text-sm text-red-500">{errors.jobDescription?.message}</p>
              </div>
        

        {/* Responsibilities */}
        <div className="mt-6">
          <label className="block font-semibold text-gray-700 mb-2">Responsibilities</label>
          {responsibilities.map((responsibility, index) => (
            <div key={index} className="flex flex-col gap-1 mb-3">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                {...register(`responsibilities.${index}`)}
                value={responsibility}
                onChange={(e) =>
                  handleFieldChange(index, e.target.value, setResponsibilities)
                }
                placeholder="Enter responsibility"
                className="input-field flex-1"
              />
              {responsibility.trim() && (
                <button
                  type="button"
                  onClick={() => handleDeleteField(index, setResponsibilities)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              )}
              {index === responsibilities.length - 1 && (
                <button
                  type="button"
                  onClick={() => addField(setResponsibilities, responsibilities)}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Add
                </button>
              )}
            </div>
            <p className="w-full h-5 text-sm text-red-500">{errors.responsibilities?.[index]?.message}</p>
          </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mt-6">
          <label className="block font-semibold text-gray-700 mb-2">Skills</label>
          {skills.map((skill, index) => (
          <div key={index} className="flex flex-col gap-1 mb-2">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                {...register(`skills.${index}`)}
                value={skill}
                onChange={(e) => handleFieldChange(index, e.target.value, setSkills)}
                placeholder="Enter skill"
                className="input-field flex-1"
              />
              {skill.trim() && (
                <button
                  type="button"
                  onClick={() => handleDeleteField(index, setSkills)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Delete
                </button>
              )}
              {index === skills.length - 1 && (
                <button 
                  type="button"
                  onClick={() => addField(setSkills, skills)}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Add
                </button>
              )}
            </div>
            {/* Error message with fixed height to prevent layout shifts */}
            <p className="w-full h-5 text-sm text-red-500">
              {errors.skills?.[index]?.message}
            </p>
          </div>
        ))}
        
        </div>

        {/* Qualification and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         <div className="flex flex-col">
           <label htmlFor="qualification" className="text-sm font-medium text-gray-700 mb-1">
             Qualification
           </label>
           <input
             id="qualification"
             {...register('qualification')}
             type="text"
             placeholder="Qualification"
             className="input-field"
           />
           <p className="w-full h-5 text-sm text-red-500">{errors.qualification?.message}</p>
         </div>
       
         <div className="flex flex-col">
           <label htmlFor="deadline" className="text-sm font-medium text-gray-700 mb-1">
             Application Deadline
           </label>
           <input
             id="deadline"
             {...register('deadline')}
             type="date"
             className="input-field"
           />
           <p className="w-full h-5 text-sm text-red-500">{errors.deadline?.message}</p>
         </div>
       </div>


        <button type="submit" className="w-full bg-blue-600 text-white py-3 mt-8 rounded-lg hover:bg-blue-700 transition duration-200">
          Submit
        </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default JobPostForm;
