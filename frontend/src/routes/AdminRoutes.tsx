import { Route, Routes } from "react-router-dom";
import AdminDahsboard from "../pages/admin/AdminDahsboard";
import AdminRegister from "../pages/admin/AdminRegister";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminPublicRoute from "./AdminPublicRoute";
import AdminProtectedRoute from "./AdminProtectedRoutes";
import Users from "../pages/admin/Users";
import Recruiters from "../pages/admin/Recruiters";
import { Skills } from "../pages/admin/AddSkills";


const AdminRoutes = () => {
  return (
    <Routes> 
        <Route element={<AdminProtectedRoute/>}>
        <Route path='/adminDashboard' element={<AdminDahsboard />}/>
        <Route path='/users' element={<Users/>} />
        <Route path='/recruiters' element={<Recruiters/>} />
        <Route path="/skills" element={<Skills />} />
        </Route>

        <Route element={<AdminPublicRoute />} >
        <Route path='/adminRegister' element={<AdminRegister />} />
        <Route path='/adminLogin' element={<AdminLogin />} />
        </Route>
    </Routes>
  )
}

export default AdminRoutes
