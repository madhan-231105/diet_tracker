import React from 'react';
import MealLogForm  from './MealLogForm';
import CalorieCard  from './CalorieCard';
import WaterCard    from './WaterCard';
import WeeklyChart  from './WeeklyChart';
import MealTable    from './MealTable';

// Layout (mobile-first):
//   Mobile  : single column
//   Desktop : 2-col grid (4 left / 8 right)

const DashboardPage = ({
  meals, selectedDate, setSelectedDate,
  form, setForm, editingId, setEditingId,
  filterType, setFilterType,
  calorieGoal, setCalorieGoal,
  waterGoal, water, handleWaterUpdate, updateWaterGoal,
  handleSubmit, handleEdit, handleDelete,
}) => {

  const totalCalories = meals
    .filter(m => m.date?.startsWith(selectedDate))
    .reduce((sum, m) => sum + Number(m.calories), 0);

  return (
    <div className="bg-slate-50 rounded-3xl p-1">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-4 space-y-5">

          <CalorieCard
            totalCalories={totalCalories}
            calorieGoal={calorieGoal}
            setCalorieGoal={setCalorieGoal}
          />

          <MealLogForm
            form={form}
            setForm={setForm}
            editingId={editingId}
            handleSubmit={handleSubmit}
            selectedDate={selectedDate}
          />

          <WaterCard
            water={water}
            waterGoal={waterGoal}
            handleWaterUpdate={handleWaterUpdate}
            updateWaterGoal={updateWaterGoal}
          />

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-8 space-y-5">

          <WeeklyChart meals={meals} />

          <MealTable
            meals={meals}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filterType={filterType}
            setFilterType={setFilterType}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;