import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import OtpVerification from "../pages/user/OtpVerification";
import PublicRoute from "../routes/PublicRoute";
import Profile from "../pages/user/Profile";
import ProtectedRoute from "./protectedRoute";
import Jobs from "../pages/user/Jobs";
import ViewJob from "../pages/user/ViewJob";
import EditProfile from "../pages/user/EditProfile";
import JobApplicationTracker from "../pages/user/MyJobs";
import MessageApp from "../components/common/Message";
import SpamReportForm from "../components/common/SpamReportForm";
import Notification from "../components/user/Notification";
import VideoCall from "../components/common/VideoCall";

const UserRoutes = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path='/jobs' element={<Jobs/>} />
        <Route path='/viewJob' element={<ViewJob/>} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path='/myJobs' element={<JobApplicationTracker />} />
        <Route path='/chat/:role/:id' element={<MessageApp />} />
        <Route path='/spam/:role/:id' element={<SpamReportForm />} />
        <Route path='/notification' element={<Notification />} />
        <Route path='/videoCall/:id' element={<VideoCall />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpVerification />} />
      </Route>
    </Routes>
    </>
  );
};

export default UserRoutes;
