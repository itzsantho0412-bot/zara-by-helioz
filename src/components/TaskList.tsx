import { useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import type { Task, Priority } from '../types';
import { uid, todayISO } from '../services/storage';

const emptyTask = (): Omit<Task, 'id' | 'done'> => ({
  title: '', description: '', date: todayISO(), time: '09:00', priority: 'medium', category: '',
});

const PRIORITY_STYLE: Record<Priority, string> = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-heliox-400 bg-heliox-500/10',
  low: 'text-neutral-400 bg-white/5',
};

export default function TaskList({
  tasks, onChange, compact = false,
}: { tasks: Task[]; onChange: (t: Task[]) => void; compact?: boolean }) {
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Omit<Task, 'id' | 'done'>>(emptyTask());
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const openNew = () => { setEditing({ id: '', done: false, ...emptyTask() }); setForm(emptyTask()); setError(''); };
  const openEdit = (t: Task) => { setEditing(t); setForm({ ...t }); setError(''); };

  const save = () => {
    if (!form.title.trim()) return setError('Please add a task title.');
    if (!form.date) return setError('Please pick a date.');
    if (editing?.id) {
      onChange(tasks.map((t) => (t.id === editing.id ? { ...t, ...form } : t)));
    } else {
      onChange([...tasks, { ...form, id: uid(), done: false }]);
    }
    setEditing(null);
  };

  const toggle = (id: string) => onChange(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => onChange(tasks.filter((t) => t.id !== id));

  const sorted = [...tasks]
    .filter((t) => filter === 'all' || (filter === 'done') === t.done)
    .sort((a, b) => Number(a.done) - Number(b.done) || `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <div>
      {!compact && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex gap-1 rounded-xl bg-white/5 p-1 text-xs">
            {(['all', 'pending', 'done'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 capitalize ${filter === f ? 'bg-heliox-500 text-black' : 'text-neutral-400'}`}>{f}</button>
            ))}
          </div>
          <button onClick={openNew} className="flex items-center gap-1 rounded-xl bg-heliox-500 px-3 py-2 text-sm font-medium text-black hover:bg-heliox-400">
            <Plus size={16} /> New task
          </button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center text-sm text-neutral-400">
          No tasks yet. Add one to start planning your day.
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.slice(0, compact ? 5 : undefined).map((t) => (
            <li key={t.id} className="glass flex items-start gap-3 rounded-xl p-3 animate-fadeUp">
              <button
                onClick={() => toggle(t.id)}
                aria-label={t.done ? 'Mark pending' : 'Mark complete'}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${t.done ? 'border-heliox-500 bg-heliox-500 text-black' : 'border-neutral-600'}`}
              >
                {t.done && <Check size={14} />}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate font-medium ${t.done ? 'line-through text-neutral-500' : ''}`}>{t.title}</p>
                <p className="text-xs text-neutral-500">{t.date} · {t.time}{t.category ? ` · ${t.category}` : ''}</p>
                {!compact && t.description && <p className="mt-1 text-xs text-neutral-400">{t.description}</p>}
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
              {!compact && (
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} aria-label="Edit" className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/5"><Pencil size={15} /></button>
                  <button onClick={() => remove(t.id)} aria-label="Delete" className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/5 hover:text-red-400"><Trash2 size={15} /></button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4" onClick={() => setEditing(null)}>
          <div className="glass w-full max-w-md rounded-2xl bg-neutral-950 p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-semibold">{editing.id ? 'Edit task' : 'New task'}</h3>
            <div className="space-y-3">
              <input className="input" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="input" rows={2} placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <input type="time" className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>
                <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-xl px-4 py-2 text-sm text-neutral-400 hover:bg-white/5">Cancel</button>
              <button onClick={save} className="rounded-xl bg-heliox-500 px-4 py-2 text-sm font-medium text-black hover:bg-heliox-400">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
