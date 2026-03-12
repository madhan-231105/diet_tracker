import React, { useState } from 'react';

const MEAL_TYPES = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];

const SortIcon = ({ active, dir }) => (
  <span className={`ml-1 inline-block transition-all ${active ? 'text-slate-600' : 'text-slate-300'}`}>
    {active && dir === 'desc' ? '↓' : active && dir === 'asc' ? '↑' : '↕'}
  </span>
);

const MealTable = ({
  meals,
  selectedDate,
  setSelectedDate,
  filterType,
  setFilterType,
  handleEdit,
  handleDelete,
}) => {

  const [sortKey, setSortKey] = useState('none');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortKey('none');
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const dailyMeals = meals.filter(
    m => m.date?.startsWith(selectedDate) &&
    (filterType === 'all' || m.type === filterType)
  );

  const sortedMeals = [...dailyMeals].sort((a, b) => {
    if (sortKey === 'none') return 0;

    let valA = a[sortKey];
    let valB = b[sortKey];

    if (sortKey === 'calories') {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalForDay = meals
    .filter(m => m.date?.startsWith(selectedDate))
    .reduce((sum, m) => sum + Number(m.calories), 0);

  const ColHeader = ({ label, sortable, colKey, className = '' }) => (
    <th className={`px-6 py-4 ${className}`}>
      {sortable ? (
        <button
          onClick={() => handleSort(colKey)}
          className={`flex items-center gap-0.5 font-black text-[10px] uppercase tracking-[0.2em]
            ${sortKey === colKey ? 'text-slate-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {label}
          <SortIcon active={sortKey === colKey} dir={sortDir} />
        </button>
      ) : (
        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
          {label}
        </span>
      )}
    </th>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="font-black p-2.5 bg-slate-100 rounded-xl outline-none text-sm text-slate-700 cursor-pointer w-full sm:w-auto"
          />

          {totalForDay > 0 && (
            <span className="text-sm font-black text-slate-500 whitespace-nowrap">
              <span className="text-slate-800">{totalForDay}</span> kcal
            </span>
          )}
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {MEAL_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider
                ${filterType === t
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">

        <table className="w-full text-left">

          <thead className="bg-slate-50">
            <tr>
              <ColHeader label="Meal" sortable colKey="name" />
              <ColHeader label="Type" sortable colKey="type" />
              <ColHeader label="Qty" sortable colKey="quantity" />
              <ColHeader label="Calories" sortable colKey="calories" />
              <ColHeader label="Actions" className="text-right" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {sortedMeals.map(m => (
              <tr key={m._id} className="group hover:bg-slate-50 transition-all">

                <td className="px-6 py-5">
                  <div className="font-bold text-slate-800">{m.name}</div>
                </td>

                <td className="px-6 py-5">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    {m.type}
                  </span>
                </td>

                <td className="px-6 py-5 text-slate-500 font-bold text-sm italic">
                  {m.quantity}
                </td>

                <td className="px-6 py-5">
                  <span className="text-2xl font-black text-slate-800 tracking-tighter">
                    {m.calories}
                  </span>
                  <span className="text-xs text-slate-400 font-bold ml-1">
                    kcal
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleEdit(m)}
                      className="text-slate-600 font-black text-xs uppercase hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(m._id)}
                      className="text-red-500 font-black text-xs uppercase hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>

              </tr>
            ))}

            {sortedMeals.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="text-4xl mb-2">🍽</div>
                  <p className="text-slate-400 font-bold italic">
                    No meals logged for this day.
                  </p>
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default MealTable;