# TaxLedger Pro — Local Tax Report Application (React + Vite)

A modern, fast, business-grade **Local Tax Report Generation Application** built with **React 18, Vite, and Tailwind CSS**.

Engineered for 100% offline local client-side persistence (no AWS, Firebase, Supabase, or external database required), and ready for **1-click instant deployment to Vercel**.

---

## 🚀 Features

- **📊 Dashboard**: 4 KPI stat cards (Total Records, Total Gross Amount, Total Loan Amount, Total KM Mileage), Quick Actions, and Recent 5 Records table.
- **➕ Add & Edit Records**: Logically grouped forms (Customer Info, Service Period with auto-computed duration, Financial Details with live Net Base computation, Travel Distance KM). Strict validation with inline error feedback.
- **📋 Master Record List**: Real-time debounced search (`/` shortcut), date range filters, multi-column sorting, row checkboxes with batch selection, and summary aggregates footer.
- **👁️ Slide-over Record Details**: High-clarity inspection drawer with full customer, duration, financial breakdown, travel logs, and direct actions.
- **📈 Tax Report Generation Wizard**: Select scope (*All Local Records*, *Date Range*, *Selected Records*), configure assessment period & entity metadata, and toggle schedule columns.
- **📑 Report Preview & Print Layout**: Pixel-perfect A4 formal tax filing schedule ready for direct browser printing / PDF generation (`@media print`) and CSV / Excel export.
- **⚙️ Settings & Local Database Management**: Live storage health monitor, 1-click **JSON Database Backup** and **JSON Restore**, database reset, and default business filing profile configuration.
- **🔒 Safety Dialogs**: Permanent delete confirmation with record summary, and unsaved changes warning intercept.
- **⌨️ Keyboard-Centric Ergonomics**: Global shortcuts (`Alt+D` Dashboard, `Alt+R` Record List, `Alt+N` Add Record, `Alt+G` Report Wizard, `Ctrl+S` Save, `Esc` Close).

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) with custom accounting palette & print media queries
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Client-side `localStorage` with automated JSON backup & restore utilities
- **Hosting Target**: [Vercel](https://vercel.com/) (Zero backend runtime required)

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
The optimized production bundle is generated in `dist/`.

---

## 🌐 Deploying to Vercel

### Option 1: Vercel CLI (Fastest)
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Run in the project directory:
   ```bash
   vercel
   ```
3. Follow the prompts (Select Vite preset, accept default build command `npm run build` and output directory `dist`).

### Option 2: Vercel Git Integration
1. Push this project to a GitHub / GitLab / Bitbucket repository.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**.

---

## 📁 Project Architecture

```
d:/Rental Car/
├── index.html                   # HTML Entry point with Inter & JetBrains Mono fonts
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite config
├── tailwind.config.js           # Accounting color tokens and tabular typography
├── vercel.json                  # Vercel SPA routing rewrite configuration
├── UI_UX_DESIGN_SPECIFICATION.md# Design system & wireframes specification
├── prototype/                   # Standalone vanilla prototype (reference)
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main application shell with keyboard shortcuts
    ├── index.css                # Tailwind directives & @media print tax schedule rules
    ├── context/
    │   └── RecordContext.jsx    # Global State, Local Persistence & Batch Management
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx       # Top navigation, status indicator, state switcher
    │   │   └── Toast.jsx        # Notification feedback banner
    │   ├── dashboard/
    │   │   └── Dashboard.jsx    # Screen 1: KPI stat cards, quick actions, recent records
    │   ├── records/
    │   │   ├── RecordForm.jsx   # Screens 2 & 3: Add/Edit with live validation & net base
    │   │   ├── RecordList.jsx   # Screen 4: Master data grid, search, filter, batch actions
    │   │   └── RecordDrawer.jsx # Screen 5: Slide-over details inspection sheet
    │   ├── reports/
    │   │   ├── ReportWizard.jsx # Screen 6: Scope selector, metadata, presentation toggles
    │   │   └── ReportPreview.jsx# Screen 7: Print-ready formal tax schedule layout (A4 PDF/CSV)
    │   ├── settings/
    │   │   └── Settings.jsx     # Screen 8: Database health, backup JSON, restore JSON
    │   └── modals/
    │       ├── DeleteModal.jsx  # Screen 11: Safety confirmation dialog
    │       └── UnsavedModal.jsx # Screen 12: Unsaved changes intercept dialog
    └── utils/
        ├── seedData.js          # Realistic default business accounting dataset
        ├── formatters.js        # Tabular currency, KM, date & day calculations
        └── exportUtils.js       # CSV & JSON exporter helpers
```
