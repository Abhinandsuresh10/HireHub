import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { Building2, CalendarDays, Briefcase, GraduationCap, MapPin, BadgeDollarSign, ScrollText, CheckCircle2 , Ban, AlertCircle} from 'lucide-react';
import { useSelector } from "react-redux";
import { applyJob } from "../../api/user/userApplication";
import toast from "react-hot-toast";
import { useState } from "react";
import { fetchIsApplied } from "../../api/user/userApplication";
import { RootState } from "../../store/store";

const ViewJob = () => {
  const location = useLocation();
  const job = location.state?.job;
  const user = useSelector((state:RootState) => state.users.user);
  const [isApplied, setIsApplied] = useState(false);
  const navigate = useNavigate();
 
 
  const fetchitem = async () => {
    const isApplied = await fetchIsApplied(user._id, job._id);
    if(!isApplied.data) {
      setIsApplied(true);
    }
  }
  fetchitem();

  const handleApply = async () => {
    try {
      const data = {
        userId: user._id,
        recruiterId: job.recruiterId,
        jobId: job._id
      }
      if(!user.resumeUrl) {
        toast.error('add your resume before apply');
        navigate('/profile')
        return;
      }
      const response = await applyJob(data);
      if(response) {
        toast.success(response.data.message)
        navigate('/jobs')
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!job) {
    return <p className="text-center text-xl text-gray-600 mt-10">Job not found</p>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl">
          {/* Header Section */}
          <div className="p-6 space-y-4">
            
            <div className="flex items-start gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{job.jobRole}</h1>
                <p className="text-lg text-gray-600"><span className="text-sm italic font-semibold">@</span>{job.company}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  {job.jobLocation}
                </div>
              </div>
           
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Job Type</p>
                  <p className="text-sm text-gray-600">{job.jobType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BadgeDollarSign className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Salary</p>
                  <p className="text-sm text-gray-600">
                    {job.minSalary}LPA - {job.maxSalary}LPA
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Qualification</p>
                  <p className="text-sm text-gray-600">{job.qualification}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-gray-600">
                    {new Date(job.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            <div className="h-px bg-gray-200" />
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <ScrollText className="w-5 h-5" />
                Job Description
              </h2>
              <p className="text-gray-600 leading-relaxed pl-4 pr-4">
                {job.jobDescription}
              </p>
            </div>
            

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Responsibilities
              </h2>
              <ul className="space-y-2 pl-4 pr-4">
                {job.responsibilities.map((responsibility: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-600 flex-shrink-0" />
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2 pl-4 pr-4">
                {job.skills.map((skill: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-6 flex justify-center pt-6">
            {isApplied ? ( <button 
              onClick={handleApply}
              className="px-8 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              Apply for this position
            </button>) : ( <button 
              className="px-8 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-300 transition-colors w-full sm:w-auto"
            disabled>
              Already applied
            </button>)}
              <button
               onClick={() => navigate(`/spam/recruiter/${job.recruiterId}`)}
               className="flex items-center border bg-red-500 text-white rounded-lg ml-4 p-2">
               <AlertCircle className="w-5 h-5 mr-1" />
               <span className="text-sm font-medium">Report</span>
             </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewJob;