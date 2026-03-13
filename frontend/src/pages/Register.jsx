import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FlameIcon } from '../components/shared/Icons';

const Register = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    return regex.test(password);
  };

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert(
        "Password must contain:\n• 1 uppercase letter\n• 1 number\n• 1 special character\n• Minimum 6 characters"
      );
      return;
    }

    try {

      const { data } = await register(formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);

      navigate('/dashboard', { replace: true });

    } catch (err) {

      alert(err.response?.data?.message || 'Registration failed. Try a different email.');

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">

      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-8"
      >

        {/* Logo + App Name */}
        <div className="mb-6">

          <div className="flex items-center gap-2 justify-center">

            <div className="w-10 h-10 bg-slate-700 text-white rounded-lg flex items-center justify-center">
              <FlameIcon />
            </div>

            <h1 className="text-xl font-black text-slate-800">
              Diet Tracker
            </h1>

          </div>

          <p className="text-sm text-slate-400 font-semibold text-center mt-1">
            Smart Nutrition Diary
          </p>

        </div>

        <h2 className="text-2xl font-black mb-6 text-center text-slate-800">
          Create Account
        </h2>

        {/* Username */}
        <input
          required
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        {/* Email */}
        <input
          required
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300"
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          required
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <p className="text-xs text-slate-400 mb-6">
          Password must contain:
          <br />• 1 uppercase letter
          <br />• 1 number
          <br />• 1 special character
        </p>

        {/* Button */}
        <button
          className="w-full bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
        >
          Sign Up
        </button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-600 font-bold"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Register;