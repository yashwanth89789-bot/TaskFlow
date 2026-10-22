import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { Task } from '../types/task';
import { formatDueDate } from '../utils/date';

interface StatsOverviewProps {
  tasks: Task[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ tasks }) => {
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  
  // Count overdue tasks (tasks with due date in the past that are not completed)
  const overdueCount = tasks.filter((t) => {
    if (t.completed || !t.dueDate) return false;
    const { isOverdue } = formatDueDate(t.dueDate);
    return isOverdue;
  }).length;

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3.5 transition-all hover:border-slate-300">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Total Tasks</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {totalCount}
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3.5 transition-all hover:border-slate-300">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Active Tasks</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {activeCount}
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3.5 transition-all hover:border-slate-300">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Completed</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {completedCount}
            </div>
          </div>
        </div>

        {/* Overdue / High Attention */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex items-center gap-3.5 transition-all hover:border-slate-300">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            overdueCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              {overdueCount > 0 ? 'Overdue Tasks' : 'Overdue'}
            </div>
            <div className={`text-2xl font-bold font-mono tabular-nums ${
              overdueCount > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {overdueCount}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-slate-800">
            Completion Progress
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {completedCount} of {totalCount} completed
            </span>
            <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 tabular-nums">
              {percentage}%
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
