import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RecruiterProtectedRoute = () => {
  const isAuthenticated = useSelector((state: any) => state.recruiterAuth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/recruiter/login" replace />;
};

export default RecruiterProtectedRoute;
