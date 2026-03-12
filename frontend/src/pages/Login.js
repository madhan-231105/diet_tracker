import React, { useState, useEffect } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FlameIcon } from '../components/shared/Icons';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const { data } = await login(formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);

      navigate('/dashboard', { replace: true });

    } catch {
      alert('Invalid credentials');
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">

      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-8"
      >

        {/* Header */}
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

        <h2 className="text-center text-lg font-bold text-slate-700 mb-6">
          Login to your account
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300"
          onChange={(e)=>setFormData({...formData,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300"
          onChange={(e)=>setFormData({...formData,password:e.target.value})}
        />

        <button className="w-full bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition">
          Login
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-slate-600 font-bold">
            Register
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Login;