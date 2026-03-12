import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
            localStorage.setItem('username', data.user.username); // Ensure this line exists
            window.location.reload(); // Quick way to refresh auth state
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input 
                    type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;