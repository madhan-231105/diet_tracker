import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';

const foodDatabase = [
  { food: "Idli", qty: "1", carbs: 16, calories: 75 },
  { food: "Dosai", qty: "1", carbs: 16, calories: 120 },
  { food: "Rice - boiled", qty: "100 g", carbs: 28, calories: 130 },
  { food: "Chappathi", qty: "1", carbs: 22, calories: 100 },
  { food: "Poori", qty: "1", carbs: 22, calories: 150 },
  { food: "Parotta", qty: "1", carbs: 33, calories: 250 },
  { food: "Fried rice", qty: "100 g", carbs: 22, calories: 180 },
  { food: "Biryani - veg", qty: "100 g", carbs: 22, calories: 150 },
  { food: "Biryani - nonveg", qty: "100 g", carbs: 18, calories: 180 },
  { food: "Sambhar", qty: "1 cup", carbs: 20, calories: 105 },
  { food: "Chutney - coconut", qty: "100 g", carbs: 10, calories: 130 },
  { food: "Veg gravy", qty: "1 cup", carbs: 33, calories: 140 },
  { food: "Non veg gravy", qty: "1 cup", carbs: 3, calories: 240 },
  { food: "Chicken fry", qty: "100 g", carbs: 0, calories: 190 },
  { food: "Mutton fry", qty: "100 g", carbs: 0, calories: 220 },
  { food: "Fish fry", qty: "100 g", carbs: 0, calories: 180 },
  { food: "Milk sweet", qty: "1", carbs: 34, calories: 150 },
  { food: "Curd", qty: "100 ml", carbs: 5, calories: 72 },
  { food: "Milk", qty: "100 ml", carbs: 6, calories: 72 },
  { food: "Butter milk", qty: "100 ml", carbs: 2, calories: 30 },
  { food: "Paneer", qty: "100 g", carbs: 2, calories: 350 },
  { food: "Egg", qty: "1", carbs: 0, calories: 70 },
  { food: "Biscuits", qty: "1", carbs: 6, calories: 45 },
  { food: "Bread", qty: "1", carbs: 15, calories: 80 },
  { food: "Cream biscuits", qty: "1", carbs: 7, calories: 50 },
  { food: "Noodles", qty: "100 g", carbs: 25, calories: 140 },
  { food: "Ice cream", qty: "100 ml", carbs: 14, calories: 130 },
  { food: "Cool drinks (cola)", qty: "100 ml", carbs: 12, calories: 48 },
  { food: "Fruit juice", qty: "100 ml", carbs: 15, calories: 60 },
  { food: "Banana", qty: "1", carbs: 27, calories: 105 },
  { food: "Mango", qty: "1", carbs: 28, calories: 108 },
  { food: "Papaya", qty: "100 g", carbs: 11, calories: 44 },
  { food: "Guava", qty: "1", carbs: 14, calories: 68 },
];

const FoodLibraryPage = () => {

  const [search, setSearch] = useState("");

  const filteredFood = foodDatabase.filter(item =>
    item.food.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search food (e.g. Biryani, Idli)"
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-slate-300 font-semibold text-slate-700 placeholder:text-slate-400"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      {/* Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex gap-3 items-start">

        <div className="text-slate-600 mt-1">
          <Info size={18} />
        </div>

        <p className="text-sm text-slate-600 font-semibold">
          Nutritional values are approximate averages. Actual calories may vary depending on cooking methods.
        </p>

      </div>


      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500 tracking-wider">

              <th className="px-8 py-5 text-left">Food</th>
              <th className="px-8 py-5 text-left">Quantity</th>
              <th className="px-8 py-5 text-center">Carbs</th>
              <th className="px-8 py-5 text-right">Calories</th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {filteredFood.map((item, index) => (

              <tr
                key={index}
                className="hover:bg-slate-50 transition-colors"
              >

                <td className="px-8 py-5 font-bold text-slate-800">
                  {item.food}
                </td>

                <td className="px-8 py-5 text-slate-500 font-semibold italic">
                  {item.qty}
                </td>

                <td className="px-8 py-5 text-center">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-xs">
                    {item.carbs} g
                  </span>
                </td>

                <td className="px-8 py-5 text-right">
                  <span className="text-2xl font-black text-slate-800">
                    {item.calories}
                  </span>
                  <span className="text-xs text-slate-400 ml-2 font-bold uppercase">
                    kcal
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default FoodLibraryPage;