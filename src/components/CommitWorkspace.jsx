import { useState, useEffect, useCallback } from 'react'
import {
  IconSearch, IconClose, IconChevronDown, IconInfo, IconCalendar,
  IconSort, IconAlert, IconCheck, IconError, IconDateInput, IconTrash,
} from './Icons'
import contractLineOutcomeIcon from '../assets/contract_line_outcome.svg'
import { PLACEHOLDER_ACCOUNTS, ACTIVE_WORKSPACE_STATE, calcEndDate, formatDate, formatCurrency } from '../data/commitData'

/* ─── Deal Summary Panel ──────────────────────────────────────────────── */
function DealSummaryPanel({ formData, selectedIds, onClose, onSubmit, submitting }) {
  const selectedCount = selectedIds.length
  const tcv = Number(formData.totalCommitValue) || 0
  const allocated = tcv * 0.0598          // simulate some allocated amount
  const unallocated = tcv - allocated
  const endDate = calcEndDate(formData.startDate, formData.termMonths)

  return (
    <aside className="workspace-panel" aria-label="Commit deal summary">
      <div className="deal-summary-header">
        <h2 id="summary-heading">Commit Deal Summary</h2>
      </div>

      <div className="deal-summary-body">
        <p className="deal-summary-help">
          Only users with edit access can reopen and update this commit record in the Commit Workspace.
        </p>

        {/* KPI: Total commit value */}
        <div className="kpi-tile">
          <div className="kpi-icon-circle">
            <svg width="16" height="14" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="2" y="4" width="20" height="13" rx="2" />
              <line x1="2" y1="8" x2="22" y2="8" />
            </svg>
          </div>
          <div className="kpi-value">{tcv > 0 ? formatCurrency(tcv) : '$0.00'}</div>
          <div className="kpi-label">Total Commit Value</div>
        </div>

        {/* KPI: Participating accounts */}
        <div className="kpi-tile kpi-tile--success">
          <div className="kpi-icon-circle">
            <svg width="16" height="14" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="8" cy="8" r="4" />
              <path d="M1 19c0-3.9 3.1-7 7-7" strokeLinecap="round" />
              <circle cx="16" cy="8" r="4" />
              <path d="M16 12c3.9 0 7 3.1 7 7" strokeLinecap="round" />
            </svg>
          </div>
          <div className="kpi-value">{selectedCount}</div>
          <div className="kpi-label">Participating Accounts</div>
        </div>

        {/* Field grid */}
        <div className="summary-grid" role="list" aria-label="Commit details">
          {[
            { label: 'Commit type', value: formData.commitType || '' },
            { label: 'Currency', value: formData.commitType ? 'USD' : '' },
            { label: 'Commit value', value: tcv > 0 ? formatCurrency(tcv) : '' },
            { label: 'Term (months)', value: formData.termMonths ? `${formData.termMonths} months` : '' },
            { label: 'Unallocated total', value: tcv > 0 ? formatCurrency(unallocated) : '' },
            { label: 'Allocated amount', value: tcv > 0 ? formatCurrency(allocated) : '' },
            { label: 'Rollover total', value: tcv > 0 ? '$0' : '' },
            { label: 'Start date', value: formData.startDate ? formatDate(formData.startDate) : '' },
            { label: 'End date', value: endDate ? formatDate(endDate) : '' },
          ].map(({ label, value }) => (
            <div className="summary-field" key={label} role="listitem">
              <div className="sf-label">{label}</div>
              <div className="sf-value">{value || <span style={{ color: '#dddbda' }}>—</span>}</div>
            </div>
          ))}
        </div>
      </div>{/* end deal-summary-body */}

      <div className="deal-summary-footer">
        <button
          className="slds-button slds-button_brand"
          onClick={onSubmit}
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              Submitting…
            </>
          ) : 'Submit'}
        </button>
      </div>
    </aside>
  )
}

