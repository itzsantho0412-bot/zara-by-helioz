import type { Task, Habit } from '../types';
import { todayISO } from './storage';

export const taskSummary = (tasks: Task[], date = todayISO()) => {
  const today = tasks.filter((t) => t.date === date);
  return { total: today.length, done: today.filter((t) => t.done).length };
};

export const habitStreak = (habit: Habit, today = todayISO()) => {
  const set = new Set(habit.doneDates);
  let streak = 0;
  const d = new Date(today);
  while (set.has(todayISO(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

export const habitRate = (habit: Habit, days = 7) => {
  let hits = 0;
  const set = new Set(habit.doneDates);
  const d = new Date();
  for (let i = 0; i < days; i++) {
    if (set.has(todayISO(d))) hits++;
    d.setDate(d.getDate() - 1);
  }
  return Math.round((hits / days) * 100);
};

export const contextSummary = (tasks: Task[], habits: Habit[], goals: string[]) => {
  const today = todayISO();
  const todays = tasks.filter((t) => t.date === today);
  return [
    `Date: ${today}`,
    `Today's tasks: ${todays.map((t) => `${t.title} (${t.done ? 'done' : 'pending'}, ${t.priority})`).join('; ') || 'none'}`,
    `Habits done today: ${habits.filter((h) => h.doneDates.includes(today)).map((h) => h.name).join(', ') || 'none'}`,
    `Goals: ${goals.join('; ') || 'none'}`,
  ].join('\n');
};
