import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Sparkles,
  Clock,
  ListTodo
} from 'lucide-react';
import { Task } from '../types/task';
import { soundEngine, AmbientSound } from '../utils/audio';

interface FocusModeModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  task,
  isOpen,
  onClose,
  onCompleteTask,
  onToggleSubtask,
}) => {
  // Timer state
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Audio state
  const [selectedSound, setSelectedSound] = useState<AmbientSound>('brown');
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer whenever a new task is opened
  useEffect(() => {
    if (task && isOpen) {
      const minutes = task.estimatedMinutes || 25;
      setInitialMinutes(minutes);
      setTimeLeftSeconds(minutes * 60);
      setIsRunning(false);
    }
  }, [task, isOpen]);

  // Handle countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            soundEngine.stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Sync ambient sound when isRunning or sound selection changes
  useEffect(() => {
    if (isOpen && isRunning && !isMuted) {
      soundEngine.play(selectedSound, volume);
    } else {
      soundEngine.stop();
    }

    return () => {
      soundEngine.stop();
    };
  }, [isOpen, isRunning, selectedSound, isMuted]);

  useEffect(() => {
    if (isMuted) {
      soundEngine.setVolume(0);
    } else {
      soundEngine.setVolume(volume);
    }
  }, [volume, isMuted]);

  // Clean exit
  const handleClose = () => {
    setIsRunning(false);
    soundEngine.stop();
    onClose();
  };

  if (!isOpen || !task) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = initialMinutes > 0
    ? Math.max(0, Math.min(100, Math.round(((initialMinutes * 60 - timeLeftSeconds) / (initialMinutes * 60)) * 100)))
    : 0;

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;

  const handleSelectPreset = (presetMinutes: number) => {
    setInitialMinutes(presetMinutes);
    setTimeLeftSeconds(presetMinutes * 60);
    setIsRunning(false);
  };

  const handleSoundChange = (sound: AmbientSound) => {
    setSelectedSound(sound);
    if (isRunning && !isMuted) {
      soundEngine.play(sound, volume);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dim backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Bar inside modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Flow Mode · Deep Focus
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Exit Focus Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Task Info */}
            <div className="text-center space-y-2">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Current Objective
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 max-w-lg mx-auto">
                {task.title}
              </h2>
              {task.description && (
                <p className="text-sm text-slate-500 max-w-md mx-auto line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Timer Centerpiece */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="text-6xl sm:text-7xl font-mono font-extrabold text-slate-900 tracking-tight tabular-nums select-none">
                  {formattedTime}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-64 max-w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-md transition-all cursor-pointer ${
                    isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  <span>{isRunning ? 'Pause Focus' : 'Start Focus'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeftSeconds(initialMinutes * 60);
                  }}
                  className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-colors cursor-pointer"
                  title="Reset Timer"
                  aria-label="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectPreset(15)}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    initialMinutes === 15
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  15m Sprint
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset(25)}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    initialMinutes === 25
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  25m Pomodoro
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset(50)}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    initialMinutes === 50
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  50m Deep Work
                </button>
              </div>
            </div>

            {/* Ambient Soundscape Synthesizer */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <Headphones className="w-4 h-4 text-indigo-600" />
                  <span>Ambient Soundscape (Web Audio Synthesizer)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-20 accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Sound choices */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'brown', label: 'Brown Noise', desc: 'Deep focus' },
                  { id: 'rain', label: 'Gentle Rain', desc: 'Calming' },
                  { id: 'white', label: 'Soft White', desc: 'Mask chatter' },
                  { id: 'none', label: 'Silent', desc: 'No sound' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSoundChange(s.id as AmbientSound)}
                    className={`py-2 px-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedSound === s.id
                        ? 'border-indigo-600 bg-white text-indigo-900 shadow-xs'
                        : 'border-slate-200/70 bg-white/70 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-semibold leading-tight">{s.label}</div>
                    <div className="text-[10px] text-slate-400">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks breakdown */}
            {task.subtasks.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-slate-400" />
                    <span>Action Steps ({completedSubtasksCount}/{task.subtasks.length})</span>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {task.subtasks.map((st) => (
                    <label
                      key={st.id}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                        st.completed
                          ? 'bg-slate-50 border-slate-200/60 text-slate-400 line-through'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => onToggleSubtask(task.id, st.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="flex-1 truncate">{st.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Objective Button */}
            <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Back to Task List
              </button>

              <button
                type="button"
                onClick={() => {
                  onCompleteTask(task.id);
                  handleClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Task as Completed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
