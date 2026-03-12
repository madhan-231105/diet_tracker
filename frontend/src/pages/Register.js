import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await register(formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);

      navigate('/dashboard');

      // refresh auth state
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed. Try a different email.');
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-slate-50">

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-slate-200"
      >

        <h2 className="text-3xl font-black mb-2 text-center text-slate-800">
          Create Account
        </h2>

        <p className="text-slate-500 text-center mb-8 text-sm">
          Join the Diet Management App
        </p>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-slate-600 text-sm font-semibold mb-1">
            Username
          </label>

          <input
            required
            type="text"
            placeholder="John Doe"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 placeholder-slate-400"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-slate-600 text-sm font-semibold mb-1">
            Email Address
          </label>

          <input
            required
            type="email"
            placeholder="john@example.com"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 placeholder-slate-400"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-slate-600 text-sm font-semibold mb-1">
            Password
          </label>

          <input
            required
            type="password"
            placeholder="••••••••"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 placeholder-slate-400"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          className="w-full bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
        >
          Sign Up
        </button>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-600 font-bold hover:text-slate-800"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Register;