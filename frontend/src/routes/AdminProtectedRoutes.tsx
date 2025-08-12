import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AdminProtectedRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/adminLogin" replace />;
};

export default AdminProtectedRoute;
