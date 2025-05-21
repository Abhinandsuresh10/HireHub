import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import RecruiterRoutes from "./RecruiterRoutes";
import IncomingCall from "../components/user/IncomingCall";



const AppRoutes = () => {
  return (
    <Router>
      <IncomingCall />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path='/recruiter/*' element={<RecruiterRoutes />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
