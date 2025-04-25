import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RecruiterPublicRoute = () => {
  const isAuthenticated = useSelector((state: any) => state.recruiterAuth.isAuthenticated);

  return isAuthenticated ? <Navigate to="/recruiter/" replace /> : <Outlet />;
};

export default RecruiterPublicRoute;
