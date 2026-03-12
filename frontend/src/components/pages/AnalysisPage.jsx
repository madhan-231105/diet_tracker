import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MEAL_TYPE_COLORS = {
  breakfast: '#475569',
  lunch: '#64748B',
  dinner: '#334155',
  snack: '#94A3B8',
};

const RANGES = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: 'Month', value: 'month' },
];

const AnalysisPage = ({ meals, calorieGoal }) => {
  const [range, setRange] = useState(30);
  const todayStr = new Date().toISOString().split('T')[0];

  const chartData = (() => {
    if (range === 'month') {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      return [...Array(daysInMonth)].map((_, i) => {
        const d = new Date(year, month, i + 1);
        const ds = d.toISOString().split('T')[0];

        const cals = meals
          .filter(m => m.date?.startsWith(ds))
          .reduce((s, m) => s + Number(m.calories), 0);

        return { date: ds, display: `${i + 1}`, calories: cals };
      });
    }

    return [...Array(range)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (range - 1 - i));
      const ds = d.toISOString().split('T')[0];

      const cals = meals
        .filter(m => m.date?.startsWith(ds))
        .reduce((s, m) => s + Number(m.calories), 0);

      return {
        date: ds,
        display: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        calories: cals
      };
    });
  })();

  const daysWithData = chartData.filter(d => d.calories > 0);

  const avgCals = daysWithData.length
    ? Math.round(daysWithData.reduce((s, d) => s + d.calories, 0) / daysWithData.length)
    : 0;

  const maxCals = daysWithData.length
    ? Math.max(...daysWithData.map(d => d.calories))
    : 0;

  const minCals = daysWithData.length
    ? Math.min(...daysWithData.map(d => d.calories))
    : 0;

  const streak = (() => {
    let s = 0;

    for (let i = 0; i < 60; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      if (meals.some(m => m.date?.startsWith(d.toISOString().split('T')[0]))) s++;
      else break;
    }

    return s;
  })();

  const thisMonthPrefix = todayStr.substring(0, 7);

  const typeBreakdown = Object.keys(MEAL_TYPE_COLORS).map(type => ({
    type,
    cals: meals
      .filter(m => m.date?.startsWith(thisMonthPrefix) && m.type === type)
      .reduce((s, m) => s + Number(m.calories), 0),
  }));

  const totalMonthCals = typeBreakdown.reduce((s, t) => s + t.cals, 0);

  const xAxisInterval = range === 7 ? 0 : range === 'month' ? 4 : 5;

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {[
          { label: 'Avg Daily', value: avgCals, unit: 'kcal' },
          { label: 'Highest Day', value: maxCals, unit: 'kcal' },
          { label: 'Lowest Day', value: minCals, unit: 'kcal' },
          { label: 'Day Streak', value: streak, unit: 'days' },
        ].map(({ label, value, unit }) => (

          <div key={label} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-6">

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
              {label}
            </p>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-800">
                {value}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {unit}
              </span>
            </div>

          </div>

        ))}

      </div>

      {/* Chart */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200">

        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">

          <h3 className="font-black text-slate-800 text-lg tracking-tight">
            Overview
          </h3>

          <div className="flex items-center gap-3 flex-wrap">

            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">

              {RANGES.map(r => (

                <button
                  key={r.value}
                  onClick={() => setRange(r.value)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all
                    ${range === r.value
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {r.label}
                </button>

              ))}

            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-400">

              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
                Intake
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                Goal
              </span>

            </div>

          </div>

        </div>

        <div className="h-48 sm:h-64">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>

              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />

              <XAxis
                dataKey="display"
                tick={{ fill: '#64748B', fontSize: 9, fontWeight: 800 }}
                tickLine={false}
                axisLine={false}
                interval={xAxisInterval}
                dy={8}
              />

              <YAxis hide />

              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  fontSize: 12,
                  fontWeight: 800
                }}
                formatter={(val, name) => [`${val} kcal`, name]}
              />

              <Line
                type="monotone"
                dataKey="calories"
                stroke="#334155"
                strokeWidth={2.5}
                dot={range === 7 ? { r: 4, fill: '#334155' } : false}
                activeDot={{ r: 4 }}
                name="Intake"
              />

              <Line
                type="monotone"
                dataKey={() => Number(calorieGoal)}
                stroke="#CBD5F5"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="Goal"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Meal Breakdown */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200">

        <h3 className="font-black text-slate-800 text-lg tracking-tight mb-5">
          This Month by Meal Type
        </h3>

        <div className="space-y-4">

          {typeBreakdown.map(({ type, cals }) => {

            const pct = totalMonthCals > 0
              ? Math.round((cals / totalMonthCals) * 100)
              : 0;

            return (

              <div key={type}>

                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-black text-slate-600 capitalize">
                    {type}
                  </span>

                  <span className="text-sm font-black text-slate-800">
                    {cals} kcal
                    <span className="text-slate-400 font-bold">
                      ({pct}%)
                    </span>
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      background: MEAL_TYPE_COLORS[type]
                    }}
                  />

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
};

export default AnalysisPage;