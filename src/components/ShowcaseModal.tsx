import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Headphones, 
  Terminal, 
  LayoutGrid, 
  ListTodo, 
  Keyboard, 
  Code2, 
  Play, 
  Volume2, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { soundEngine, AmbientSound } from '../utils/audio';
import { parseNaturalLanguageInput } from '../utils/nlpParser';

interface ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCommandPalette: () => void;
  onToggleLayout: (layout: 'list' | 'board') => void;
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  isOpen,
  onClose,
  onOpenCommandPalette,
  onToggleLayout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'nlp_playground' | 'audio_lab' | 'shortcuts'>('overview');

  // NLP Playground state
  const [demoInput, setDemoInput] = useState('Ship product roadmap tomorrow !high #work ~45m');
  const demoParsed = parseNaturalLanguageInput(demoInput);

  // Audio lab state
  const [previewSound, setPreviewSound] = useState<AmbientSound>('none');
  const [previewPlaying, setPreviewPlaying] = useState(false);

  if (!isOpen) return null;

  const handleTestSound = (sound: AmbientSound) => {
    if (previewPlaying && previewSound === sound) {
      soundEngine.stop();
      setPreviewPlaying(false);
      setPreviewSound('none');
    } else {
      soundEngine.play(sound, 0.4);
      setPreviewSound(sound);
      setPreviewPlaying(true);
    }
  };

  const handleClose = () => {
    if (previewPlaying) {
      soundEngine.stop();
      setPreviewPlaying(false);
    }
    onClose();
  };

  const sampleNlpPhrases = [
    'Review financial forecast next week !high #finance ~1h',
    'Morning 5k trail run today !medium #health ~30m',
    'Read systems architecture book on friday !low #study ~45m',
    'Call car mechanic tomorrow !urgent #personal ~15m',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    TaskFlow Interactive Showcase
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
                    Explore innovative features, test drive live modules, and master shortcuts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                aria-label="Close showcase"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-6 relative z-10">
              {[
                { id: 'overview', label: 'Feature Showcase', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'nlp_playground', label: 'NLP Parser Lab', icon: <Terminal className="w-3.5 h-3.5" /> },
                { id: 'audio_lab', label: 'Ambient Audio Lab', icon: <Headphones className="w-3.5 h-3.5" /> },
                { id: 'shortcuts', label: 'Keyboard Matrix', icon: <Keyboard className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto">
            {/* Tab 1: Feature Showcase */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Flow Mode */}
                  <div className="p-4 rounded-2xl border border-slate-200/90 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/30 transition-all space-y-2.5 group">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wide">
                      <Headphones className="w-4 h-4" />
                      <span>Flow Mode</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Deep Focus & Ambient Audio
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Enter distraction-free focus sessions with a Pomodoro timer and real-time soothing audio synthesized with the Web Audio API.
                    </p>
                    <div className="pt-1 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <span>Click 'Focus' on any task to launch</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>

                  {/* Card 2: Command Palette */}
                  <div className="p-4 rounded-2xl border border-slate-200/90 hover:border-purple-500 bg-slate-50/50 hover:bg-purple-50/30 transition-all space-y-2.5 group">
                    <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wide">
                      <Terminal className="w-4 h-4" />
                      <span>Command Center</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Keyboard-Driven Palette (⌘K)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Instant search, navigation, layout toggling, and data backups without taking your hands off the keyboard.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        onOpenCommandPalette();
                      }}
                      className="pt-1 flex items-center text-xs font-semibold text-purple-600 hover:text-purple-800 cursor-pointer"
                    >
                      <span>Press ⌘K or click here to try</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>

                  {/* Card 3: Smart NLP */}
                  <div className="p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 transition-all space-y-2.5 group">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wide">
                      <Zap className="w-4 h-4" />
                      <span>Natural Language Parser</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Rapid Task Entry
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Type dates, priorities, categories, and estimates naturally. The parser extracts tags dynamically as you type.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('nlp_playground')}
                      className="pt-1 flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                    >
                      <span>Open Live Parser Playground</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>

                  {/* Card 4: Dual Layouts */}
                  <div className="p-4 rounded-2xl border border-slate-200/90 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/30 transition-all space-y-2.5 group">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wide">
                      <LayoutGrid className="w-4 h-4" />
                      <span>List & Kanban Board</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Visual Agile Workflow
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Switch between clean structured lists and a 3-column Kanban board (*To Do*, *In Progress*, *Completed*) with single-click moves.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onToggleLayout('list');
                          handleClose();
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer"
                      >
                        Set List View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onToggleLayout('board');
                          handleClose();
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-md hover:bg-slate-100 cursor-pointer"
                      >
                        Set Board View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Live NLP Parser Lab */}
            {activeTab === 'nlp_playground' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Natural Language Extraction Simulator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Type a task below with shortcuts like <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">!high</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">#work</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">tomorrow</code>, or <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">~45m</code> to see the parser in action.
                  </p>
                </div>

                {/* Input area */}
                <div className="relative">
                  <input
                    type="text"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none transition-all font-medium text-slate-900 bg-white"
                    placeholder="Type a task with natural language tags..."
                  />
                </div>

                {/* Live Extraction Results Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Parsed Tokens Output
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="text-slate-400 text-[11px]">Clean Title</div>
                      <div className="font-semibold text-slate-800 truncate mt-0.5">
                        {demoParsed.cleanTitle || '(empty)'}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="text-slate-400 text-[11px]">Priority</div>
                      <div className="font-semibold text-rose-600 uppercase mt-0.5">
                        {demoParsed.detectedPriority || 'Default (Med)'}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="text-slate-400 text-[11px]">Category</div>
                      <div className="font-semibold text-indigo-600 mt-0.5">
                        {demoParsed.detectedCategory ? `#${demoParsed.detectedCategory}` : 'None'}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <div className="text-slate-400 text-[11px]">Due Date & Est</div>
                      <div className="font-semibold text-slate-800 font-mono mt-0.5">
                        {demoParsed.detectedDueDate || 'None'} {demoParsed.detectedEstimatedMinutes ? `(~${demoParsed.detectedEstimatedMinutes}m)` : ''}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preset clickable samples */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-600">Try Sample Prompts:</div>
                  <div className="flex flex-wrap gap-2">
                    {sampleNlpPhrases.map((phrase, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setDemoInput(phrase)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer text-slate-700"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Ambient Audio Lab */}
            {activeTab === 'audio_lab' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">
                    Web Audio API Synthesizer Lab
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test the browser-synthesized soundscapes directly. Audio is generated mathematically with custom audio buffer nodes and acoustic biquad filters.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'brown', title: 'Deep Brown Noise', desc: 'Attenuated low frequencies. Ideal for programming and deep reading.' },
                    { id: 'rain', title: 'Gentle Rainfall', desc: 'Acoustic droplet simulation. Calms sympathetic nervous system.' },
                    { id: 'white', title: 'Soft White Noise', desc: 'Equal spectral power. Effectively masks background conversations.' },
                  ].map((s) => {
                    const isActive = previewPlaying && previewSound === s.id;
                    return (
                      <div
                        key={s.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 ${
                          isActive
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">{s.title}</div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTestSound(s.id as AmbientSound)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-rose-600 text-white hover:bg-rose-700'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Listen Preview</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% offline, generated in your browser via AudioContext. Zero external network streams or audio assets required.</span>
                </div>
              </div>
            )}

            {/* Tab 4: Keyboard Matrix */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Keyboard Shortcuts & Power Navigation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fly through your workflows with zero-latency keyboard commands.
                  </p>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {[
                    { key: '⌘ + K  /  Ctrl + K', desc: 'Open Command Palette from anywhere in the app' },
                    { key: 'Enter', desc: 'Submit and create task in quick-add input' },
                    { key: 'Esc', desc: 'Close modals, drawers, or Command Palette' },
                    { key: '!high / !med / !low', desc: 'Natural language priority shortcut in title' },
                    { key: '#work / #health / #study', desc: 'Natural language category tag in title' },
                    { key: 'today / tomorrow / friday', desc: 'Natural language due date parser in title' },
                    { key: '~30m / ~1h', desc: 'Natural language duration estimate in title' },
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 text-xs hover:bg-slate-50">
                      <span className="text-slate-600 font-medium">{row.desc}</span>
                      <kbd className="font-mono font-semibold bg-slate-100 border border-slate-200 text-slate-800 px-2 py-1 rounded-md text-[11px]">
                        {row.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              TaskFlow v2.0 · Engineered for Productivity
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
            >
              Back to Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
