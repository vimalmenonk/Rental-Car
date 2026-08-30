# UI/UX Design Specification & Visual Architecture
## Local Tax Report Generation Application

---

## 1. Executive Summary & Design Philosophy

The **Local Tax Report Generation Application** is an internal business and accounting utility designed for local desktop and browser environments. The system is engineered to capture transaction records (Customer details, Service/Rental period, Financial amounts, Loan amounts, and Distance in KM) and generate audit-ready, structured reports for tax filing.

### Core Design Principles
1. **Utility & Velocity Over Decoration**: High contrast, crisp typography, and zero distracting visual flair. Engineered for rapid 10-key numeric keypad and keyboard-centric data entry.
2. **Tabular Numeric Precision**: Standardized right-aligned monetary and distance figures using tabular numeral font features (`font-feature-settings: 'tnum'`).
3. **Information Density & Hierarchy**: Logical grouping into distinct visual cards (Customer Information, Period / Date Range, Financial Metrics, Travel Distance).
4. **100% Local Self-Sufficiency**: Clear system feedback indicating local database status, auto-save states, and easy one-click backup/export without any cloud dependencies.
5. **Tax-Ready Structure**: Report generation and preview layouts formatted to standard accounting schedules ready for print, PDF export, or spreadsheet extraction.

---

## 2. Design System & Style Guide

### 2.1 Color Palette

```
========================================================================================
TOKEN               HEX CODE    ROLE & APPLICATION
========================================================================================
--bg-app            #0F172A     Deep Slate Dark Mode Base / Application Outer Frame
--bg-surface        #1E293B     Card & Surface Backgrounds (Dark Mode)
--bg-canvas         #F8FAFC     Primary Light Canvas (High Readability Accounting View)
--surface-card      #FFFFFF     White card containers with subtle crisp borders
--border-subtle     #E2E8F0     Dividers, table borders, input outlines
--border-focus      #2563EB     Active field focus ring (2px solid)

--text-primary      #0F172A     Primary headings, active inputs, dense data
--text-secondary    #475569     Labels, helper text, table column headers
--text-muted        #94A3B8     Placeholders, disabled states, timestamps

--brand-navy        #1E3A8A     Primary action buttons, brand header, report title
--brand-blue        #2563EB     Interactive links, active tab indicator, focus states
--brand-blue-hover  #1D4ED8     Hover state for primary actions

--financial-green   #059669     Transaction Amount, Gross Revenue badges, Success states
--loan-amber        #D97706     Loan Amount, Deductions, Warning alerts
--distance-slate    #4F46E5     Kilometers (KM) indicators, Distance logs
--danger-red        #DC2626     Delete actions, validation error text & borders
========================================================================================
```

### 2.2 Typography Scale

* **Primary Font Stack**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Tabular Figures**: `font-variant-numeric: tabular-nums;` for all currency, KM, and date columns.
* **Hierarchy**:
  * **Page Title / Report Header**: `24px (1.5rem)` | Font Weight: `700 (Bold)` | Line Height: `1.2`
  * **Section Headings / KPI Numbers**: `20px (1.25rem)` | Font Weight: `600 (Semi-Bold)`
  * **Table Headers / Card Titles / Subheadings**: `14px (0.875rem)` | Font Weight: `600 (Semi-Bold)` | Text Transform: `UPPERCASE` with `0.05em` letter-spacing
  * **Body Text & Standard Inputs**: `14px (0.875rem)` | Font Weight: `400 (Regular)` | Line Height: `1.5`
  * **Helper Text & Metadata**: `12px (0.75rem)` | Font Weight: `500 (Medium)` | Color: `#64748B`

### 2.3 Spacing & Form Sizing
* **Input Height**: `40px` (standardized for rapid mouse click and touch targets).
* **Grid Spacing**: 8pt grid system (`8px`, `16px`, `24px`, `32px`).
* **Table Row Height**: Compact `44px` with subtle zebra striping (`#F8FAFC` on alternating rows).

---

## 3. Keyboard Ergonomics & Navigation

