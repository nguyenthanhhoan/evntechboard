import React, { useEffect } from "react";
import { useAuth } from './auth-context/auth.context';
import { useNavigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token || user.token === "") {
      console.log("User not authenticated, redirecting to sign-in"); // Debug log
      navigate("/authentication/sign-in", { replace: true });
    } else {
      console.log("User authenticated, rendering protected route"); // Debug log
    }
  }, [user, navigate]);

  // Render Outlet only if authenticated
  return user?.token ? <Outlet /> : null;
};