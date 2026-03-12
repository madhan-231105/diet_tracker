import React, { useState } from 'react';

// Consistent slate-based status colors
const getCalorieStatus = (calories, goal) => {
  if (calories === 0) return { bg: 'bg-slate-100', text: 'text-slate-400', dot: '#CBD5F5' };

  const percent = (calories / goal) * 100;

  if (percent < 50)  return { bg: 'bg-slate-50', text: 'text-slate-600', dot: '#94A3B8' };
  if (percent <= 80) return { bg: 'bg-slate-100', text: 'text-slate-700', dot: '#64748B' };
  if (percent <= 110)return { bg: 'bg-slate-200', text: 'text-slate-800', dot: '#475569' };

  return { bg: 'bg-slate-300', text: 'text-slate-900', dot: '#334155' };
};

const MONTH_NAMES = [
'January','February','March','April','May','June',
'July','August','September','October','November','December'
];

const DAY_NAMES = ['S','M','T','W','T','F','S'];

const HistoryCalendar = ({ meals, calorieGoal, onDateSelect, selectedDate }) => {

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-CA');

  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekDay = new Date(viewYear, viewMonth, 1).getDay();

  const isNextDisabled =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth >= today.getMonth());

  const changeMonth = (offset) => {
    const newDate = new Date(viewYear, viewMonth + offset, 1);
    setViewMonth(newDate.getMonth());
    setViewYear(newDate.getFullYear());
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-6 sm:p-8 w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <div className="text-center">
          <span className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
            {viewYear}
          </span>
          <span className="text-xl font-black text-slate-800 tracking-tight">
            {MONTH_NAMES[viewMonth]}
          </span>
        </div>

        <button
          onClick={() => changeMonth(1)}
          disabled={isNextDisabled}
          className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 disabled:opacity-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">

        {DAY_NAMES.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-black text-slate-300 uppercase mb-2">
            {d}
          </div>
        ))}

        {[...Array(firstWeekDay)].map((_, i) => <div key={`pad-${i}`} />)}

        {[...Array(daysInMonth)].map((_, i) => {

          const day = i + 1;

          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

          const isFuture = dateStr > todayStr;
          const isSelected = dateStr === selectedDate;

          const dayTotal = meals
            .filter(m => m.date?.startsWith(dateStr))
            .reduce((s, m) => s + Number(m.calories), 0);

          const { bg, text, dot } = getCalorieStatus(dayTotal, calorieGoal);

          return (
            <button
              key={dateStr}
              onClick={() => !isFuture && onDateSelect(dateStr)}
              disabled={isFuture}
              className={`
                relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all
                ${isFuture ? 'opacity-10 cursor-not-allowed' : `hover:scale-105 active:scale-95 ${bg}`}
                ${isSelected ? '!bg-slate-700 shadow-lg shadow-slate-200 z-10' : ''}
              `}
            >

              <span className={`text-xs font-black ${isSelected ? 'text-white' : text}`}>
                {day}
              </span>

              {dayTotal > 0 && (
                <span
                  className={`text-[8px] font-bold mt-1 ${isSelected ? 'text-slate-100' : ''}`}
                  style={!isSelected ? { color: dot } : {}}
                >
                  {dayTotal >= 1000 ? `${(dayTotal/1000).toFixed(1)}k` : dayTotal}
                </span>
              )}

            </button>
          );

        })}

      </div>

    </div>
  );
};

export default HistoryCalendar;