import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = () => {
  const isAuthenticated = useSelector((state: any) => state.adminAuth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/adminLogin" replace />;
};

export default AdminProtectedRoute;
