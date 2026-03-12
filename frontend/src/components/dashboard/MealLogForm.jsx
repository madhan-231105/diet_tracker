import React from 'react';

const MealLogForm = ({ form, setForm, editingId, handleSubmit, selectedDate }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-200 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">
          {editingId ? '✏️ Update Entry' : '➕ Log New Meal'}
        </h3>

        {selectedDate && (
          <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-xl uppercase tracking-wider">
            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
        )}
      </div>

      {/* Meal Name */}
      <input
        required
        placeholder="Meal name (e.g. Oatmeal)"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="w-full p-3.5 bg-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-400 outline-none font-medium text-slate-800 placeholder-slate-400 text-sm"
      />

      {/* Quantity + Calories */}
      <div className="flex gap-3">
        <input
          required
          placeholder="Qty (e.g. 1 cup)"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
          className="w-2/3 p-3.5 bg-slate-100 rounded-2xl outline-none font-medium text-slate-800 placeholder-slate-400 text-sm"
        />

        <input
          required
          type="number"
          min="1"
          placeholder="Kcal"
          value={form.calories}
          onChange={e => setForm({ ...form, calories: e.target.value })}
          className="w-1/3 p-3.5 bg-slate-100 rounded-2xl outline-none font-black text-slate-700 placeholder-slate-400 text-sm"
        />
      </div>

      {/* Meal Type */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { type: 'breakfast', emoji: '🌅' },
          { type: 'lunch', emoji: '☀️' },
          { type: 'dinner', emoji: '🌙' },
          { type: 'snack', emoji: '🍎' }
        ].map(({ type, emoji }) => (
          <button
            key={type}
            type="button"
            onClick={() => setForm({ ...form, type })}
            className={`py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wide transition-all duration-200 flex flex-col items-center gap-0.5
              ${
                form.type === type
                  ? 'bg-slate-700 text-white shadow-lg shadow-slate-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
            <span className="text-base">{emoji}</span>
            {type}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-2xl font-black text-white text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.01] active:scale-95 bg-slate-700 hover:bg-slate-800 shadow-slate-200"
      >
        {editingId ? '💾 Save Changes' : '+ Add to Diary'}
      </button>

      {editingId && (
        <p className="text-center text-xs text-slate-400 font-bold">
          Editing mode — form resets after save
        </p>
      )}
    </form>
  );
};

export default MealLogForm;