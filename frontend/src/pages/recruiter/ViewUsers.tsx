import Footer from "../../components/user/Footer"
import RecruiterHeader from "../../components/recruiter/RecruiterHeader"
import { useEffect, useState } from "react"
import { fetchAllUsers } from "../../api/recruiter/recriuters";
import Loader from "../../components/ui/Loader";
import { Iuser } from "../../types/user.types";
import ViewUserCard from "../../components/recruiter/ViewUserCard";


const ViewUsers = () => {

  const [users, setUsers] = useState<Iuser[]>();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [jobType, setJobType] = useState<string>("");
  const [jobRole, setJobRole] = useState<string>("");
  const limit = 9;

  
  useEffect(() => {

  const fetchUsers = async() => {
    const response = await fetchAllUsers( page, limit, jobType, jobRole );
    if(response.data) {
        setUsers(response.data.filteredUsers);
        setTotalPages(Math.ceil(response.data.total / limit))
    }
  } 

  fetchUsers();

},[page, jobType, jobRole]);

if(!users) {
    return (
        <>
       <RecruiterHeader />
          <Loader />
       <Footer />
       </>
    )
}

  return (
     <>
    <RecruiterHeader />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-8 md:px-20">  

    {/* filter area */}

    <div className="w-full max-w-7xl flex justify-center mt-4">

       <input
        type="text" className="w-35 bg-white p-2 m-2 border rounded text-sm px-3.5"
        placeholder="jobType"
        value={jobType}
        onChange={e => { setJobType(e.target.value); setPage(1); }} />

       <input
        type="text" className="w-35 bg-white p-2 m-2 border rounded text-sm px-3.5"
        placeholder="jobRole"
        value={jobRole} 
        onChange={e => { setJobRole(e.target.value); setPage(1); }}/>

    </div>

     {/* Show User Cards */}

     <div className="w-full max-w-7xl p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => (
          <ViewUserCard user={user} key={index}/>
        ))}
     </div>

     {/* Pagination */}

     <div className="m-2 p-2">
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

export default ViewUsers
