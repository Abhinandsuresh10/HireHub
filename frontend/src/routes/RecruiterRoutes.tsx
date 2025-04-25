import { Route, Routes } from "react-router-dom"
import RecruiterHome from '../pages/recruiter/RecruiterHome'
import RecruiterRegister from "../pages/recruiter/RecruiterRegister"
import RecruiterLogin from "../pages/recruiter/RecruiterLogin"
import RecruiterOtp from "../pages/recruiter/RecruiterOtp"
import RecruiterPublicRoute from "./RecruiterPublicRoutes"
import RecruiterProtectedRoute from "./RecruiterProtectedRoutes"
import RecruiterProfile from "../pages/recruiter/RecruiterProfile"
import RecruiterManageJobs from "../pages/recruiter/RecruiterManageJobs"
import JobPostForm from "../pages/recruiter/JobPostForm"
import EditProfile from '../pages/recruiter/RecruiterEditProfile'
import EditJob from "../pages/recruiter/EditJob"

const RecruiterRoutes = () => {
  return (
   <Routes>
      <Route path='/' element={<RecruiterHome/>}/>

      <Route element={<RecruiterProtectedRoute/>}>
       <Route path='/profile' element={<RecruiterProfile/>} />
       <Route path='/jobs' element={<RecruiterManageJobs />} />
       <Route path='/postJob' element={<JobPostForm/>} />
       <Route path='/editProfile' element={<EditProfile />} />
       <Route path='/editJob/:id' element={<EditJob />} />
      </Route>

      <Route element={<RecruiterPublicRoute/>} >
      <Route path='/register' element={<RecruiterRegister/>} />
      <Route path='/login' element={<RecruiterLogin/>} />
      <Route path='/otp' element={<RecruiterOtp />} />
      </Route>
   </Routes>
  )
}

export default RecruiterRoutes