/* ─── Account selection table ─────────────────────────────────────────── */
function AccountTable({ accounts, selectedIds, billId, onToggleAccount, onToggleAll, onBillChange, searchQuery }) {
  const allSelected = accounts.length > 0 && accounts.every(a => selectedIds.includes(a.id))
  const someSelected = accounts.some(a => selectedIds.includes(a.id)) && !allSelected

  return (
    <div className="account-table-wrap">
      <table className="account-table" aria-label="Participating accounts">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <label>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected }}
                  onChange={() => onToggleAll(!allSelected)}
                  aria-label="Select all accounts"
                />
              </label>
            </th>
            <th>
              <span className="th-inner">Account name <IconSort /></span>
            </th>
            <th style={{ width: 130 }}>
              <span className="th-inner">Bill for shortfall <IconSort /></span>
            </th>
            <th>
              <span className="th-inner">Global company <IconSort /></span>
            </th>
            <th>
              <span className="th-inner">Account name (local) <IconSort /></span>
            </th>
            <th>
              <span className="th-inner">Country code <IconSort /></span>
            </th>
            <th>
              <span className="th-inner">DUNS <IconSort /></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(acct => {
            const isSelected = selectedIds.includes(acct.id)
            const isBill = billId === acct.id
            return (
              <tr key={acct.id} className={isSelected ? 'selected-row' : ''}>
                <td>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleAccount(acct.id)}
                      aria-label={`Include ${acct.name}`}
                    />
                  </label>
                </td>
                <td>{acct.name}</td>
                <td style={{ textAlign: 'center' }}>
                  <label>
                    <input
                      type="radio"
                      name="bill-for-shortfall"
                      checked={isBill}
                      disabled={!isSelected}
                      onChange={() => onBillChange(acct.id)}
                      aria-label={`Mark ${acct.name} as bill for shortfall`}
                    />
                  </label>
                </td>
                <td className={acct.globalCompany === 'none' ? 'col-none' : ''}>{acct.globalCompany}</td>
                <td className={acct.accountNameLocal === 'none' ? 'col-none' : ''}>{acct.accountNameLocal}</td>
                <td className={acct.countryCode === 'none' ? 'col-none' : ''}>{acct.countryCode}</td>
                <td className={acct.uduns === 'none' ? 'col-none' : ''}>{acct.uduns}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const VALIDATION_STATE = {
  customerName: ACTIVE_WORKSPACE_STATE.customerName,
  commitType: ACTIVE_WORKSPACE_STATE.commitType,
  totalCommitValue: 5000,
  termMonths: 11,
  startDate: '2026-10-09',  // in the past relative to today (Oct 23 2026)
  affiliateAccount: false,
}

/* ─── Main Commit Workspace ───────────────────────────────────────────── */
export default function CommitWorkspace({ initialState = 'empty', onSubmit }) {
  const isActive = initialState === 'active'
  const isValidation = initialState === 'validation'

  const getInitialFormData = () => {
    if (isValidation) return VALIDATION_STATE
    if (isActive) return {
      customerName: ACTIVE_WORKSPACE_STATE.customerName,
      commitType: ACTIVE_WORKSPACE_STATE.commitType,
      totalCommitValue: ACTIVE_WORKSPACE_STATE.totalCommitValue,
      termMonths: ACTIVE_WORKSPACE_STATE.termMonths,
      startDate: ACTIVE_WORKSPACE_STATE.startDate,
      affiliateAccount: ACTIVE_WORKSPACE_STATE.affiliateAccount,
    }
    return { customerName: '', commitType: '', totalCommitValue: '', termMonths: '', startDate: '', affiliateAccount: false }
  }

  const [formData, setFormData] = useState(getInitialFormData)

  const [selectedIds, setSelectedIds] = useState(() =>
    isActive || isValidation ? [...ACTIVE_WORKSPACE_STATE.selectedAccountIds] : []
  )
  const [billId, setBillId] = useState(() =>
    isActive || isValidation ? ACTIVE_WORKSPACE_STATE.billForShortfallId : null
  )
  const [searchQuery, setSearchQuery] = useState(isActive || isValidation ? ACTIVE_WORKSPACE_STATE.customerName : '')
  const [errors, setErrors] = useState(() =>
    isValidation
      ? { termMonths: 'Minimum term is 12 months.', startDate: 'Start date must be at least 1 day after today.' }
      : {}
  )
  const [submitted, setSubmitted] = useState(isValidation)
  const [submitting, setSubmitting] = useState(false)
  const [showConflict, setShowConflict] = useState(isValidation)
  const [tcvFocused, setTcvFocused] = useState(false)

  const endDate = calcEndDate(formData.startDate, formData.termMonths)

  const q = searchQuery.trim().toLowerCase()
  const filteredAccounts = q.length > 0
    ? PLACEHOLDER_ACCOUNTS.filter(a =>
        a.name.toLowerCase().startsWith(q)
      )
    : []

  const showAccountTable = q.length > 0

  function handleFieldChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!formData.customerName.trim()) e.customerName = 'Select a customer account.'
    if (!formData.commitType) e.commitType = 'Select a commit type.'
    if (!formData.totalCommitValue) e.totalCommitValue = 'Enter a total commit value.'
    if (!formData.termMonths) {
      e.termMonths = 'Enter the term in months.'
    } else if (Number(formData.termMonths) < 12) {
      e.termMonths = 'Minimum term is 12 months.'
    }
    if (!formData.startDate) {
      e.startDate = 'Select a start date.'
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const sd = new Date(formData.startDate)
      if (sd <= today) e.startDate = 'Start date must be at least 1 day after today.'
    }
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      setSubmitted(true)
      return
    }
    setSubmitting(true)
    // Simulate async commit creation
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    onSubmit && onSubmit({
      ...formData,
      selectedIds,
      billId,
    })
  }

  function handleToggleAccount(id) {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      if (!next.includes(id) && billId === id) setBillId(null)
      return next
    })
  }

  function handleToggleAll(selectAll) {
    if (selectAll) {
      setSelectedIds(PLACEHOLDER_ACCOUNTS.map(a => a.id))
    } else {
      setSelectedIds([])
      setBillId(null)
    }
  }

  const hasCustomerError = submitted && !!errors.customerName

  return (
    <>
      {/* Left col: page-header + scrollable form — flex siblings with panel at page-body level */}
      <div className="workspace-left-col">
        <div className="page-header-commit">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--slds-g-spacing-3, 12px)', minHeight: 51 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2e844a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={contractLineOutcomeIcon} alt="" aria-hidden="true" style={{ width: 32, height: 32, aspectRatio: '1 / 1' }} />
            </div>
            <h1 className="slds-page-header__title" style={{ fontSize: 'var(--slds-g-font-scale-5, 28px)', fontWeight: 400, color: 'var(--slds-g-color-on-surface-3, #001e5b)', margin: 0, lineHeight: '35px' }}>
              Commit Workspace
            </h1>
          </div>
        </div>

        <main className="workspace-main" id="main-content">
        <div className="workspace-card">
          <p className="workspace-intro">Complete all the required fields to submit the Commit.</p>

          {/* Conflict banner (validation state) */}
          {showConflict && (
            <div className="conflict-banner" role="alert">
              <div className="conflict-icon-text">
                <IconError size={18} className="conflict-icon" />
                <div className="conflict-text">
                  <p className="conflict-title">3 accounts can't be added</p>
                  <div className="conflict-body">
                    <p>They're already on commit Amazon US – SFC-20261007-105641-7684, which runs Term: Oct 14, 2026 – Aug 13, 2028:</p>
                    <ul>
                      <li>Amazon AU</li>
                      <li>Amazon DE</li>
                      <li>Amazon US</li>
                    </ul>
                    <p>Remove them to continue, or start this commit after Aug 13, 2028. To renew, change the type to Renewal</p>
                  </div>
                </div>
              </div>
              <div className="conflict-close">
                <button onClick={() => setShowConflict(false)} aria-label="Dismiss">
                  <IconClose size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Customer setup */}
          <section className="step-section" aria-labelledby="step1-heading">
            <div className="step-header">
              <div className="step-badge" aria-hidden="true">1</div>
              <div>
                <h2 className="step-title" id="step1-heading">Customer setup</h2>
                <p className="step-subtitle">Select an account and complete the details.</p>
              </div>
            </div>

            {hasCustomerError && (
              <div className="validation-banner" role="alert">
                <IconAlert size={14} />
                Select an account without commits
              </div>
            )}

            <div className="form-grid-2">
              {/* Customer name */}
              <div className="form-field">
                <label htmlFor="customer-name" className="slds-form-element__label">
                  <abbr className="slds-required" title="required">*</abbr>Customer name
                </label>
                <div className="input-icon-wrap">
                  <span className="input-icon-left"><IconSearch size={14} /></span>
                  <input
                    id="customer-name"
                    type="text"
                    className={errors.customerName ? 'error' : ''}
                    style={{ paddingLeft: '2.25rem' }}
                    placeholder="Select a negotiating account"
                    value={formData.customerName}
                    onChange={e => handleFieldChange('customerName', e.target.value)}
                    aria-required="true"
                    aria-describedby={errors.customerName ? 'customer-name-err' : undefined}
                    aria-invalid={!!errors.customerName}
                  />
                </div>
                {errors.customerName && (
                  <span className="field-error" id="customer-name-err" role="alert">
                    <IconAlert size={12} /> {errors.customerName}
                  </span>
                )}
              </div>

              {/* Commit type */}
              <div className="form-field">
                <label htmlFor="commit-type" className="slds-form-element__label">
                  <abbr className="slds-required" title="required">*</abbr>Commit type
                  <span className="info-icon-wrap" tabIndex={0} aria-label="About commit types">
                    <IconInfo size={13} />
                    <span className="tooltip" role="tooltip">New: first-time commit. Renewal: follow-on commit.</span>
                  </span>
                </label>
                <div className="select-wrap">
                  <select
                    id="commit-type"
                    className={errors.commitType ? 'error' : ''}
                    value={formData.commitType}
                    onChange={e => handleFieldChange('commitType', e.target.value)}
                    aria-required="true"
                    aria-describedby={errors.commitType ? 'commit-type-err' : undefined}
                    aria-invalid={!!errors.commitType}
                  >
                    <option value="">Select type</option>
                    <option value="New">New</option>
                    <option value="Renewal">Renewal</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                {errors.commitType && (
                  <span className="field-error" id="commit-type-err" role="alert">
                    <IconAlert size={12} /> {errors.commitType}
                  </span>
                )}
              </div>

              {/* Total commit value */}
              <div className="form-field">
                <label htmlFor="total-commit-value" className="slds-form-element__label">
                  <abbr className="slds-required" title="required">*</abbr>Total commit value
                </label>
                <input
                  id="total-commit-value"
                  type={tcvFocused ? 'number' : 'text'}
                  className={errors.totalCommitValue ? 'error' : ''}
                  placeholder="e.g., 150000000"
                  value={
                    tcvFocused
                      ? formData.totalCommitValue
                      : formData.totalCommitValue
                        ? formatCurrency(Number(formData.totalCommitValue))
                        : ''
                  }
                  onFocus={() => setTcvFocused(true)}
                  onBlur={() => setTcvFocused(false)}
                  onChange={e => handleFieldChange('totalCommitValue', e.target.value)}
                  aria-required="true"
                  aria-describedby={errors.totalCommitValue ? 'tcv-err' : undefined}
                  aria-invalid={!!errors.totalCommitValue}
                  min="0"
                />
                {errors.totalCommitValue && (
                  <span className="field-error" id="tcv-err" role="alert">
                    <IconAlert size={12} /> {errors.totalCommitValue}
                  </span>
                )}
              </div>

              {/* Term */}
              <div className="form-field">
                <label htmlFor="term-months" className="slds-form-element__label">
                  <abbr className="slds-required" title="required">*</abbr>Term (months)
                </label>
                <input
                  id="term-months"
                  type="number"
                  className={errors.termMonths ? 'error' : ''}
                  placeholder="e.g., 36"
                  value={formData.termMonths}
                  onChange={e => handleFieldChange('termMonths', e.target.value)}
                  aria-required="true"
                  aria-describedby={errors.termMonths ? 'term-err' : 'term-help'}
                  aria-invalid={!!errors.termMonths}
                  min="12"
                />
                {errors.termMonths
                  ? <span className="field-error" id="term-err" role="alert"><IconAlert size={12} /> {errors.termMonths}</span>
                  : <span className="field-help" id="term-help">Term must be at least 12 months</span>
                }
              </div>

              {/* Start date */}
              <div className="form-field">
                <label htmlFor="start-date" className="slds-form-element__label">
                  <abbr className="slds-required" title="required">*</abbr>Start date
                </label>
                <div className="input-icon-wrap icon-right">
                  <input
                    id="start-date"
                    type="date"
                    className={errors.startDate ? 'error' : ''}
                    value={formData.startDate}
                    onChange={e => handleFieldChange('startDate', e.target.value)}
                    aria-required="true"
                    aria-describedby={errors.startDate ? 'start-date-err' : undefined}
                    aria-invalid={!!errors.startDate}
                  />
                  <span className="input-icon-right date-icon--active">
                    <IconDateInput size={14} />
                  </span>
                </div>
                {errors.startDate && (
                  <span className="field-error" id="start-date-err" role="alert">
                    <IconAlert size={12} /> {errors.startDate}
                  </span>
                )}
              </div>

              {/* Affiliate account */}
              <div className="form-field">
                <label className="slds-form-element__label">
                  Affiliate Account
                </label>
                <label className="checkbox-wrap" htmlFor="affiliate-account">
                  <input
                    type="checkbox"
                    checked={formData.affiliateAccount}
                    onChange={e => handleFieldChange('affiliateAccount', e.target.checked)}
                    id="affiliate-account"
                  />
                  This is an affiliate account
                </label>
              </div>

              {/* End date (auto-calculated, read-only) */}
              <div className="form-field">
                <label htmlFor="end-date" className="slds-form-element__label">
                  End date
                </label>
                <div className="input-icon-wrap icon-right">
                  <input
                    id="end-date"
                    type="text"
                    readOnly
                    value={endDate ? formatDate(endDate) : ''}
                    aria-readonly="true"
                    aria-describedby="end-date-help"
                  />
                  <span className="input-icon-right">
                    <IconDateInput size={14} />
                  </span>
                </div>
                <span className="field-help" id="end-date-help">Start date plus term in months. Set on save.</span>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="divider" />

          {/* Step 2: Select participating accounts */}
          <section className="step-section accounts-section" aria-labelledby="step2-heading">
            <div className="step-header">
              <div className="step-badge" aria-hidden="true">2</div>
              <div>
                <h2 className="step-title" id="step2-heading">Select Participating Accounts</h2>
                <p className="step-subtitle">Choose the accounts that participate in this commit.</p>
              </div>
            </div>

            <div className="selected-badge" aria-live="polite" aria-atomic="true">
              Selected accounts: {selectedIds.length}
            </div>

            <p className="accounts-help">
              Search for accounts to add. Only one can be marked Bill for shortfall.
            </p>

            {/* Account search */}
            <div className="account-search">
              <IconSearch size={14} />
              <input
                type="search"
                placeholder="Search by account name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search for accounts"
                id="account-search"
              />
            </div>

            {/* Table or empty state */}
            {showAccountTable ? (
              filteredAccounts.length > 0 ? (
                <AccountTable
                  accounts={filteredAccounts}
                  selectedIds={selectedIds}
                  billId={billId}
                  onToggleAccount={handleToggleAccount}
                  onToggleAll={handleToggleAll}
                  onBillChange={id => setBillId(id)}
                  searchQuery={searchQuery}
                />
              ) : (
                <div className="empty-accounts">
                  <h3>No matching accounts</h3>
                  <p>Try a different search term.</p>
                </div>
              )
            ) : (
              <div className="empty-accounts">
                <h3>
                  {selectedIds.length >= 1
                    ? `${selectedIds.length} account${selectedIds.length === 1 ? '' : 's'} selected`
                    : 'No accounts selected'}
                </h3>
                <p>
                  {selectedIds.length >= 1
                    ? 'You can keep adding participating accounts later, but you need at least one to activate the commit.'
                    : 'You can add the participating accounts later, but you need at least one to activate the commit.'}
                </p>
              </div>
            )}

            {/* Selected accounts list */}
            {selectedIds.length > 0 && (
              <ul className="selected-list" role="list" aria-label="Selected accounts">
                {PLACEHOLDER_ACCOUNTS
                  .filter(a => selectedIds.includes(a.id))
                  .map(a => (
                    <li key={a.id} className="selected-list-item">
                      <span className="selected-list-cc">
                        {a.countryCode !== 'none' ? a.countryCode : '—'}
                      </span>
                      <span className="selected-list-name" title={a.name}>{a.name}</span>
                      <button
                        className="slds-button slds-button_icon selected-list-remove"
                        onClick={() => handleToggleAccount(a.id)}
                        aria-label={`Remove ${a.name}`}
                      >
                        <IconTrash size={14} />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      </div>{/* end workspace-left-col */}

      {/* Panel — direct child of page-body (flex row), stretches full height */}
      <DealSummaryPanel
        formData={formData}
        selectedIds={selectedIds}
        onClose={() => {}}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      {/* Utility bar — fixed position, outside layout flow */}
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
    </>
  )
}
