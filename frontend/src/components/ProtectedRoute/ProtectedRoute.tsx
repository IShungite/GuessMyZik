import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import decodeJwt from '../../utils/decodeJwt';

export default function ProtectedRoute() {
  const { auth, logout } = useAuth();

  useEffect(() => {
    if (!auth) return;

    const decodedToken = decodeJwt(auth.access_token);
    if (decodedToken.exp * 1000 < Date.now()) {
      logout();
    }

  }, [auth?.access_token, logout]);

  if (!auth) {
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
}
