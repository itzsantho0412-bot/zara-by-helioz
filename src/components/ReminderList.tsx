import { useState } from 'react';
import { Plus, Trash2, Bell } from 'lucide-react';
import type { Reminder } from '../types';
import { uid, todayISO } from '../services/storage';
import { requestNotificationPermission } from '../services/reminderService';

export default function ReminderList({ reminders, onChange }: { reminders: Reminder[]; onChange: (r: Reminder[]) => void }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState('18:00');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const add = async () => {
    if (!title.trim()) return setError('Add a reminder title.');
    if (!date || !time) return setError('Pick a date and time.');
    onChange([...reminders, { id: uid(), title: title.trim(), date, time, done: false }]);
    setTitle('');
    setError('');
    const perm = await requestNotificationPermission();
    setNotice(perm === 'granted' ? 'Browser alerts are on while this tab is open.' : perm === 'unsupported' ? 'This browser does not support notifications.' : 'Allow notifications to get alerts while the tab is open.');
  };

  const sorted = [...reminders].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 space-y-3">
        <input className="input" placeholder="Reminder (e.g. Call client Siva)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {notice && <p className="text-xs text-neutral-400">{notice}</p>}
        <button onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl bg-heliox-500 py-2.5 text-sm font-medium text-black hover:bg-heliox-400"><Plus size={16} /> Add reminder</button>
      </div>

      {sorted.length === 0 ? (
        <p className="glass rounded-2xl p-6 text-center text-sm text-neutral-400">No reminders scheduled.</p>
      ) : sorted.map((r) => (
        <div key={r.id} className="glass flex items-center gap-3 rounded-xl p-3 animate-fadeUp">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-heliox-500/15 text-heliox-400"><Bell size={16} /></div>
          <div className="min-w-0 flex-1">
            <p className={`truncate font-medium ${r.done ? 'line-through text-neutral-500' : ''}`}>{r.title}</p>
            <p className="text-xs text-neutral-500">{r.date} · {r.time}</p>
          </div>
          <button onClick={() => onChange(reminders.map((x) => (x.id === r.id ? { ...x, done: !x.done } : x)))} className="rounded-lg px-2 py-1 text-xs text-neutral-400 hover:bg-white/5">
            {r.done ? 'Undo' : 'Done'}
          </button>
          <button onClick={() => onChange(reminders.filter((x) => x.id !== r.id))} aria-label="Delete" className="rounded-lg p-1.5 text-neutral-400 hover:text-red-400"><Trash2 size={15} /></button>
        </div>
      ))}
    </div>
  );
}
