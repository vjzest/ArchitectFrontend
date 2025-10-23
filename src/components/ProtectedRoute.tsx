// src/components/ProtectedRoute.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '@/lib/store';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    toast.error("You are not authorized to view this page.");
    return <Navigate to="/" replace />;
  }
  return <Outlet />; 
};
export default ProtectedRoute;