For rapid bookkeeping and tax record entry, the entire application supports full keyboard navigation:

| Key Binding | Scope | Action |
| :--- | :--- | :--- |
| `Alt + N` | Global | Open **Add New Record** Form |
| `Alt + D` | Global | Navigate to **Dashboard** |
| `Alt + R` | Global | Navigate to **Record List** |
| `Alt + G` | Global | Open **Report Generation** Wizard |
| `Ctrl + F` / `/` | Record List | Focus Global Search Input |
| `Ctrl + S` / `Enter` | Form Modal / Page | **Save Record** |
| `Ctrl + Shift + S` | Form Modal / Page | **Save & Generate Report** |
| `Escape` | Modals / Drawers | Close Modal / Cancel Action (with dirty state confirmation) |
| `Tab` / `Shift + Tab` | Forms | Move between input fields in logical sequence |

---

## 4. Screen-by-Screen Specifications & Wireframes

```
+--------------------------------------------------------------------------------------------------+
|  TAX REPORT GENERATOR  [Local v1.0]           [Search Records...] (Ctrl+F)   [+ Add Record (Alt+N)]|
|  [Dashboard]   [Record List]   [Report Generator]   [Settings & DB]        ● Local DB: Connected |
+--------------------------------------------------------------------------------------------------+
```

---

### Screen 1: Dashboard

**Purpose**: High-level operational summary showing core metric aggregates and quick actions.

```
+--------------------------------------------------------------------------------------------------+
| DASHBOARD OVERVIEW                                                 [Period: All Time (FY 2024) v]|
|                                                                                                  |
| +-------------------+ +-------------------+ +-------------------+ +--------------------+         |
| | TOTAL RECORDS     | | TOTAL AMOUNT      | | TOTAL LOAN AMOUNT | | TOTAL DISTANCE     |         |
| | 128               | | $ 485,250.00      | | $ 112,400.00      | | 42,850 KM          |         |
| | +12 this month    | | Gross Volume      | | Active Liabilities| | Recorded Mileage   |         |
| +-------------------+ +-------------------+ +-------------------+ +--------------------+         |
|                                                                                                  |
| QUICK ACTIONS:                                                                                   |
| [+ Add New Record (Alt+N)]    [View All Records (128)]    [Generate Tax Report (Alt+G)]          |
|                                                                                                  |
| RECENTLY ADDED RECORDS (Last 5)                                      [View Full Record List ->]  |
| +----------+--------------------+----------------+-----------------------+------------+--------+ |
| | ID       | CUSTOMER NAME      | CONTACT        | PERIOD                | AMOUNT     | STATUS | |
| +----------+--------------------+----------------+-----------------------+------------+--------+ |
| | #REC-128 | Apex Logistics Ltd | +1 555-019-283 | 2024-03-01 - 2024-03-15| $ 4,500.00 | Local  | |
| | #REC-127 | Skyline Travels    | +1 555-014-992 | 2024-02-15 - 2024-02-28| $ 8,200.00 | Local  | |
| | #REC-126 | Robert Johnson     | +1 555-018-331 | 2024-02-01 - 2024-02-10| $ 1,450.00 | Local  | |
| | #REC-125 | Metro Fleet Inc    | +1 555-012-774 | 2024-01-20 - 2024-01-30| $ 12,300.00| Local  | |
| | #REC-124 | Elena Rostova      | +1 555-016-550 | 2024-01-10 - 2024-01-18| $ 3,100.00 | Local  | |
| +----------+--------------------+----------------+-----------------------+------------+--------+ |
+--------------------------------------------------------------------------------------------------+
```

**Key Dashboard UI Elements**:
1. **4 KPI Stat Cards**:
   - **Total Records**: Clean integer count with recent month delta.
   - **Total Amount**: Formatted currency with gross volume indicator.
   - **Total Loan Amount**: Formatted currency with liability highlight.
   - **Total KM**: Total odometer/trip distance logged.
2. **Prominent Quick Action Bar**: High-contrast primary and secondary button triggers.
3. **Recent Records Table**: Quick preview of last 5 entries with direct click-to-view links.

