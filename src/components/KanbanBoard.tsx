import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Headphones, 
  Edit3, 
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Task, TaskStatus } from '../types/task';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../utils/theme';
import { formatDueDate } from '../utils/date';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
  onStartFocus: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateStatus,
  onEditTask,
  onRequestDelete,
  onStartFocus,
}) => {
  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <Circle className="w-4 h-4 text-slate-400" />,
      color: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      color: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const getTasksForColumn = (status: TaskStatus) => {
    return tasks.filter((t) => {
      if (status === 'completed') return t.completed || t.status === 'completed';
      if (status === 'in_progress') return !t.completed && t.status === 'in_progress';
      return !t.completed && (t.status === 'todo' || !t.status);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const columnTasks = getTasksForColumn(col.id);

        return (
          <div
            key={col.id}
            className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[450px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                {col.icon}
                <span className="text-sm font-bold text-slate-800">{col.title}</span>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200/80 tabular-nums">
                {columnTasks.length}
              </span>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnTasks.map((task) => {
                const priorityInfo = PRIORITY_CONFIG[task.priority];
                const categoryInfo = CATEGORY_CONFIG[task.category];
                const { label: dueLabel, isOverdue, isToday } = formatDueDate(task.dueDate);
                const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

                return (
                  <div
                    key={task.id}
                    className="group bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold leading-tight ${
                          col.id === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={() => onEditTask(task)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                          title="Edit task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRequestDelete(task)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Subtasks Progress */}
                    {task.subtasks.length > 0 && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{
                              width: `${(completedSubtasks / task.subtasks.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="tabular-nums">
                          {completedSubtasks}/{task.subtasks.length}
                        </span>
                      </div>
                    )}

                    {/* Metadata line */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotColor}`} />
                        <span className={priorityInfo.textColor}>{priorityInfo.label}</span>
                      </div>

                      {task.dueDate && (
                        <>
                          <span className="text-slate-300">·</span>
                          <div
                            className={`flex items-center gap-1 font-mono ${
                              col.id === 'completed'
                                ? 'text-slate-400'
                                : isOverdue
                                ? 'text-rose-600 font-semibold'
                                : isToday
                                ? 'text-indigo-600 font-semibold'
                                : 'text-slate-500'
                            }`}
                          >
                            {isOverdue && col.id !== 'completed' ? (
                              <AlertCircle className="w-3 h-3 text-rose-500" />
                            ) : (
                              <Calendar className="w-3 h-3 text-slate-400" />
                            )}
                            <span>{dueLabel}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Bar: Flow Mode & Column Transitions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onStartFocus(task)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                        title="Enter deep focus session for this task"
                      >
                        <Headphones className="w-3.5 h-3.5" />
                        <span>Focus</span>
                      </button>

                      {/* Status move buttons */}
                      <div className="flex items-center gap-1">
                        {col.id !== 'todo' && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateStatus(task.id, col.id === 'completed' ? 'in_progress' : 'todo')
                            }
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Move left"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}
                        {col.id !== 'completed' && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateStatus(task.id, col.id === 'todo' ? 'in_progress' : 'completed')
                            }
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Move right"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {columnTasks.length === 0 && (
                <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  No tasks in {col.title}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
