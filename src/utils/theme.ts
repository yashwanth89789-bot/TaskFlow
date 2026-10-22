import { Priority, TaskCategory } from '../types/task';

export const PRIORITY_CONFIG: Record<
  Priority,
  {
    label: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
    dotColor: string;
  }
> = {
  high: {
    label: 'High Priority',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    dotColor: 'bg-rose-500',
  },
  medium: {
    label: 'Medium Priority',
    textColor: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  low: {
    label: 'Low Priority',
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    dotColor: 'bg-slate-400',
  },
};

export const CATEGORY_CONFIG: Record<
  TaskCategory,
  {
    label: string;
    color: string;
  }
> = {
  work: { label: 'Work', color: 'text-indigo-600' },
  personal: { label: 'Personal', color: 'text-teal-600' },
  health: { label: 'Health & Fitness', color: 'text-emerald-600' },
  study: { label: 'Study & Learning', color: 'text-purple-600' },
  finance: { label: 'Finance', color: 'text-sky-600' },
  general: { label: 'General', color: 'text-slate-600' },
};
