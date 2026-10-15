import type { Task } from '../types';
import TaskList from '../components/TaskList';

export default function Tasks({ tasks, onChange }: { tasks: Task[]; onChange: (t: Task[]) => void }) {
  const done = tasks.filter((t) => t.done).length;
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-neutral-500">{done} of {tasks.length} completed</p>
      </header>
      <TaskList tasks={tasks} onChange={onChange} />
    </div>
  );
}
