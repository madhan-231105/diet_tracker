// ─── CALORIE COLOR HELPERS ────────────────────────────────────────────────────
// Returns Tailwind class names + hex dot color based on % of calorie goal.
// Used in: CalorieCard, HistoryCalendar, HistoryPage

export const getCalorieColor = (calories, goal = 2000) => {
  if (calories === 0)
    return { bg: 'bg-gray-100', text: 'text-gray-300', dot: '#E5E7EB', label: 'empty' };

  const pct = (calories / goal) * 100;

  if (pct < 50)
    return { bg: 'bg-zinc-100',   text: 'text-zinc-600',   dot: '#3B82F6', label: 'low'  };
  if (pct < 80)
    return { bg: 'bg-green-100',  text: 'text-green-600',  dot: '#22C55E', label: 'good' };
  if (pct <= 110)
    return { bg: 'bg-orange-100', text: 'text-orange-500', dot: '#F97316', label: 'high' };

  return   { bg: 'bg-red-100',    text: 'text-red-500',    dot: '#EF4444', label: 'over' };
};

// ─── PROGRESS BAR COLOR ───────────────────────────────────────────────────────
// Returns Tailwind bg class for the calorie progress bar fill.
// Used in: CalorieCard

export const getProgressBarColor = (percent) => {
  if (percent < 50)  return 'bg-zinc-500';
  if (percent < 80)  return 'bg-yellow-400';
  if (percent <= 100) return 'bg-orange-500';
  return 'bg-red-600 animate-pulse';
};

// ─── MEAL TYPE CONFIG ─────────────────────────────────────────────────────────
// Shared emoji + color config for breakfast/lunch/dinner/snack.
// Used in: TodayPage, HistoryPage

export const MEAL_TYPE_CONFIG = {
  breakfast: { emoji: '🌅', color: '#F59E0B', bg: 'bg-amber-50',  text: 'text-amber-600'  },
  lunch:     { emoji: '☀️', color: '#22C55E', bg: 'bg-green-50',  text: 'text-green-600'  },
  dinner:    { emoji: '🌙', color: '#3B82F6', bg: 'bg-zinc-50',   text: 'text-zinc-600'   },
  snack:     { emoji: '🍎', color: '#A855F7', bg: 'bg-purple-50', text: 'text-purple-600' },
};