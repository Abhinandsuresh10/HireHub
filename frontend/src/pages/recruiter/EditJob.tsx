import { useEffect, useState } from "react";
import Footer from "../../components/user/Footer";
import RecruiterHeader from "../../components/recruiter/RecruiterHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "../../schema/Job.schema";
import { z } from "zod";
import { EditJobData, fetchJobById } from "../../api/recruiter/jobPost";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getJobRoles } from "../../api/admin/jobRoles";
import { getSkills } from "../../api/admin/skills";

type FormData = z.infer<typeof jobSchema>

interface Categories {
  _id: string;
  category: string;
  jobRole: [string]
}

interface SkillCategory {
  _id: string;
  category: string;
  skills: string[];
}


const EditJob = () => {
  const { id } = useParams();
  const [responsibilities, setResponsibilities] = useState([""]);
  const [categories, setCategories] = useState<Categories[]>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const selectedCategory = categories?.find(cat => cat._id === selectedCategoryId);
  const [skills, setSkills] = useState([""]);

  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [selectedSkillCategoryId, setSelectedSkillCategoryId] = useState<string>("");
  const selectedSkillCategory = skillCategories.find(cat => cat._id === selectedSkillCategoryId);

  // Fetch skill categories on mount
  useEffect(() => {
    const fetchSkillCategories = async () => {
      const response = await getSkills();
      if (response?.data) {
        setSkillCategories(response.data.skills);
      }
    };
    fetchSkillCategories();
  }, []);

  useEffect(() => {
    const fetchJobRoles = async () => {
      const response = await getJobRoles();
      if (response?.data) {
        setCategories(response.data.jobRoles)
      }
    }
    fetchJobRoles();
  }, []);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(jobSchema)
  });

  useEffect(() => {
    const fetchJob = async () => {
      const response = await fetchJobById(id as string);
      const jobData = response.data.job;

      setSkills(jobData.skills || [""]);
      setResponsibilities(jobData.responsibilities || [""]);

      // Set selected skill category based on the first skill
      if (skillCategories && jobData.skills && jobData.skills.length > 0) {
        const foundSkillCategory = skillCategories.find(cat =>
          cat.skills.includes(jobData.skills[0])
        );
        if (foundSkillCategory) {
          setSelectedSkillCategoryId(foundSkillCategory._id);
        }
      }


      if (categories) {
        const foundCategory = categories.find(cat =>
          cat.jobRole.includes(jobData.jobRole)
        );
        if (foundCategory) {
          setSelectedCategoryId(foundCategory._id);
        }
      }

      reset({
        jobRole: jobData.jobRole,
        jobType: jobData.jobType,
        jobLocation: jobData.jobLocation,
        minSalary: jobData.minSalary,
        maxSalary: jobData.maxSalary,
        jobDescription: jobData.jobDescription,
        qualification: jobData.qualification,
        deadline: jobData.deadline?.split("T")[0],
        responsibilities: jobData.responsibilities,
        skills: jobData.skills,
      });
    };
  if (categories && skillCategories) {
    fetchJob();
  }
  }, [id, reset, categories, skillCategories]);


  const navigate = useNavigate();
  const onsubmit = async (data: FormData) => {
    try {
      const updatedData = {
        ...data,
        skills: skills.filter(skill => skill.trim() !== ""),
        responsibilities: responsibilities.filter(resp => resp.trim() !== "")
      };
      const response = await EditJobData(updatedData, id as string);
      if (response.data) {
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
    if (values[values.length - 1].length > 0) setState((prev) => [...prev, ""]);
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
          <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">Edit Job Post</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* Category Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                className="input-field mt-1"
                value={selectedCategoryId}
                onChange={e => {
                  setSelectedCategoryId(e.target.value);
                  // Optionally reset jobRole when category changes
                }}
              >
                <option value="">Select Category</option>
                {categories?.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Role Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Job Role</label>
              <select
                {...register('jobRole')}
                className="input-field mt-1"
                disabled={!selectedCategory}
                value={selectedCategory?.jobRole.includes(watch('jobRole')) ? watch('jobRole') : ""}
                onChange={e => {
                  // Update the jobRole in the form
                  setValue('jobRole', e.target.value);
                }}
              >
                <option value="" disabled>Select Job Role</option>
                {selectedCategory?.jobRole.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
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
                <label className="text-sm font-medium text-gray-700">Min Salary </label>
                <input type="number" {...register('minSalary')} placeholder="Min Salary ( ₹ )" step="any" className="input-field mt-1" />
                <p className="w-full h-5 text-sm text-red-500">{errors.minSalary?.message}</p>
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-700">Max Salary </label>
                <input type="number" {...register('maxSalary')} placeholder="Max Salary ( ₹ )" step="any" className="input-field mt-1" />
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

      

          {/* Skills Category Dropdown */}
          <div className="flex flex-col mt-6">
            <label className="text-sm font-medium text-gray-700">Skill Category</label>
            <select
              className="input-field mt-1"
              value={selectedSkillCategoryId}
              onChange={e => {
                setSelectedSkillCategoryId(e.target.value);
                setSkills([""]); // Reset skills when category changes
              }}
            >
              <option value="">Select Skill Category</option>
              {skillCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Dropdowns (multiple selection) */}
          <div className="mt-2">
            <label className="block font-semibold text-gray-700 mb-2">Skills</label>
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-4 items-center mb-2">
                <select
                  {...register(`skills.${index}`)}
                  className="input-field flex-1"
                  value={skill}
                  onChange={e => handleFieldChange(index, e.target.value, setSkills)}
                  disabled={!selectedSkillCategory}
                >
                  <option value="">Select Skill</option>
                  {selectedSkillCategory?.skills.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
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
            ))}
            {skills.map((_, idx) => (
              <p key={idx} className="w-full h-5 text-sm text-red-500">{errors.skills?.[idx]?.message}</p>
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
  )
}

export default EditJob
