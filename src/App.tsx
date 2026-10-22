import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  Sidebar 
} from './components/Sidebar';
import { 
  StatsOverview 
} from './components/StatsOverview';
import { 
  TaskForm 
} from './components/TaskForm';
import { 
  TaskCard 
} from './components/TaskCard';
import { 
  TaskFilterBar 
} from './components/TaskFilterBar';
import { 
  TaskEditModal 
} from './components/TaskEditModal';
import { 
  ConfirmDeleteModal 
} from './components/ConfirmDeleteModal';
import { 
  EmptyState 
} from './components/EmptyState';
import { 
  FocusModeModal 
} from './components/FocusModeModal';
import { 
  CommandPalette 
} from './components/CommandPalette';
import { 
  KanbanBoard 
} from './components/KanbanBoard';
import { 
  DataManagementModal 
} from './components/DataManagementModal';
import { 
  ShowcaseModal 
} from './components/ShowcaseModal';
import { 
  Task, 
  Priority, 
  TaskCategory, 
  StatusFilter, 
  SortOption, 
  ViewSection,
  ViewLayout,
  TaskStatus,
  SubTask
} from './types/task';
import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  resetToSampleTasks 
} from './utils/storage';
import { 
  getTodayDateString 
} from './utils/date';
import { Trash2, Sparkles, LayoutGrid, List } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [currentView, setCurrentView] = useState<ViewSection>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt-desc');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('list');

  // Innovative Modals & Modes
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [confirmClearCompleted, setConfirmClearCompleted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [showcaseOpen, setShowcaseOpen] = useState(false);

  // Micro-feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync to local storage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Global keyboard shortcut listener (⌘K / Ctrl+K and ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShowcaseOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for task mutations
  const handleAddTask = (data: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string;
    category: TaskCategory;
    subtasks?: SubTask[];
    estimatedMinutes?: number;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      category: data.category,
      completed: false,
      status: 'todo',
      subtasks: data.subtasks || [],
      estimatedMinutes: data.estimatedMinutes,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task created.`);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'completed' : 'todo',
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );

    const target = tasks.find((t) => t.id === taskId);
    if (target) {
      if (!target.completed) {
        showToast('Task marked as completed!');
      } else {
        showToast('Task marked as active.');
      }
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const updatedSubtasks = task.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return {
          ...task,
          subtasks: updatedSubtasks,
        };
      })
    );
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = newStatus === 'completed';
          return {
            ...t,
            status: newStatus,
            completed: isDone,
            completedAt: isDone ? t.completedAt || new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleSaveEditedTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    showToast('Task updated successfully.');
  };

  const handleConfirmDelete = () => {
    if (!deletingTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
    showToast(`Task deleted.`);
    setDeletingTask(null);
  };

  const handleClearCompleted = () => {
    const countCompleted = tasks.filter((t) => t.completed).length;
    setTasks((prev) => prev.filter((t) => !t.completed));
    setConfirmClearCompleted(false);
    showToast(`Cleared ${countCompleted} completed ${countCompleted === 1 ? 'task' : 'tasks'}.`);
  };

  const handleResetSampleData = () => {
    const reset = resetToSampleTasks();
    setTasks(reset);
    setCurrentView('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedCategory('all');
    setSearchQuery('');
    showToast('Sample tasks restored.');
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks);
    showToast(`Imported ${importedTasks.length} tasks.`);
  };

  // Filter & Sort Pipeline
  const filteredAndSortedTasks = useMemo(() => {
    const todayStr = getTodayDateString();

    return tasks
      .filter((task) => {
        // 1. Current View Filter
        if (currentView === 'today') {
          if (task.dueDate !== todayStr) return false;
        } else if (currentView === 'upcoming') {
          if (!task.dueDate || task.dueDate <= todayStr) return false;
        } else if (currentView === 'high-priority') {
          if (task.priority !== 'high') return false;
        } else if (currentView === 'completed') {
          if (!task.completed) return false;
        }

        // 2. Status Filter
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // 3. Priority Filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // 4. Category Filter
        if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

        // 5. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description ? task.description.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'dueDate-asc': {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
          }
          case 'dueDate-desc': {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return b.dueDate.localeCompare(a.dueDate);
          }
          case 'priority-desc': {
            const weights: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
            return weights[b.priority] - weights[a.priority];
          }
          case 'priority-asc': {
            const weights: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
            return weights[a.priority] - weights[b.priority];
          }
          case 'createdAt-desc': {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          case 'createdAt-asc': {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          case 'title-asc': {
            return a.title.localeCompare(b.title);
          }
          default:
            return 0;
        }
      });
  }, [tasks, currentView, statusFilter, priorityFilter, selectedCategory, searchQuery, sortBy]);

  // View titles & metadata
  const viewMeta = useMemo(() => {
    switch (currentView) {
      case 'today':
        return {
          title: "Today's Focus",
          subtitle: "Prioritize what matters most for today and maintain deep flow.",
        };
      case 'upcoming':
        return {
          title: 'Upcoming Tasks',
          subtitle: 'Stay ahead of deadlines and upcoming commitments.',
        };
      case 'high-priority':
        return {
          title: 'High Priority Tasks',
          subtitle: 'Urgent and mission-critical objectives requiring attention.',
        };
      case 'completed':
        return {
          title: 'Completed Tasks',
          subtitle: 'Review accomplishments and track your productivity log.',
        };
      case 'all':
      default:
        return {
          title: 'My Tasks',
          subtitle: 'Organize daily workflows, track priorities, and stay in flow.',
        };
    }
  }, [currentView]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const hasActiveFilters = 
    statusFilter !== 'all' || 
    priorityFilter !== 'all' || 
    selectedCategory !== 'all' || 
    Boolean(searchQuery.trim());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Bar Contract */}
      <Header
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setSelectedCategory('all');
        }}
        onOpenNewTask={() => {
          const formInput = document.querySelector('input[placeholder*="Add task"]') as HTMLInputElement | null;
          formInput?.focus();
          formInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenShowcase={() => setShowcaseOpen(true)}
        viewLayout={viewLayout}
        onToggleLayout={setViewLayout}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Workspace Canvas: Sidebar + Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (cat !== 'all') {
              setCurrentView('all');
            }
          }}
          tasks={tasks}
          onResetSampleData={handleResetSampleData}
          onOpenDataModal={() => setDataModalOpen(true)}
          onOpenShowcase={() => setShowcaseOpen(true)}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 py-6 px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header Title & Subtitle + View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {viewMeta.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {viewMeta.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Layout Switcher buttons on tablet/mobile */}
              <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewLayout('list')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewLayout === 'list'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewLayout('board')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    viewLayout === 'board'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Board</span>
                </button>
              </div>

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmClearCompleted(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                  title="Remove all completed tasks from storage"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Completed ({completedCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Dashboard Summary Cards & Progress Tracking */}
          <StatsOverview tasks={tasks} />

          {/* Prominent Task Input Area with Smart NLP */}
          <section aria-labelledby="add-task-heading">
            <h2 id="add-task-heading" className="sr-only">Add New Task</h2>
            <TaskForm 
              onAddTask={handleAddTask} 
              defaultCategory={selectedCategory !== 'all' ? selectedCategory : 'work'} 
            />
          </section>

          {/* Filter & Sort Controls */}
          <section aria-labelledby="task-filters-heading">
            <h2 id="task-filters-heading" className="sr-only">Filter & Sort Tasks</h2>
            <TaskFilterBar
              statusFilter={statusFilter}
              onChangeStatusFilter={setStatusFilter}
              searchQuery={searchQuery}
              onChangeSearchQuery={setSearchQuery}
              priorityFilter={priorityFilter}
              onChangePriorityFilter={setPriorityFilter}
              sortBy={sortBy}
              onChangeSortBy={setSortBy}
              totalVisibleCount={filteredAndSortedTasks.length}
            />
          </section>

          {/* View Container: List or Kanban Board */}
          <section aria-labelledby="task-view-heading">
            <h2 id="task-view-heading" className="sr-only">Tasks View</h2>

            {filteredAndSortedTasks.length > 0 ? (
              viewLayout === 'list' ? (
                <div className="space-y-2.5">
                  {filteredAndSortedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onRequestDelete={setDeletingTask}
                      onEdit={setEditingTask}
                      onStartFocus={setFocusTask}
                      onToggleSubtask={handleToggleSubtask}
                    />
                  ))}
                </div>
              ) : (
                <KanbanBoard
                  tasks={filteredAndSortedTasks}
                  onUpdateStatus={handleUpdateStatus}
                  onEditTask={setEditingTask}
                  onRequestDelete={setDeletingTask}
                  onStartFocus={setFocusTask}
                />
              )
            ) : (
              <EmptyState
                statusFilter={statusFilter}
                currentView={currentView}
                hasSearchQuery={Boolean(searchQuery.trim())}
                hasFilters={hasActiveFilters}
                totalTaskCount={tasks.length}
                onClearFilters={handleClearFilters}
                onAddTaskClick={() => {
                  const formInput = document.querySelector('input[placeholder*="Add task"]') as HTMLInputElement | null;
                  formInput?.focus();
                  formInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                onResetSampleTasks={handleResetSampleData}
              />
            )}
          </section>
        </main>
      </div>

      {/* Edit Task Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
      />

      {/* Flow Mode Deep Focus Modal */}
      <FocusModeModal
        task={focusTask}
        isOpen={Boolean(focusTask)}
        onClose={() => setFocusTask(null)}
        onCompleteTask={handleToggleComplete}
        onToggleSubtask={handleToggleSubtask}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        tasks={tasks}
        onSelectView={setCurrentView}
        onOpenNewTask={() => {
          const formInput = document.querySelector('input[placeholder*="Add task"]') as HTMLInputElement | null;
          formInput?.focus();
          formInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        onToggleLayout={setViewLayout}
        currentLayout={viewLayout}
        onStartFocus={setFocusTask}
        onOpenDataModal={() => setDataModalOpen(true)}
        onResetSampleData={handleResetSampleData}
      />

      {/* Data Management (Export & Import) Modal */}
      <DataManagementModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        tasks={tasks}
        onImportTasks={handleImportTasks}
      />

      {/* Interactive Showcase Tour Modal */}
      <ShowcaseModal
        isOpen={showcaseOpen}
        onClose={() => setShowcaseOpen(false)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleLayout={setViewLayout}
      />

      {/* Confirm Delete Single Task Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingTask)}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        itemTitle={deletingTask?.title}
        confirmLabel="Delete Permanently"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Confirm Batch Clear Completed Modal */}
      <ConfirmDeleteModal
        isOpen={confirmClearCompleted}
        title="Clear All Completed Tasks"
        message={`Are you sure you want to permanently delete all ${completedCount} completed task(s)? This will clean up your archive.`}
        confirmLabel={`Clear ${completedCount} Tasks`}
        onConfirm={handleClearCompleted}
        onCancel={() => setConfirmClearCompleted(false)}
      />

      {/* Toast Micro-Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
