import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  // If not logged in, redirect to home with login modal
  if (!token) {
    // Store the intended destination
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/?login=true&role=citizen" replace />;
  }
  
  // If role is required, check if user has that role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated, render the component
  return children;
};

export default ProtectedRoute;