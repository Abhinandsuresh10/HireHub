import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slices/recruiterSlice";

const RecruiterProtectedRoute = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.recruiterAuth.isAuthenticated);
  // const token = localStorage.getItem('recruiterToken'); // just done this to check token exist if any error change this area....
  const token = localStorage.getItem('token'); // testing...
  if(!token) {
    dispatch(logout())
  }

  return isAuthenticated && token? <Outlet /> : <Navigate to="/recruiter/login" replace />;
};

export default RecruiterProtectedRoute;
