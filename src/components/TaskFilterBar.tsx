import React from 'react';
import { Search, ArrowUpDown, Filter, X } from 'lucide-react';
import { StatusFilter, SortOption, Priority } from '../types/task';

interface TaskFilterBarProps {
  statusFilter: StatusFilter;
  onChangeStatusFilter: (status: StatusFilter) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  priorityFilter: Priority | 'all';
  onChangePriorityFilter: (priority: Priority | 'all') => void;
  sortBy: SortOption;
  onChangeSortBy: (sort: SortOption) => void;
  totalVisibleCount: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  statusFilter,
  onChangeStatusFilter,
  searchQuery,
  onChangeSearchQuery,
  priorityFilter,
  onChangePriorityFilter,
  sortBy,
  onChangeSortBy,
  totalVisibleCount,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 sm:p-4 space-y-3">
      {/* Top Row: Segmented Status Controls + Search Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filter Tabs (Segmented Control per Frontend Constitution) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => onChangeStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tasks
          </button>
          <button
            type="button"
            onClick={() => onChangeStatusFilter('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'active'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => onChangeStatusFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Real-time Search Box */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder="Search tasks by title or note..."
            className="w-full pl-9 pr-8 py-1.5 text-xs text-slate-900 bg-slate-50/50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onChangeSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Priority Filter, Sorting, and Result Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Filter Dropdown */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => onChangePriorityFilter(e.target.value as Priority | 'all')}
              className="bg-transparent text-slate-800 font-medium py-1 px-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-xs"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as SortOption)}
              className="bg-transparent text-slate-800 font-medium py-1 px-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-xs"
            >
              <option value="dueDate-asc">Due Date (Soonest first)</option>
              <option value="dueDate-desc">Due Date (Latest first)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="createdAt-desc">Date Added (Newest)</option>
              <option value="createdAt-asc">Date Added (Oldest)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Visible count */}
        <div className="text-slate-500 font-mono tabular-nums text-xs">
          Showing <span className="font-semibold text-slate-700">{totalVisibleCount}</span> {totalVisibleCount === 1 ? 'task' : 'tasks'}
        </div>
      </div>
    </div>
  );
};
