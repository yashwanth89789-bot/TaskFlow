import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Layers, 
  Tag, 
  RotateCcw,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { ViewSection, TaskCategory, Task } from '../types/task';
import { CATEGORY_CONFIG } from '../utils/theme';
import { getTodayDateString } from '../utils/date';

interface SidebarProps {
  currentView: ViewSection;
  onSelectView: (view: ViewSection) => void;
  selectedCategory: TaskCategory | 'all';
  onSelectCategory: (category: TaskCategory | 'all') => void;
  tasks: Task[];
  onResetSampleData: () => void;
  onOpenDataModal: () => void;
  onOpenShowcase: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  selectedCategory,
  onSelectCategory,
  tasks,
  onResetSampleData,
  onOpenDataModal,
  onOpenShowcase,
  isOpenMobile,
  onCloseMobile,
}) => {
  const todayStr = getTodayDateString();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr).length;
  const upcomingTasks = tasks.filter((t) => t.dueDate && t.dueDate > todayStr).length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  // Calculate planned minutes for active tasks today
  const plannedMinutesToday = tasks
    .filter((t) => t.dueDate === todayStr && !t.completed && t.estimatedMinutes)
    .reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  const getCategoryCount = (cat: TaskCategory) => {
    return tasks.filter((t) => t.category === cat).length;
  };

  const navItems: { id: ViewSection; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: <Layers className="w-4 h-4 text-slate-500" />,
      count: totalTasks,
    },
    {
      id: 'today',
      label: "Today's Focus",
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      count: todayTasks,
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: <Calendar className="w-4 h-4 text-sky-500" />,
      count: upcomingTasks,
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      count: highPriorityTasks,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      count: completedTasks,
    },
  ];

  const categories: TaskCategory[] = ['work', 'personal', 'health', 'study', 'finance', 'general'];

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Overview label */}
      <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase px-2 mb-2">
        Views
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id && selectedCategory === 'all';
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id);
                onSelectCategory('all');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="truncate">{item.label}</span>
              </div>
              <span
                className={`text-xs font-mono tabular-nums px-2 py-0.5 rounded ${
                  isActive ? 'bg-indigo-100 text-indigo-800' : 'text-slate-500 bg-slate-100'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Categories Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Categories
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1">
          {categories.map((catKey) => {
            const config = CATEGORY_CONFIG[catKey];
            const isSelected = selectedCategory === catKey;
            const count = getCategoryCount(catKey);

            return (
              <button
                key={catKey}
                onClick={() => {
                  onSelectCategory(catKey);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-200/70 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Tag className={`w-3.5 h-3.5 ${config.color}`} />
                  <span className="truncate">{config.label}</span>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Progress Card */}
      <div className="mt-auto pt-6">
        <div className="bg-slate-100/70 rounded-xl p-4 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Momentum</span>
            </div>
            <span className="text-xs font-bold font-mono text-indigo-600 tabular-nums">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono tabular-nums">
            <span>{completedTasks} completed</span>
            <span>{activeTasks} left</span>
          </div>

          {plannedMinutesToday > 0 && (
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-indigo-900 font-medium">
              <span>Today's Workload</span>
              <span className="font-mono tabular-nums">
                {Math.floor(plannedMinutesToday / 60) > 0 ? `${Math.floor(plannedMinutesToday / 60)}h ` : ''}
                {plannedMinutesToday % 60 > 0 ? `${plannedMinutesToday % 60}m` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => {
              onOpenShowcase();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Showcase</span>
          </button>

          <button
            type="button"
            onClick={onOpenDataModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <span>Backup & Export Data</span>
          </button>

          <button
            type="button"
            onClick={onResetSampleData}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Restore sample tasks for testing and demonstration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Container */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-slate-900">TaskFlow</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
