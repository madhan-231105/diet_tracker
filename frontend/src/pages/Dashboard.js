import React, { useEffect, useState } from 'react';
import { fetchMeals, addMeal, deleteMeal, updateMeal } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [meals, setMeals] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [form, setForm] = useState({ name: '', calories: '', type: 'breakfast' });
    const [editingId, setEditingId] = useState(null);
    
    // GOALS & FILTERS
    const [goal, setGoal] = useState(localStorage.getItem('calorieGoal') || 2000);
    const [filterType, setFilterType] = useState('all');

    // HYDRATION STATE (Synced with Date)
    const [water, setWater] = useState(0);

    const username = localStorage.getItem('username') || 'User';

    useEffect(() => { 
        loadMeals(); 
        // Load water for the selected date from localStorage
        const savedWater = localStorage.getItem(`water_${username}_${selectedDate}`);
        setWater(savedWater ? parseInt(savedWater) : 0);
    }, [selectedDate, username]);

    const loadMeals = async () => {
        try {
            const { data } = await fetchMeals();
            setMeals(data || []);
        } catch (err) { 
            toast.error("Failed to sync with server");
        }
    };

    const handleWaterUpdate = (amount) => {
        const newWater = Math.max(0, water + amount);
        setWater(newWater);
        localStorage.setItem(`water_${username}_${selectedDate}`, newWater);
        
        if (newWater === 8 && amount > 0) {
            toast.success("Goal Reached! You are perfectly hydrated! 💧", { duration: 4000 });
        } else if (amount > 0) {
            toast('Glug glug! Stay refreshed.', { icon: '💧' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.calories) return toast.error("Fields cannot be empty");

        try {
            if (editingId) {
                await updateMeal(editingId, { ...form, date: selectedDate });
                setEditingId(null);
                toast.success("Meal updated successfully!");
            } else {
                await addMeal({ ...form, date: selectedDate });
                toast.success("Meal added to your log!");
            }
            setForm({ name: '', calories: '', type: 'breakfast' });
            loadMeals();
        } catch (err) {
            toast.error("Error saving entry");
        }
    };

    const handleEdit = (meal) => {
        setEditingId(meal._id);
        setForm({ name: meal.name, calories: meal.calories, type: meal.type });
        setSelectedDate(meal.date.split('T')[0]);
        toast('Editing mode active', { icon: '✏️' });
    };

    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayTotal = meals
                .filter(m => m.date && m.date.startsWith(date))
                .reduce((sum, m) => sum + Number(m.calories), 0);
            return { 
                day: date.split('-').slice(1).join('/'),
                calories: dayTotal 
            };
        });
    };

    const dailyMeals = meals.filter(m => {
        const matchesDate = m.date && m.date.startsWith(selectedDate);
        const matchesType = filterType === 'all' || m.type === filterType;
        return matchesDate && matchesType;
    });

    const totalCalories = meals
        .filter(m => m.date && m.date.startsWith(selectedDate))
        .reduce((sum, m) => sum + Number(m.calories), 0);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const updateGoal = () => {
        const newGoal = prompt("Set your daily calorie goal:", goal);
        if (newGoal && !isNaN(newGoal)) {
            setGoal(newGoal);
            localStorage.setItem('calorieGoal', newGoal);
            toast.success(`Goal updated to ${newGoal} kcal`);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Diet Tracker</h1>
                    <p className="text-sm text-gray-500 font-medium">Welcome, <span className="text-blue-600 font-bold">{username}</span></p>
                </div>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-100 transition duration-200">Logout</button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Goal Progress Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Progress</h3>
                            <button onClick={updateGoal} className="text-blue-600 text-xs font-bold hover:underline">Set Goal</button>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 mb-3">
                            <div 
                                className={`h-4 rounded-full transition-all duration-700 ${totalCalories > goal ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${Math.min((totalCalories / goal) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-3xl font-black text-gray-800">{totalCalories}</span>
                                <span className="text-gray-400 text-sm font-bold ml-1">/ {goal} kcal</span>
                            </div>
                        </div>
                    </div>

                    {/* NEW HYDRATION TRACKER */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-blue-100 text-xs font-bold uppercase tracking-widest">Water Tracker</h3>
                                <p className="text-2xl font-black mt-1">{water} Glasses</p>
                            </div>
                            <div className="text-3xl">💧</div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleWaterUpdate(1)}
                                className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-xl font-bold transition"
                            > + Add Glass </button>
                            <button 
                                onClick={() => handleWaterUpdate(-1)}
                                className="px-4 bg-white/10 hover:bg-white/20 py-2 rounded-xl transition"
                            > − </button>
                        </div>
                        <p className="text-[10px] mt-4 text-blue-100 font-medium italic">
                            * Goal: 8 glasses (2 Liters) per day
                        </p>
                    </div>

                    {/* Date Selector */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Date</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-5 text-gray-800 flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${editingId ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                            {editingId ? 'Update Meal' : 'Log New Meal'}
                        </h3>
                        <input required placeholder="Meal name..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mb-3 p-3 border border-gray-200 rounded-xl outline-none" />
                        <input required type="number" placeholder="Calories" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} className="w-full mb-3 p-3 border border-gray-200 rounded-xl outline-none" />
                        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full mb-5 p-3 border border-gray-200 rounded-xl bg-white outline-none">
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>
                        <button className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition ${editingId ? 'bg-orange-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {editingId ? 'Save Changes' : 'Add to Diary'}
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Chart */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-6 text-gray-800">7-Day Analysis</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getChartData()}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                    <YAxis hide />
                                    <Tooltip cursor={{fill: '#F9FAFB'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                                    <Bar dataKey="calories" radius={[6, 6, 0, 0]} barSize={40}>
                                        {getChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.calories > goal ? '#EF4444' : '#3B82F6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* List Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Entries for {selectedDate}</h3>
                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                className="text-xs font-bold border border-gray-200 rounded-lg p-2 outline-none bg-gray-50"
                            >
                                <option value="all">All Categories</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                                <option value="snack">Snack</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Meal</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Kcal</th>
                                        <th className="p-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {dailyMeals.length > 0 ? dailyMeals.map(meal => (
                                        <tr key={meal._id} className="hover:bg-blue-50/30 transition group">
                                            <td className="p-5 font-bold text-gray-700">{meal.name}</td>
                                            <td className="p-5">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold capitalize">{meal.type}</span>
                                            </td>
                                            <td className="p-5 font-black text-gray-800">{meal.calories}</td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => handleEdit(meal)} className="text-orange-500 font-bold text-sm">Edit</button>
                                                    <button onClick={async () => { if(window.confirm('Delete?')) { await deleteMeal(meal._id); loadMeals(); toast.error("Entry deleted"); }}} className="text-red-500 font-bold text-sm">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="p-20 text-center text-gray-400 font-medium">No records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;