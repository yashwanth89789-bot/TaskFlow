import React from 'react';
import { CheckCircle2, Search, ListPlus, RotateCcw, FilterX } from 'lucide-react';
import { StatusFilter, ViewSection } from '../types/task';

interface EmptyStateProps {
  statusFilter: StatusFilter;
  currentView: ViewSection;
  hasSearchQuery: boolean;
  hasFilters: boolean;
  totalTaskCount: number;
  onClearFilters: () => void;
  onAddTaskClick: () => void;
  onResetSampleTasks: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  statusFilter,
  currentView,
  hasSearchQuery,
  hasFilters,
  totalTaskCount,
  onClearFilters,
  onAddTaskClick,
  onResetSampleTasks,
}) => {
  // Scenario 1: Total tasks is 0
  if (totalTaskCount === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 sm:p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <ListPlus className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Your task list is empty</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          Start planning your day by adding your first task above, or restore the default sample tasks to explore.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAddTaskClick}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={onResetSampleTasks}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Load Sample Tasks</span>
          </button>
        </div>
      </div>
    );
  }

  // Scenario 2: Search filter returned 0 results
  if (hasSearchQuery) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No matching tasks found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          We couldn't find any tasks matching your keywords. Check for typos or reset your search.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            <FilterX className="w-4 h-4" />
            <span>Clear Search & Filters</span>
          </button>
        </div>
      </div>
    );
  }

  // Scenario 3: Completed filter is active, but none completed
  if (statusFilter === 'completed' || currentView === 'completed') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No completed tasks yet</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          When you finish tasks, check them off to celebrate your daily progress here!
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            View Active Tasks
          </button>
        </div>
      </div>
    );
  }

  // Scenario 4: Active filter is active, and all are completed!
  if (statusFilter === 'active') {
    return (
      <div className="bg-white rounded-xl border border-emerald-200 bg-emerald-50/30 p-8 sm:p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h3 className="text-base font-bold text-emerald-900">All caught up!</h3>
        <p className="mt-1 text-sm text-emerald-700/80 max-w-sm mx-auto">
          You've completed every active task on your list. Enjoy your day or add something new to tackle next.
        </p>
        <div className="mt-5">
          <button
            type="button"
            onClick={onAddTaskClick}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Add Another Task
          </button>
        </div>
      </div>
    );
  }

  // Scenario 5: Filter combination empty (e.g. specific category or priority has no tasks)
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <FilterX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">No tasks in this category or view</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        There are currently no tasks matching the selected filters.
      </p>
      {hasFilters && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
