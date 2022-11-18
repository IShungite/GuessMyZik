import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../../atoms/authAtom';

export default function ProtectedRoute() {
  const isAuthenticated = useRecoilValue(authState);

  if (!isAuthenticated) {
    return <Navigate to={'/login'} />;
  }

  return <Outlet />;
}
