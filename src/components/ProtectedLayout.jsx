import { Outlet, Navigate } from "react-router-dom";

function ProtectedLayout() {
  const token = localStorage.getItem("access_token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedLayout;