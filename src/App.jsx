import { useState } from 'react'
import GlobalHeader from './components/GlobalHeader'
import CommitWorkspace from './components/CommitWorkspace'
import CommitRecord from './components/CommitRecord'
import { POPULATED_COMMIT } from './data/commitData'

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
  const [currentState, setCurrentState] = useState('workspace-empty')

  const activeStateObj = STATES.find(s => s.key === currentState)

  function handleWorkspaceSubmit() {
    setCurrentState('record-just-created')
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
            onClick={() => setCurrentState(s.key)}
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
            commit={POPULATED_COMMIT}
            showModal={true}
            populated={true}
            onEdit={handleEditFromRecord}
          />
        )}
        {currentState === 'record-populated' && (
          <CommitRecord
            key="populated"
            commit={POPULATED_COMMIT}
            showModal={false}
            populated={true}
            onEdit={handleEditFromRecord}
          />
        )}
      </div>
    </div>
  )
}
