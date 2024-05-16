import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const AuthRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <Outlet />;
};

export default AuthRoutes;
