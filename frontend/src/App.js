import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History'; // NEW

function App() {

  const isAuthenticated = !!localStorage.getItem('token');

  return (

    <Router>

      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-50">

        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />

          {/* NEW HISTORY PAGE */}
          <Route 
            path="/history" 
            element={isAuthenticated ? <History /> : <Navigate to="/login" />} 
          />


          {/* Root Redirect */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />


          {/* Catch-all */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />

        </Routes>

      </div>

    </Router>

  );

}

export default App;