import { useEffect, useState } from "react"
import Footer from "../../components/user/Footer"
import Header from "../../components/user/Header"
import { getAllRecruiters } from "../../api/user/users";
import ViewRecruiterCard from "../../components/user/ViewRecruiterCard";
import { IRecruiter } from "@/types/recruiter.types";
import toast from "react-hot-toast";

const ViewAllRecruiters = () => {
  const [recruiters, setRecruiters] = useState<IRecruiter[]>();
  const [company, setCompany] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 9;


  // fetching all recruiters with filter and pagination...

  useEffect(() => {
  const loadingToastId = 'no-recruiters-toast';
  const fetchRecruiters = async() => {
    const response = await getAllRecruiters(company, industry, page, limit);
    if(response.data) {
        const recruitersData = response.data.recruiters;
        setRecruiters(recruitersData);
        setTotalPages(Math.ceil(response.data.total / limit))
        if (recruitersData.length === 0) {
          // Show only one toast if not already shown
          toast.loading('No Recruiters Found', { id: loadingToastId });
        } else {
          // Dismiss if a toast with that ID exists
          toast.dismiss(loadingToastId);
        }
    }
  }
  fetchRecruiters();
  },[company, industry, page]);


  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-100 px-4 sm:px-8 md:px-20 flex flex-col justify-between">
        <div className="w-full flex justify-center items-center space-x-2 mt-6">
            <input type="text" className="p-2 border rounded flex justify-center items-center text-sm bg-white" onChange={(e) => setCompany(e.target.value)} placeholder="company" />
            <input type="text" className="p-2 border rounded flex justify-center items-center text-sm bg-white" onChange={(e) => setIndustry(e.target.value)} placeholder="industry" />
        </div>
      <div className="w-full grid grid-cols-1 mb-10 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
       {recruiters?.map((item, index) => (
         <ViewRecruiterCard key={index} recruiter={item} />
        ))}
      </div>
          {/* Pagination */}

     <div className="m-2 p-2 w-full flex items-center justify-center">
       <button
        className="p-2 rounded-lg bg-black text-white px-4"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        >
         Prev
       </button>
        <span className="p-2">{page} / {totalPages}</span>
      <button
       className="p-2 rounded-lg bg-black text-white px-4"
       disabled={page === totalPages}
       onClick={() => setPage(page + 1)}
        >
       Next
      </button>
     </div>
    </div>
    <Footer />
    </>
  )
}

export default ViewAllRecruiters
