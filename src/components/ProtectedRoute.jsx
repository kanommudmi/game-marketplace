import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useUser();

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
