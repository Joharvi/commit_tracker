import { useState } from 'react'
import { IconPencil, IconChevronDown } from './Icons'
import { POPULATED_COMMIT, formatDate, formatCurrency } from '../data/commitData'

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = title.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="details-section">
      <button
        className="details-section-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={id}
      >
        <h3>{title}</h3>
        <IconChevronDown size={14} className={`chevron${open ? ' open' : ''}`} />
      </button>
      {open && <div id={id} className="details-grid">{children}</div>}
    </div>
  )
}

function DetailField({ label, value, editable = true, isLink = false }) {
  return (
    <div className="detail-field">
      <div className="df-label">{label}</div>
      <div className="df-value">
        {isLink && value
          ? <a href="#" onClick={e => e.preventDefault()}>{value}</a>
          : value || <span style={{ color: '#dddbda' }}>—</span>
        }
      </div>
      {editable && (
        <button className="edit-pencil" aria-label={`Edit ${label}`}>
          <IconPencil size={13} />
        </button>
      )}
    </div>
  )
}

export default function DetailsTab({ commit = POPULATED_COMMIT }) {
  const endDate = commit.endDate ? formatDate(commit.endDate) : '—'
  const startDate = commit.startDate ? formatDate(commit.startDate) : '—'

  return (
    <div>
      {/* Commit details */}
      <CollapsibleSection title="Commit details">
        <DetailField label="Commit name" value={commit.commitName} />
        <DetailField label="Commit number" value={commit.commitNumber} editable={false} />
        <DetailField label="Account" value={commit.account} isLink />
        <DetailField label="Commit ID" value={commit.id} />
        <DetailField label="Commit type" value={commit.commitType} />
        <DetailField label="Opportunity" value={commit.opportunity || null} />
        <div className="detail-field">
          <div className="df-label">Status</div>
          <div className="df-value">
            <span className={`status-badge ${commit.status.toLowerCase()}`}>{commit.status}</span>
          </div>
          <button className="edit-pencil" aria-label="Edit Status">
            <IconPencil size={13} />
          </button>
        </div>
        <div className="detail-field">
          <div className="df-label">Owner</div>
          <div className="df-value">
            <a href="#" onClick={e => e.preventDefault()}>{commit.owner}</a>
          </div>
          <button className="edit-pencil" aria-label="Edit Owner">
            <IconPencil size={13} />
          </button>
        </div>
        <div className="detail-field">
          <div className="df-label">Requires approval</div>
          <div className="df-value">
            <input type="checkbox" checked={commit.requiresApproval} readOnly aria-label="Requires approval" />
          </div>
          <button className="edit-pencil" aria-label="Edit Requires approval">
            <IconPencil size={13} />
          </button>
        </div>
        <DetailField label="Currency" value={commit.currency} />
      </CollapsibleSection>

      {/* Financials */}
      <CollapsibleSection title="Financials">
        <DetailField
          label="Total commit value"
          value={commit.totalCommitValue ? `USD ${formatCurrency(commit.totalCommitValue)}` : null}
        />
        <DetailField label="Discount variance %" value={commit.discountVariancePct} />
      </CollapsibleSection>

      {/* Term & dates */}
      <CollapsibleSection title="Term & dates">
        <DetailField label="Term (months)" value={commit.termMonths ? String(commit.termMonths) : null} />
        <DetailField label="End date" value={endDate} />
        <DetailField label="Start date" value={startDate} />
        <div className="detail-field" />
      </CollapsibleSection>

      {/* System information */}
      <CollapsibleSection title="System information">
        <div className="detail-field">
          <div className="df-label">Created by</div>
          <div className="df-value">
            <a href="#" onClick={e => e.preventDefault()}>{commit.createdBy}</a>
            {commit.createdAt ? `, ${commit.createdAt}` : ''}
          </div>
        </div>
        <div className="detail-field">
          <div className="df-label">Last modified by</div>
          <div className="df-value">
            <a href="#" onClick={e => e.preventDefault()}>{commit.modifiedBy}</a>
            {commit.modifiedAt ? `, ${commit.modifiedAt}` : ''}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )
}