---

### Screen 2: Add Record Form

**Purpose**: Streamlined, logically grouped data entry form with instant validation.

```
+--------------------------------------------------------------------------------------------------+
| < Back to Records       ADD NEW TRANSACTION RECORD                    [Discard / Clear Form]     |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| +-- 1. CUSTOMER INFORMATION -------------------------------------------------------------------+ |
| | Customer Full Name *                   Customer Contact Number *                              | |
| | [ Apex Logistics Corp                ] [ +1 (555) 234-5678               ]                    | |
| | e.g., Individual or Legal Entity Name  10-15 digit phone / mobile number                       | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +-- 2. TRANSACTION / SERVICE PERIOD -----------------------------------------------------------+ |
| | Start Date *                           End Date *                             Total Days       | |
| | [ 2024-03-01            📅 ]          [ 2024-03-15            📅 ]           [ 15 Days (Auto)]| |
| | Format: YYYY-MM-DD                     Must be on or after Start Date                          | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +-- 3. FINANCIAL & TRANSACTION DETAILS --------------------------------------------------------+ |
| | Gross Transaction Amount ($) *         Loan Amount ($) [Optional]             Net Base Balance | |
| | [ $ 4,500.00                       ]   [ $ 1,000.00                       ]   [ $ 3,500.00   ] | |
| | Positive numeric value                 Deductible / Financed portion          Amount - Loan    | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +-- 4. TRAVEL / DISTANCE DETAILS --------------------------------------------------------------+ |
| | Distance (KM) *                                                                                | |
| | [ 850.00                      ] KM                                                            | |
| | Total recorded odometer distance for the period                                                | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [Cancel]                                     [Save Record (Ctrl+S)]   [Save & Generate Report ->]|
+--------------------------------------------------------------------------------------------------+
```

**Form Validation Specifications**:
- `Customer Name`: Required, minimum 2 characters, trimmed.
- `Customer Contact Number`: Required, regex pattern validation for numeric/international format `^+?[0-9\-\(\) ]{7,18}$`.
- `Start Date` & `End Date`: Required valid ISO dates. Inline validation rule: `End Date >= Start Date`. If `End Date < Start Date`, field outlines in red with message: *"End Date cannot precede Start Date"*.
- `Amount`: Required, numeric, `>= 0.00`. Formats with currency symbol and 2 decimal places.
- `Loan Amount`: Optional, numeric, `>= 0.00`. Warning if `Loan Amount > Amount`.
- `KM`: Required, numeric, `>= 0.0`.

---

### Screen 3: Edit Record

**Purpose**: Modify existing saved record with historical audit awareness and change protection.

**Key UI Differences from Add Record**:
- Header displays: `EDITING RECORD #REC-0089` along with badge `Original Creation: 2024-02-10 14:32`.
- Form is pre-populated with current values.
- Primary buttons: `[Cancel Changes]`, `[Update Record]`, `[Update & Generate Report]`.
- An "Unsaved Changes" warning is triggered if the user navigates away after editing any field.

---

### Screen 4: Record List (Master Grid)

**Purpose**: Primary tabular view for searching, filtering, sorting, multi-selecting, and batch actions.

