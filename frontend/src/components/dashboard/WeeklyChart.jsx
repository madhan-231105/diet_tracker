import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WeeklyChart = ({ meals }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const getChartData = () => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map(d => {
      const kcal = meals
        .filter(m => m.date?.startsWith(d))
        .reduce((s, m) => s + Number(m.calories), 0);

      return {
        displayDay: d === todayStr ? 'Today' : d.split('-').slice(1).join('/'),
        actualKcal: kcal,
        chartKcal: kcal === 0 ? 50 : kcal,
      };
    });
  };

  const data = getChartData();

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200">

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-slate-800 text-lg tracking-tight">
          7-Day Overview
        </h3>

        <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-800 inline-block" />
            Today
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
            Past
          </span>
        </div>
      </div>

      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">

            <XAxis
              dataKey="displayDay"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontWeight: 800, fontSize: 10 }}
              dy={10}
            />

            <YAxis hide />

            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.08)' }}
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontWeight: 800,
                fontSize: 12
              }}
              formatter={(value, name, props) => [
                `${props.payload.actualKcal} kcal`,
                props.payload.displayDay
              ]}
            />

            <Bar dataKey="chartKcal" radius={[10, 10, 10, 10]} barSize={36}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.displayDay === 'Today'
                      ? '#334155'      // slate-700
                      : entry.actualKcal === 0
                      ? '#F1F5F9'      // slate-100
                      : '#CBD5F5'      // slate-300
                  }
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default WeeklyChart;