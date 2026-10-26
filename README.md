# Commit Tracker — UI Prototype

A high-fidelity prototype of a Salesforce Commit management console, built to explore the UX of creating, viewing, and tracking multi-year customer commit deals. Intended for internal review and team feedback — not production code.

**Live preview:** https://joharvi.github.io/commit_tracker/

---

## What it covers

The prototype simulates two core workflows:

### 1. Commit Workspace (creation flow)
A step-by-step commit creation experience with:
- Account search and selection with a participating accounts table
- Deal summary panel showing commit value, term, and shortfall rules
- Negotiating account modal
- Form validation and a "Commit Created" confirmation modal on submit

### 2. Commit Record (record detail view)
A full record page for an existing commit, with:
- **Record header** — object icon, breadcrumb, commit name, grouped action buttons (Edit / Delete / Clone / overflow)
- **Related tab** — contracts and orders tables
- **Details tab** — collapsible sections (Commit details, Financials, Term & dates, System information) with inline edit affordances
- **Commit Tracker tab** — Commit Overview card (status, financials, KPIs), annual drawdown table, contracts table, and orders table
- **Right sidebar** — Salesforce Commit FAQ card and Activity card (Activity / Chatter tabs)

The prototype ships five discrete states toggled from the landing page: empty workspace, populated workspace, empty record, populated record, and a populated record with the Commit Tracker tab pre-selected.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | CSS custom properties — SLDS2 Cosmos design tokens (`@salesforce-ux/design-system` v2) |
| Routing | React Router v7 |
| Linting | Oxlint |

All visual styling uses `--slds-g-*` tokens directly. No Tailwind, no CSS-in-JS.

---

## Project structure

```
src/
  components/
    GlobalHeader.jsx          # Salesforce global nav + app nav bar
    CommitWorkspace.jsx       # Commit creation form + account table + deal summary
    CommitRecord.jsx          # Record page shell, header, sidebar (FAQ + Activity)
    DetailsTab.jsx            # Collapsible field sections with inline edit icons
    RelatedTab.jsx            # Contracts and orders related lists
    CommitTrackerTab.jsx      # Commit Overview card + drawdown/contracts/orders tables
    CommitCreatedModal.jsx    # Post-submit confirmation modal
    SelectNegotiatingAccountModal.jsx
    Icons.jsx                 # Inline SVG icon set
  data/
    commitData.js             # Placeholder commit, contracts, orders, and accounts data
  assets/
    contract-line-outcome.svg # Object icon used in record header and Commit Overview
    header-avatar.png         # Avatar used in the global header
  index.css                   # All component styles (SLDS2 tokens, no Tailwind)
  main.jsx                    # App entry — mounts routing and AppLayout
```

---

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
```

> **Note:** `build.cssMinify` is set to `false` in `vite.config.js` to avoid a LightningCSS crash with the SLDS token bundle.

---

## Design reference

Figma file: [Salesforce Commit](https://www.figma.com/design/GIWWMt9QdRj0hZjEf9q3M2/Salesforce-Commit)

Key nodes implemented:
- `2007-78740` — Record card wrapper
- `2007-79452` — Record header
- `2008-80128` — Details tab section style
- `2008-80753` — Sidebar cards (FAQ + Activity)
- `2010-80892` — Commit Overview card

---

## Data

All account names, IDs, and financial figures are fictional placeholder data. No real customer or employee information is present anywhere in the codebase.
