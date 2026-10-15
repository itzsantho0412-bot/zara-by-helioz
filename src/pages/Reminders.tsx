import type { Reminder } from '../types';
import ReminderList from '../components/ReminderList';

export default function Reminders({ reminders, onChange }: { reminders: Reminder[]; onChange: (r: Reminder[]) => void }) {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Reminders</h1>
        <p className="text-sm text-neutral-500">Alerts fire while HELIOZ is open in your browser.</p>
      </header>
      <ReminderList reminders={reminders} onChange={onChange} />
    </div>
  );
}
