import { Sunrise, Moon, Bell, Mic, MessageSquare, BookOpen, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Task, Habit, Reminder, Settings, Page } from '../types';
import { todayISO } from '../services/storage';
import { taskSummary } from '../services/taskService';
import { QUOTES } from '../services/gitaService';
import DashboardCard from '../components/DashboardCard';
import TaskList from '../components/TaskList';
import Logo from '../components/Logo';

interface Props {
  settings: Settings; tasks: Task[]; habits: Habit[]; reminders: Reminder[];
  onTasks: (t: Task[]) => void; onNavigate: (p: Page) => void;
}

export default function Dashboard({ settings, tasks, habits, reminders, onTasks, onNavigate }: Props) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const h = now.getHours();
  const timeGreeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const today = todayISO();
  const { total, done } = taskSummary(tasks, today);
  const habitsDone = habits.filter((x) => x.doneDates.includes(today)).length;
  const totalUnits = total + habits.length;
  const progress = totalUnits ? Math.round(((done + habitsDone) / totalUnits) * 100) : 0;
  const upcoming = reminders.filter((r) => !r.done && `${r.date}T${r.time}` >= `${today}T00:00`).slice(0, 4);
  const quote = QUOTES[now.getDate() % QUOTES.length];

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="md:hidden"><Logo size="sm" /></div>
        <div className="hidden md:block">
          <p className="text-sm text-neutral-400">{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-sm tabular-nums text-heliox-400">{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
      </header>

      <section className="animate-fadeUp">
        <p className="text-neutral-400">{timeGreeting},</p>
        <h1 className="text-3xl font-semibold">{settings.greeting || 'Hello'} <span className="text-gradient-orange">{settings.name}</span> ☀️</h1>
        <p className="mt-1 text-sm text-neutral-500">{quote}</p>
      </section>

      <div className="glass rounded-2xl p-5 flex items-center gap-5">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${progress} 100`} pathLength={100} className="transition-all duration-700" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold">{progress}%</span>
        </div>
        <div>
          <p className="font-medium">Today’s progress</p>
          <p className="text-sm text-neutral-400">{done}/{total} tasks · {habitsDone}/{habits.length} habits</p>
          {totalUnits === 0 && <p className="mt-1 text-xs text-neutral-500">Add a task or habit to start tracking.</p>}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <DashboardCard title="Morning call" subtitle={`${settings.morningTime} · planning & motivation`} icon={<Sunrise size={20} />} onClick={() => onNavigate('settings')} />
        <DashboardCard title="Evening call" subtitle={`${settings.eveningTime} · daily review`} icon={<Moon size={20} />} onClick={() => onNavigate('settings')} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Talk to HELIOZ', icon: MessageSquare, page: 'chat' as Page },
          { label: 'Voice', icon: Mic, page: 'voice' as Page },
          { label: 'Gita', icon: BookOpen, page: 'gita' as Page },
        ].map(({ label, icon: Icon, page }) => (
          <button key={label} onClick={() => onNavigate(page)} className="glass flex flex-col items-center gap-2 rounded-2xl p-4 text-xs transition hover:border-heliox-500/40">
            <Icon size={20} className="text-heliox-400" /> {label}
          </button>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Today’s tasks</h2>
          <button onClick={() => onNavigate('tasks')} className="text-xs text-heliox-400">View all</button>
        </div>
        <TaskList tasks={tasks.filter((t) => t.date === today)} onChange={(next) => onTasks([...tasks.filter((t) => t.date !== today), ...next])} compact />
        {tasks.filter((t) => t.date === today).length === 0 && (
          <div className="glass rounded-2xl p-5 text-center text-sm text-neutral-400">No tasks for today. <button className="text-heliox-400 underline" onClick={() => onNavigate('tasks')}>Plan your day</button></div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Upcoming reminders</h2>
        {upcoming.length === 0 ? (
          <p className="glass rounded-2xl p-5 text-center text-sm text-neutral-400">Nothing scheduled.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((r) => (
              <li key={r.id} className="glass flex items-center gap-3 rounded-xl p-3">
                <Bell size={16} className="text-heliox-400" />
                <span className="flex-1 truncate text-sm">{r.title}</span>
                <span className="text-xs text-neutral-500">{r.date} {r.time}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="glass flex items-center gap-3 rounded-2xl p-4 text-sm text-neutral-400">
        <Sparkles size={18} className="text-heliox-400" />
        <span>{done > 0 ? 'Good work on your tasks today. Keep the streak going!' : 'Start with one small task. Momentum does the rest.'}</span>
      </div>
    </div>
  );
}
