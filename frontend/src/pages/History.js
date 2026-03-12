import React, { useEffect, useState } from "react";
import { fetchMeals } from "../services/api";

const History = () => {

const [meals,setMeals] = useState([])

useEffect(()=>{
loadMeals()
},[])

const loadMeals = async ()=>{
const {data} = await fetchMeals()
setMeals(data || [])
}

const getCaloriesForDate = (date)=>{
return meals
.filter(m=>m.date?.startsWith(date))
.reduce((sum,m)=>sum+Number(m.calories),0)
}

const generateCalendar = ()=>{

let days = []

for(let i=0;i<365;i++){

let d = new Date()
d.setDate(d.getDate()-i)

let date = d.toISOString().split("T")[0]

days.push({
date,
kcal:getCaloriesForDate(date)
})

}

return days.reverse()

}

const color = (kcal)=>{

if(kcal===0) return "bg-gray-100"
if(kcal<800) return "bg-zinc-200"
if(kcal<1500) return "bg-yellow-300"
if(kcal<2000) return "bg-green-400"
return "bg-red-400"

}

return (

<div className="p-10">

<h1 className="text-3xl font-black mb-10">
Diet History
</h1>

<div className="grid grid-cols-14 gap-2">

{generateCalendar().map((d,i)=>(

<div
key={i}
className={`h-6 w-6 rounded ${color(d.kcal)}`}
title={`${d.date} : ${d.kcal} kcal`}
>
</div>

))}

</div>

</div>

)

}

export default History