```
+--------------------------------------------------------------------------------------------------+
| ALL RECORDS (128 Total)                                            [+ Add New Record (Alt+N)]    |
+--------------------------------------------------------------------------------------------------+
| [ Search by customer name, phone, or ID... (Ctrl+F) ]  [From Date 📅] to [To Date 📅] [Reset]     |
| Filter: [All Records v]   Sort: [Newest First v]    Selected: 2 records  [Batch Generate Report]|
+---+----------+---------------------+----------------+------------+------------+------------+-----+
|[] | ID       | CUSTOMER NAME       | CONTACT        | PERIOD     | AMOUNT ($) | LOAN ($)   | KM  |
+---+----------+---------------------+----------------+------------+------------+------------+-----+
|[x]| #REC-128 | Apex Logistics Ltd  | +1 555-019-283 | Mar 01-15  |   4,500.00 |   1,000.00 | 850 |
|[x]| #REC-127 | Skyline Travels     | +1 555-014-992 | Feb 15-28  |   8,200.00 |   2,400.00 |1420 |
|[ ]| #REC-126 | Robert Johnson      | +1 555-018-331 | Feb 01-10  |   1,450.00 |       0.00 | 310 |
|[ ]| #REC-125 | Metro Fleet Inc     | +1 555-012-774 | Jan 20-30  |  12,300.00 |   3,500.00 |2100 |
|[ ]| #REC-124 | Elena Rostova       | +1 555-016-550 | Jan 10-18  |   3,100.00 |     500.00 | 620 |
+---+----------+---------------------+----------------+------------+------------+------------+-----+
| Showing 1 - 5 of 128 records                        [|<] [<] Page [ 1 ] of 26 [>] [>|]  [25/page]|
| SUMMARY FOR FILTERED RECORDS:  Total Amount: $29,550.00 | Total Loan: $7,400.00 | Total KM: 5,300|
+--------------------------------------------------------------------------------------------------+
```

**Table Row Actions (Hover / Quick Menu)**:
Each row features an action toolbar or `...` menu with:
- 👁️ **View**: Opens Slide-over Record Details.
- ✏️ **Edit**: Opens Edit Record form.
- 📄 **Generate Report**: Generates single-record tax document preview.
- 🗑️ **Delete**: Triggers Delete Confirmation Modal.

---

### Screen 5: Record Details (Slide-over Drawer / Modal View)

**Purpose**: High-clarity single record inspection with complete breakdown and direct actions.

```
+-------------------------------------------------------------------------+
| RECORD DETAILS: #REC-0089                                           [X] |
+-------------------------------------------------------------------------+
| Customer Information                                                    |
| Name: Apex Logistics Ltd               Contact: +1 (555) 019-283        |
|                                                                         |
| Duration & Service Period                                               |
| Start Date: March 01, 2024             End Date: March 15, 2024         |
| Total Active Days: 15 Days                                              |
|                                                                         |
| Financial Summary                                                       |
| +---------------------------------------------------------------------+ |
| | Gross Transaction Amount:                             $ 4,500.00    | |
| | Loan / Financed Portion:                             - $ 1,000.00    | |
| | ------------------------------------------------------------------- | |
| | Net Transaction Base:                                 $ 3,500.00    | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| Distance Logged                                                         |
| Total Distance: 850.00 Kilometers                                       |
|                                                                         |
| Storage & System Metadata                                               |
| Stored Locally | ID: REC-0089 | Last Modified: 2024-03-15 16:45        |
|                                                                         |
| ACTIONS:                                                                |
| [🗑️ Delete Record]        [✏️ Edit Record]    [📄 Generate Tax Report]  |
+-------------------------------------------------------------------------+
```

---

### Screen 6: Report Generation Workflow

**Purpose**: Guided configuration step for generating tailored tax filing reports.

```
+--------------------------------------------------------------------------------------------------+
| GENERATE TAX REPORT                                                                              |
+--------------------------------------------------------------------------------------------------+
| Step 1: Record Selection Scope                                                                   |
| ( ) All Stored Records (128 Records)                                                             |
| (o) Filter by Date Range: [ 2024-01-01 📅 ] to [ 2024-03-31 📅 ] (Q1 FY2024 - 42 Records)       |
| ( ) Selected Records Only (2 Records Selected)                                                   |
| ( ) Specific Customer Filter: [ Select Customer... v ]                                           |
|                                                                                                  |
| Step 2: Report Configuration & Metadata                                                          |
| Report Title: [ TAX FILING TRANSACTION & MILEAGE SCHEDULE - Q1 2024                           ] |
| Financial / Assessment Year: [ FY 2023-2024 (Assessment Year 2024-2025)                      v] |
| Entity / Business Name:      [ Local Enterprise Tax Services LLC                              ] |
| Tax ID / Registration No:    [ TAX-8839201-LOCAL                                              ] |
|                                                                                                  |
| Step 3: Schedule Grouping & Presentation                                                          |
| Group Records By: [ Chronological (By Date) v ]                                                  |
| Include Summaries: [x] Total Gross Amount   [x] Total Loan Deductions   [x] Total Travel KM      |
|                                                                                                  |
| [Cancel]                                                         [Preview & Generate Report ->]  |
+--------------------------------------------------------------------------------------------------+
```

