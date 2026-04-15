import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CitizenPortal from './pages/CitizenPortal';
import OfficerDashboard from './pages/OfficerDashboard';
import TrackComplaint from './pages/TrackComplaint';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        
        {/* Track Complaint - Public Access */}
        <Route path="/track-complaint" element={<TrackComplaint />} />
        
        {/* Citizen Portal - PROTECTED (Requires Login) */}
        <Route 
          path="/citizen" 
          element={
            <ProtectedRoute requiredRole="citizen">
              <CitizenPortal />
            </ProtectedRoute>
          } 
        />
        
        {/* Officer Dashboard - PROTECTED (Requires Officer Login) */}
        <Route 
          path="/officer-dashboard" 
          element={
            <ProtectedRoute requiredRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Dashboard - PROTECTED (Requires Admin Login) */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Citizen Dashboard - To be created */}
        {/* <Route path="/citizen-dashboard" element={<CitizenDashboard />} /> */}
        
        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a 
                href="/" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                Go Back Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;