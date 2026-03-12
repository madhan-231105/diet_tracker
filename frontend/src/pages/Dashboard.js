import React, { useEffect, useState, useRef } from 'react';
import { fetchMeals, addMeal, deleteMeal, updateMeal } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Today: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Analysis: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  History: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
      <polyline points="12 7 12 12 15 15"/>
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Drop: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  ChevLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  Flame: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c0 0-5 4-5 9a5 5 0 0 0 10 0C17 6 12 2 12 2zm0 14a3 3 0 0 1-3-3c0-2.5 3-5.5 3-5.5s3 3 3 5.5a3 3 0 0 1-3 3z"/>
    </svg>
  ),
};

// ─── CALORIE COLOR HELPERS ────────────────────────────────────────────────────
const getCalorieColor = (calories, goal = 2000) => {
  if (calories === 0) return { bg: 'bg-gray-100', text: 'text-gray-300', dot: '#E5E7EB', label: 'empty' };
  const pct = (calories / goal) * 100;
  if (pct < 50) return { bg: 'bg-blue-100', text: 'text-blue-600', dot: '#3B82F6', label: 'low' };
  if (pct < 80) return { bg: 'bg-green-100', text: 'text-green-600', dot: '#22C55E', label: 'good' };
  if (pct <= 110) return { bg: 'bg-orange-100', text: 'text-orange-500', dot: '#F97316', label: 'high' };
  return { bg: 'bg-red-100', text: 'text-red-500', dot: '#EF4444', label: 'over' };
};

