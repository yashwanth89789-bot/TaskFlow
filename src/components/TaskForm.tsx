import React, { useState, useRef, useMemo } from 'react';
import { Plus, Calendar, AlertCircle, ChevronDown, ChevronUp, Sparkles, Clock, ListPlus, X } from 'lucide-react';
import { Priority, TaskCategory, SubTask } from '../types/task';
import { getTodayDateString, getTomorrowDateString, getNextWeekDateString } from '../utils/date';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../utils/theme';
import { parseNaturalLanguageInput } from '../utils/nlpParser';

interface TaskFormProps {
  onAddTask: (data: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string;
    category: TaskCategory;
    subtasks?: SubTask[];
    estimatedMinutes?: number;
  }) => void;
  defaultCategory?: TaskCategory;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, defaultCategory = 'work' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>(defaultCategory);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Live NLP Parse detection
  const nlpResult = useMemo(() => {
    return parseNaturalLanguageInput(title);
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use NLP parsed values if present
    const finalTitle = nlpResult.cleanTitle.trim();
    const finalPriority = nlpResult.detectedPriority || priority;
    const finalCategory = nlpResult.detectedCategory || category;
    const finalDueDate = nlpResult.detectedDueDate || dueDate || undefined;
    const finalEst = nlpResult.detectedEstimatedMinutes || estimatedMinutes || undefined;

    if (!finalTitle) {
      setErrorMessage('Please enter a task title before adding.');
      titleInputRef.current?.focus();
      return;
    }

    setErrorMessage(null);

    const formattedSubtasks: SubTask[] = subtasks
      .filter((s) => s.trim().length > 0)
      .map((s, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: s.trim(),
        completed: false,
      }));

    onAddTask({
      title: finalTitle,
      description: description.trim() ? description.trim() : undefined,
      priority: finalPriority,
      dueDate: finalDueDate,
      category: finalCategory,
      subtasks: formattedSubtasks,
      estimatedMinutes: finalEst,
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setEstimatedMinutes(undefined);
    setSubtasks([]);
    setNewSubtaskInput('');
    setIsExpanded(false);
  };

  const handleAddSubtaskDraft = () => {
    if (newSubtaskInput.trim()) {
      setSubtasks([...subtasks, newSubtaskInput.trim()]);
      setNewSubtaskInput('');
    }
  };

  const handleRemoveSubtaskDraft = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isExpanded) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const setPresetDate = (presetStr: string) => {
    setDueDate(presetStr);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 transition-all">
      <form onSubmit={handleSubmit} noValidate>
        {/* Main Title Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Add task... (try 'Design prototype tomorrow !high #work ~45m')"
              className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all ${
                errorMessage
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse options' : 'More options'}
            >
              <span>{isExpanded ? 'Fewer options' : 'Options'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Live Smart NLP Detection Banner */}
        {nlpResult.hasDetectedTokens && (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-indigo-50/80 border border-indigo-100 flex flex-wrap items-center gap-2 text-[11px] text-indigo-900 animate-in fade-in duration-100">
            <div className="flex items-center gap-1 font-semibold text-indigo-700">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Smart Parse:</span>
            </div>
            {nlpResult.detectedPriority && (
              <span className="font-medium bg-white px-2 py-0.5 rounded border border-indigo-200">
                Priority: {nlpResult.detectedPriority.toUpperCase()}
              </span>
            )}
            {nlpResult.detectedCategory && (
              <span className="font-medium bg-white px-2 py-0.5 rounded border border-indigo-200">
                #{nlpResult.detectedCategory}
              </span>
            )}
            {nlpResult.detectedDueDate && (
              <span className="font-medium bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono tabular-nums">
                Due: {nlpResult.detectedDueDate}
              </span>
            )}
            {nlpResult.detectedEstimatedMinutes && (
              <span className="font-medium bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono tabular-nums">
                ~{nlpResult.detectedEstimatedMinutes}m
              </span>
            )}
          </div>
        )}

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Expanded Details Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
            {/* Optional Description */}
            <div>
              <label htmlFor="task-desc" className="block text-xs font-medium text-slate-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="task-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add additional context, sub-points, or links..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none transition-all resize-y"
              />
            </div>

            {/* Subtasks Builder */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Subtasks / Action Steps
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtaskDraft();
                    }
                  }}
                  placeholder="Add a checklist step (press Enter)..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtaskDraft}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                >
                  Add Step
                </button>
              </div>

              {subtasks.length > 0 && (
                <div className="space-y-1">
                  {subtasks.map((st, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <span className="truncate">{st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtaskDraft(i)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority, Category, Time & Due Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPriority('low')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      priority === 'low'
                        ? 'bg-white text-slate-800 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Low
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('medium')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      priority === 'medium'
                        ? 'bg-white text-amber-800 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('high')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      priority === 'high'
                        ? 'bg-white text-rose-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    High
                  </button>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label htmlFor="task-cat" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  id="task-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none cursor-pointer"
                >
                  {(Object.keys(CATEGORY_CONFIG) as TaskCategory[]).map((catKey) => (
                    <option key={catKey} value={catKey}>
                      {CATEGORY_CONFIG[catKey].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Estimate Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="task-est" className="block text-xs font-medium text-slate-700">
                    Est. Duration
                  </label>
                  {estimatedMinutes && (
                    <button
                      type="button"
                      onClick={() => setEstimatedMinutes(undefined)}
                      className="text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <select
                  id="task-est"
                  value={estimatedMinutes || ''}
                  onChange={(e) => setEstimatedMinutes(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none cursor-pointer"
                >
                  <option value="">No estimate</option>
                  <option value="15">15 minutes (Quick)</option>
                  <option value="25">25 minutes (Pomodoro)</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours (Deep block)</option>
                </select>
              </div>

              {/* Due Date & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="task-due" className="block text-xs font-medium text-slate-700">
                    Due Date
                  </label>
                  {dueDate && (
                    <button
                      type="button"
                      onClick={() => setDueDate('')}
                      className="text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      id="task-due"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none cursor-pointer"
                    />
                  </div>
                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPresetDate(getTodayDateString())}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDate(getTomorrowDateString())}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetDate(getNextWeekDateString())}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Next Week
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