---

### Screen 7: Report Preview (Print & Tax Filing Layout)

**Purpose**: Formal, structured accounting document ready for immediate printing, PDF export, or tax submission.

```
+--------------------------------------------------------------------------------------------------+
| < Back to Generator          REPORT PREVIEW: Q1 FY2024            [🖨️ Print] [📥 PDF] [📊 Excel]|
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| +==============================================================================================+ |
| |                                 TAX FILING TRANSACTION SCHEDULE                               | |
| |                             Local Enterprise Operations & Mileage Log                        | |
| | Assessment Period: 01-Jan-2024 to 31-Mar-2024 | Generated: 2024-08-30 | Local Storage Ver. 1.0  | |
| +==============================================================================================+ |
|                                                                                                  |
| 1. TAXPAYER / FILING ENTITY DETAILS                                                              |
| Business Name: Local Enterprise Services LLC         Tax / Registration ID: TAX-8839201-LOCAL   |
| Reporting Period: Q1 (Jan 2024 - Mar 2024)           Report Date: 30-Aug-2024                    |
|                                                                                                  |
| 2. ITEMIZED TRANSACTION & DISTANCE SCHEDULE                                                      |
| +----+----------------------+-------------------+--------------+------------+------------+-----+ |
| | #  | CUSTOMER NAME        | CONTACT NUMBER    | PERIOD DATES | GROSS AMT  | LOAN AMT   | KM  | |
| +----+----------------------+-------------------+--------------+------------+------------+-----+ |
| | 01 | Apex Logistics Ltd   | +1 (555) 019-283  | 01/03 - 15/03| $  4,500.00| $  1,000.00|  850| |
| | 02 | Skyline Travels      | +1 (555) 014-992  | 15/02 - 28/02| $  8,200.00| $  2,400.00|1,420| |
| | 03 | Robert Johnson       | +1 (555) 018-331  | 01/02 - 10/02| $  1,450.00| $      0.00|  310| |
| | 04 | Metro Fleet Inc      | +1 (555) 012-774  | 20/01 - 30/01| $ 12,300.00| $  3,500.00|2,100| |
| | 05 | Elena Rostova        | +1 (555) 016-550  | 10/01 - 18/01| $  3,100.00| $    500.00|  620| |
| +----+----------------------+-------------------+--------------+------------+------------+-----+ |
|                                                                                                  |
| 3. CONSOLIDATED FINANCIAL & DISTANCE SUMMARY                                                    |
| +---------------------------------------------------------------+------------------------------+ |
| | METRIC DESCRIPTION                                            | CONSOLIDATED VALUE           | |
| +---------------------------------------------------------------+------------------------------+ |
| | Total Transaction Records Processed                           | 5 Entries                    | |
| | Total Gross Transaction Amount                                | $ 29,550.00                  | |
| | Total Loan / Financing Deductions                             | - $ 7,400.00                 | |
| | Net Transaction Base Value                                    | $ 22,150.00                  | |
| | Total Business Travel Distance (KM)                           | 5,300.00 KM                  | |
| +---------------------------------------------------------------+------------------------------+ |
|                                                                                                  |
| * Note: Tax calculation formulas and statutory rates will be applied upon final client rules.    |
|                                                                                                  |
| Prepared By: __________________________        Authorized Signature: _________________________   |
| +==============================================================================================+ |
+--------------------------------------------------------------------------------------------------+
```

---

### Screen 8: Settings & Local Database Configuration

**Purpose**: Manage local database health, offline backups, data imports, and report header presets.