// ─── HISTORY CALENDAR ─────────────────────────────────────────────────────────
const HistoryCalendar = ({ meals, calorieGoal, onDateSelect, selectedDate }) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const getCaloriesForDate = (dateStr) =>
    meals.filter(m => m.date?.startsWith(dateStr)).reduce((s, m) => s + Number(m.calories), 0);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8">
      {/* Month Nav */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 transition text-gray-500">
          <Icons.ChevLeft />
        </button>
        <h3 className="text-xl font-black text-gray-800 tracking-tight">
          {monthNames[viewMonth]} <span className="text-blue-600">{viewYear}</span>
        </h3>
        <button
          onClick={nextMonth}
          disabled={viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth >= today.getMonth())}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 transition text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Icons.ChevRight />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 px-1">
        {[
          { dot: '#E5E7EB', label: 'No data' },
          { dot: '#3B82F6', label: '< 50%' },
          { dot: '#22C55E', label: '50–80%' },
          { dot: '#F97316', label: '80–110%' },
          { dot: '#EF4444', label: '> 110%' },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: dot }} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-3">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest py-1">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isFuture = dateStr > todayStr;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const calories = getCaloriesForDate(dateStr);
          const { bg, text, dot } = getCalorieColor(calories, calorieGoal);

          return (
            <button
              key={dateStr}
              onClick={() => !isFuture && onDateSelect(dateStr)}
              disabled={isFuture}
              title={calories > 0 ? `${calories} kcal` : 'No data'}
              className={`
                relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 group
                ${isFuture ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:shadow-md'}
                ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1 scale-105' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-gray-300 ring-offset-1' : ''}
                ${!isFuture ? bg : 'bg-gray-50'}
              `}
            >
              <span className={`text-xs font-black ${isSelected ? 'text-blue-600' : isToday ? 'text-gray-800' : text}`}>{day}</span>
              {calories > 0 && (
                <span className="text-[8px] font-bold opacity-70 mt-0.5" style={{ color: dot }}>
                  {calories >= 1000 ? `${(calories/1000).toFixed(1)}k` : calories}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
const HistoryPage = ({ meals, calorieGoal }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const dayMeals = meals.filter(m => m.date?.startsWith(selectedDate));
  const dayCalories = dayMeals.reduce((s, m) => s + Number(m.calories), 0);
  const { bg, text, dot } = getCalorieColor(dayCalories, calorieGoal);

  const typeColors = {
    breakfast: { bg: 'bg-amber-50', text: 'text-amber-600', dot: '#F59E0B' },
    lunch: { bg: 'bg-green-50', text: 'text-green-600', dot: '#22C55E' },
    dinner: { bg: 'bg-blue-50', text: 'text-blue-600', dot: '#3B82F6' },
    snack: { bg: 'bg-purple-50', text: 'text-purple-600', dot: '#A855F7' },
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">History</h2>
        <p className="text-gray-400 font-bold text-sm mt-1">Tap a date to explore your meals</p>
      </div>

      <HistoryCalendar
        meals={meals}
        calorieGoal={calorieGoal}
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
      />

      {/* Selected Day Detail */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className={`p-8 ${bg} border-b border-gray-100`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">
                {selectedDate === todayStr ? "Today's Log" : new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">{dayCalories}</span>
                <span className="text-gray-400 font-bold">/ {calorieGoal} kcal</span>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-2xl ${bg}`}>
              <span className={`text-sm font-black uppercase tracking-wider ${text}`}>
                {dayCalories === 0 ? 'No Data' : `${Math.round((dayCalories / calorieGoal) * 100)}% of goal`}
              </span>
            </div>
          </div>
        </div>

        {dayMeals.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-300 font-bold italic text-lg">No meals logged for this date</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {dayMeals.map(m => {
              const tc = typeColors[m.type] || typeColors.snack;
              return (
                <div key={m._id} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl ${tc.bg} flex items-center justify-center`}>
                      <span style={{ color: tc.dot }} className="text-xs">
                        {m.type === 'breakfast' ? '🌅' : m.type === 'lunch' ? '☀️' : m.type === 'dinner' ? '🌙' : '🍎'}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{m.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${tc.text}`}>{m.type}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-xs text-gray-400 font-bold italic">{m.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{m.calories}</span>
                    <span className="text-xs text-gray-400 font-bold ml-1">kcal</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TODAY PAGE ───────────────────────────────────────────────────────────────
const TodayPage = ({ meals, calorieGoal, waterGoal }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const username = localStorage.getItem('username') || 'User';
  const todayMeals = meals.filter(m => m.date?.startsWith(todayStr));
  const totalCals = todayMeals.reduce((s, m) => s + Number(m.calories), 0);
  const water = parseInt(localStorage.getItem(`water_${username}_${todayStr}`)) || 0;
  const pct = Math.round((totalCals / calorieGoal) * 100);

  const byType = ['breakfast', 'lunch', 'dinner', 'snack'].map(type => ({
    type,
    meals: todayMeals.filter(m => m.type === type),
    cals: todayMeals.filter(m => m.type === type).reduce((s, m) => s + Number(m.calories), 0),
  }));

  const typeConfig = {
    breakfast: { emoji: '🌅', color: '#F59E0B', bg: 'bg-amber-50' },
    lunch:     { emoji: '☀️', color: '#22C55E', bg: 'bg-green-50' },
    dinner:    { emoji: '🌙', color: '#3B82F6', bg: 'bg-blue-50' },
    snack:     { emoji: '🍎', color: '#A855F7', bg: 'bg-purple-50' },
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gray-400 font-bold text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{greeting}, {username} 👋</h2>
      </div>

      {/* Progress Ring Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Today's Progress</p>
          <div className="flex items-center gap-8">
            {/* SVG Ring */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none"
                  stroke={pct > 100 ? '#EF4444' : pct > 80 ? '#F97316' : pct > 50 ? '#22C55E' : '#3B82F6'}
                  strokeWidth="12"
                  strokeDasharray={`${Math.min(pct, 100) * 2.51} 251`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900">{pct}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">{totalCals}</span>
                <span className="text-gray-400 font-bold text-sm">kcal</span>
              </div>
              <p className="text-gray-400 text-sm font-bold">of {calorieGoal} kcal goal</p>
              <p className={`text-sm font-black mt-2 ${totalCals > calorieGoal ? 'text-red-500' : 'text-green-500'}`}>
                {totalCals > calorieGoal ? `${totalCals - calorieGoal} kcal over` : `${calorieGoal - totalCals} kcal remaining`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Hydration</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-5xl font-black text-blue-600 tracking-tighter">{water}</span>
            <span className="text-gray-400 font-bold">/ {waterGoal}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {[...Array(waterGoal)].map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${i < water ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-200'}`}>
                <Icons.Drop />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meals By Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {byType.map(({ type, meals, cals }) => {
          const cfg = typeConfig[type];
          return (
            <div key={type} className={`bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden`}>
              <div className={`${cfg.bg} px-8 py-5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cfg.emoji}</span>
                  <span className="font-black text-gray-800 capitalize">{type}</span>
                </div>
                <span className="font-black text-gray-600">{cals} kcal</span>
              </div>
              {meals.length === 0 ? (
                <div className="px-8 py-6 text-gray-300 italic text-sm font-bold">Nothing logged yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {meals.map(m => (
                    <div key={m._id} className="px-8 py-4 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-700 text-sm">{m.name}</div>
                        <div className="text-xs text-gray-400 italic">{m.quantity}</div>
                      </div>
                      <span className="font-black text-gray-900">{m.calories}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── ANALYSIS PAGE ────────────────────────────────────────────────────────────
const AnalysisPage = ({ meals, calorieGoal }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const getLast30Days = () => {
    return [...Array(30)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i));
      const ds = d.toISOString().split('T')[0];
      const cals = meals.filter(m => m.date?.startsWith(ds)).reduce((s, m) => s + Number(m.calories), 0);
      return { date: ds, display: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), calories: cals };
    });
  };

  const last30 = getLast30Days();
  const daysWithData = last30.filter(d => d.calories > 0);
  const avgCals = daysWithData.length ? Math.round(daysWithData.reduce((s, d) => s + d.calories, 0) / daysWithData.length) : 0;
  const maxCals = daysWithData.length ? Math.max(...daysWithData.map(d => d.calories)) : 0;
  const minCals = daysWithData.length ? Math.min(...daysWithData.filter(d => d.calories > 0).map(d => d.calories)) : 0;

  const typeBreakdown = ['breakfast', 'lunch', 'dinner', 'snack'].map(type => ({
    type,
    cals: meals.filter(m => m.date?.startsWith(todayStr.substring(0, 7)) && m.type === type)
              .reduce((s, m) => s + Number(m.calories), 0),
  }));
  const totalMonthCals = typeBreakdown.reduce((s, t) => s + t.cals, 0);

  const typeColors2 = { breakfast: '#F59E0B', lunch: '#22C55E', dinner: '#3B82F6', snack: '#A855F7' };

  const streak = (() => {
    let s = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      if (meals.some(m => m.date?.startsWith(ds))) s++;
      else break;
    }
    return s;
  })();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Analysis</h2>
        <p className="text-gray-400 font-bold text-sm mt-1">Your nutrition insights at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Daily', value: avgCals, unit: 'kcal', color: 'text-blue-600' },
          { label: 'Highest Day', value: maxCals, unit: 'kcal', color: 'text-orange-500' },
          { label: 'Lowest Day', value: minCals, unit: 'kcal', color: 'text-green-500' },
          { label: 'Day Streak', value: streak, unit: 'days', color: 'text-purple-500' },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-black tracking-tighter ${color}`}>{value}</span>
              <span className="text-xs text-gray-400 font-bold">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 30-Day Chart */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-gray-800 text-xl tracking-tight">30-Day Overview</h3>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-gray-400">Daily Intake</span>
            <div className="w-2.5 h-2.5 rounded-full bg-red-300 ml-3" />
            <span className="text-xs font-bold text-gray-400">Goal</span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="display" tick={{ fill: '#9CA3AF', fontSize: 9, fontWeight: 800 }} tickLine={false} axisLine={false}
                interval={4} dy={10} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 800 }} />
              <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#3B82F6' }} />
              <Line type="monotone" dataKey={() => Number(calorieGoal)} stroke="#FCA5A5" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Goal" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Meal Type Breakdown (this month) */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="font-black text-gray-800 text-xl tracking-tight mb-6">This Month by Meal Type</h3>
        <div className="space-y-4">
          {typeBreakdown.map(({ type, cals }) => {
            const pct = totalMonthCals > 0 ? Math.round((cals / totalMonthCals) * 100) : 0;
            const color = typeColors2[type];
            return (
              <div key={type}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-black text-gray-600 capitalize">{type}</span>
                  <span className="text-sm font-black text-gray-800">{cals} kcal <span className="text-gray-400 font-bold">({pct}%)</span></span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD PAGE ──────────────────────────────────────────────────────
const DashboardPage = ({
  meals, selectedDate, setSelectedDate, form, setForm,
  editingId, setEditingId, filterType, setFilterType,
  calorieGoal, setCalorieGoal, waterGoal, setWaterGoal,
  water, handleWaterUpdate, updateWaterGoal,
  handleSubmit, handleEdit, handleDelete,
  handleBackup, handleRestore, fileInputRef,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const getProgressColor = (percent) => {
    if (percent < 50) return 'bg-blue-500';
    if (percent < 80) return 'bg-yellow-400';
    if (percent <= 100) return 'bg-orange-500';
    return 'bg-red-600 animate-pulse';
  };

  const getChartData = () => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    return days.map(d => {
      const kcal = meals.filter(m => m.date?.startsWith(d)).reduce((s, m) => s + Number(m.calories), 0);
      return {
        fullDate: d,
        displayDay: d === todayStr ? "Today" : d.split('-').slice(1).join('/'),
        actualKcal: kcal,
        chartKcal: kcal === 0 ? 50 : kcal,
      };
    });
  };

  const dailyMeals = meals.filter(m => m.date?.startsWith(selectedDate) && (filterType === 'all' || m.type === filterType));
  const totalCalories = meals.filter(m => m.date?.startsWith(selectedDate)).reduce((sum, m) => sum + Number(m.calories), 0);
  const caloriePercent = Math.round((totalCalories / calorieGoal) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

      {/* --- SIDEBAR --- */}
      <div className="lg:col-span-4 space-y-8">

        {/* Calorie Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Energy Progress</h3>
            <button onClick={() => { const n = prompt("New Daily Goal?", calorieGoal); if (n) setCalorieGoal(n); }} className="text-blue-600 text-xs font-bold underline">Edit</button>
          </div>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-6xl font-black tracking-tighter">{totalCalories}</span>
            <span className="text-gray-300 font-bold">/ {calorieGoal} kcal</span>
          </div>
          <div className="relative w-full h-8 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className={`h-full transition-all duration-1000 ease-out ${getProgressColor(caloriePercent)}`} style={{ width: `${Math.min(caloriePercent, 100)}%` }} />
          </div>
          <div className="flex justify-between text-[11px] font-black uppercase">
            <span className={caloriePercent > 100 ? 'text-red-600' : 'text-gray-400'}>{caloriePercent}% {caloriePercent > 100 ? 'Over limit!' : 'Consumed'}</span>
            <span className="text-gray-400">{calorieGoal - totalCalories > 0 ? `${calorieGoal - totalCalories} kcal remaining` : 'Target Hit'}</span>
          </div>
        </div>

        {/* Water Tracker Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em]">Hydration</h3>
            <button onClick={updateWaterGoal} className="text-blue-600 text-xs font-bold underline">Set Goal</button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl font-black">{water}</span>
            <span className="text-gray-300 font-bold">/ {waterGoal} glasses</span>
            <span className="text-3xl ml-auto">💧</span>
          </div>
          <div className="flex gap-1.5 mb-8">
            {[...Array(waterGoal)].map((_, i) => (
              <div key={i} className={`flex-1 h-3 rounded-sm transition-all duration-500 ${i < water ? 'bg-blue-400 shadow-sm shadow-blue-100' : 'bg-gray-100'}`} />
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => handleWaterUpdate(1)} className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition">DRINK GLASS</button>
            <button onClick={() => handleWaterUpdate(-1)} className="px-8 bg-gray-50 text-gray-300 py-5 rounded-[1.5rem] font-black hover:bg-gray-100 transition">−</button>
          </div>
        </div>

        {/* Log Form */}
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-5">
          <h3 className="text-xl font-black text-gray-800 tracking-tight">{editingId ? '✏️ Update Entry' : '➕ Log New Meal'}</h3>
          <input required placeholder="Meal Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          <div className="flex gap-3">
            <input required placeholder="Quantity (e.g. 1 cup)" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className="w-2/3 p-5 bg-gray-50 border-none rounded-2xl outline-none font-medium" />
            <input required type="number" placeholder="Kcal" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} className="w-1/3 p-5 bg-gray-50 border-none rounded-2xl outline-none font-bold text-blue-600" />
          </div>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full p-5 bg-gray-50 border-none rounded-2xl outline-none appearance-none font-bold text-gray-500">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <button className={`w-full py-5 rounded-2xl font-black text-white shadow-2xl transition-all ${editingId ? 'bg-orange-500' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
            {editingId ? 'SAVE CHANGES' : 'ADD TO DIARY'}
          </button>
        </form>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="lg:col-span-8 space-y-8">

        {/* Weekly Chart */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-2xl mb-10 tracking-tighter">7-Day Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <XAxis dataKey="displayDay" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontWeight: 800, fontSize: 11 }} dy={15} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="chartKcal" radius={[12, 12, 12, 12]} barSize={50}>
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.displayDay === "Today" ? '#3B82F6' : (entry.actualKcal === 0 ? '#F9FAFB' : '#DBEAFE')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="font-black p-3 bg-gray-50 rounded-xl outline-none text-sm text-blue-600" />
            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-2xl">
              {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterType === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">Meal Detail</th>
                  <th className="px-10 py-6">Qty</th>
                  <th className="px-10 py-6">Energy</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dailyMeals.map(m => (
                  <tr key={m._id} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="px-10 py-8">
                      <div className="font-bold text-gray-800 text-lg leading-tight">{m.name}</div>
                      <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">{m.type}</div>
                    </td>
                    <td className="px-10 py-8 text-gray-500 font-bold text-sm italic">{m.quantity}</td>
                    <td className="px-10 py-8">
                      <span className="text-3xl font-black text-gray-900 tracking-tighter">{m.calories}</span>
                      <span className="text-xs text-gray-400 font-bold ml-1 uppercase">kcal</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-6 opacity-30 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                        <button onClick={() => handleEdit(m)} className="text-orange-500 font-black text-xs uppercase tracking-tighter hover:underline">Edit</button>
                        <button onClick={() => handleDelete(m._id)} className="text-red-500 font-black text-xs uppercase tracking-tighter hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {dailyMeals.length === 0 && (
                  <tr><td colSpan="4" className="px-10 py-24 text-center text-gray-300 font-bold italic text-lg">Your diary is empty for today.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SIDE NAV ─────────────────────────────────────────────────────────────────
const SideNav = ({ activePage, setActivePage, collapsed, setCollapsed, username, handleBackup, fileInputRef, handleRestore }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: Icons.Dashboard },
    { id: 'today',     label: 'Today',     Icon: Icons.Today     },
    { id: 'analysis',  label: 'Analysis',  Icon: Icons.Analysis  },
    { id: 'history',   label: 'History',   Icon: Icons.History   },
  ];

  return (
    <>
      {/* Backdrop on mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white border-r border-gray-100 shadow-xl shadow-gray-100/50
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo + Toggle */}
        <div className={`flex items-center h-20 px-4 border-b border-gray-100 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Icons.Flame />
              </div>
              <span className="font-black text-gray-900 tracking-tight">DietTracker</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition flex-shrink-0"
          >
            {collapsed ? <Icons.Menu /> : <Icons.Close />}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="px-4 py-5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-gray-800 text-sm truncate">{username}</p>
                <p className="text-[10px] text-gray-400 font-bold">Personal Diary</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                onClick={() => { setActivePage(id); if (window.innerWidth < 1024) setCollapsed(true); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-2xl font-black text-sm
                  transition-all duration-200 group
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? label : undefined}
              >
                <span className={`flex-shrink-0 transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
                  <Icon />
                </span>
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className={`border-t border-gray-100 p-2 space-y-1 ${collapsed ? '' : ''}`}>
          {!collapsed && (
            <>
              <button
                onClick={handleBackup}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Backup
              </button>
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Restore
              </button>
              <input type="file" ref={fileInputRef} onChange={handleRestore} className="hidden" accept=".json" />
            </>
          )}
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-red-400 hover:bg-red-50 font-black text-xs uppercase tracking-wider transition-all ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <Icons.Logout />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── MAIN DASHBOARD COMPONENT ─────────────────────────────────────────────────
const Dashboard = () => {
  // --- STATE MANAGEMENT ---
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({ name: '', calories: '', quantity: '', type: 'breakfast' });
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [activePage, setActivePage] = useState('dashboard');
  const [navCollapsed, setNavCollapsed] = useState(false);

  // Goals (Stored in LocalStorage)
  const [calorieGoal, setCalorieGoal] = useState(localStorage.getItem('calorieGoal') || 2000);
  const [waterGoal, setWaterGoal] = useState(parseInt(localStorage.getItem('waterGoal')) || 8);
  const [water, setWater] = useState(0);

  const fileInputRef = useRef(null);
  const todayStr = new Date().toISOString().split('T')[0];
  const username = localStorage.getItem('username') || 'User';

  // --- SYNC DATA ON LOAD/DATE CHANGE ---
  useEffect(() => {
    loadMeals();
    const savedWater = localStorage.getItem(`water_${username}_${selectedDate}`);
    setWater(savedWater ? parseInt(savedWater) : 0);
  }, [selectedDate, username]);

  // --- API & DATA HANDLERS ---
  const loadMeals = async () => {
    try {
      const { data } = await fetchMeals();
      setMeals(data || []);
    } catch (err) {
      toast.error("Sync error: Could not fetch your diary");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.calories || !form.quantity) return toast.error("Please fill all fields");
    try {
      if (editingId) {
        await updateMeal(editingId, { ...form, date: selectedDate });
        setEditingId(null);
        toast.success("Meal updated!");
      } else {
        await addMeal({ ...form, date: selectedDate });
        toast.success("Meal logged!");
      }
      setForm({ name: '', calories: '', quantity: '', type: 'breakfast' });
      loadMeals();
    } catch (err) {
      toast.error("Save failed. Check connection.");
    }
  };

  const handleEdit = (meal) => {
    setEditingId(meal._id);
    setForm({ name: meal.name, calories: meal.calories, quantity: meal.quantity, type: meal.type });
    setSelectedDate(meal.date.split('T')[0]);
    toast('Editing mode active', { icon: '✏️' });
    setActivePage('dashboard');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await deleteMeal(id);
        loadMeals();
        toast.success("Entry removed");
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // --- HYDRATION LOGIC ---
  const handleWaterUpdate = (val) => {
    const next = Math.max(0, water + val);
    setWater(next);
    localStorage.setItem(`water_${username}_${selectedDate}`, next);
    if (next >= waterGoal && val > 0) toast.success("Hydration Goal Reached! 💧");
  };

  const updateWaterGoal = () => {
    const newGoal = prompt("Set your target glasses per day:", waterGoal);
    if (newGoal && !isNaN(newGoal)) {
      setWaterGoal(parseInt(newGoal));
      localStorage.setItem('waterGoal', newGoal);
      toast.success(`Target updated to ${newGoal} glasses`);
    }
  };

  // --- BACKUP & RESTORE ---
  const handleBackup = () => {
    const dataStr = JSON.stringify(meals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const fileName = `My_Diet_History_${selectedDate}.json`;
    let link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
    toast.success("Backup saved successfully!");
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          toast.loading("Restoring data...");
          for (const m of imported) {
            await addMeal({ name: m.name, calories: m.calories, quantity: m.quantity, type: m.type, date: m.date });
          }
          loadMeals();
          toast.dismiss();
          toast.success("History restored!");
        }
      } catch (err) {
        toast.dismiss();
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  const pageTitles = {
    dashboard: { title: 'Diet Tracker', sub: `Personal Diary for ${username}` },
    today:     { title: "Today's Log",   sub: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) },
    analysis:  { title: 'Analysis',       sub: 'Nutrition insights & trends' },
    history:   { title: 'History',        sub: 'Browse your past meals by date' },
  };

  const sidebarWidth = navCollapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Side Navigation */}
      <SideNav
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={navCollapsed}
        setCollapsed={setNavCollapsed}
        username={username}
        handleBackup={handleBackup}
        fileInputRef={fileInputRef}
        handleRestore={handleRestore}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarWidth} min-h-screen`}>
        <div className="p-4 md:p-8 max-w-[1200px] mx-auto">

          {/* Page Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{pageTitles[activePage]?.title}</h1>
              <p className="text-gray-400 font-bold italic tracking-wide mt-1">
                {activePage === 'dashboard'
                  ? <>Personal Diary for <span className="text-blue-600 not-italic">{username}</span></>
                  : pageTitles[activePage]?.sub
                }
              </p>
            </div>

            {/* Only show backup/restore/logout in header on dashboard for non-mobile */}
            {activePage === 'dashboard' && (
              <div className="hidden md:flex gap-3">
                <button onClick={handleBackup} className="bg-blue-50 text-blue-700 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition">Backup</button>
                <button onClick={() => fileInputRef.current.click()} className="bg-gray-50 text-gray-500 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition">Restore</button>
              </div>
            )}
          </header>

          {/* Page Content */}
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
              setWaterGoal={setWaterGoal}
              water={water}
              handleWaterUpdate={handleWaterUpdate}
              updateWaterGoal={updateWaterGoal}
              handleSubmit={handleSubmit}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleBackup={handleBackup}
              handleRestore={handleRestore}
              fileInputRef={fileInputRef}
            />
          )}

          {activePage === 'today' && (
            <TodayPage meals={meals} calorieGoal={calorieGoal} waterGoal={waterGoal} />
          )}

          {activePage === 'analysis' && (
            <AnalysisPage meals={meals} calorieGoal={calorieGoal} />
          )}

          {activePage === 'history' && (
            <HistoryPage meals={meals} calorieGoal={calorieGoal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;