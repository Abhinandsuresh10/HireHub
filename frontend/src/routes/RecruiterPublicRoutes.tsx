import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slices/recruiterSlice";

const RecruiterPublicRoute = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.recruiterAuth.isAuthenticated);
    // const token = localStorage.getItem('recruiterToken'); // just done this to check token exist if any error change this area....
    const token = localStorage.getItem('token');
    if(!token) {
      dispatch(logout())
    }

  return isAuthenticated && token ? <Navigate to="/recruiter/" replace /> : <Outlet />;
};

export default RecruiterPublicRoute;
