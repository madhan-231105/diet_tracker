import React from 'react';
import { DropIcon, BreakfastIcon, LunchIcon, DinnerIcon, SnackIcon } from '../shared/Icons';
import { MEAL_TYPE_CONFIG } from '../../utils/calorieHelpers';

const TodayPage = ({ meals, calorieGoal, waterGoal }) => {

  const todayStr = new Date().toISOString().split('T')[0];
  const username = localStorage.getItem('username') || 'User';

  const todayMeals = meals.filter(m => m.date?.startsWith(todayStr));
  const totalCals  = todayMeals.reduce((s,m)=> s + Number(m.calories),0);
  const water      = parseInt(localStorage.getItem(`water_${username}_${todayStr}`)) || 0;
  const pct        = Math.min(Math.round((totalCals/calorieGoal)*100),999);

  const byType = ['breakfast','lunch','dinner','snack'].map(type=>({
    type,
    meals: todayMeals.filter(m=>m.type===type),
    cals:  todayMeals.filter(m=>m.type===type).reduce((s,m)=>s+Number(m.calories),0),
  }));

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning'
    : hour < 17 ? 'Good afternoon'
    : 'Good evening';

  const ringColor =
    pct > 100 ? '#EF4444'
    : pct > 80 ? '#F97316'
    : pct > 50 ? '#22C55E'
    : '#3B82F6';

  const getMealIcon = (type) => {
    switch(type){
      case 'breakfast': return <BreakfastIcon/>
      case 'lunch': return <LunchIcon/>
      case 'dinner': return <DinnerIcon/>
      case 'snack': return <SnackIcon/>
      default: return null
    }
  }

  return (

    <div className="space-y-5">

      {/* Greeting */}
      <div className="bg-white px-5 py-4 rounded-3xl border border-slate-200 shadow-sm">

        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          {greeting}, {username}
        </h2>

        <p className="text-slate-400 font-bold text-sm mt-0.5">
          Here's how your day looks so far
        </p>

      </div>


      {/* Progress Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Calorie Progress */}
        <div className="sm:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-7">

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
            Today's Progress
          </p>

          <div className="flex items-center gap-6">

            {/* Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">

              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="12"
                  strokeDasharray={`${Math.min(pct,100)*2.51} 251`}
                  strokeLinecap="round"
                  style={{transition:'stroke-dasharray 1s ease'}}
                />

              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-black text-slate-800">
                  {pct}%
                </span>
              </div>

            </div>


            {/* Calories */}
            <div>

              <div className="flex items-baseline gap-1 mb-1">

                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                  {totalCals}
                </span>

                <span className="text-slate-400 font-bold text-sm">
                  kcal
                </span>

              </div>

              <p className="text-slate-400 text-sm font-bold">
                of {calorieGoal} kcal
              </p>

              <p className={`text-sm font-black mt-1.5 ${
                totalCals > calorieGoal ? 'text-red-500' : 'text-green-500'
              }`}>
                {totalCals > calorieGoal
                  ? `${totalCals-calorieGoal} over`
                  : `${calorieGoal-totalCals} remaining`}
              </p>

            </div>

          </div>

        </div>


        {/* Water */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
            Hydration
          </p>

          <div className="flex items-baseline gap-1 mb-4">

            <span className="text-4xl font-black text-slate-700 tracking-tighter">
              {water}
            </span>

            <span className="text-slate-400 font-bold text-sm">
              / {waterGoal}
            </span>

          </div>

          <div className="flex gap-1 flex-wrap">

            {[...Array(waterGoal)].map((_,i)=>(
              <div
                key={i}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs
                ${i < water
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-slate-100 text-slate-300'
                }`}
              >
                <DropIcon/>
              </div>
            ))}

          </div>

        </div>

      </div>


      {/* Meals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {byType.map(({type,meals:typeMeals,cals})=>{

          const cfg = MEAL_TYPE_CONFIG[type]

          return(

            <div
              key={type}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
            >

              <div className={`${cfg.bg} px-5 py-4 flex items-center justify-between`}>

                <div className="flex items-center gap-2">

                  <span className="text-slate-700">
                    {getMealIcon(type)}
                  </span>

                  <span className="font-black text-slate-800 capitalize text-sm">
                    {type}
                  </span>

                </div>

                <span className="font-black text-slate-600 text-sm">
                  {cals} kcal
                </span>

              </div>

              {typeMeals.length===0 ? (

                <div className="px-5 py-4 text-slate-400 italic text-sm font-bold">
                  Nothing logged yet
                </div>

              ) : (

                <div className="divide-y divide-slate-100">

                  {typeMeals.map(m=>(
                    <div
                      key={m._id}
                      className="px-5 py-3 flex justify-between items-center"
                    >

                      <div>

                        <div className="font-bold text-slate-700 text-sm">
                          {m.name}
                        </div>

                        <div className="text-xs text-slate-400 italic">
                          {m.quantity}
                        </div>

                      </div>

                      <span className="font-black text-slate-800 text-sm">
                        {m.calories}
                      </span>

                    </div>
                  ))}

                </div>

              )}

            </div>

          )
        })}

      </div>

    </div>
  );
};

export default TodayPage;