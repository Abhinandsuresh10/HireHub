import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AdminPublicRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);
    
    return isAuthenticated ? <Navigate to="/admin/adminDashboard" replace /> : <Outlet />;
}

export default AdminPublicRoute
