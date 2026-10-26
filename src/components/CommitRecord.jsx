import { useState, useEffect, useRef } from 'react'
import { IconChevronDown, IconSettings, IconPerson, IconCheck } from './Icons'
import contractLineOutcomeIcon from '../assets/contract-line-outcome.svg'
import { POPULATED_COMMIT } from '../data/commitData'
import CommitCreatedModal from './CommitCreatedModal'
import DetailsTab from './DetailsTab'
import RelatedTab from './RelatedTab'
import CommitTrackerTab from './CommitTrackerTab'

/* ─── FAQ sidebar card ───────────────────────────────────────────────── */
function FaqCard() {
  const [open, setOpen] = useState(true)
  return (
    <div className="sidebar-card">
      <button
        className="sidebar-card-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="faq-body"
      >
        <IconChevronDown size={14} className={`chevron${open ? ' open' : ''}`} />
        <h3>Salesforce Commit FAQ</h3>
      </button>
      <div id="faq-body" className={`sidebar-card-body${open ? '' : ' collapsed'}`}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#181818', margin: '0 0 6px' }}>Key rules</p>
        <ul className="faq-rules">
          <li>The customer owes the full committed amount. If they haven't spent it by the end of the term, they get a shortfall bill for the difference.</li>
          <li>Spend draws the commitment down through renewals, Day 1 orders, and mid-term add-ons.</li>
          <li>Usage above the pre-purchased amount draws against the remaining unallocated commitment. Overages are charged at the contracted Overage Rate Card price, or list price if none was defined.</li>
          <li>ProServe and ISV AgentExchange Private Offers are each capped at 10% of the commitment.</li>
        </ul>
      </div>
    </div>
  )
}

