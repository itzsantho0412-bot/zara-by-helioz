import { useState } from 'react';
import { Plus, Flame, Check } from 'lucide-react';
import type { Habit } from '../types';
import { uid, todayISO } from '../services/storage';
import { habitStreak, habitRate } from '../services/taskService';

export default function HabitTracker({ habits, onChange }: { habits: Habit[]; onChange: (h: Habit[]) => void }) {
  const [name, setName] = useState('');
  const today = todayISO();

  const toggle = (id: string) =>
    onChange(habits.map((h) => {
      if (h.id !== id) return h;
      const has = h.doneDates.includes(today);
      return { ...h, doneDates: has ? h.doneDates.filter((d) => d !== today) : [...h.doneDates, today] };
    }));

  const add = () => {
    const n = name.trim();
    if (!n) return;
    onChange([...habits, { id: uid(), name: n, doneDates: [] }]);
    setName('');
  };

  const doneToday = habits.filter((h) => h.doneDates.includes(today)).length;

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">Today</span>
          <span className="font-semibold text-heliox-400">{doneToday}/{habits.length}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all" style={{ width: `${habits.length ? (doneToday / habits.length) * 100 : 0}%` }} />
        </div>
      </div>

      {habits.length === 0 && <p className="glass rounded-2xl p-6 text-center text-sm text-neutral-400">No habits yet. Add your first one below.</p>}

      {habits.map((h) => (
        <div key={h.id} className="glass flex items-center gap-3 rounded-2xl p-4 animate-fadeUp">
          <button
            onClick={() => toggle(h.id)}
            aria-label={`Mark ${h.name} done today`}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${h.doneDates.includes(today) ? 'border-heliox-500 bg-heliox-500 text-black' : 'border-neutral-700 text-neutral-500'}`}
          >
            <Check size={16} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{h.name}</p>
            <p className="text-xs text-neutral-500">7-day {habitRate(h)}%</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-heliox-400">
            <Flame size={15} /> {habitStreak(h)}
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <input className="input" placeholder="Add a custom habit (e.g. Read 10 pages)" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button onClick={add} className="flex items-center gap-1 rounded-xl bg-heliox-500 px-4 text-sm font-medium text-black hover:bg-heliox-400"><Plus size={16} /> Add</button>
      </div>
    </div>
  );
}
