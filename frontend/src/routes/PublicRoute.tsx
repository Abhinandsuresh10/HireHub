  import { Navigate, Outlet } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/userSlice";
import { RootState } from "../store/store";

  const PublicRoute = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
      const token = localStorage.getItem('token'); // just done this to check token exist if any error change this area....
      if(!token) {
        dispatch(logout())
      }

    return isAuthenticated && token ? <Navigate to="/" replace /> : <Outlet />;
  };

  export default PublicRoute;
