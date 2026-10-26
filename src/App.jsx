import { useState } from 'react'
import GlobalHeader from './components/GlobalHeader'
import CommitWorkspace from './components/CommitWorkspace'
import CommitRecord from './components/CommitRecord'
import { POPULATED_COMMIT, calcEndDate } from './data/commitData'

function buildCommit({ customerName, commitType, totalCommitValue, termMonths, startDate, selectedIds, billId }) {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm   = String(now.getMonth() + 1).padStart(2, '0')
  const dd   = String(now.getDate()).padStart(2, '0')
  const hh   = String(now.getHours()).padStart(2, '0')
  const min  = String(now.getMinutes()).padStart(2, '0')
  const ss   = String(now.getSeconds()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  const id   = `SFC-${yyyy}${mm}${dd}-${hh}${min}${ss}-${rand}`
  const endDateObj = calcEndDate(startDate, termMonths)
  const endDate    = endDateObj ? endDateObj.toISOString().slice(0, 10) : null
  const stamp = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
            + ', ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return {
    id,
    commitNumber:            'CMT-00001',
    commitName:              `${customerName} – ${id}`,
    account:                 customerName,
    commitType,
    status:                  'Draft',
    requiresApproval:        false,
    currency:                'USD – U.S. Dollar',
    owner:                   'Rep One',
    totalCommitValue:        Number(totalCommitValue),
    discountVariancePct:     null,
    termMonths:              Number(termMonths),
    startDate,
    endDate,
    createdBy:               'Rep One',
    createdAt:               stamp,
    modifiedBy:              'Rep One',
    modifiedAt:              stamp,
    commitConsumed:          0,
    rolloverTotal:           0,
    participatingAccountIds: selectedIds ?? [],
    billForShortfallId:      billId ?? null,
  }
}

/*
  Page states:
  - workspace-empty       : Commit Workspace, empty form (screenshot A)
  - workspace-active      : Commit Workspace, filled form (screenshot B)
  - workspace-validation  : Commit Workspace, validation errors (screenshot C from workspace set)
  - record-just-created   : Commit record, modal open, Details tab (screenshot D+E)
  - record-populated      : Commit record, no modal, all data (screenshots C/E/F)
*/

const STATES = [
  { key: 'workspace-empty',      label: 'Workspace — empty',      nav: 'Commit Workspace' },
  { key: 'workspace-active',     label: 'Workspace — active',      nav: 'Commit Workspace' },
  { key: 'workspace-validation', label: 'Workspace — validation',  nav: 'Commit Workspace' },
  { key: 'record-just-created',  label: 'Record — just created',   nav: 'Commits' },
  { key: 'record-populated',     label: 'Record — populated',      nav: 'Commits' },
]

export default function App() {
  const [currentState, setCurrentState]   = useState('workspace-empty')
  const [submittedCommit, setSubmittedCommit] = useState(null)

  const activeStateObj = STATES.find(s => s.key === currentState)

  // Real form submit — build a commit from actual form data
  function handleWorkspaceSubmit(data) {
    setSubmittedCommit(buildCommit(data))
    setCurrentState('record-just-created')
  }

  // Toggle bar — always reset to pre-populated demo data for record states
  function handleStateChange(key) {
    if (key.startsWith('record-')) setSubmittedCommit(null)
    setCurrentState(key)
  }

  function handleEditFromRecord() {
    setCurrentState('workspace-active')
  }

  const isWorkspace = currentState.startsWith('workspace')
  const isRecord = currentState.startsWith('record')

  return (
    <div className="app-layout">
      {/* State toggle bar */}
      <nav
        className="state-toggle-bar"
        aria-label="Prototype state switcher"
        role="navigation"
      >
        <span>Prototype state:</span>
        {STATES.map(s => (
          <button
            key={s.key}
            className={currentState === s.key ? 'active' : ''}
            onClick={() => handleStateChange(s.key)}
            aria-pressed={currentState === s.key}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Salesforce chrome */}
      <GlobalHeader activeNav={activeStateObj?.nav ?? 'Commit Workspace'} />

      {/* Main content */}
      <div className="page-body">
        {currentState === 'workspace-empty' && (
          <CommitWorkspace
            key="empty"
            initialState="empty"
            onSubmit={handleWorkspaceSubmit}
          />
        )}
        {currentState === 'workspace-active' && (
          <CommitWorkspace
            key="active"
            initialState="active"
            onSubmit={handleWorkspaceSubmit}
          />
        )}
        {currentState === 'workspace-validation' && (
          <CommitWorkspace
            key="validation"
            initialState="validation"
            onSubmit={handleWorkspaceSubmit}
          />
        )}
        {currentState === 'record-just-created' && (
          <CommitRecord
            key="just-created"
            commit={submittedCommit ?? POPULATED_COMMIT}
            showModal={true}
            populated={true}
            onEdit={handleEditFromRecord}
          />
        )}
        {currentState === 'record-populated' && (
          <CommitRecord
            key="populated"
            commit={submittedCommit ?? POPULATED_COMMIT}
            showModal={false}
            populated={true}
            onEdit={handleEditFromRecord}
          />
        )}
      </div>
    </div>
  )
}
