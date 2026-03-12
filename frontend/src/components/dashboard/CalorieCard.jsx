import React from 'react';
import { getProgressBarColor } from '../../utils/calorieHelpers';

const CalorieCard = ({ totalCalories, calorieGoal, setCalorieGoal }) => {
  const goal = Number(calorieGoal);
  const caloriePercent = Math.round((totalCalories / goal) * 100);
  const remaining = goal - totalCalories;

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">
          Energy Progress
        </h3>

        <button
          onClick={() => {
            const n = prompt('New Daily Calorie Goal?', calorieGoal);
            if (n && !isNaN(n)) setCalorieGoal(n);
          }}
          className="text-slate-600 hover:text-slate-800 text-xs font-bold underline transition"
        >
          Edit Goal
        </button>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-5xl font-black tracking-tighter text-slate-800">
          {totalCalories}
        </span>
        <span className="text-slate-400 font-bold text-sm">/ {goal} kcal</span>
      </div>

      <div className="relative w-full h-5 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor(caloriePercent)}`}
          style={{ width: `${Math.min(caloriePercent, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-[11px] font-black uppercase">
        <span className={caloriePercent > 100 ? 'text-red-600' : 'text-slate-500'}>
          {caloriePercent}% {caloriePercent > 100 ? '⚠ Over!' : 'consumed'}
        </span>

        <span className="text-slate-500">
          {remaining > 0 ? `${remaining} kcal left` : '🎯 Goal reached'}
        </span>
      </div>
    </div>
  );
};

export default CalorieCard;