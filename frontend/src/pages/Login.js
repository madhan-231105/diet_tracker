import React, { useState, useEffect } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const { data } = await login(formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);

      // Replace history so login page disappears
      navigate('/dashboard', { replace: true });

    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-slate-50">

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-slate-200"
      >

        <h2 className="text-2xl font-black mb-6 text-center text-slate-800">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 placeholder-slate-400"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 placeholder-slate-400"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* Login button */}
        <button
          className="w-full bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-slate-600 font-bold hover:text-slate-800"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Login;