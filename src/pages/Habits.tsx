import { useMemo } from 'react';
import type { Habit } from '../types';
import HabitTracker from '../components/HabitTracker';
import { todayISO } from '../services/storage';

const DEFAULT_HABITS = ['Studying', 'Business work', 'Gym', 'Diet', 'Meditation', 'Room cleaning', 'Cooking', 'Sleep on time', 'Wake up on time', 'Screen-time limit'];

export function defaultHabits(): Habit[] {
  return DEFAULT_HABITS.map((name, i) => ({ id: `default-${i}`, name, doneDates: [] }));
}

export default function Habits({ habits, onChange }: { habits: Habit[]; onChange: (h: Habit[]) => void }) {
  // Weekly summary: last 7 days, count of habit completions per day.
  const week = useMemo(() => {
    const out: { label: string; count: number; key: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayISO(d);
      out.push({ key, label: d.toLocaleDateString('en-IN', { weekday: 'short' }), count: habits.filter((h) => h.doneDates.includes(key)).length });
    }
    return out;
  }, [habits]);
  const max = Math.max(1, ...week.map((w) => w.count));
  const isToday = (k: string) => k === todayISO();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Habits</h1>
        <p className="text-sm text-neutral-500">Small daily actions, tracked honestly.</p>
      </header>

      <div className="glass rounded-2xl p-4">
        <p className="mb-3 text-sm text-neutral-400">This week</p>
        <div className="flex h-24 items-end justify-between gap-2">
          {week.map((w) => (
            <div key={w.key} className="flex flex-1 flex-col items-center gap-1">
              <div className={`w-full rounded-md ${isToday(w.key) ? 'bg-heliox-500' : 'bg-heliox-500/40'}`} style={{ height: `${(w.count / max) * 100}%`, minHeight: 4 }} title={`${w.count} done`} />
              <span className="text-[10px] text-neutral-500">{w.label}</span>
            </div>
          ))}
        </div>
      </div>

      <HabitTracker habits={habits} onChange={onChange} />
    </div>
  );
}
