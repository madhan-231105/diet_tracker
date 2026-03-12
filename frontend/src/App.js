import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login    from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// NOTE: History is no longer a separate page/route.
// It lives inside the Dashboard's side navigation (History tab).
// Navigate to /dashboard and click "History" in the sidebar.

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-slate-50">
        <Routes>

          {/* Public Routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />

          {/* Root redirect */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;