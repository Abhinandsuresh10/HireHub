import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminPublicRoute = () => {
    const isAuthenticated = useSelector((state: any) => state.adminAuth.isAuthenticated);
    console.log(isAuthenticated);
    return isAuthenticated ? <Navigate to="/admin/adminDashboard" replace /> : <Outlet />;
}

export default AdminPublicRoute
