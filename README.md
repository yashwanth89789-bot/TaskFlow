# ⚡ TaskFlow — Next-Gen Modern Task & Deep Flow Workspace

<div align="center">

```text
  ████████╗ █████╗ ███████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗
  ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║
     ██║   ███████║███████╗█████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║
     ██║   ██╔══██║╚════██║██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║
     ██║   ██║  ██║███████║██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝
     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ 
```

**High-Performance Task Management · Native Web Audio Flow Engine · Natural Language Parser · Kanban & List Workspaces**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Audio](https://img.shields.io/badge/Web_Audio_API-Synthesizer-FF6B6B?style=for-the-badge&logo=soundcharts&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[🚀 Quick Start](#-quick-start) • [✨ Interactive Show & Tour](#-interactive-show--tour) • [🎧 Flow Mode & Audio](#-flow-mode--ambient-sound-synthesizer) • [🧠 Smart NLP](#-smart-nlp-parser) • [⌨️ Shortcuts](#️-keyboard-shortcuts-matrix)

</div>

---

## 🖥️ Live Interface Preview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ ✦ TaskFlow       [All Tasks]  [Today's Focus]  [Upcoming]  [Completed]   [Showcase] ⌘K │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ VIEWS                    │  My Tasks                                                   │
│ ▢ All Tasks           6  │  Stay organized, prioritize what matters, and maintain flow │
│ ◉ Today's Focus       2  ├─────────────────────────────────────────────────────────────┤
│ ◈ Upcoming            2  │  [ Total: 6 ]  [ Active: 4 ]  [ Completed: 2 ]  [ Overdue: 0 ]│
│ ⚑ High Priority       2  │  Progress: [████████████░░░░░░░░░░░░░░░░░] 33%              │
│                          ├─────────────────────────────────────────────────────────────┤
│ CATEGORIES               │  ┌────────────────────────────────────────────────────────┐ │
│ #work  #health  #study   │  │ Add task... (e.g. 'Deploy API tomorrow !high #work ~1h')│ │
│                          │  └────────────────────────────────────────────────────────┘ │
│ ⚡ TODAY'S WORKLOAD      │  [All Tasks] [Active] [Completed]     [🔍 Search tasks...]   │
│ Planned Focus: 1h 45m    │  ---------------------------------------------------------- │
│ Momentum: 33%            │  [ ] Finalize Q4 architecture proposal · High · ~60m [Focus]│
│                          │  [ ] Prepare presentation slides · High · ~45m       [Focus]│
│ [Showcase] [Backup Data] │  [✓] Complete 30-min cardio run · Done                [Edit]│
└──────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## ✨ Interactive Show & Tour

TaskFlow features an **In-App Interactive Showcase Modal** accessible anytime by clicking **"Showcase"** in the top navigation or pressing **`?`** on your keyboard.

<details open>
<summary><b>🎬 Click to Expand: Interactive Feature Tour Walkthrough</b></summary>

### 1. 🎧 Flow Mode (Deep Focus Workspace)
> **Problem**: Traditional task managers are passive lists where users lose focus and get distracted by notifications or ambient room chatter.  
> **TaskFlow Solution**: An immersive focus mode linking a specific task to a countdown timer and a **pure Web Audio API synthesizer** that generates acoustic soundscapes directly in your browser.

```text
                   ┌───────────────────────────────────────┐
                   │        FLOW MODE · DEEP FOCUS         │
                   │                                       │
                   │    Finalize Q4 Architecture Proposal  │
                   │                                       │
                   │                 24:58                 │
                   │    [████████████████████░░░░░░░░░]    │
                   │                                       │
                   │       [ ❚❚ Pause ]    [ ↺ Reset ]     │
                   │   (15m Sprint)  (25m Pomo)  (50m Flow)│
                   ├───────────────────────────────────────┤
                   │ 🎧 AMBIENT SOUNDSCAPE (Web Audio API) │
                   │  [Brown Noise] [Rainfall] [Soft White]│
                   │  Volume: ──────────●────── 70%        │
                   ├───────────────────────────────────────┤
                   │  [✓] 1. Draft architecture diagram    │
                   │  [✓] 2. Sync with backend lead        │
                   │  [ ] 3. Submit pull request           │
                   └───────────────────────────────────────┘
```

---

### 2. 🧠 Smart Natural Language Input Parser (NLP Sandbox)
> **Problem**: Filling out 5 form fields (due date, priority, tags, durations) slows down task capture.  
> **TaskFlow Solution**: Type one natural sentence. The parser detects keywords, highlights them in real time, and applies them instantly.

| You Type In Task Input | Detected Priority | Detected Category | Detected Due Date | Detected Duration | Resulting Task |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `"Prepare keynote tomorrow !high #work ~45m"` | **HIGH** | `#work` | *Tomorrow* | `45 min` | Title: `Prepare keynote` |
| `"Review bank statements next week !medium #finance"` | **MEDIUM** | `#finance` | *Next Week* | — | Title: `Review bank statements` |
| `"Morning interval sprint today !low #health ~30m"` | **LOW** | `#health` | *Today* | `30 min` | Title: `Morning interval sprint` |
| `"Read clean code book on friday #study ~1h"` | — | `#study` | *Upcoming Friday* | `60 min` | Title: `Read clean code book` |

---

### 3. ⚡ Command Palette (`⌘K` / `Ctrl+K`)
> **Problem**: Reaching for the mouse to navigate between views or search tasks breaks flow.  
> **TaskFlow Solution**: Press `⌘K` to open a Raycast/Linear-grade search and command dispatcher.

```text
┌────────────────────────────────────────────────────────┐
│ 🔍 Type a command or search tasks...              ESC │
├────────────────────────────────────────────────────────┤
│ ACTIONS                                                │
│  ➕  Create New Task                     Quick entry    │
│  📅  Go to Today's Focus                 Due today      │
│  ⚡  Switch to Kanban Board View         Status columns │
│  💾  Backup & Export Data                JSON / CSV     │
│                                                        │
│ TASKS (Press Enter to launch Flow Mode)               │
│  🎧  Finalize Q4 project roadmap         Launch Focus  │
│  🎧  Prepare presentation slides         Launch Focus  │
└────────────────────────────────────────────────────────┘
```

---

### 4. 📋 Dual Workspace: Kanban Board vs Structured List
> **Problem**: Different tasks need different visual workflows. Some days you need an agile board; other days you need a structured daily agenda.  
> **TaskFlow Solution**: Instant 1-click toggle between **Linear List View** and **Agile 3-Column Kanban Board** (`To Do` → `In Progress` → `Completed`).

</details>

---

## 🎧 Flow Mode & Ambient Sound Synthesizer

TaskFlow's ambient sound generator does **NOT** download mp3 files or rely on fragile external audio streams. It builds real-time acoustic waveforms directly via the browser's `AudioContext`:

<details>
<summary><b>🔬 Click to inspect Web Audio API Architecture</b></summary>

```text
  [Math.random() Buffer Source]
                │
                ▼
  [BiquadFilterNode (Lowpass 450Hz / Bandpass 800Hz)]
                │
                ▼
  [GainNode (Volume Multiplier 0.0 – 1.0)]
                │
                ▼
  [AudioContext.destination (Speakers / Headphones)]
```

- **Deep Brown Noise**: Generates $1/f^2$ Brownian random walk with gentle low-pass smoothing at 450Hz.
- **Gentle Rainfall**: Uses multi-pole recursive filter equations simulating natural rainfall droplet acoustic signatures.
- **Soft White Noise**: Filtered flat-spectrum distribution softening harsh high-frequency treble.

</details>

---

## ⌨️ Keyboard Shortcuts Matrix

| Key Combo | Context | Action |
| :--- | :--- | :--- |
| <kbd>⌘</kbd> + <kbd>K</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> | Anywhere | Open Command Palette |
| <kbd>?</kbd> | Anywhere | Open Interactive Showcase Tour |
| <kbd>Enter</kbd> | Task Input | Submit new task with auto-parsed NLP tags |
| <kbd>Esc</kbd> | Modals / Palette | Dismiss any open modal, dialog, or drawer |
| `!high` / `!med` / `!low` | Task Input | Assign task priority instantly |
| `#work` / `#health` / `#study` | Task Input | Assign category tag instantly |
| `today` / `tomorrow` / `friday` | Task Input | Schedule due date instantly |
| `~15m` / `~30m` / `~1h` | Task Input | Set estimated duration |

---

## 🏗️ Architecture & Component Hierarchy

```text
src/
├── types/
│   └── task.ts                # Task, Subtask, Priority, Status, ViewLayout interfaces
├── utils/
│   ├── audio.ts               # Web Audio API Synthesizer (Brown noise, Rain, White noise)
│   ├── nlpParser.ts           # Tokenizer & Natural Language parser (!priority, #cat, date, ~est)
│   ├── date.ts                # Relative due date calculation & overdue checkers
│   ├── storage.ts             # LocalStorage persistence, sample data & backward migration
│   └── theme.ts               # WCAG AA compliant palette & priority configurations
├── components/
│   ├── Header.tsx             # 3-Zone Top Bar: Wordmark, Nav links, Showcase, ⌘K, +Task
│   ├── Sidebar.tsx            # View selectors, Category filters & Today's Workload counter
│   ├── StatsOverview.tsx      # KPI cards (Total, Active, Done, Overdue) + Animated progress
│   ├── TaskForm.tsx           # Quick-add form with live Smart NLP token preview & subtasks
│   ├── TaskCard.tsx           # Single task item with subtask checklist, Flow trigger & badges
│   ├── KanbanBoard.tsx        # 3-Column agile workflow (To Do, In Progress, Completed)
│   ├── FocusModeModal.tsx     # Fullscreen deep work session with Pomodoro & soundscape
│   ├── CommandPalette.tsx     # Keyboard-driven search & action runner (⌘K)
│   ├── ShowcaseModal.tsx      # Interactive in-app product tour, NLP playground & audio lab
│   ├── DataManagementModal.tsx# Complete data backup: JSON & CSV export/import
│   ├── TaskEditModal.tsx      # Accessible task editor with subtasks & time estimates
│   ├── ConfirmDeleteModal.tsx # Non-disruptive confirmation dialog (zero window.confirm)
│   └── EmptyState.tsx         # Contextual empty state illustrations & actions
└── App.tsx                    # Main state machine, keyboard listeners & layout coordinator
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🛡️ Data Sovereignty & Offline Support

- **Zero Cloud Lock-In**: All tasks, subtasks, and focus records are saved in browser `localStorage`.
- **Instant JSON Export**: One-click complete database export for offline backups.
- **CSV Format Support**: Ready for Excel, Google Sheets, Notion, or Obsidian.
- **Hermetic Audio**: The ambient sound synthesizer runs completely locally in the browser with zero external network requests.

---

<div align="center">
  <sub>Built with precision for peak daily productivity · TaskFlow v2.0</sub>
</div>
