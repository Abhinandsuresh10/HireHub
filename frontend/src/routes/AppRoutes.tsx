import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import RecruiterRoutes from "./RecruiterRoutes";



const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path='/recruiter/*' element={<RecruiterRoutes />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
