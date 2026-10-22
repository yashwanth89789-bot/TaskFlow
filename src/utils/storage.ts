import { Task } from '../types/task';
import { getTodayDateString, getTomorrowDateString, getNextWeekDateString } from './date';

const STORAGE_KEY = 'taskflow_tasks_v1';

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Finalize Q4 project roadmap & architecture proposal',
    description: 'Review milestones with engineering leads and ensure cross-team dependencies are aligned.',
    priority: 'high',
    dueDate: getTodayDateString(),
    category: 'work',
    completed: false,
    status: 'in_progress',
    estimatedMinutes: 60,
    timeSpentMinutes: 25,
    subtasks: [
      { id: 'sub-1', title: 'Draft core architectural diagram', completed: true },
      { id: 'sub-2', title: 'Sync with lead backend engineer', completed: true },
      { id: 'sub-3', title: 'Consolidate feedback in PR description', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Prepare presentation slides for product review',
    description: 'Focus on user engagement metrics and mobile responsiveness improvements.',
    priority: 'high',
    dueDate: getTomorrowDateString(),
    category: 'work',
    completed: false,
    status: 'todo',
    estimatedMinutes: 45,
    subtasks: [
      { id: 'sub-4', title: 'Export monthly retention metrics', completed: false },
      { id: 'sub-5', title: 'Record 2-min prototype walkthrough video', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Complete morning 30-minute cardio session',
    description: 'Interval training or 5k steady pace run.',
    priority: 'medium',
    dueDate: getTodayDateString(),
    category: 'health',
    completed: true,
    status: 'completed',
    estimatedMinutes: 30,
    timeSpentMinutes: 30,
    subtasks: [
      { id: 'sub-6', title: 'Dynamic stretch & warmup', completed: true },
      { id: 'sub-7', title: '5k run at target HR', completed: true },
      { id: 'sub-8', title: 'Hydration & cool down', completed: true },
    ],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'sample-4',
    title: 'Review weekly budget spreadsheet & cloud invoices',
    description: 'Check subscription renewals and utility bills.',
    priority: 'medium',
    dueDate: getNextWeekDateString(),
    category: 'finance',
    completed: false,
    status: 'todo',
    estimatedMinutes: 30,
    subtasks: [
      { id: 'sub-9', title: 'Download AWS and GCP invoices', completed: false },
      { id: 'sub-10', title: 'Reconcile bank charges against budget', completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'sample-5',
    title: 'Read chapter 4 of Clean Architecture book',
    description: 'Take structured notes on component cohesion and dependency inversion principles.',
    priority: 'low',
    dueDate: getNextWeekDateString(),
    category: 'study',
    completed: false,
    status: 'todo',
    estimatedMinutes: 45,
    subtasks: [],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'sample-6',
    title: 'Renew monthly car insurance policy',
    description: 'Compare provider quotes and confirm payment receipt.',
    priority: 'low',
    category: 'personal',
    completed: true,
    status: 'completed',
    estimatedMinutes: 15,
    subtasks: [],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasksToStorage(INITIAL_SAMPLE_TASKS);
      return INITIAL_SAMPLE_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Migrate existing tasks if missing subtasks or status
      return parsed.map((item) => ({
        ...item,
        status: item.status || (item.completed ? 'completed' : 'todo'),
        subtasks: Array.isArray(item.subtasks) ? item.subtasks : [],
        estimatedMinutes: item.estimatedMinutes || undefined,
        timeSpentMinutes: item.timeSpentMinutes || 0,
      }));
    }
    return INITIAL_SAMPLE_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
    return INITIAL_SAMPLE_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
}

export function resetToSampleTasks(): Task[] {
  saveTasksToStorage(INITIAL_SAMPLE_TASKS);
  return INITIAL_SAMPLE_TASKS;
}