```
+--------------------------------------------------------------------------------------------------+
| SETTINGS & LOCAL STORAGE MANAGEMENT                                                              |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
| +-- 1. LOCAL DATA PERSISTENCE & STORAGE STATUS ------------------------------------------------+ |
| | ● Database Status: Local IndexedDB / SQLite (Ready)      Total Storage Used: 142 KB            | |
| | Storage Location: Local Client Device (No Cloud Sync Required)                                 | |
| |                                                                                                | |
| | [📥 Backup Database (JSON/SQL)]    [📤 Restore Database from File]    [🗑️ Reset Local Database] | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| +-- 2. TAX REPORT HEADER & BUSINESS PROFILE PRESETS -------------------------------------------+ |
| | Business / Entity Legal Name:           Tax Registration / PAN / EIN:                          | |
| | [ Local Enterprise Services LLC       ] [ TAX-8839201-LOCAL                                ]  | |
| | Business Address / Contact:             Default Currency Symbol:                               | |
| | [ 100 Main St, Suite 400              ] [ $ (USD)                                          v]  | |
| +----------------------------------------------------------------------------------------------+ |
|                                                                                                  |
| [Save Settings]                                                            [Reset to Defaults]   |
+--------------------------------------------------------------------------------------------------+
```

---

### Screen 9: Empty States

1. **Dashboard Zero State**:
   - Icon: 🗂️ Clean ledger graphic.
   - Message: *"No transaction records found in your local database yet."*
   - Description: *"Start by adding your first customer transaction to see live financial metrics and generate tax reports."*
   - Primary CTA Button: `[+ Add First Record]`

2. **Record List No Results State**:
   - Icon: 🔍 Search ledger graphic.
   - Message: *"No records match your search filter."*
   - Description: *"Try adjusting your search keywords, date range, or reset filters."*
   - CTA Button: `[Clear All Filters]`

3. **Report Generator Empty Scope**:
   - Message: *"No records exist within the selected date range."*
   - Banner: *"Adjust your date parameters to include active transaction records."*

---

### Screen 10: Validation & Error States

1. **Form Validation Matrix**:
   - **Start Date after End Date**: Red input border on both date pickers + inline badge: *"End Date (2024-03-01) cannot precede Start Date (2024-03-15)"*.
   - **Invalid Phone**: Inline warning: *"Enter a valid 10-15 digit phone number"*.
   - **Negative Financial Value**: Field outline turns red: *"Amount must be a positive number"*.
   - **Empty Required Field**: Form submit shake animation + field label highlighted in red: *"This field is required"*.

2. **Dirty Form Unsaved Changes Warning Dialog**:
   - Triggered when user attempts to leave an edited form without saving:
   - Dialog: *"You have unsaved changes. Do you want to discard your edits or stay on this page?"*
   - Buttons: `[Discard Changes]` (Red Outline) | `[Stay on Page]` (Primary Blue)

---

### Screen 11: Delete Confirmation Modal

**Purpose**: High-safety confirmation dialog to prevent accidental local data loss.

```
+-------------------------------------------------------------------------+
| ⚠️ CONFIRM PERMANENT RECORD DELETION                                [X] |
+-------------------------------------------------------------------------+
| Are you sure you want to delete this record? This action cannot be       |
| undone because data is stored strictly on your local device.            |
|                                                                         |
| RECORD TO BE REMOVED:                                                   |
| * Customer:  Apex Logistics Ltd (+1 555-019-283)                        |
| * Period:    2024-03-01 to 2024-03-15 (15 Days)                         |
| * Amount:    $ 4,500.00 | Loan: $ 1,000.00 | Distance: 850 KM           |
|                                                                         |
| [Cancel & Keep Record]                   [🗑️ Yes, Delete Permanently]   |
+-------------------------------------------------------------------------+
```

---

## 5. Transition to Development (Next Steps)

Once this design specification and accompanying interactive prototype are approved by the client:
1. Client will provide exact **Tax Calculation Formulas**, deductions rules, and statutory schedules.
2. The UI components specified here will be connected to the chosen local persistence engine (SQLite / IndexedDB / Electron Local Store) with full export/print capabilities.
