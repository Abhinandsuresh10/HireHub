import { useParams } from "react-router-dom";
import Footer from "../../components/user/Footer"
import Header from "../../components/user/Header"
import { useEffect, useState } from "react";
import { IRecruiter } from "../../types/recruiter.types";
import { getSingleRecruiter } from "../../api/user/users";


const ViewAnyRecruiter = () => {
  const { id } = useParams();
  const [recruiter, setRecruiter] = useState<IRecruiter>();

  useEffect(() => {
    const fetchSingleRecruiter = async() => {
      const response = await getSingleRecruiter(id as string);
      if(response.data) {
         setRecruiter(response.data.recruiter);
      }
    }
    fetchSingleRecruiter();
  }, [id]);

  return (
  <>
  <Header />
  <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 sm:px-8 py-10">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center space-y-6">
      {/* Profile Image */}
      {recruiter?.imageUrl && (
        <img
          src={recruiter.imageUrl}
          alt={recruiter.name}
          className="w-28 h-28 rounded-full mx-auto object-cover border border-gray-300 shadow"
        />
      )}

      {/* Recruiter Details */}
      <div className="space-y-2">
        <p className="text-2xl font-semibold text-gray-900">{recruiter?.name}</p>
        <p className="text-base text-gray-600">{recruiter?.email}</p>
        <p className="text-base text-gray-600">🏢 {recruiter?.company}</p>
        <p className="text-base text-gray-600">📢 {recruiter?.hiringInfo}</p>
        <p className="text-base text-gray-600">🏭 {recruiter?.industry}</p>
      </div>
    </div>

     {/* Recent Recruiter Jobs - pending*/} 
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center space-y-6 mt-6">

    </div>

  </div>
  <Footer />
</>

  )
}

export default ViewAnyRecruiter
