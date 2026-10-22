import React from 'react';
import { CheckSquare, Plus, Menu, X, Calendar, Search, LayoutGrid, List, Sparkles } from 'lucide-react';
import { ViewSection, ViewLayout } from '../types/task';

interface HeaderProps {
  currentView: ViewSection;
  onSelectView: (view: ViewSection) => void;
  onOpenNewTask: () => void;
  onOpenCommandPalette: () => void;
  onOpenShowcase: () => void;
  viewLayout: ViewLayout;
  onToggleLayout: (layout: ViewLayout) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenNewTask,
  onOpenCommandPalette,
  onOpenShowcase,
  viewLayout,
  onToggleLayout,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Wordmark & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <CheckSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                TaskFlow
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectView('all')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                currentView === 'all' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => onSelectView('today')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                currentView === 'today' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
              }`}
            >
              Today's Focus
            </button>
            <button
              onClick={() => onSelectView('upcoming')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                currentView === 'upcoming' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => onSelectView('completed')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                currentView === 'completed' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : ''
              }`}
            >
              Completed
            </button>
          </nav>

          {/* Zone 3: Command Palette shortcut + Layout Switcher + Showcase + Primary Add Task */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Interactive Showcase Tour Button */}
            <button
              type="button"
              onClick={onOpenShowcase}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
              title="Interactive Feature Showcase & Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Showcase</span>
            </button>

            {/* Quick Command Palette Button */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Search and run commands (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Commands</span>
              <kbd className="text-[10px] font-mono font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* List vs Board Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => onToggleLayout('list')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewLayout === 'list'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onToggleLayout('board')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewLayout === 'board'
                    ? 'bg-white text-indigo-600 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Kanban Board View"
                aria-label="Kanban Board View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
