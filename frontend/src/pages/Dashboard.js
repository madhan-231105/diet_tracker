import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { fetchMeals, addMeal, deleteMeal, updateMeal } from '../services/api';

import SideNav from '../components/shared/SideNav';

import DashboardPage from '../components/dashboard/DashboardPage';
import TodayPage from '../components/pages/TodayPage';
import AnalysisPage from '../components/pages/AnalysisPage';
import HistoryPage from '../components/pages/HistoryPage';
import FoodLibraryPage from '../components/pages/FoodLibrary';

import { MenuIcon } from '../components/shared/Icons';

const Dashboard = () => {

  const [activePage, setActivePage] = useState('dashboard');
  const [navCollapsed, setNavCollapsed] = useState(true);

  const [meals, setMeals] = useState([]);

  const [selectedDate, setSelectedDate] =
    useState(new Date().toISOString().split('T')[0]);

  const [form, setForm] =
    useState({ name: '', calories: '', quantity: '', type: 'breakfast' });

  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const [calorieGoal, setCalorieGoal] =
    useState(localStorage.getItem('calorieGoal') || 2000);

  const [waterGoal, setWaterGoal] =
    useState(parseInt(localStorage.getItem('waterGoal')) || 8);

  const [water, setWater] = useState(0);

  const username = localStorage.getItem('username') || 'User';


  useEffect(() => {
    loadMeals();

    const saved =
      localStorage.getItem(`water_${username}_${selectedDate}`);

    setWater(saved ? parseInt(saved) : 0);

  }, [selectedDate, username]);


  useEffect(() => {

    const sync = () => setNavCollapsed(window.innerWidth < 1024);

    sync();

    window.addEventListener('resize', sync);

    return () => window.removeEventListener('resize', sync);

  }, []);


  const loadMeals = async () => {

    try {

      const { data } = await fetchMeals();

      setMeals(data || []);

    } catch {

      toast.error('Sync error: Could not fetch your diary');

    }

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name || !form.calories || !form.quantity)
      return toast.error('Please fill all fields');

    try {

      if (editingId) {

        await updateMeal(editingId, { ...form, date: selectedDate });

        setEditingId(null);

        toast.success('Meal updated!');

      } else {

        await addMeal({ ...form, date: selectedDate });

        toast.success('Meal logged!');

      }

      setForm({
        name: '',
        calories: '',
        quantity: '',
        type: 'breakfast'
      });

      loadMeals();

    } catch {

      toast.error('Save failed. Check connection.');

    }

  };


  const handleEdit = (meal) => {

    setEditingId(meal._id);

    setForm({
      name: meal.name,
      calories: meal.calories,
      quantity: meal.quantity,
      type: meal.type
    });

    setSelectedDate(meal.date.split('T')[0]);

    setActivePage('dashboard');

    toast('Editing mode active', { icon: '✏️' });

  };


  const handleDelete = async (id) => {

    if (!window.confirm('Delete this entry?')) return;

    try {

      await deleteMeal(id);

      loadMeals();

      toast.success('Entry removed');

    } catch {

      toast.error('Delete failed');

    }

  };


  const handleWaterUpdate = (val) => {

    const next = Math.max(0, water + val);

    setWater(next);

    localStorage.setItem(
      `water_${username}_${selectedDate}`,
      next
    );

    if (next >= waterGoal && val > 0)
      toast.success('Hydration Goal Reached! 💧');

  };


  const updateWaterGoal = () => {

    const n = prompt('Set your target glasses per day:', waterGoal);

    if (n && !isNaN(n)) {

      setWaterGoal(parseInt(n));

      localStorage.setItem('waterGoal', n);

      toast.success(`Target updated to ${n} glasses`);

    }

  };


  const PAGE_TITLES = {

    dashboard: 'Diet Tracker',

    today: "Today's Log",

    analysis: 'Analysis',

    history: 'History',

    library: 'Calorie Reference Library'

  };


  const PAGE_SUBS = {

    dashboard:
      <>Personal Diary for <span className="text-slate-600 not-italic">{username}</span></>,

    today:
      new Date().toLocaleDateString(
        'en-US',
        { weekday: 'long', month: 'long', day: 'numeric' }
      ),

    analysis: 'Nutrition insights & trends',

    history: 'Browse your past meals by date',

    library: 'Browse common foods and their calorie values'

  };


  const sideW = navCollapsed ? 80 : 256;


  return (

    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      <SideNav
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={navCollapsed}
        setCollapsed={setNavCollapsed}
        username={username}
      />

      <div
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: window.innerWidth >= 1024 ? sideW : 0
        }}
      >

        {/* Mobile Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-3 flex items-center gap-3 lg:hidden">

          <button
            onClick={() => setNavCollapsed(false)}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition shrink-0"
          >
            <MenuIcon />
          </button>

          <h1 className="font-black text-slate-800 text-lg tracking-tight truncate">
            {PAGE_TITLES[activePage]}
          </h1>

        </header>


        {/* Desktop Header */}
        <div className="hidden lg:block px-6 pt-7 pb-1">

          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
            {PAGE_TITLES[activePage]}
          </h1>

          <p className="text-slate-400 font-bold italic tracking-wide mt-0.5 text-sm">
            {PAGE_SUBS[activePage]}
          </p>

        </div>


        {/* Page Content */}
        <div className="p-4 lg:px-6 lg:py-5">

          {activePage === 'dashboard' && (
            <DashboardPage
              meals={meals}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              form={form}
              setForm={setForm}
              editingId={editingId}
              setEditingId={setEditingId}
              filterType={filterType}
              setFilterType={setFilterType}
              calorieGoal={calorieGoal}
              setCalorieGoal={setCalorieGoal}
              waterGoal={waterGoal}
              water={water}
              handleWaterUpdate={handleWaterUpdate}
              updateWaterGoal={updateWaterGoal}
              handleSubmit={handleSubmit}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}

          {activePage === 'today' &&
            <TodayPage
              meals={meals}
              calorieGoal={calorieGoal}
              waterGoal={waterGoal}
            />
          }

          {activePage === 'analysis' &&
            <AnalysisPage
              meals={meals}
              calorieGoal={calorieGoal}
            />
          }

          {activePage === 'history' &&
            <HistoryPage
              meals={meals}
              calorieGoal={calorieGoal}
            />
          }

          {activePage === 'library' &&
            <FoodLibraryPage />
          }

        </div>

      </div>

    </div>
  );

};

export default Dashboard;