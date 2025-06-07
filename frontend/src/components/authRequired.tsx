import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loading from "./loading/Loading";

const AuthRequired = ({ allowedRole }: { allowedRole: number }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or nothing while checking auth
    // console.log("we are laoding..")
    return <div className="h-screen w-screen flex items-center justify-center"><Loading/></div>; // or return null;
  }

  if (!user?.userId) {
    // Not logged in
    // console.log(user, "User is not logged in");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.roles !== allowedRole) {
    // Logged in but not allowed
    console.log(user, "User is logged in but not allowed");

    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AuthRequired;
