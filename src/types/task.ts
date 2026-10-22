export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 'work' | 'personal' | 'study' | 'health' | 'finance' | 'general';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  category: TaskCategory;
  completed: boolean;
  status: TaskStatus;
  subtasks: SubTask[];
  estimatedMinutes?: number; // e.g. 15, 30, 45, 60
  timeSpentMinutes?: number;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export type StatusFilter = 'all' | 'active' | 'completed';

export type SortOption = 
  | 'dueDate-asc' 
  | 'dueDate-desc' 
  | 'priority-desc' 
  | 'priority-asc' 
  | 'createdAt-desc' 
  | 'createdAt-asc' 
  | 'title-asc';

export type ViewSection = 'all' | 'today' | 'upcoming' | 'completed' | 'high-priority';

export type ViewLayout = 'list' | 'board';
