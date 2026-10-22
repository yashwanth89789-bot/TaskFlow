import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  LayoutGrid, 
  List, 
  Download, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { Task, ViewSection, ViewLayout } from '../types/task';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectView: (view: ViewSection) => void;
  onOpenNewTask: () => void;
  onToggleLayout: (layout: ViewLayout) => void;
  currentLayout: ViewLayout;
  onStartFocus: (task: Task) => void;
  onOpenDataModal: () => void;
  onResetSampleData: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelectView,
  onOpenNewTask,
  onToggleLayout,
  currentLayout,
  onStartFocus,
  onOpenDataModal,
  onResetSampleData,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Static commands
  const defaultActions = [
    {
      id: 'cmd-new',
      label: 'Create New Task',
      sublabel: 'Add a task with priority and due date',
      icon: <Plus className="w-4 h-4 text-indigo-600" />,
      run: () => {
        onClose();
        onOpenNewTask();
      },
    },
    {
      id: 'cmd-toggle-view',
      label: currentLayout === 'list' ? 'Switch to Kanban Board View' : 'Switch to List View',
      sublabel: currentLayout === 'list' ? 'View tasks in status columns' : 'View tasks as structured list',
      icon: currentLayout === 'list' ? <LayoutGrid className="w-4 h-4 text-purple-600" /> : <List className="w-4 h-4 text-purple-600" />,
      run: () => {
        onClose();
        onToggleLayout(currentLayout === 'list' ? 'board' : 'list');
      },
    },
    {
      id: 'cmd-today',
      label: "Go to Today's Focus",
      sublabel: 'View tasks due today',
      icon: <Calendar className="w-4 h-4 text-indigo-500" />,
      run: () => {
        onClose();
        onSelectView('today');
      },
    },
    {
      id: 'cmd-high',
      label: 'Go to High Priority Tasks',
      sublabel: 'View critical objectives',
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      run: () => {
        onClose();
        onSelectView('high-priority');
      },
    },
    {
      id: 'cmd-export',
      label: 'Export or Import Task Data',
      sublabel: 'Backup or restore JSON and CSV files',
      icon: <Download className="w-4 h-4 text-teal-600" />,
      run: () => {
        onClose();
        onOpenDataModal();
      },
    },
    {
      id: 'cmd-sample',
      label: 'Restore Sample Tasks',
      sublabel: 'Reset tasks to default template',
      icon: <RotateCcw className="w-4 h-4 text-slate-500" />,
      run: () => {
        onClose();
        onResetSampleData();
      },
    },
  ];

  // Filter tasks based on query
  const q = query.toLowerCase().trim();
  const matchedTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
    : [];

  const matchedActions = q
    ? defaultActions.filter((a) => a.label.toLowerCase().includes(q) || a.sublabel.toLowerCase().includes(q))
    : defaultActions;

  // Flattened list for keyboard up/down navigation
  const allItems = [
    ...matchedActions.map((a) => ({ type: 'action' as const, data: a })),
    ...matchedTasks.slice(0, 6).map((t) => ({ type: 'task' as const, data: t })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (allItems.length || 1)) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        if (current.type === 'action') {
          current.data.run();
        } else {
          onClose();
          onStartFocus(current.data);
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-start justify-center pt-16 sm:pt-24 p-4">
        <div 
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150"
          onKeyDown={handleKeyDown}
        >
          {/* Search Input Bar */}
          <div className="relative border-b border-slate-200 flex items-center px-4">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search tasks... (Press Esc to exit)"
              className="w-full px-3 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <kbd className="hidden sm:inline-block text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            {/* Actions Section */}
            {matchedActions.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Actions
                </div>
                <div className="space-y-0.5">
                  {matchedActions.map((action, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={action.run}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50 text-indigo-900' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-100 shrink-0">
                            {action.icon}
                          </div>
                          <div>
                            <div className="text-xs font-semibold">{action.label}</div>
                            <div className="text-[11px] text-slate-400">{action.sublabel}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tasks Section */}
            {matchedTasks.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Tasks (Press Enter to launch Flow Mode)
                </div>
                <div className="space-y-0.5">
                  {matchedTasks.slice(0, 6).map((task, idx) => {
                    const itemIndex = matchedActions.length + idx;
                    const isSelected = selectedIndex === itemIndex;
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          onStartFocus(task);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50 text-indigo-900' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Headphones className="w-4 h-4 text-indigo-500 shrink-0" />
                          <div className="truncate">
                            <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {task.title}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-indigo-600 font-medium shrink-0">
                          Focus
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {allItems.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No commands or tasks found matching "{query}"
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Use ↑ ↓ to navigate, Enter to select</span>
            <span>TaskFlow Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};
