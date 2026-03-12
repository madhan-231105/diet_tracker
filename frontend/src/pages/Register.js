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
            // Save the token to local storage
            localStorage.setItem('token', data.token);
            // Redirect to dashboard
            navigate('/dashboard');
            // Refresh to update the auth state in App.js
            window.location.reload(); 
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed. Try a different email.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-xl w-96 border border-gray-100">
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h2>
                <p className="text-gray-500 text-center mb-8 text-sm">Join the Diet Management App</p>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Username</label>
                    <input 
                        required
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Email Address</label>
                    <input 
                        required
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
                    <input 
                        required
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition duration-200">
                    Sign Up
                </button>

                <p className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;