/* ─── Activity sidebar card ──────────────────────────────────────────── */
function ActivityCard() {
  const [activityTab, setActivityTab] = useState('Activity')
  const [insightsToggle, setInsightsToggle] = useState(false)

  return (
    <div className="sidebar-card">
      <div className="activity-tabs" role="tablist" aria-label="Activity and chatter">
        {['Activity', 'Chatter'].map(t => (
          <button
            key={t}
            className={`activity-tab-btn${activityTab === t ? ' active' : ''}`}
            role="tab"
            aria-selected={activityTab === t}
            onClick={() => setActivityTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="activity-body" role="tabpanel">
        {activityTab === 'Activity' ? (
          <>
            {/* Composer */}
            <div className="activity-composer-row">
              <button className="activity-composer-btn" aria-label="Log activity">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="2" width="12" height="12" rx="2" />
                  <line x1="8" y1="5" x2="8" y2="11" strokeLinecap="round" />
                  <line x1="5" y1="8" x2="11" y2="8" strokeLinecap="round" />
                </svg>
                Log activity
              </button>
              <button style={{ background: 'none', border: '1px solid #dddbda', borderRadius: 4, padding: '6px 8px', cursor: 'pointer', color: '#706e6b' }} aria-label="More options">
                <IconChevronDown size={12} />
              </button>
            </div>

            {/* Insights toggle */}
            <div className="activity-toggle-row">
              <span>Only show activities with insights</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={insightsToggle}
                  onChange={e => setInsightsToggle(e.target.checked)}
                  aria-label="Only show activities with insights"
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Filters */}
            <p className="activity-filters">
              Filters: Within 2 months · All activities · Logged calls, Email, Events, List email, Tasks, Voice Calls, Video Calls, and Web
            </p>

            <div className="activity-filter-links">
              <a href="#" onClick={e => e.preventDefault()}>Refresh</a>
              <span>·</span>
              <a href="#" onClick={e => e.preventDefault()}>Expand all</a>
              <span>·</span>
              <a href="#" onClick={e => e.preventDefault()}>View all</a>
              <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#706e6b', padding: 0 }} aria-label="Filter settings">
                <IconSettings size={14} />
              </button>
            </div>

            {/* Upcoming & overdue */}
            <div>
              <div className="activity-section-header">
                <IconChevronDown size={12} className="chevron open" />
                Upcoming &amp; overdue
              </div>
              <p className="activity-empty">
                No activities to show. Get started by sending an email, scheduling a task, and more.
              </p>
            </div>

            {/* Info callout */}
            <div className="activity-info-callout">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#0176d3" />
                <line x1="7" y1="6" x2="7" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="4.5" r="0.6" fill="white" />
              </svg>
              To change what's shown, try changing your filters.
            </div>

            <button className="btn-show-all">Show all activities</button>
          </>
        ) : (
          <p style={{ fontSize: 13, color: '#706e6b', margin: 0 }}>
            No chatter posts yet.
          </p>
        )}
      </div>
    </div>
  )
}

/* ─── Record header ──────────────────────────────────────────────────── */
function RecordHeader({ commit, onEdit }) {
  return (
    <div className="record-header-bar">
      <div className="record-header-row">
        <div className="record-header-left">
          <img src={contractLineOutcomeIcon} alt="" className="record-object-icon" aria-hidden="true" />
          <div className="record-header-titles">
            <div className="record-breadcrumb">Commit</div>
            <h1 className="record-title" id="record-title">{commit.commitName}</h1>
          </div>
        </div>
        <div className="record-actions">
          <button className="btn-record-action" onClick={onEdit} aria-label="Edit this commit record">
            Edit
          </button>
          <button className="btn-record-action" aria-label="Delete this commit record">
            Delete
          </button>
          <button className="btn-record-action" aria-label="Clone this commit record">
            Clone
          </button>
          <button className="btn-overflow" aria-label="More record actions" aria-haspopup="true">
            <IconChevronDown size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main CommitRecord page ─────────────────────────────────────────── */
export default function CommitRecord({
  commit = POPULATED_COMMIT,
  showModal = true,
  populated = true,
  onEdit,
}) {
  const [activeTab, setActiveTab] = useState('Details')
  const [modalOpen, setModalOpen] = useState(showModal)
  const pageTitleRef = useRef(null)

  const tabs = ['Related', 'Details', 'Commit Tracker']

  function handleCloseModal() {
    setModalOpen(false)
    // Return focus to page heading
    pageTitleRef.current?.focus()
  }

  return (
    <div className="record-page">
      {/* Record header */}
      <RecordHeader commit={commit} onEdit={onEdit} />

      {/* Body */}
      <div className="record-body">
        {/* Tab nav + content wrapped in a card */}
        <div className="record-card">
          <nav className="record-tabs" aria-label="Record sections">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`record-tab-btn${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
                aria-selected={activeTab === tab}
                role="tab"
              >
                {tab}
              </button>
            ))}
          </nav>
          <main className="record-main" id="main-content" tabIndex={-1} ref={pageTitleRef}>
            {activeTab === 'Related' && <RelatedTab commit={commit} populated={populated} />}
            {activeTab === 'Details' && <DetailsTab commit={commit} />}
            {activeTab === 'Commit Tracker' && <CommitTrackerTab commit={commit} populated={populated} />}
          </main>
        </div>

        <aside className="record-sidebar" aria-label="Record sidebar">
          <FaqCard />
          <ActivityCard />
        </aside>
      </div>

      {/* Commit Created modal */}
      {modalOpen && <CommitCreatedModal onClose={handleCloseModal} />}

      {/* Utility bar */}
      <div className="sf-utility-bar" role="region" aria-label="Utility bar">
        <button className="sf-utility-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <rect x="1" y="3" width="12" height="9" rx="1" />
            <line x1="4" y1="7" x2="10" y2="7" strokeLinecap="round" />
            <line x1="4" y1="9.5" x2="8" y2="9.5" strokeLinecap="round" />
          </svg>
          To Do List
        </button>
      </div>
    </div>
  )
}
