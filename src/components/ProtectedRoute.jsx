import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  console.log("PROTECTED ROUTE TOKEN:", token);

  if (!token || token === "undefined") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;