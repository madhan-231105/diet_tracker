import React from 'react';

const WaterCard = ({ water, waterGoal, handleWaterUpdate, updateWaterGoal }) => {
  const pct = Math.round((water / waterGoal) * 100);

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200">

      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">
          Hydration
        </h3>

        <button
          onClick={updateWaterGoal}
          className="text-slate-600 text-xs font-bold underline hover:text-slate-800 transition"
        >
          Set Goal
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-4xl font-black text-slate-800">{water}</span>
        <span className="text-slate-400 font-bold text-sm">/ {waterGoal} glasses</span>
        <span className="text-2xl ml-auto">💧</span>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-1 mb-2">
        {[...Array(waterGoal)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2.5 rounded-sm transition-all duration-500 ${
              i < water
                ? 'bg-blue-500 scale-y-110'
                : 'bg-slate-100'
            }`}
          />
        ))}
      </div>

      <p
        className={`text-[11px] font-black uppercase tracking-wider mb-4 ${
          pct >= 100 ? 'text-blue-600' : 'text-slate-400'
        }`}
      >
        {pct >= 100 ? '✓ Goal reached!' : `${pct}% of daily target`}
      </p>

      <div className="flex gap-3">

        <button
          onClick={() => handleWaterUpdate(1)}
          className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-95 transition"
        >
          + Drink Glass
        </button>

        <button
          onClick={() => handleWaterUpdate(-1)}
          className="px-5 bg-slate-100 text-slate-500 py-3.5 rounded-2xl font-black hover:bg-slate-200 transition text-lg"
        >
          −
        </button>

      </div>
    </div>
  );
};

export default WaterCard;