import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle, 
  Tag,
  Headphones,
  ChevronDown,
  ChevronUp,
  Clock,
  ListTodo
} from 'lucide-react';
import { Task } from '../types/task';
import { formatDueDate } from '../utils/date';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../utils/theme';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onRequestDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onStartFocus: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onRequestDelete,
  onEdit,
  onStartFocus,
  onToggleSubtask,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const priorityInfo = PRIORITY_CONFIG[task.priority];
  const categoryInfo = CATEGORY_CONFIG[task.category];
  const { label: dueDateLabel, isOverdue, isToday, isTomorrow } = formatDueDate(task.dueDate);

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 p-4 sm:p-5 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 shadow-none'
          : 'border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Custom Accessible Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={task.completed}
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            task.completed
              ? 'bg-emerald-600 border-emerald-600 text-white focus:ring-emerald-500'
              : 'border-slate-300 hover:border-indigo-600 bg-white focus:ring-indigo-500'
          }`}
          title={task.completed ? 'Mark task as active' : 'Mark task as complete'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              onClick={() => onToggleComplete(task.id)}
              className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer select-none transition-colors ${
                task.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-900 hover:text-indigo-600'
              }`}
            >
              {task.title}
            </h3>

            {/* Action buttons (Focus, Edit & Delete) */}
            <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              {!task.completed && (
                <button
                  type="button"
                  onClick={() => onStartFocus(task)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                  title="Enter Flow Mode (Deep Focus & Ambient Audio)"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Focus</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                title="Edit task"
                aria-label={`Edit task ${task.title}`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onRequestDelete(task)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                title="Delete task"
                aria-label={`Delete task ${task.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Description */}
          {task.description && (
            <p
              className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Subtasks summary toggle (if task has subtasks) */}
          {task.subtasks.length > 0 && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <ListTodo className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono tabular-nums">
                  {completedSubtasksCount} of {task.subtasks.length} steps completed
                </span>
                {showSubtasks ? (
                  <ChevronUp className="w-3 h-3 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                )}
              </button>

              {/* Subtasks dropdown checklist */}
              {showSubtasks && (
                <div className="mt-2 pl-2 space-y-1.5 border-l-2 border-slate-200">
                  {task.subtasks.map((st) => (
                    <label
                      key={st.id}
                      className="flex items-center gap-2 text-xs cursor-pointer select-none py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => onToggleSubtask(task.id, st.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span
                        className={`truncate ${
                          st.completed ? 'line-through text-slate-400' : 'text-slate-700'
                        }`}
                      >
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Unboxed Metadata (Zero-Pill Discipline with Typographic Separators) */}
          <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs">
            {/* Priority Indicator */}
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${priorityInfo.dotColor}`} />
              <span className={`font-medium ${task.completed ? 'text-slate-400' : priorityInfo.textColor}`}>
                {priorityInfo.label}
              </span>
            </div>

            <span className="text-slate-300" aria-hidden="true">·</span>

            {/* Category */}
            <div className="flex items-center gap-1 text-slate-500">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{categoryInfo.label}</span>
            </div>

            {/* Estimated Duration */}
            {task.estimatedMinutes && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px] tabular-nums">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>~{task.estimatedMinutes}m</span>
                </div>
              </>
            )}

            {/* Due Date (if present) */}
            {task.dueDate && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <div
                  className={`flex items-center gap-1 font-mono text-[11px] tabular-nums ${
                    task.completed
                      ? 'text-slate-400'
                      : isOverdue
                      ? 'text-rose-600 font-semibold'
                      : isToday
                      ? 'text-indigo-600 font-semibold'
                      : isTomorrow
                      ? 'text-amber-700'
                      : 'text-slate-500'
                  }`}
                >
                  {isOverdue && !task.completed ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{dueDateLabel}</span>
                </div>
              </>
            )}

            {/* Completed timestamp indicator */}
            {task.completed && task.completedAt && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="text-emerald-700 font-mono text-[11px] tabular-nums">
                  Done
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
