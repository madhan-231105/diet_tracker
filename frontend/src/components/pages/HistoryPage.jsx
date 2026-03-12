import React, { useState, useMemo } from 'react';
import HistoryCalendar from './HistoryCalendar';
import {
  BreakfastIcon,
  LunchIcon,
  DinnerIcon,
  SnackIcon
} from '../shared/Icons';

const MEAL_TYPE_CONFIG = {
  breakfast: { bg: 'bg-slate-100', text: 'text-slate-600' },
  lunch:     { bg: 'bg-slate-100', text: 'text-slate-600' },
  dinner:    { bg: 'bg-slate-100', text: 'text-slate-600' },
  snack:     { bg: 'bg-slate-100', text: 'text-slate-600' },
};

const getMealIcon = (type) => {
  switch(type){
    case 'breakfast': return <BreakfastIcon />;
    case 'lunch': return <LunchIcon />;
    case 'dinner': return <DinnerIcon />;
    case 'snack': return <SnackIcon />;
    default: return <SnackIcon />;
  }
};

const HistoryPage = ({ meals = [], calorieGoal = 2000 }) => {

  const todayStr = new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const { dayMeals, dayCalories } = useMemo(() => {
    const filtered = meals.filter(m => m.date?.startsWith(selectedDate));
    const total = filtered.reduce((sum, m) => sum + Number(m.calories), 0);
    return { dayMeals: filtered, dayCalories: total };
  }, [meals, selectedDate]);

  const percent = Math.round((dayCalories / calorieGoal) * 100);

  const displayDate = useMemo(() => {
    if (selectedDate === todayStr) return "Today's Log";
    return new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }, [selectedDate, todayStr]);

  return (

    <div className="w-full max-w-[1400px] mx-auto px-4 py-2">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Calendar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-6">

            <HistoryCalendar
              meals={meals}
              calorieGoal={calorieGoal}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />

          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">

          {/* Summary */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex-1">

              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                {displayDate}
              </p>

              <div className="flex items-baseline gap-3">

                <span className="text-6xl font-black text-slate-800 tracking-tighter">
                  {dayCalories}
                </span>

                <span className="text-slate-400 font-bold text-lg">
                  / {calorieGoal} kcal
                </span>

              </div>

            </div>

            <div className="w-full md:w-64 space-y-3">

              <div className="flex justify-between items-end">

                <span className="text-[11px] font-black uppercase text-slate-600 tracking-widest">
                  {percent}% OF GOAL
                </span>

                <span className="text-xs font-bold text-slate-400">
                  {dayCalories > calorieGoal ? 'Limit Exceeded' : 'Remaining'}
                </span>

              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className={`h-full transition-all duration-700 rounded-full ${
                    percent > 100 ? 'bg-red-500' : 'bg-slate-700'
                  }`}
                  style={{ width: `${Math.min(percent,100)}%` }}
                />

              </div>

            </div>

          </div>

          {/* Meals */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {dayMeals.length === 0 ? (

              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">

                <p className="text-slate-400 font-bold italic text-lg">
                  No meals logged for this date
                </p>

              </div>

            ) : (

              dayMeals.map((m) => {

                const cfg = MEAL_TYPE_CONFIG[m.type] || MEAL_TYPE_CONFIG.snack;

                return (

                  <div
                    key={m._id}
                    className="group flex items-center justify-between p-5 bg-white rounded-[2rem] border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg transition-all"
                  >

                    <div className="flex items-center gap-5">

                      <div className={`w-14 h-14 ${cfg.bg} rounded-2xl flex items-center justify-center shadow-sm`}>

                        {getMealIcon(m.type)}

                      </div>

                      <div>

                        <h4 className="font-black text-slate-800 text-lg tracking-tight leading-tight">
                          {m.name}
                        </h4>

                        <div className="flex items-center gap-2">

                          <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.text}`}>
                            {m.type}
                          </span>

                          <span className="text-slate-300 text-xs">•</span>

                          <span className="text-xs text-slate-400 font-medium italic">
                            {m.quantity}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="text-right">

                      <span className="text-2xl font-black text-slate-800 tracking-tighter">
                        {m.calories}
                      </span>

                      <span className="text-[10px] text-slate-400 font-black ml-1 uppercase">
                        kcal
                      </span>

                    </div>

                  </div>

                );

              })

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default HistoryPage;