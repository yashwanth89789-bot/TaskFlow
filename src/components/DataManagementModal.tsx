import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task } from '../types/task';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onImportTasks: (imported: Task[]) => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImportTasks,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['id', 'title', 'description', 'priority', 'category', 'status', 'completed', 'dueDate', 'createdAt'];
    const rows = tasks.map((t) => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.priority,
      t.category,
      t.status,
      t.completed ? 'true' : 'false',
      t.dueDate || '',
      t.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          const validated: Task[] = parsed.map((item, index) => ({
            id: item.id || `imported-${Date.now()}-${index}`,
            title: item.title || 'Untitled Task',
            description: item.description || undefined,
            priority: item.priority === 'high' || item.priority === 'low' ? item.priority : 'medium',
            category: item.category || 'general',
            completed: Boolean(item.completed),
            status: item.status || (item.completed ? 'completed' : 'todo'),
            subtasks: Array.isArray(item.subtasks) ? item.subtasks : [],
            dueDate: item.dueDate || undefined,
            estimatedMinutes: item.estimatedMinutes || undefined,
            createdAt: item.createdAt || new Date().toISOString(),
          }));

          onImportTasks(validated);
          setIsError(false);
          setImportStatus(`Successfully imported ${validated.length} tasks!`);
          setTimeout(() => {
            onClose();
            setImportStatus(null);
          }, 1500);
        } else {
          throw new Error('Invalid format: root must be an array');
        }
      } catch (err) {
        setIsError(true);
        setImportStatus('Invalid JSON file format. Please upload a valid TaskFlow backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Data & Backup Management</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Own your productivity data. Export your current tasks to JSON for safe backups, download a CSV for spreadsheets, or import tasks from an existing file.
          </p>

          {importStatus && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{importStatus}</span>
            </div>
          )}

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={exportJSON}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Export JSON Backup</div>
                  <div className="text-[11px] text-slate-400">Complete task backup including subtasks</div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 tabular-nums">
                {tasks.length} items
              </span>
            </button>

            <button
              type="button"
              onClick={exportCSV}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Export CSV Spreadsheet</div>
                  <div className="text-[11px] text-slate-400">Formatted for Excel, Google Sheets, Notion</div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">.csv</span>
            </button>

            <div className="pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Import Tasks from JSON</div>
                    <div className="text-[11px] text-slate-400">Restore a previous backup file</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
