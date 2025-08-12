import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slices/userSlice";


const ProtectedRoute = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = localStorage.getItem('token'); // just done this to check token exist if any error change this area....
  if(!token) {
    dispatch(logout());
  }

  return isAuthenticated && token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
